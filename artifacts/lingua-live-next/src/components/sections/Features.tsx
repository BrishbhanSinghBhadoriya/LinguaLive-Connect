"use client"
import { motion } from "framer-motion";
import { Mic, Cpu, Volume2, Users, Zap, Shield } from "lucide-react";

const features = [
  { icon: Mic,     color: "text-primary",   title: "Real-Time Voice Translation",    desc: "Speak naturally and let our AI translate instantly without awkward pauses." },
  { icon: Cpu,     color: "text-secondary", title: "AI-Powered Language Detection",  desc: "Automatically identifies the spoken language with 99.9% accuracy." },
  { icon: Volume2, color: "text-accent",    title: "Natural Voice Output",           desc: "Generates lifelike translated audio that preserves emotion and tone." },
  { icon: Users,   color: "text-primary",   title: "Multi-Language Conversations",   desc: "Connect groups speaking different languages in one seamless room." },
  { icon: Zap,     color: "text-secondary", title: "Low Latency Communication",      desc: "Sub-second processing ensures conversations flow naturally." },
  { icon: Shield,  color: "text-accent",    title: "Enterprise-Grade Security",      desc: "End-to-end encryption keeps your private conversations private." },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold mb-4"
        >
          Everything You Need to Break Language Barriers
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-muted-foreground max-w-2xl mx-auto text-lg"
        >
          Powerful tools designed for seamless, cross-border communication.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="glass-card p-8 group hover:border-primary/30 transition-colors duration-200"
            >
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6">
                <Icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
