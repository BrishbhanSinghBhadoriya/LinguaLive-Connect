"use client"
import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";

const WaveBar = ({ delay }: { delay: number }) => (
  <motion.div
    className="w-1 rounded-full bg-gradient-to-t from-primary to-secondary"
    style={{ height: 8, minHeight: 8 }}
    animate={{ height: [8, 28, 12, 36, 8] }}
    transition={{
      duration: 2.5,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
      repeatType: "reverse",
    }}
  />
);

const GlobeOrb = () => (
  <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center flex-shrink-0">
    {[1, 2, 3].map((ring) => (
      <motion.div
        key={ring}
        className="absolute rounded-full border border-primary/20"
        style={{ width: `${ring * 100}px`, height: `${ring * 100}px` }}
        animate={{ scale: [1, 1.02, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4 + ring, repeat: Infinity, delay: ring * 0.8, ease: "easeInOut" }}
      />
    ))}
    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/40 shadow-[0_0_60px_rgba(108,99,255,0.4)] flex items-center justify-center backdrop-blur-sm">
      <svg viewBox="0 0 80 80" className="w-20 h-20 opacity-70" fill="none">
        <circle cx="40" cy="40" r="36" stroke="rgba(108,99,255,0.5)" strokeWidth="1" />
        <ellipse cx="40" cy="40" rx="18" ry="36" stroke="rgba(0,229,255,0.4)" strokeWidth="1" />
        <line x1="4" y1="40" x2="76" y2="40" stroke="rgba(108,99,255,0.3)" strokeWidth="1" />
        <line x1="4" y1="26" x2="76" y2="26" stroke="rgba(108,99,255,0.2)" strokeWidth="1" />
        <line x1="4" y1="54" x2="76" y2="54" stroke="rgba(108,99,255,0.2)" strokeWidth="1" />
      </svg>
    </div>
    {[
      { label: "हि", top: "5%", left: "20%", color: "bg-orange-400" },
      { label: "Te", top: "10%", right: "15%", color: "bg-pink-400" },
      { label: "En", bottom: "15%", left: "8%", color: "bg-blue-400" },
      { label: "த", bottom: "10%", right: "20%", color: "bg-red-400" },
      { label: "ক", top: "50%", right: "0%", color: "bg-teal-400" },
    ].map((dot, i) => (
      <motion.div
        key={i}
        className={`absolute w-8 h-8 rounded-full ${dot.color} bg-opacity-80 flex items-center justify-center text-white text-xs font-bold shadow-lg`}
        style={{ top: dot.top, left: dot.left, right: dot.right, bottom: dot.bottom }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
      />
    ))}
  </div>
);

const trustedLogos = ["Google", "Microsoft", "Tata", "Infosys", "Wipro"];

export function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 px-6 md:px-12 overflow-hidden">
      {/* Background glows — pointer-events-none so they don't affect layout */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Real-Time AI Voice Translation
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6"
          >
            Speak Any Language.{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Be Understood
            </span>{" "}
            Everywhere.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg md:text-xl text-white/60 max-w-xl mb-10 leading-relaxed"
          >
            Real-time AI voice translation for Indian languages — sub-second latency,
            natural voice output.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <button
              onClick={() => scrollTo("#pricing")}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold text-base shadow-[0_0_30px_rgba(108,99,255,0.4)] hover:shadow-[0_0_50px_rgba(108,99,255,0.6)] hover:scale-105 transition-all duration-200"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo("#demo")}
              className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-semibold text-base hover:bg-white/5 hover:border-white/40 transition-all duration-200"
            >
              <Play className="w-4 h-4 text-secondary" /> Watch Demo
            </button>
          </motion.div>

          {/* Wave — fixed height container so bars don't cause layout shift */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-end gap-1 mb-10 h-10"
          >
            <span className="text-xs text-white/40 mr-3 self-center whitespace-nowrap">AI Voice Processing</span>
            {Array.from({ length: 24 }).map((_, i) => (
              <WaveBar key={i} delay={i * 0.07} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col gap-3"
          >
            <p className="text-xs text-white/30 uppercase tracking-widest">Trusted by 500+ enterprises</p>
            <div className="flex flex-wrap gap-4">
              {trustedLogos.map((logo) => (
                <span key={logo} className="text-sm text-white/25 font-semibold tracking-wide px-3 py-1 rounded border border-white/8">
                  {logo}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right — Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-center justify-center"
        >
          <GlobeOrb />
        </motion.div>
      </div>
    </section>
  );
}
