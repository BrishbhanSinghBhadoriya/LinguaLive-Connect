"use client";
import dynamic from "next/dynamic";

// Skip SSR entirely — VoiceCall uses browser APIs (Web Speech, Socket.io, AudioContext)
const VoiceCall = dynamic(
  () => import("@/components/VoiceCall").then((m) => ({ default: m.VoiceCall })),
  { ssr: false, loading: () => (
    <div className="min-h-screen bg-[#07071a] flex items-center justify-center">
      <div className="flex items-center gap-3 text-white/50">
        <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
        Loading voice call...
      </div>
    </div>
  )}
);

export default function CallPage() {
  return <VoiceCall />;
}
