"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Planet {
  sign: string;
  name: string;
  orbit: number;  // fraction of max radius (0–1)
  size: number;   // fraction of canvas width
  dur: number;    // seconds per full orbit
  start: number;  // initial angle in degrees
  colors: [string, string];
  ring: boolean;
  ringColor: string;
}

// ─── Wave Bar ─────────────────────────────────────────────────────────────────
const WaveBar = ({ delay }: { delay: number }) => (
  <motion.div
    className="w-[3px] rounded-full bg-gradient-to-t from-[#5b6ff5] to-[#7effc8]"
    style={{ height: 5, minHeight: 5 }}
    animate={{ height: [5, 28, 8, 22, 5] }}
    transition={{
      duration: 2.2,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
      repeatType: "reverse",
    }}
  />
);

// ─── Planet Data ──────────────────────────────────────────────────────────────
const PLANETS: Planet[] = [
  { sign: "En",    name: "English",   orbit: 0.14, size: 0.042, dur: 12,  start: 0,   colors: ["#90c4ff", "#1a4a9e"], ring: true,  ringColor: "#5588cc" },
  { sign: "हिं",   name: "Hindi",     orbit: 0.22, size: 0.052, dur: 20,  start: 45,  colors: ["#ffb366", "#c04000"], ring: false, ringColor: "" },
  { sign: "த",     name: "Tamil",     orbit: 0.30, size: 0.046, dur: 30,  start: 90,  colors: ["#ffd700", "#a06000"], ring: false, ringColor: "" },
  { sign: "বাং",   name: "Bengali",   orbit: 0.38, size: 0.050, dur: 42,  start: 135, colors: ["#55e0a0", "#0a6640"], ring: false, ringColor: "" },
  { sign: "తె",    name: "Telugu",    orbit: 0.46, size: 0.054, dur: 56,  start: 180, colors: ["#cc88ff", "#6600aa"], ring: true,  ringColor: "#bb66ff" },
  { sign: "म",     name: "Marathi",   orbit: 0.54, size: 0.042, dur: 72,  start: 220, colors: ["#ff8888", "#aa0022"], ring: false, ringColor: "" },
  { sign: "اردو",  name: "Urdu",      orbit: 0.62, size: 0.046, dur: 92,  start: 40,  colors: ["#88ddff", "#004488"], ring: false, ringColor: "" },
  { sign: "ਪੰ",    name: "Punjabi",   orbit: 0.70, size: 0.050, dur: 115, start: 270, colors: ["#ffee55", "#886600"], ring: true,  ringColor: "#ccaa00" },
  { sign: "ಕ",     name: "Kannada",   orbit: 0.78, size: 0.044, dur: 140, start: 300, colors: ["#aaffaa", "#006600"], ring: false, ringColor: "" },
  { sign: "മ",     name: "Malayalam", orbit: 0.86, size: 0.042, dur: 170, start: 330, colors: ["#ffaacc", "#880044"], ring: false, ringColor: "" },
  { sign: "ગુ",    name: "Gujarati",  orbit: 0.94, size: 0.048, dur: 210, start: 10,  colors: ["#ffcc88", "#884400"], ring: false, ringColor: "" },
];

const TRUSTED_LOGOS = ["Google", "Microsoft", "Tata", "Infosys", "Wipro"];

// ─── Solar System Canvas ──────────────────────────────────────────────────────
function SolarSystemCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const anglesRef = useRef<number[]>(PLANETS.map((p) => (p.start * Math.PI) / 180));
  const rafRef = useRef<number>(0);
  const lastTRef = useRef<number>(0);

  const draw = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dt = lastTRef.current === 0 ? 0 : (ts - lastTRef.current) / 1000;
    lastTRef.current = ts;

    const W = canvas.width;
    const H = canvas.height;
    const CX = W / 2;
    const CY = H / 2;
    const R = W * 0.47;

    ctx.clearRect(0, 0, W, H);

    // ── Sun corona glow (multi-layer) ──
    const sunR = W * 0.065;
    for (let g = 4; g >= 1; g--) {
      const glowGrad = ctx.createRadialGradient(CX, CY, 0, CX, CY, sunR * g * 1.8);
      glowGrad.addColorStop(0, `rgba(255,180,30,${0.07 / g})`);
      glowGrad.addColorStop(1, "rgba(255,100,0,0)");
      ctx.beginPath();
      ctx.arc(CX, CY, sunR * g * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();
    }

    // ── Orbit rings ──
    PLANETS.forEach((p) => {
      ctx.beginPath();
      ctx.arc(CX, CY, p.orbit * R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(120,140,255,0.13)";
      ctx.lineWidth = 0.7;
      ctx.stroke();
    });

    // ── Sun body ──
    const sunGrad = ctx.createRadialGradient(
      CX - sunR * 0.28, CY - sunR * 0.28, 0,
      CX, CY, sunR
    );
    sunGrad.addColorStop(0, "#fff8d0");
    sunGrad.addColorStop(0.35, "#ffcc44");
    sunGrad.addColorStop(1, "#e06000");
    ctx.beginPath();
    ctx.arc(CX, CY, sunR, 0, Math.PI * 2);
    ctx.fillStyle = sunGrad;
    ctx.fill();

    // Sun surface highlight
    ctx.beginPath();
    ctx.ellipse(CX - sunR * 0.35, CY - sunR * 0.35, sunR * 0.28, sunR * 0.18, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,220,0.38)";
    ctx.fill();

    // ── Sun labels ──
    ctx.textAlign = "center";
    ctx.font = `600 ${W * 0.018}px 'Space Grotesk', system-ui, sans-serif`;
    ctx.fillStyle = "#ffdd77";
    ctx.fillText("🌐 VoiceAI", CX, CY + sunR + W * 0.026);

    ctx.font = `400 ${W * 0.013}px 'Space Grotesk', system-ui, sans-serif`;
    ctx.fillStyle = "rgba(255,160,60,0.7)";
    ctx.fillText("Core Engine", CX, CY + sunR + W * 0.044);

    // ── Planets ──
    PLANETS.forEach((p, i) => {
      const speed = (2 * Math.PI) / p.dur;
      anglesRef.current[i] = (anglesRef.current[i] + speed * dt) % (Math.PI * 2);

      const orbitPx = p.orbit * R;
      const pr = p.size * W;
      const px = CX + orbitPx * Math.sin(anglesRef.current[i]);
      const py = CY - orbitPx * Math.cos(anglesRef.current[i]);

      // Drop shadow
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = pr * 1.5;
      ctx.shadowOffsetX = pr * 0.3;
      ctx.shadowOffsetY = pr * 0.3;

      // Planet gradient
      const pg = ctx.createRadialGradient(
        px - pr * 0.3, py - pr * 0.3, pr * 0.05,
        px, py, pr
      );
      pg.addColorStop(0, p.colors[0]);
      pg.addColorStop(1, p.colors[1]);
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fillStyle = pg;
      ctx.fill();
      ctx.restore();

      // Saturn ring
      if (p.ring && p.ringColor) {
        ctx.save();
        ctx.translate(px, py);
        ctx.scale(1, 0.3);
        ctx.beginPath();
        ctx.arc(0, 0, pr * 1.75, 0, Math.PI * 2);
        ctx.strokeStyle = p.ringColor + "99";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // Sign label (inside planet)
      ctx.textAlign = "center";
      ctx.font = `600 ${pr * 0.72}px system-ui, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fillText(p.sign, px, py + pr * 0.28);

      // Name label (below planet)
      const nameSize = Math.max(8, W * 0.014);
      ctx.font = `400 ${nameSize}px 'Space Grotesk', system-ui, sans-serif`;
      ctx.fillStyle = "rgba(190,200,255,0.72)";
      ctx.fillText(p.name, px, py + pr + nameSize + 2);
    });

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const sz = Math.min(parent.offsetWidth, parent.offsetHeight, 500);
      canvas.width = sz;
      canvas.height = sz;
    };

    setSize();

    const ro = new ResizeObserver(setSize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    lastTRef.current = 0;
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="block"
      aria-label="Solar system showing Indian languages orbiting a VoiceAI core"
    />
  );
}

// ─── Hero Component ───────────────────────────────────────────────────────────
export function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,#0d1433_0%,#060a1a_60%,#020408_100%)]">

      {/* ── Background glows ── */}
      <div className="pointer-events-none absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-[#5b6ff5]/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#7effc8]/6 blur-[120px]" />

      {/* ── Starfield ── */}
      <Starfield />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 py-24 grid md:grid-cols-2 gap-8 items-center">

        {/* ── Left column ── */}
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#6c95ff]/35 bg-[#6c95ff]/10 text-[#7eaaff] text-xs font-medium mb-8 tracking-wide"
          >
            <span className="w-2 h-2 rounded-full bg-[#7effc8] animate-pulse" />
            Real-Time AI Voice Translation
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-5 text-white"
          >
            Speak Any Language.{" "}
            <span className="bg-gradient-to-r from-[#7eaaff] via-[#a78bfa] to-[#7effc8] bg-clip-text text-transparent">
              Be Understood
            </span>{" "}
            Everywhere.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-base md:text-lg text-white/55 max-w-md mb-9 leading-relaxed"
          >
            Real-time AI voice translation for Indian languages —
            sub-second latency, natural voice output across 11+ languages.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap gap-4 mb-11"
          >
            <button
              onClick={() => scrollTo("#pricing")}
              className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#5b6ff5] to-[#8b5cf6] text-white font-semibold text-sm shadow-[0_0_32px_rgba(91,111,245,0.45)] hover:shadow-[0_0_52px_rgba(91,111,245,0.65)] hover:scale-105 transition-all duration-200"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => scrollTo("#demo")}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-white/80 font-semibold text-sm hover:bg-white/5 hover:border-white/38 transition-all duration-200"
            >
              <Play className="w-4 h-4 text-[#7effc8]" />
              Watch Demo
            </button>
          </motion.div>

          {/* Wave Bars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-end gap-[3px] mb-10 h-10"
          >
            <span className="text-[10px] text-white/30 mr-3 self-center whitespace-nowrap tracking-wide">
              AI Voice Processing
            </span>
            {Array.from({ length: 26 }).map((_, i) => (
              <WaveBar key={i} delay={i * 0.065} />
            ))}
          </motion.div>

          {/* Trust Logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="flex flex-col gap-3"
          >
            <p className="text-[9px] text-white/25 uppercase tracking-[3px]">
              Trusted by 500+ enterprises
            </p>
            <div className="flex flex-wrap gap-3">
              {TRUSTED_LOGOS.map((logo) => (
                <span
                  key={logo}
                  className="text-[11px] text-white/25 font-semibold tracking-wide px-3 py-1.5 rounded-md border border-white/10"
                >
                  {logo}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right column — Solar System ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          className="flex items-center justify-center w-full aspect-square max-w-[520px] mx-auto"
        >
          <SolarSystemCanvas />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Starfield ────────────────────────────────────────────────────────────────
function Starfield() {
  // Static star positions (pre-computed to avoid hydration mismatch)
  const stars = [
    { x: 6,  y: 12, s: 1.2, o: 0.25, d: 0.2 },  { x: 18, y: 5,  s: 0.8, o: 0.4,  d: 1.1 },
    { x: 28, y: 30, s: 1.0, o: 0.3,  d: 0.7 },  { x: 45, y: 8,  s: 1.3, o: 0.5,  d: 1.8 },
    { x: 62, y: 22, s: 0.9, o: 0.2,  d: 0.4 },  { x: 74, y: 55, s: 1.1, o: 0.35, d: 2.2 },
    { x: 85, y: 15, s: 0.7, o: 0.45, d: 0.9 },  { x: 92, y: 70, s: 1.2, o: 0.3,  d: 1.5 },
    { x: 10, y: 45, s: 1.0, o: 0.2,  d: 1.3 },  { x: 35, y: 80, s: 0.8, o: 0.4,  d: 0.6 },
    { x: 55, y: 65, s: 1.3, o: 0.25, d: 2.0 },  { x: 70, y: 40, s: 0.9, o: 0.5,  d: 0.3 },
    { x: 82, y: 85, s: 1.1, o: 0.3,  d: 1.7 },  { x: 3,  y: 88, s: 0.7, o: 0.4,  d: 1.0 },
    { x: 48, y: 92, s: 1.0, o: 0.2,  d: 2.5 },  { x: 90, y: 3,  s: 1.4, o: 0.45, d: 0.8 },
    { x: 22, y: 60, s: 0.8, o: 0.35, d: 1.4 },  { x: 67, y: 10, s: 1.2, o: 0.3,  d: 0.5 },
    { x: 40, y: 48, s: 0.9, o: 0.5,  d: 1.9 },  { x: 78, y: 28, s: 1.0, o: 0.25, d: 2.3 },
    { x: 15, y: 72, s: 1.1, o: 0.4,  d: 0.2 },  { x: 58, y: 35, s: 0.7, o: 0.3,  d: 1.6 },
    { x: 95, y: 50, s: 1.3, o: 0.45, d: 0.7 },  { x: 30, y: 18, s: 0.8, o: 0.2,  d: 2.1 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.s}px`,
            height: `${star.s}px`,
            opacity: star.o,
          }}
          animate={{ opacity: [star.o * 0.3, star.o, star.o * 0.3] }}
          transition={{
            duration: 2 + (i % 5) * 0.5,
            repeat: Infinity,
            delay: star.d,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}