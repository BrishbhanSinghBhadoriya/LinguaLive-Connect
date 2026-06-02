"use client"
import { motion } from "framer-motion";
import { GraduationCap, HeartPulse, Headphones, Landmark, Plane, PhoneCall, Building2 } from "lucide-react";

const industries = [
  { Icon: GraduationCap, name: "Education",        desc: "Bridge classroom language gaps for multilingual students",             color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40" },
  { Icon: HeartPulse,    name: "Healthcare",        desc: "Enable doctors to communicate clearly with every patient",            color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40" },
  { Icon: Headphones,    name: "Customer Support",  desc: "Resolve issues faster with native-language conversations",            color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40" },
  { Icon: Landmark,      name: "Government",        desc: "Serve every citizen in their preferred language",                     color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20 hover:border-yellow-500/40" },
  { Icon: Plane,         name: "Travel & Tourism",  desc: "Help travelers navigate with confidence",                            color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/40" },
  { Icon: PhoneCall,     name: "Call Centers",      desc: "Scale multilingual support without multilingual staff",              color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20 hover:bg-green-500/20 hover:border-green-500/40" },
  { Icon: Building2,     name: "Enterprise",        desc: "Unify global teams across language boundaries",                      color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20 hover:border-orange-500/40" },
];

export function Industries() {
  return (
    <section id="industries" className="py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            className="inline-block text-xs uppercase tracking-widest text-secondary font-semibold mb-4"
          >
            Use Cases
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Built for Every Sector
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            From classrooms to boardrooms, LinguaLive AI powers real communication everywhere.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {industries.map((ind, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className={`${ind.bg} rounded-2xl border p-6 transition-colors duration-200 cursor-default`}
            >
              <div className={`${ind.color} mb-4`}><ind.Icon className="w-6 h-6" /></div>
              <h3 className="text-base font-semibold text-white mb-2">{ind.name}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{ind.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
