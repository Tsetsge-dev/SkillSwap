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
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const timerRef = useRef(null);
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
          <span className="hidden rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-slate-200 sm:block">Хэрэглэгч хоорондын шууд холболт</span>
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
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
