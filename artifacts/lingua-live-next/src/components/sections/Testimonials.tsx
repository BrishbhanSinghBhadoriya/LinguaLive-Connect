"use client"
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "LinguaLive AI transformed how we deliver online classes across India. Students in Tamil Nadu and UP can now participate in the same live session. The accuracy is remarkable.",
    name: "Priya Sharma", title: "Co-founder & CEO", company: "EduBridge Technologies",
    initials: "PS", color: "bg-gradient-to-br from-orange-400 to-pink-500",
  },
  {
    quote: "In healthcare, miscommunication can be fatal. LinguaLive AI gives our doctors confidence to consult patients in rural areas who speak regional languages. The sub-second latency is a game changer.",
    name: "Dr. Raj Kumar", title: "Chief Technology Officer", company: "Medivox Health Systems",
    initials: "RK", color: "bg-gradient-to-br from-blue-400 to-cyan-500",
  },
  {
    quote: "We integrated LinguaLive AI into our global call centers within a week. Customer satisfaction scores went up 40% in regional markets. It's the infrastructure layer we needed.",
    name: "Sarah Mitchell", title: "VP of Global Operations", company: "Nexus Customer Solutions",
    initials: "SM", color: "bg-gradient-to-br from-purple-400 to-violet-500",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            className="inline-block text-xs uppercase tracking-widest text-secondary font-semibold mb-4"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold"
          >
            Trusted by Global Teams
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.12, duration: 0.45 }}
              className="glass-card p-8 flex flex-col justify-between relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />
              <div>
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-8">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-white/40 text-xs">{t.title} · {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
