"use client"
import { motion } from "framer-motion";
import { Mic, FileText, Languages, Volume2 } from "lucide-react";

const steps = [
  { Icon: Mic,       title: "Speak",     desc: "Talk in your native language" },
  { Icon: FileText,  title: "Process",   desc: "AI converts speech to text" },
  { Icon: Languages, title: "Translate", desc: "Instant accurate translation" },
  { Icon: Volume2,   title: "Listen",    desc: "Listener hears translated voice" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold"
        >
          How LinguaLive AI Works
        </motion.h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative">
        {/* connector line — desktop only */}
        <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary/10 via-secondary/40 to-primary/10" />

        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.12, duration: 0.45 }}
            className="flex flex-col items-center text-center relative"
          >
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center text-primary shadow-[0_0_24px_rgba(108,99,255,0.15)]">
                <step.Icon className="w-6 h-6" />
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                {i + 1}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
            <p className="text-muted-foreground text-sm max-w-[140px]">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
