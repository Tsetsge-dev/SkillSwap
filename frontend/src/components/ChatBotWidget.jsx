import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { chatbotAPI } from '../services/api';
import MatchRequestModal from './MatchRequestModal';
import AuthPromptModal from './AuthPromptModal';
import ChatbotText from './ChatbotText';
import { useAuth } from '../context/AuthContext';

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Сайн байна уу! Би SkillSwap-ийн AI туслах. Зааж чадах болон сурахыг хүссэн чадвараа бичвэл тохирох хүн хайхад тань тусална. Платформын талаар чөлөөтэй асуугаарай.",
      recommendations: [],
      isIntro: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUserForSwap, setSelectedUserForSwap] = useState(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const messagesEndRef = useRef(null);
  const sendLock = useRef(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (textToSend = null) => {
    const query = (textToSend ?? input).trim();
    if (!query || sendLock.current) return;
    sendLock.current = true;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const historyPayload = messages.filter((m) => !m.isIntro).slice(-8).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await chatbotAPI.sendMessage(query, historyPayload);
      if (!textToSend) setInput('');
      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.data.reply,
        recommendations: res.data.recommendations || [],
      };

      setMessages((prev) => [...prev, botReply]);
    } catch {
      console.warn('Chatbot widget request failed');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: "Туслахтай холбогдож чадсангүй. Интернэтээ шалгаад асуултаа дахин илгээнэ үү.",
          recommendations: [],
          isIntro: true,
        },
      ]);
    } finally {
      setLoading(false);
      sendLock.current = false;
    }
  };

  const starterPrompts = [
    '🔍 Тохирох хүн хайх',
    '🤝 Хамт суралцах хүн санал болгох',
    '📹 Видео дуудлагыг хэрхэн эхлүүлэх вэ?',
    '💡 SkillSwap гэж юу вэ?',
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'AI туслах хаах' : 'AI туслах нээх'}
        className={`fixed bottom-5 right-5 z-40 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold p-3.5 rounded-full shadow-xl shadow-violet-500/30 transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer ${
          !isOpen ? 'animate-bounce' : ''
        }`}
        title="AI Туслах"
      >
        <Bot className="w-5 h-5" />
        <span className="hidden sm:inline text-xs font-bold">AI Туслах</span>
      </button>

      {/* Floating Assistant Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-5 z-40 w-[92vw] max-w-[390px] h-[min(540px,calc(100dvh-6rem))] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in" role="dialog" aria-label="AI чадвар солилцооны туслах">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-white" />
              <h4 className="text-xs font-bold">AI Чадвар Солилцооны Туслах</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="AI туслах хаах"
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/50" role="log" aria-live="polite" aria-relevant="additions text">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[88%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium rounded-br-none shadow-md'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs'
                  }`}
                >
                  {m.sender === 'bot' ? <ChatbotText text={m.text} /> : <div className="whitespace-pre-wrap break-words">{m.text}</div>}
                </div>

                {/* Recommendations */}
                {m.recommendations && m.recommendations.length > 0 && (
                  <div className="mt-2 w-full space-y-2">
                    {m.recommendations.map((rec) => (
                      <div
                        key={rec.user_id}
                        className="p-2.5 rounded-xl bg-white border border-violet-200 flex flex-col gap-2 text-xs shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={rec.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rec.full_name}`}
                              alt=""
                              className="w-7 h-7 rounded-lg object-cover border border-slate-100"
                            />
                            <div className="min-w-0">
                              <h5 className="font-bold text-slate-800 text-xs truncate">{rec.full_name}</h5>
                              <span className="text-[10px] text-violet-700 font-semibold block">
                                {rec.match_badge || `${rec.match_score}% тохирол`}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => isAuthenticated ? setSelectedUserForSwap(rec) : setShowAuthPrompt(true)}
                            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold text-[10px] shrink-0 cursor-pointer shadow-sm"
                          >
                            Холбогдох хүсэлт илгээх
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex justify-between">
                          <span>Заах чадвар: <b>{rec.offered_skill}</b></span>
                          <span>Сурах чадвар: <b>{rec.wanted_skill}</b></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="text-[11px] text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl w-fit flex items-center gap-1.5 shadow-2xs">
                <div className="w-2.5 h-2.5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Танд тохирох хүн хайж байна…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-2.5 py-1.5 bg-violet-50/70 border-t border-violet-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {starterPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                disabled={loading}
                className="whitespace-nowrap text-[10px] px-2.5 py-1 rounded-full bg-white hover:bg-violet-100 text-slate-700 font-medium border border-slate-200 shrink-0 cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-wait"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2 bg-white border-t border-slate-200 flex items-center gap-1.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={2000}
              aria-label="AI туслахад асуулт бичих"
              placeholder="Асуултаа бичих эсвэл заах, сурах чадвараа оруулна уу..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:bg-white"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-xl disabled:opacity-40 cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Request Modal */}
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
    </>
  );
};

export default ChatBotWidget;
