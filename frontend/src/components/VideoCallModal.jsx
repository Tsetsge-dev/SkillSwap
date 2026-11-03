<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  MonitorUp,
  Maximize2,
  PhoneCall,
  Volume2
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

const VideoCallModal = ({ partner, isCaller = false, onClose }) => {
  const { user } = useAuth();
  const { sendCallSignal, subscribe, setIncomingCall } = useSocket();

  const [callStatus, setCallStatus] = useState(isCaller ? 'calling' : 'connected'); // 'calling', 'connected', 'ended'
=======
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, MonitorUp } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { callsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const VideoCallModal = ({ partner, isCaller = false, onClose }) => {
  const { user } = useAuth();
  const { sendCallSignal, subscribe } = useSocket();
  const partnerId = Number(partner?.id ?? partner?.user_id);
  const [callStatus, setCallStatus] = useState('starting');
  const [statusMessage, setStatusMessage] = useState('Камер, микрофоныг бэлдэж байна…');
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
<<<<<<< HEAD

=======
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const timerRef = useRef(null);
<<<<<<< HEAD

  useEffect(() => {
    startMediaAndConnection();

    return () => {
      cleanupCall();
    };
  }, []);

  const startMediaAndConnection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize WebRTC PeerConnection
      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionRef.current = pc;

      // Add local tracks to peer connection
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Handle remote tracks
      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setCallStatus('connected');
        }
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          sendCallSignal(partner.id, 'ice-candidate', {
            candidate: event.candidate,
          });
        }
      };

      // If caller, send call request and create offer
      if (isCaller) {
        sendCallSignal(partner.id, 'call-request', {
          caller_name: user.full_name,
          caller_avatar: user.avatar,
        });
      }

      // Subscribe to WebRTC events
      const unsubAccept = subscribe('call-accept', async () => {
        setCallStatus('connected');
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sendCallSignal(partner.id, 'call-offer', { offer });
      });

      const unsubOffer = subscribe('call-offer', async (data) => {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendCallSignal(partner.id, 'call-answer', { answer });
        setCallStatus('connected');
      });

      const unsubAnswer = subscribe('call-answer', async (data) => {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      });

      const unsubCandidate = subscribe('ice-candidate', async (data) => {
        try {
          if (pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        } catch (e) {
          console.error('Error adding ICE candidate:', e);
        }
      });

      const unsubEnd = subscribe('call-end', () => {
        cleanupCall();
        onClose();
      });

      const unsubReject = subscribe('call-reject', () => {
        alert(`${partner.full_name} declined the video call.`);
        cleanupCall();
        onClose();
      });

      // Start call timer when connected
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => {
        unsubAccept();
        unsubOffer();
        unsubAnswer();
        unsubCandidate();
        unsubEnd();
        unsubReject();
      };
    } catch (err) {
      console.error('Error setting up WebRTC call:', err);
      alert('Camera & Microphone access is needed for video calls.');
      onClose();
    }
  };

  const cleanupCall = () => {
    clearInterval(timerRef.current);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  const handleEndCall = () => {
    sendCallSignal(partner.id, 'call-end', {});
    cleanupCall();
    onClose();
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];

        const sender = peerConnectionRef.current
          ?.getSenders()
          .find((s) => s.track.kind === 'video');
        if (sender) {
          sender.replaceTrack(screenTrack);
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenTrack.onended = () => {
          stopScreenShare();
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.error('Error sharing screen:', err);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    const sender = peerConnectionRef.current
      ?.getSenders()
      .find((s) => s.track.kind === 'video');
    if (sender && videoTrack) {
      sender.replaceTrack(videoTrack);
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    setIsScreenSharing(false);
  };

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[85vh] bg-[#0f172a] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-between">
        
        {/* Top Header Bar */}
        <div className="absolute top-4 left-6 right-6 z-20 flex items-center justify-between text-white drop-shadow-md">
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
            <img
              src={partner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.full_name}`}
              alt={partner.full_name}
              className="w-8 h-8 rounded-full border border-white/20 object-cover"
            />
            <div>
              <h4 className="text-sm font-bold truncate">{partner.full_name}</h4>
              <span className="text-[11px] text-emerald-400 font-mono block">
                {callStatus === 'calling' ? 'Calling...' : `Live Swap • ${formatDuration(callDuration)}`}
              </span>
            </div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-xs font-semibold text-gray-300">
            1-on-1 Peer Encrypted
          </div>
        </div>

        {/* Video Area */}
        <div className="relative w-full h-full flex items-center justify-center bg-gray-950 overflow-hidden">
          {/* Remote Video (Full Screen) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Placeholder if remote video stream not yet received */}
          {callStatus === 'calling' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b0f19] z-10">
              <div className="relative mb-6">
                <img
                  src={partner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.full_name}`}
                  alt={partner.full_name}
                  className="w-28 h-28 rounded-full border-4 border-emerald-500/50 object-cover shadow-2xl animate-pulse"
                />
                <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-50"></span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Calling {partner.full_name}...</h3>
              <p className="text-sm text-gray-400">Waiting for partner to accept</p>
            </div>
          )}

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute bottom-24 right-6 w-36 h-48 md:w-48 md:h-64 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black z-20 group">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            {isVideoOff && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-xs text-gray-400 font-semibold">
                Camera Off
              </div>
            )}
            <div className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-2 py-0.5 rounded text-white font-medium">
              You {isMuted && '(Muted)'}
            </div>
          </div>
        </div>

        {/* Bottom Call Controls Floating Toolbar */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-4 bg-gray-900/80 backdrop-blur-xl px-6 py-3 rounded-full border border-white/15 shadow-2xl">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`p-3.5 rounded-full transition-all cursor-pointer ${
              isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Toggle Video */}
          <button
            onClick={toggleVideo}
            className={`p-3.5 rounded-full transition-all cursor-pointer ${
              isVideoOff ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`p-3.5 rounded-full transition-all cursor-pointer ${
              isScreenSharing ? 'bg-emerald-500 text-black font-bold' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
          >
            <MonitorUp className="w-5 h-5" />
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="p-3.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all shadow-lg hover:scale-105 cursor-pointer"
            title="End Video Call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
=======
  const mountedRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const remoteCandidatesRef = useRef([]);
  const remoteDescriptionReadyRef = useRef(false);
  const closedRef = useRef(false);

  const cleanupCall = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    clearInterval(timerRef.current);
    [localStreamRef.current, screenStreamRef.current].forEach((stream) => {
      stream?.getTracks().forEach((track) => track.stop());
    });
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;
    const unsubscribers = [];
    const isPartnerSignal = (data) => Number(data?.sender_id) === partnerId;

    const start = async () => {
      try {
        if (!Number.isFinite(partnerId) || !partnerId) throw new Error('Хэрэглэгчийн мэдээлэл олдсонгүй.');
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('Камер, микрофон ашиглахад HTTPS эсвэл localhost шаардлагатай.');
        const { data: iceConfig } = await callsAPI.getIceServers();
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        const pc = new RTCPeerConnection({ iceServers: iceConfig.ice_servers });
        peerConnectionRef.current = pc;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        pc.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams[0]) remoteVideoRef.current.srcObject = event.streams[0];
        };
        pc.onicecandidate = ({ candidate }) => {
          if (candidate) sendCallSignal(partnerId, 'ice-candidate', { candidate });
        };
        pc.onconnectionstatechange = () => {
          if (!mountedRef.current) return;
          if (pc.connectionState === 'connected') {
            setCallStatus('connected');
            setStatusMessage('Холбогдлоо');
            if (!timerRef.current) timerRef.current = setInterval(() => setCallDuration((seconds) => seconds + 1), 1000);
          } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
            setCallStatus('error');
            setStatusMessage('Нөгөө төхөөрөмжтэй холбогдож чадсангүй. Хоёр тал онлайн эсэх болон TURN серверийн тохиргоог шалгана уу.');
          }
        };

        const addQueuedCandidates = async () => {
          remoteDescriptionReadyRef.current = true;
          const pending = remoteCandidatesRef.current.splice(0);
          for (const candidate of pending) await pc.addIceCandidate(new RTCIceCandidate(candidate));
        };

        unsubscribers.push(subscribe('call-accept', async (data) => {
          if (!isPartnerSignal(data) || !isCaller || closedRef.current) return;
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            sendCallSignal(partnerId, 'call-offer', { offer: pc.localDescription });
          } catch (error) { console.error('Offer үүсгэхэд алдаа:', error); setCallStatus('error'); setStatusMessage('Дуудлага үүсгэж чадсангүй.'); }
        }));
        unsubscribers.push(subscribe('call-offer', async (data) => {
          if (!isPartnerSignal(data) || isCaller || closedRef.current) return;
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
            await addQueuedCandidates();
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            sendCallSignal(partnerId, 'call-answer', { answer: pc.localDescription });
          } catch (error) { console.error('Offer боловсруулахад алдаа:', error); setCallStatus('error'); setStatusMessage('Холболт эхлүүлж чадсангүй.'); }
        }));
        unsubscribers.push(subscribe('call-answer', async (data) => {
          if (!isPartnerSignal(data) || !isCaller || closedRef.current) return;
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
            await addQueuedCandidates();
          } catch (error) { console.error('Answer боловсруулахад алдаа:', error); setCallStatus('error'); setStatusMessage('Хариуг боловсруулахад алдаа гарлаа.'); }
        }));
        unsubscribers.push(subscribe('ice-candidate', async (data) => {
          if (!isPartnerSignal(data) || closedRef.current || !data.candidate) return;
          try {
            if (remoteDescriptionReadyRef.current) await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            else remoteCandidatesRef.current.push(data.candidate);
          } catch (error) { console.error('ICE candidate нэмэхэд алдаа:', error); }
        }));
        unsubscribers.push(subscribe('call-end', (data) => {
          if (!isPartnerSignal(data)) return;
          setCallStatus('ended'); setStatusMessage('Дуудлага дууслаа'); cleanupCall(); onCloseRef.current();
        }));
        unsubscribers.push(subscribe('call-reject', (data) => {
          if (!isPartnerSignal(data)) return;
          setCallStatus('ended'); setStatusMessage('Нөгөө хэрэглэгч дуудлагыг хүлээн авсангүй.'); cleanupCall();
        }));

        setCallStatus(isCaller ? 'calling' : 'waiting');
        setStatusMessage(isCaller ? 'Нөгөө хэрэглэгчийн хариуг хүлээж байна…' : 'Дуудлагад холбогдож байна…');
        // The receiving side accepts only after media and event handlers are ready.
        const signalSent = isCaller
          ? sendCallSignal(partnerId, 'call-request', { caller_name: user?.full_name, caller_avatar: user?.avatar, call_type: 'video' })
          : sendCallSignal(partnerId, 'call-accept', {});
        if (!signalSent) throw new Error('Бодит цагийн холболт тасарсан байна. Интернэтээ шалгаад дахин оролдоно уу.');
      } catch (error) {
        console.error('Дуудлага эхлүүлэхэд алдаа:', error);
        if (!cancelled && mountedRef.current) {
          const detail = error?.response?.data?.detail;
          const friendlyMessage = typeof detail === 'string' && /[А-Яа-яЁёӨөҮү]/.test(detail)
            ? detail
            : error?.response?.status === 401
              ? 'Нэвтрэлт дууссан байна. Дахин нэвтэрч дуудлага хийнэ үү.'
              : error?.name === 'NotAllowedError'
                ? 'Камер, микрофон ашиглах зөвшөөрөл өгнө үү.'
                : error?.name === 'NotFoundError'
                  ? 'Камер эсвэл микрофон төхөөрөмж олдсонгүй.'
                  : error?.message && /[А-Яа-яЁёӨөҮү]/.test(error.message)
                    ? error.message
                    : 'Видео дуудлагыг эхлүүлж чадсангүй. Холболт болон төхөөрөмжийн зөвшөөрлөө шалгаад дахин оролдоно уу.';
          setCallStatus('error');
          setStatusMessage(friendlyMessage);
          cleanupCall();
        }
      }
    };

    start();
    return () => {
      cancelled = true;
      mountedRef.current = false;
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      cleanupCall();
    };
  }, [partnerId, isCaller, user?.full_name, user?.avatar, sendCallSignal, subscribe, cleanupCall]);

  useEffect(() => {
    if (isCaller && callStatus === 'calling') {
      const timeout = setTimeout(() => {
        sendCallSignal(partnerId, 'call-end', {});
        cleanupCall();
        setCallStatus('error'); setStatusMessage('Хариу ирсэнгүй. Дахин залгаж болно.');
      }, 45000);
      return () => clearTimeout(timeout);
    }
  }, [isCaller, callStatus, partnerId, sendCallSignal, cleanupCall]);

  const handleEndCall = () => {
    sendCallSignal(partnerId, 'call-end', {});
    cleanupCall();
    onCloseRef.current();
  };
  const toggleMute = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) { track.enabled = !track.enabled; setIsMuted(!track.enabled); }
  };
  const toggleVideo = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) { track.enabled = !track.enabled; setIsVideoOff(!track.enabled); }
  };
  const stopScreenShare = async () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    const sender = peerConnectionRef.current?.getSenders().find((item) => item.track?.kind === 'video');
    if (sender && track) await sender.replaceTrack(track);
    screenStreamRef.current?.getTracks().forEach((item) => item.stop());
    screenStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
    setIsScreenSharing(false);
  };
  const toggleScreenShare = async () => {
    if (isScreenSharing) return stopScreenShare();
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = stream;
      const track = stream.getVideoTracks()[0];
      const sender = peerConnectionRef.current?.getSenders().find((item) => item.track?.kind === 'video');
      if (sender) await sender.replaceTrack(track);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      track.onended = stopScreenShare;
      setIsScreenSharing(true);
    } catch (error) { console.error('Дэлгэц хуваалцахад алдаа:', error); }
  };
  const duration = `${String(Math.floor(callDuration / 60)).padStart(2, '0')}:${String(callDuration % 60).padStart(2, '0')}`;
  const avatar = partner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(partner?.full_name || 'SkillSwap')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 backdrop-blur-xl sm:p-6" role="dialog" aria-modal="true" aria-label={`${partner?.full_name || 'Хэрэглэгч'}-тэй видео дуудлага`}>
      <div className="relative flex h-[min(85vh,760px)] w-full max-w-5xl flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
        <header className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between gap-2 text-white sm:left-6 sm:right-6">
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-md sm:px-4">
            <img src={avatar} alt="" className="h-9 w-9 rounded-full border border-white/20 object-cover" />
            <div className="min-w-0"><h2 className="truncate text-sm font-bold">{partner?.full_name || 'Хэрэглэгч'}</h2><p className="text-xs text-indigo-200">{callStatus === 'connected' ? `Холбогдсон · ${duration}` : statusMessage}</p></div>
          </div>
          <span className="hidden rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-slate-200 sm:block">Шууд видео дуудлага</span>
        </header>
        <div className="relative flex h-full items-center justify-center overflow-hidden bg-slate-950">
          <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" aria-label="Нөгөө хэрэглэгчийн дүрс" />
          {callStatus !== 'connected' && <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/90 px-6 text-center text-white"><img src={avatar} alt="" className="mb-5 h-24 w-24 rounded-full border-4 border-indigo-400/50 object-cover" /><h3 className="text-lg font-bold">{partner?.full_name || 'Хэрэглэгч'}</h3><p role={callStatus === 'error' ? 'alert' : 'status'} className="mt-2 max-w-md text-sm text-slate-300">{statusMessage}</p></div>}
          <div className="absolute bottom-24 right-4 z-20 h-32 w-24 overflow-hidden rounded-2xl border border-white/30 bg-black shadow-xl sm:bottom-24 sm:right-6 sm:h-56 sm:w-40">
            <video ref={localVideoRef} autoPlay playsInline muted className="h-full w-full -scale-x-100 object-cover" aria-label="Таны дүрс" />
            {isVideoOff && <div className="absolute inset-0 grid place-items-center bg-slate-900 text-center text-xs text-slate-300">Камер унтраалттай</div>}
          </div>
        </div>
        <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-slate-900/90 px-3 py-2 shadow-2xl backdrop-blur-xl sm:gap-3 sm:px-5">
          <button type="button" onClick={toggleMute} disabled={!localStreamRef.current || callStatus === 'error'} aria-label={isMuted ? 'Микрофон нээх' : 'Микрофон хаах'} title={isMuted ? 'Микрофон нээх' : 'Микрофон хаах'} className={`rounded-full p-3 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:opacity-40 ${isMuted ? 'bg-red-500/30' : 'bg-white/10'}`}>{isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}</button>
          <button type="button" onClick={toggleVideo} disabled={!localStreamRef.current || callStatus === 'error'} aria-label={isVideoOff ? 'Камер асаах' : 'Камер унтраах'} title={isVideoOff ? 'Камер асаах' : 'Камер унтраах'} className={`rounded-full p-3 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:opacity-40 ${isVideoOff ? 'bg-red-500/30' : 'bg-white/10'}`}>{isVideoOff ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}</button>
          <button type="button" onClick={toggleScreenShare} disabled={!localStreamRef.current || callStatus === 'error'} aria-label={isScreenSharing ? 'Дэлгэц хуваалцахаа зогсоох' : 'Дэлгэц хуваалцах'} title={isScreenSharing ? 'Хуваалцахаа зогсоох' : 'Дэлгэц хуваалцах'} className={`rounded-full p-3 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:opacity-40 ${isScreenSharing ? 'bg-indigo-500' : 'bg-white/10'}`}><MonitorUp className="h-5 w-5" /></button>
          <button type="button" onClick={handleEndCall} aria-label="Дуудлага дуусгах" title="Дуудлага дуусгах" className="rounded-full bg-red-600 p-3 text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><PhoneOff className="h-5 w-5" /></button>
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
