import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Send, Paperclip, Mic, Video, ArrowLeft, Image as ImageIcon, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { messagesAPI, usersAPI } from '../services/api';
import VoiceRecorder from '../components/VoiceRecorder';
import FileShareModal from '../components/FileShareModal';
import VideoCallModal from '../components/VideoCallModal';

const ChatPage = () => {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isConnected, isUserOnline, subscribe } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(partnerId ? parseInt(partnerId) : null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [showVoice, setShowVoice] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showSidebar, setShowSidebar] = useState(!partnerId);
  const [sending, setSending] = useState(false);
  const [messageError, setMessageError] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (partnerId) {
      const pid = parseInt(partnerId);
      setSelectedPartner(pid);
      setShowSidebar(false);
    }
  }, [partnerId]);

  useEffect(() => {
    if (selectedPartner) {
      loadMessages(selectedPartner);
      loadPartnerInfo(selectedPartner);
    }
  }, [selectedPartner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Subscribe to real-time incoming messages
  useEffect(() => {
    const unsub = subscribe('message', (newMsg) => {
      if (
        (newMsg.sender_id === selectedPartner && newMsg.receiver_id === user?.id) ||
        (newMsg.sender_id === user?.id && newMsg.receiver_id === selectedPartner)
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          let pendingIndex = -1;
          for (let i = prev.length - 1; i >= 0; i -= 1) {
            const item = prev[i];
            if (item.pending && item.sender_id === newMsg.sender_id && item.receiver_id === newMsg.receiver_id && item.content === newMsg.content && item.msg_type === newMsg.msg_type) {
              pendingIndex = i;
              break;
            }
          }
          if (pendingIndex < 0) return [...prev, newMsg];
          return prev.map((item, index) => index === pendingIndex ? newMsg : item);
        });
      }
      // Update sidebar last message
      setConversations((prev) => {
        const partnerId = newMsg.sender_id === user?.id ? newMsg.receiver_id : newMsg.sender_id;
        const exists = prev.some((c) => (c.partner?.id || c.partner_id) === partnerId);
        if (!exists) {
          loadConversations();
          return prev;
        }
        return prev.map((c) => {
          const cPid = c.partner?.id || c.partner_id;
          if (cPid === partnerId) {
            return {
              ...c,
              last_message: {
                content: newMsg.content || (newMsg.msg_type === 'voice' ? '🎤 Дуут мессеж' : '📎 Файл'),
                created_at: newMsg.created_at,
              },
            };
          }
          return c;
        });
      });
    });

    return () => {
      unsub();
    };
  }, [selectedPartner, user?.id, subscribe]);

  const loadConversations = async () => {
    try {
      const res = await messagesAPI.getRecentConversations();
      if (res.data && res.data.length > 0) {
        setConversations(res.data);
        if (!selectedPartner && !partnerId) {
          setSelectedPartner(res.data[0].partner?.id || res.data[0].partner_id);
        }
      } else {
        // Fallback to connected friends
        const frRes = await usersAPI.getFriends();
        const friendConvs = (frRes.data || []).map((f) => ({
          partner: {
            id: f.id,
            full_name: f.full_name,
            avatar: f.avatar,
            headline: f.headline,
          },
          last_message: null,
          unread_count: 0,
        }));
        setConversations(friendConvs);
        if (!selectedPartner && !partnerId && friendConvs.length > 0) {
          setSelectedPartner(friendConvs[0].partner.id);
        }
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
    }
  };

  const loadMessages = async (pid) => {
    try {
      const res = await messagesAPI.getHistory(pid);
      setMessages(res.data || []);
    } catch (err) {
      console.error('Error loading message history:', err);
    }
  };

  const loadPartnerInfo = async (pid) => {
    try {
      const res = await usersAPI.getProfile(pid);
      setPartnerInfo(res.data);
    } catch {
      const conv = conversations.find((c) => (c.partner?.id || c.partner_id) === pid);
      if (conv) {
        setPartnerInfo(conv.partner || { id: pid, full_name: 'Хэрэглэгч' });
      }
    }
  };

  const handleSendText = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedPartner || sending) return;

    const content = input.trim();
    setInput('');
    setSending(true);

    const tempMsg = {
      id: Date.now(),
      sender_id: user.id,
      receiver_id: selectedPartner,
      content,
      msg_type: 'text',
      created_at: new Date().toISOString(),
      pending: true,
    };

    setMessageError('');
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const response = await messagesAPI.sendMessage({
        receiver_id: selectedPartner,
        content,
        msg_type: 'text',
      });
      const savedMessage = response.data;
      setMessages((prev) => prev.map((item) => item.id === tempMsg.id ? savedMessage : item));
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => prev.filter((item) => item.id !== tempMsg.id));
      const detail = err?.response?.data?.detail;
      setMessageError(typeof detail === 'string' ? detail : 'Зурвас илгээж чадсангүй. Холболтоо шалгаад дахин оролдоно уу.');
    } finally {
      setSending(false);
    }
  };

  const handleMediaSent = async (mediaMsg) => {
    const tempMsg = {
      id: Date.now(),
      sender_id: user.id,
      receiver_id: selectedPartner,
      content: mediaMsg.content || '',
      msg_type: mediaMsg.msg_type,
      file_url: mediaMsg.file_url,
      file_name: mediaMsg.file_name,
      file_size: mediaMsg.file_size,
      audio_duration: mediaMsg.audio_duration,
      created_at: new Date().toISOString(),
      pending: true,
    };

    setMessageError('');
    setMessages((prev) => [...prev, tempMsg]);
    try {
      const response = await messagesAPI.sendMessage({
        receiver_id: selectedPartner,
        content: mediaMsg.content || '',
        msg_type: mediaMsg.msg_type,
        file_url: mediaMsg.file_url,
        file_name: mediaMsg.file_name,
        file_size: mediaMsg.file_size,
        audio_duration: mediaMsg.audio_duration,
      });
      setMessages((prev) => prev.map((item) => item.id === tempMsg.id ? response.data : item));
    } catch (err) {
      console.error('Error sending media message:', err);
      setMessages((prev) => prev.filter((item) => item.id !== tempMsg.id));
      const detail = err?.response?.data?.detail;
      setMessageError(typeof detail === 'string' ? detail : 'Файлтай зурвас илгээгдсэнгүй. Дахин оролдоно уу.');
    }
  };

  const renderMessage = (msg) => {
    const isMine = msg.sender_id === user?.id;
    const mediaUrl = msg.file_url || msg.media_url;

    return (
      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-fade-in`}>
        <div
          className={`max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
            isMine
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-br-none'
              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
          }`}
        >
          {msg.msg_type === 'photo' && mediaUrl && (
            <div className="mb-2 overflow-hidden rounded-xl">
              <img src={mediaUrl} alt="Зураг" className="max-w-full max-h-60 object-cover rounded-xl hover:scale-105 transition-transform" />
            </div>
          )}

          {msg.msg_type === 'voice' && mediaUrl && (
            <div className="my-1">
              <audio controls src={mediaUrl} className="w-full max-w-xs" />
            </div>
          )}

          {msg.msg_type === 'file' && mediaUrl && (
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 p-2 rounded-xl border mb-1.5 transition-colors ${
                isMine
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-violet-700 font-medium'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="truncate">{msg.file_name || 'Хавсаргасан файл татах'}</span>
            </a>
          )}

          {msg.content && <p className="whitespace-pre-line">{msg.content}</p>}

          <span
            className={`text-[9px] mt-1.5 block text-right font-medium ${
              isMine ? 'text-white/70' : 'text-slate-400'
            }`}
          >
            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 h-[calc(100dvh-8rem)] min-h-[26rem] flex gap-4 animate-fade-in">
      {/* Sidebar: Conversation List */}
      <div
        className={`${
          showSidebar || !selectedPartner ? 'flex' : 'hidden'
        } md:flex min-h-0 flex-col w-full md:w-80 shrink-0 glass-panel rounded-2xl overflow-hidden border border-slate-200`}
      >
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-800">Зурвасууд</h2>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {conversations.length === 0 ? (
            <div className="p-6 text-xs text-slate-400 text-center space-y-2">
              <p>Энэ хүнтэй одоогоор зурвас солилцоогүй байна.</p>
              <Link to="/explore" className="text-violet-600 font-bold hover:underline block pt-2">
                Найз хайх →
              </Link>
            </div>
          ) : (
            conversations.map((c) => {
              const partner = c.partner || { id: c.partner_id, full_name: c.partner_name, avatar: c.partner_avatar };
              const pid = partner.id;
              const isSelected = selectedPartner === pid;
              const online = isUserOnline(pid);

              return (
                <button
                  key={pid}
                  onClick={() => {
                    setSelectedPartner(pid);
                    setShowSidebar(false);
                    navigate(`/chat/${pid}`, { replace: true });
                  }}
                  className={`w-full flex items-center gap-3 p-3.5 transition-colors cursor-pointer text-left ${
                    isSelected ? 'bg-violet-50/90 border-l-4 border-violet-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={partner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.full_name}`}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    {online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-800 truncate">{partner.full_name}</p>
                      {c.last_message?.created_at && (
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {c.last_message?.content || partner.headline || 'Шинэ яриа эхлүүлэх...'}
                    </p>
                  </div>

                  {c.unread_count > 0 && (
                    <span className="px-2 py-0.5 bg-violet-600 text-white text-[10px] font-bold rounded-full">
                      {c.unread_count}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area Panel */}
      <div
        className={`${
          !showSidebar || selectedPartner ? 'flex' : 'hidden'
        } md:flex min-h-0 min-w-0 flex-1 flex-col glass-panel rounded-2xl overflow-hidden border border-slate-200`}
      >
        {selectedPartner && partnerInfo ? (
          <>
            {/* Top Chat Header */}
            <div className="p-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="md:hidden p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="relative">
                  <img
                    src={partnerInfo.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partnerInfo.full_name}`}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  {isUserOnline(selectedPartner) && (
                    <div className="absolute -bottom-0.5 -right-0.=���h��춻�q�^tchatbotAPI } from '../services/api';
import MatchRequestModal from '../components/MatchRequestModal';
import AuthPromptModal from '../components/AuthPromptModal';
import ChatbotText from '../components/ChatbotText';
import { useAuth } from '../context/AuthContext';

const STARTER_PROMPTS = [
  '🔍 Надад тохирох хүн хайж өг',
  '🤝 Хамт суралцах хүн санал болго',
  '📹 Видео дуудлагыг хэрхэн эхлүүлэх вэ?',
  '🔄 Чадвар солилцох хүсэлт яаж илгээх вэ?',
  '💡 SkillSwap гэж юу вэ?',
  'Би Python заана, Япон хэл сурмаар байна',
  'Математик яаж сурах вэ?',
  'Морин хуур сурмаар байна цуг суралцах хүн хайж байна',
];

const PoweredBadge = ({ poweredBy }) => {
  if (!poweredBy) return null;
  const isGemini = poweredBy === 'gemini';
  return (
    <span
      className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
        isGemini
          ? 'bg-blue-100 text-blue-700 border border-blue-200'
          : 'bg-slate-100 text-slate-500 border border-slate-200'
      }`}
    >
      {isGemini ? (
        <>
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          Gemini AI
        </>
      ) : (
        <>
          <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
          Суурь туслах
        </>
      )}
    </span>
  );
};

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Сайн байна уу! Би SkillSwap-ийн AI туслах.\n\n• Тохирох хүн хайх\n• Хамт суралцах хүн санал болгох\n• Шинэ чадвар сурах төлөвлөгөө гаргах\n• Платформын талаар асуултад хариулах\n\nЮу мэдэхийг хүсэж байна вэ?",
      recommendations: [],
      powered_by: null,
      isIntro: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUserForSwap, setSelectedUserForSwap] = useState(null);
  const [geminiStatus, setGeminiStatus] = useState(null); // 'active' | 'local' | null
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const messagesEndRef = useRef(null);
  const sendLock = useRef(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText = null) => {
    const text = (queryText ?? input).trim();
    if (!text || sendLock.current) return;
    sendLock.current = true;

    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const historyPayload = messages.filter((m) => !m.isIntro).slice(-8).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await chatbotAPI.sendMessage(text, historyPayload);
      const data = res.data;

      // Track if Gemini is active
      setGeminiStatus(data.powered_by === 'gemini' ? 'active' : 'local');
      if (!queryText) setInput('');

      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.reply,
        recommendations: data.recommendations || [],
        extracted_offered: data.extracted_skills_offered,
        extracted_wanted: data.extracted_skills_wanted,
        powered_by: data.powered_by,
      };

      setMessages((prev) => [...prev, botReply]);
    } catch {
      console.warn('Chatbot request failed');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: "Туслахтай холбогдож чадсангүй. Интернэтээ шалгаад асуултаа дахин илгээнэ үү.",
          recommendations: [],
          powered_by: null,
          isIntro: true,
        },
      ]);
    } finally {
      setLoading(false);
      sendLock.current = false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 h-[calc(100vh-5.5rem)] flex flex-col space-y-3 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between p-3.5 bg-white/95 rounded-2xl border border-slate-200 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              SkillSwap AI Ухаалаг Туслах
              {geminiStatus === 'active' ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> Gemini 3.8 Flash
                </span>
              ) : geminiStatus === 'local' ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                  Суурь туслах
                </span>
              ) : null}
            </h1>
            <p className="text-[11px] text-slate-500">
              AI чат + ML Matchmaking • Монгол хэлний NLP
            </p>
          </div>
        </div>

      </div>

      {/* Messages Stream */}
      <div className="flex-1 bg-white/95 rounded-2xl border border-slate-200 p-4 overflow-y-auto space-y-4 shadow-inner" role="log" aria-live="polite" aria-relevant="additions text">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
          >
            {/* Message Bubble */}
            <div
              className={`p-3.5 rounded-2xl text-xs sm:text-sm max-w-[90%] sm:max-w-[82%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium rounded-br-none shadow-md'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
              }`}
            >
              {m.sender === 'bot' ? <ChatbotText text={m.text} /> : <div className="whitespace-pre-wrap break-words">{m.text}</div>}
              {m.sender === 'bot' && m.powered_by && (
                <div className="mt-1.5 flex justify-end">
                  <PoweredBadge poweredBy={m.powered_by} />
                </div>
              )}
            </div>

            {/* Extracted Entity Tags */}
            {m.sender === 'bot' && (m.extracted_offered?.length > 0 || m.extracted_wanted?.length > 0) && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {m.extracted_offered?.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-violet-100 text-violet-800 border border-violet-200 text-[10px] font-bold">
                    ✓ Заах: {s}
                  </span>
                ))}
                {m.extracted_wanted?.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-bold">
                    ★ Сурах: {s}
                  </span>
                ))}
              </div>
            )}

            {/* Recommendation Cards */}
            {m.recommendations?.length > 0 && (
              <div className="mt-3 w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
                {m.recommendations.map((rec) => {
                  const isStudyBuddy = rec.match_type === 'study_buddy';
                  const isMentor = rec.match_type === 'mentor';
                  return (
                    <div
                      key={rec.user_id}
                      className={`p-3.5 rounded-2xl border flex flex-col justify-between text-xs shadow-sm transition-all hover:shadow-md ${
                        isStudyBuddy
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : isMentor
                          ? 'bg-sky-50/70 border-sky-200'
                          : 'bg-white border-violet-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isStudyBuddy ? 'bg-emerald-200 text-emerald-800'
                            : isMentor ? 'bg-sky-200 text-sky-800'
                            : 'bg-violet-100 text-violet-800'
                          }`}>
                            {rec.match_badge || '🔄 Харилцан солилцох'}
                          </span>
                          <span className="text-[10px] font-extrabold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                            {rec.match_score}%
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 mb-2.5">
                          <img
                            src={rec.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rec.full_name}`}
                            alt={rec.full_name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-800 text-xs truncate">{rec.full_name}</h4>
                            <p className="text-[10px] text-slate-500 truncate">{rec.headline || 'SkillSwap гишүүн'}</p>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-xl space-y-0.5 mb-2 border border-slate-100">
                          <div>Заах чадвар: <strong className="text-violet-700">{rec.offered_skill}</strong></div>
                          <div>Сурах чадвар: <strong className="text-sky-700">{rec.wanted_skill}</strong></div>
                        </div>

                        {rec.match_reason && (
                          <p className="text-[10px] text-slate-500 italic mb-3 leading-tight line-clamp-2">
                            {rec.match_reason}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/users/${rec.user_id}`}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] rounded-xl text-center transition-colors"
                        >
                          Үзэх
                        </Link>
                        <button
                          onClick={() => isAuthenticated ? setSelectedUserForSwap(rec) : setShowAuthPrompt(true)}
                          className="flex-1 py-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                          <span>Холбогдох хүсэлт илгээх</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="text-xs text-slate-500 bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl w-fit flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Хариу бэлдэж байна…</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompt Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
        {STARTER_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-violet-50 hover:text-violet-700 border border-slate-200 text-[11px] font-medium text-slate-700 whitespace-nowrap cursor-pointer transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-wait"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-2.5 bg-white rounded-2xl border border-slate-200 flex items-center gap-2 shrink-0 shadow-sm"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={2000}
          aria-label="AI туслахад асуулт бичих"
          placeholder="Асуултаа бичих эсвэл заах, сурах чадвараа оруулна уу..."
          className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold text-xs rounded-xl disabled:opacity-40 cursor-pointer shadow-md flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Илгээх</span>
        </button>
      </form>

      {selectedUserForSwap && (
        <MatchRequestModal
          isOpen={!!selectedUserForSwap}
          targetUser={selectedUserForSwap}
          onClose={() => setSelectedUserForSwap(null)}
          onSuccess={() => setSelectedUserForSwap(null)}
        />
      )}
      {showAuthPrompt && (
        <AuthPromptModal
          isOpen={showAuthPrompt}
          onClose={() => setShowAuthPrompt(false)}
          message="Санал илгээхийн тулд эхлээд SkillSwap-д нэвтэрнэ үү."
        />
      )}
    </div>
  );
};

export default ChatbotPage;
