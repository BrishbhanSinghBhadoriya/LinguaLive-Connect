"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Volume2, Languages, PhoneOff, Users,
  Copy, Check, Wifi, WifiOff, MessageSquare, LogIn,
  Sparkles, Radio, AlertCircle, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { VoiceSocket, type VoiceSocketEvent } from "@/lib/voice-socket";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Use the current origin so the Next.js rewrite proxy forwards to the API server.
// Set NEXT_PUBLIC_SOCKET_URL only if you need to override (e.g. in production).
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

const languages = [
  { code: "hi-IN", name: "Hindi",          script: "हिंदी",      color: "from-orange-400 to-orange-600",   dot: "bg-orange-400" },
  { code: "bn-IN", name: "Bengali",         script: "বাংলা",       color: "from-green-400 to-green-600",     dot: "bg-green-400" },
  { code: "te-IN", name: "Telugu",          script: "తెలుగు",      color: "from-pink-400 to-pink-600",       dot: "bg-pink-400" },
  { code: "mr-IN", name: "Marathi",         script: "मराठी",      color: "from-purple-400 to-purple-600",   dot: "bg-purple-400" },
  { code: "ta-IN", name: "Tamil",           script: "தமிழ்",       color: "from-red-400 to-red-600",         dot: "bg-red-400" },
  { code: "gu-IN", name: "Gujarati",        script: "ગુજરાતી",    color: "from-indigo-400 to-indigo-600",   dot: "bg-indigo-400" },
  { code: "kn-IN", name: "Kannada",         script: "ಕನ್ನಡ",      color: "from-yellow-400 to-yellow-600",   dot: "bg-yellow-400" },
  { code: "ml-IN", name: "Malayalam",       script: "മലയാളം",     color: "from-teal-400 to-teal-600",       dot: "bg-teal-400" },
  { code: "pa-IN", name: "Punjabi",         script: "ਪੰਜਾਬੀ",    color: "from-amber-400 to-amber-600",     dot: "bg-amber-400" },
  { code: "or-IN", name: "Odia",            script: "ଓଡ଼ିଆ",       color: "from-lime-400 to-lime-600",       dot: "bg-lime-400" },
  { code: "ur-IN", name: "Urdu",            script: "اردو",        color: "from-rose-400 to-rose-600",       dot: "bg-rose-400" },
  { code: "en-IN", name: "English (India)", script: "English",     color: "from-blue-400 to-blue-600",       dot: "bg-blue-400" },
];

const demoConversations = [
  { original: "नमस्ते! आप कैसे हैं?",         translated: "Hello! How are you?",           from: "hi-IN", to: "en-IN" },
  { original: "मैं ठीक हूँ, धन्यवाद!",       translated: "I'm fine, thank you!",           from: "hi-IN", to: "en-IN" },
  { original: "आज बैठक कब शुरू होगी?",        translated: "When will today's meeting start?", from: "hi-IN", to: "en-IN" },
  { original: "क्या आप मुझे समझ पा रहे हैं?", translated: "Are you able to understand me?",  from: "hi-IN", to: "en-IN" },
];

type Transcript = {
  id: string;
  userId: string;
  userName: string;
  original: string;
  translated: string;
  fromLang: string;
  toLang: string;
  timestamp: Date;
  isOwn: boolean;
};

type CallState = "idle" | "lobby" | "connecting" | "active";

// --- Waveform ---
function Waveform({ active, size = "md" }: { active: boolean; size?: "sm" | "md" | "lg" }) {
  const bars = size === "lg" ? 16 : size === "md" ? 10 : 6;
  const heights = size === "lg" ? [4, 12, 24, 16, 32, 20, 28, 12, 36, 20, 28, 16, 32, 12, 24, 8]
                : size === "md" ? [4, 12, 24, 16, 32, 12, 28, 16, 24, 8]
                : [4, 14, 24, 14, 24, 8];
  return (
    <div className="flex items-center justify-center gap-[3px]">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full bg-gradient-to-t from-violet-500 to-cyan-400"
          style={{ width: size === "lg" ? 4 : 3, minHeight: 4 }}
          animate={{ height: active ? [4, heights[i], 4] : 4, opacity: active ? [0.5, 1, 0.5] : 0.25 }}
          transition={{ duration: 0.5 + (i % 3) * 0.15, repeat: active ? Infinity : 0, delay: i * 0.06 }}
        />
      ))}
    </div>
  );
}

// --- Pulsing mic ring ---
function PulseRing({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {active && [0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-violet-400/40"
          style={{ width: 96, height: 96 }}
          animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// --- Language Select ---
function LangSelect({ value, onChange, label, icon: Icon, disabled }: {
  value: string; onChange: (v: string) => void; label: string;
  icon: React.ElementType; disabled?: boolean;
}) {
  const lang = languages.find(l => l.code === value)!;
  return (
    <div className="relative">
      <label className="block text-xs text-white/40 font-medium uppercase tracking-widest mb-2">
        <Icon className="inline w-3 h-3 mr-1" />{label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl pl-10 pr-8 py-3 text-white text-sm focus:outline-none focus:border-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {languages.map(l => (
            <option key={l.code} value={l.code} className="bg-[#0f0f1a]">
              {l.name} ({l.script})
            </option>
          ))}
        </select>
        <span className={`absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${lang.dot}`} />
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
      </div>
    </div>
  );
}

export function VoiceCall() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [socket, setSocket] = useState<VoiceSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [callState, setCallState] = useState<CallState>("idle");
  const [roomId, setRoomId] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputLang, setInputLang] = useState("hi-IN");
  const [outputLang, setOutputLang] = useState("en-IN");
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [liveText, setLiveText] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [participants, setParticipants] = useState(1);
  const [browserSupported, setBrowserSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const demoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<VoiceSocket | null>(null);

  // Auto-scroll transcripts
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts]);

  // Check browser support
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setBrowserSupported(!!SR && !!window.speechSynthesis);
    synthRef.current = window.speechSynthesis;
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  // Socket setup — uses a ref so React 19 strict-mode double-invoke doesn't race
  useEffect(() => {
    if (!isLoggedIn) return;

    // Already created by strict-mode first pass — reuse it
    if (socketRef.current) {
      setSocket(socketRef.current);
      return;
    }

    const s = new VoiceSocket(SOCKET_URL, { userId: user.id, userName: user.name });
    socketRef.current = s;

    const off = s.on((event: VoiceSocketEvent) => {
      switch (event.type) {
        case "connected":
          setConnected(true);
          setError("");
          break;
        case "disconnected":
          setConnected(false);
          break;
        case "user-joined":
          setParticipants(event.count ?? 2);
          setStatus(`${event.userName} joined the room`);
          break;
        case "user-left":
          setParticipants(event.count ?? 1);
          setStatus(`${event.userName} left the room`);
          break;
        case "receive-transcript":
          setTranscripts(prev => [...prev, { ...event, timestamp: new Date(event.timestamp), isOwn: false }]);
          speakText(event.translated, outputLang);
          break;
        case "error":
          setError(event.message ?? "Connection error. Is the API server running on port 3001?");
          break;
      }
    });

    s.connect();
    setSocket(s);

    return () => {
      off();
      s.disconnect();
      socketRef.current = null;
    };
  }, [isLoggedIn]);

  // Speech recognition setup
  useEffect(() => {
    if (!isLoggedIn || !browserSupported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = inputLang;

    recognition.onresult = (event: any) => {
      let interim = "", final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        event.results[i].isFinal ? (final += t) : (interim += t);
      }
      setLiveText(interim || final);
      if (final) handleNewSpeech(final.trim());
    };

    recognition.onerror = (e: any) => {
      if (e.error === "no-speech") return;
      const msgs: Record<string, string> = {
        "audio-capture": "Microphone not accessible",
        "not-allowed": "Microphone permission denied — please allow mic access",
        "network": "Network error during voice capture",
      };
      setError(msgs[e.error] ?? `Voice error: ${e.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      if (isRecording) {
        try { recognition.start(); } catch (_) {}
      }
    };

    recognitionRef.current = recognition;
    return () => { try { recognition.stop(); } catch (_) {} };
  }, [inputLang, isLoggedIn, browserSupported]);

  const speakText = useCallback((text: string, lang: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.rate = 0.92;
    utt.pitch = 1;
    const voices = synthRef.current.getVoices();
    const match = voices.find(v => v.lang === lang)
      ?? voices.find(v => v.lang.startsWith(lang.split("-")[0]));
    if (match) utt.voice = match;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utt);
  }, []);

  const translateText = useCallback(async (text: string, from: string, to: string): Promise<string> => {
    setStatus("Translating...");
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          sourceLanguage: from.split("-")[0],
          targetLanguage: to.split("-")[0],
        }),
      });
      const data = await res.json();
      setStatus("");
      if (data.success && data.translation?.translatedText) return data.translation.translatedText;
    } catch {}
    setStatus("");
    return text;
  }, []);

  const handleNewSpeech = useCallback(async (text: string) => {
    setLiveText("");
    const translated = await translateText(text, inputLang, outputLang);
    const transcript: Transcript = {
      id: Date.now().toString(),
      userId: user?.id ?? "demo",
      userName: user?.name ?? "You",
      original: text,
      translated,
      fromLang: inputLang,
      toLang: outputLang,
      timestamp: new Date(),
      isOwn: true,
    };
    setTranscripts(prev => [...prev, transcript]);
    speakText(translated, outputLang);
    if (socket?.isConnected && roomId) {
      socket.sendTranscript(roomId, { ...transcript, timestamp: transcript.timestamp.toISOString() });
    }
  }, [inputLang, outputLang, user, socket, roomId, translateText, speakText]);

  // --- Actions ---
  const generateRoom = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomInput(id);
  };

  const joinRoom = () => {
    const id = roomInput.trim().toUpperCase();
    if (!id) return;
    setCallState("connecting");
    setRoomId(id);
    socket?.joinRoom(id);
    setTimeout(() => setCallState("active"), 800);
  };

  const leaveRoom = () => {
    stopRecording();
    socket?.leaveRoom(roomId);
    setCallState("idle");
    setRoomId("");
    setRoomInput("");
    setTranscripts([]);
    setParticipants(1);
    setLiveText("");
  };

  const startRecording = async () => {
    if (!recognitionRef.current) return;
    setError("");

    // Explicitly request mic permission first so the browser shows the
    // permission prompt and we can give a clear error if denied.
    // This is required on mobile (Chrome/Safari) and on non-localhost HTTP.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // We only needed the permission — stop the raw stream immediately.
      // SpeechRecognition will open its own internal audio stream.
      stream.getTracks().forEach(t => t.stop());
    } catch (err: any) {
      const msg =
        err?.name === "NotAllowedError"
          ? "Microphone permission denied. Please allow mic access in your browser settings."
          : err?.name === "NotFoundError"
          ? "No microphone found on this device."
          : `Microphone error: ${err?.message ?? err}`;
      setError(msg);
      return;
    }

    setIsRecording(true);
    try {
      recognitionRef.current.lang = inputLang;
      recognitionRef.current.start();
      setStatus("Listening...");
    } catch {
      setError("Could not start voice recognition. Try refreshing the page.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setLiveText("");
    setStatus("");
    try { recognitionRef.current?.stop(); } catch (_) {}
    synthRef.current?.cancel();
    setIsSpeaking(false);
  };

  const copyRoom = async () => {
    await navigator.clipboard.writeText(roomId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Demo mode — simulate conversation
  const runDemo = () => {
    setCallState("active");
    let i = 0;
    demoTimerRef.current = setInterval(async () => {
      if (i >= demoConversations.length) {
        clearInterval(demoTimerRef.current!);
        setCallState("idle");
        return;
      }
      const c = demoConversations[i++];
      setLiveText(c.original);
      setStatus("Translating...");
      await new Promise(r => setTimeout(r, 700));
      setLiveText("");
      setStatus("🔊 Speaking...");
      setTranscripts(prev => [...prev, {
        id: Date.now().toString(),
        userId: "demo",
        userName: "Demo User",
        original: c.original,
        translated: c.translated,
        fromLang: c.from,
        toLang: c.to,
        timestamp: new Date(),
        isOwn: true,
      }]);
      setStatus("");
    }, 3500);
  };

  const stopDemo = () => {
    if (demoTimerRef.current) clearInterval(demoTimerRef.current);
    setCallState("idle");
    setTranscripts([]);
    setLiveText("");
    setStatus("");
  };

  // --- UI helpers ---
  const inputLangObj  = languages.find(l => l.code === inputLang)!;
  const outputLangObj = languages.find(l => l.code === outputLang) ?? languages[0];

  return (
    <div className="min-h-screen bg-[#07071a] text-white overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4  w-[500px] h-[500px] bg-violet-700/8  rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/6   rounded-full blur-[100px]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio className="w-5 h-5 text-violet-400 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-violet-400 font-semibold">AI Voice Translation</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Live Translation Call
              </span>
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {isLoggedIn ? `Signed in as ${user.name}` : "Demo mode — sign in for live calls"}
            </p>
          </div>

          {/* Status badge */}
          {isLoggedIn && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border ${
              connected
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-white/5 border-white/10 text-white/40"
            }`}>
              {connected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              {connected ? "Server Connected" : "Connecting..."}
            </div>
          )}
        </div>

        {/* ── Error Banner ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
              <button onClick={() => setError("")} className="ml-auto text-red-400/60 hover:text-red-400">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── NOT LOGGED IN — Demo Gate ── */}
        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <span className="font-semibold text-violet-300">Demo Mode Active</span>
                </div>
                <p className="text-white/50 text-sm">
                  Sign in to enable real microphone access, live voice rooms, and peer-to-peer translation.
                </p>
              </div>
              <a
                href="/auth"
                className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </a>
            </div>
          </motion.div>
        )}

        {/* ── MAIN LAYOUT ── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── LEFT PANEL ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Language selector */}
            <div className="glass-card rounded-3xl p-6">
              <div className="grid sm:grid-cols-2 gap-4 items-end">
                <LangSelect value={inputLang} onChange={setInputLang} label="You speak" icon={Mic} disabled={isRecording} />
                <div className="flex items-end gap-4">
                  <div className="hidden sm:flex items-center justify-center pb-2">
                    <Languages className="w-6 h-6 text-violet-400" />
                  </div>
                  <LangSelect value={outputLang} onChange={setOutputLang} label="You hear" icon={Volume2} />
                </div>
              </div>
            </div>

            {/* Call interface */}
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-cyan-600/5 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center">

                {/* Waveform */}
                <div className="h-12 mb-6 w-full flex items-center justify-center">
                  <Waveform active={isRecording} size="lg" />
                </div>

                {/* Big Mic Button */}
                <div className="relative mb-6">
                  <PulseRing active={isRecording} />
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={
                      !isLoggedIn ? undefined
                      : isRecording ? stopRecording
                      : callState === "active" ? startRecording
                      : undefined
                    }
                    disabled={!isLoggedIn || callState !== "active"}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl
                      ${!isLoggedIn || callState !== "active"
                        ? "bg-white/5 border border-white/10 cursor-not-allowed opacity-50"
                        : isRecording
                          ? "bg-red-500 hover:bg-red-600 shadow-[0_0_40px_rgba(239,68,68,0.5)]"
                          : "bg-gradient-to-br from-violet-500 to-fuchsia-600 hover:shadow-[0_0_50px_rgba(139,92,246,0.6)]"
                      }`}
                  >
                    {isRecording
                      ? <MicOff className="w-10 h-10 text-white" />
                      : <Mic className="w-10 h-10 text-white" />
                    }
                  </motion.button>
                </div>

                {/* Status text */}
                <div className="h-8 text-center">
                  {status && (
                    <motion.p
                      key={status}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-violet-300 flex items-center gap-2 justify-center"
                    >
                      <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                      {status}
                    </motion.p>
                  )}
                  {!status && isRecording && (
                    <p className="text-sm text-white/50">
                      {isSpeaking ? "🔊 Speaking translation..." : "🎤 Listening..."}
                    </p>
                  )}
                  {!isRecording && callState === "active" && !status && (
                    <p className="text-sm text-white/30">Tap mic to start speaking</p>
                  )}
                </div>

                {/* Live recognized text */}
                <AnimatePresence>
                  {liveText && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 w-full max-w-md p-4 rounded-2xl bg-white/5 border border-violet-500/20 text-center"
                    >
                      <p className="text-white/70 text-sm italic">"{liveText}"</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Room controls */}
                <div className="mt-8 w-full max-w-md">
                  {callState === "idle" && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={roomInput}
                          onChange={e => setRoomInput(e.target.value.toUpperCase())}
                          placeholder={isLoggedIn ? "Enter Room ID (e.g. ABC123)" : "Sign in for live rooms"}
                          disabled={!isLoggedIn}
                          maxLength={8}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
                        />
                        {isLoggedIn && (
                          <Button variant="outline" onClick={generateRoom}
                            className="border-white/10 hover:bg-white/5 text-white/60 rounded-xl text-xs px-3">
                            Generate
                          </Button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {isLoggedIn ? (
                          <Button
                            onClick={joinRoom}
                            disabled={!roomInput.trim() || !connected}
                            className="flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:opacity-90 disabled:opacity-40 rounded-xl"
                          >
                            <Users className="w-4 h-4 mr-2" /> Join Room
                          </Button>
                        ) : (
                          <Button
                            onClick={callState === "idle" ? runDemo : stopDemo}
                            className="flex-1 bg-gradient-to-r from-violet-500/60 to-fuchsia-600/60 rounded-xl"
                          >
                            <Sparkles className="w-4 h-4 mr-2" /> Run Demo
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {callState === "connecting" && (
                    <div className="flex items-center justify-center gap-3 py-4">
                      <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-white/60">Joining room...</span>
                    </div>
                  )}

                  {callState === "active" && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {roomId && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/40">Room:</span>
                            <code className="text-sm text-violet-300 font-mono bg-violet-500/10 px-3 py-1 rounded-lg">{roomId}</code>
                            <button onClick={copyRoom} className="text-white/30 hover:text-violet-400 transition-colors">
                              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-white/40">
                          <Users className="w-3 h-3" /> {participants}
                        </div>
                      </div>
                      <Button
                        onClick={isLoggedIn ? leaveRoom : stopDemo}
                        className="bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 rounded-xl px-4"
                        variant="outline"
                      >
                        <PhoneOff className="w-4 h-4 mr-2" />
                        {isLoggedIn ? "Leave" : "Stop"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL — Transcript ── */}
          <div className="glass-card rounded-3xl p-6 flex flex-col" style={{ minHeight: 480 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2 text-white/80">
                <MessageSquare className="w-4 h-4 text-violet-400" />
                Transcript
              </h3>
              {transcripts.length > 0 && (
                <button onClick={() => setTranscripts([])} className="text-xs text-white/20 hover:text-white/50">
                  Clear
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scroll">
              <AnimatePresence initial={false}>
                {transcripts.map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`p-4 rounded-2xl border text-sm ${
                      t.isOwn
                        ? "bg-violet-500/10 border-violet-500/20 ml-4"
                        : "bg-cyan-500/10 border-cyan-500/20 mr-4"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium ${t.isOwn ? "text-violet-400" : "text-cyan-400"}`}>
                        {t.userName}
                      </span>
                      <span className="text-xs text-white/20">
                        {new Date(t.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-white/60 mb-1 text-xs">
                      {languages.find(l => l.code === t.fromLang)?.name ?? t.fromLang}:
                    </p>
                    <p className="text-white/85 mb-2">{t.original}</p>
                    <div className="border-t border-white/5 pt-2">
                      <p className="text-white/40 mb-1 text-xs">
                        → {languages.find(l => l.code === t.toLang)?.name ?? t.toLang}:
                      </p>
                      <p className={`font-medium ${t.isOwn ? "text-violet-300" : "text-cyan-300"}`}>
                        {t.translated}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {transcripts.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <MessageSquare className="w-8 h-8 text-white/10 mb-3" />
                  <p className="text-white/25 text-sm">
                    {isLoggedIn ? "Join a room and start speaking" : "Run demo to see transcripts"}
                  </p>
                </div>
              )}
              <div ref={transcriptEndRef} />
            </div>
          </div>
        </div>

        {/* ── Info strip ── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/20">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-400/50" />Web Speech API</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400/50" />Socket.io Rooms</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-fuchsia-400/50" />MyMemory Translation</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400/50" />{browserSupported ? "Browser Supported ✓" : "Use Chrome/Edge for mic"}</span>
        </div>
      </div>
    </div>
  );
}
