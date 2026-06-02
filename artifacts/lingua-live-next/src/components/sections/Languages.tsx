"use client"
import { motion } from "framer-motion";

const languages = [
  { name: "Hindi",     script: "हिंदी",      color: "bg-orange-500" },
  { name: "English",   script: "English",    color: "bg-blue-500" },
  { name: "Telugu",    script: "తెలుగు",      color: "bg-pink-500" },
  { name: "Tamil",     script: "தமிழ்",       color: "bg-red-500" },
  { name: "Kannada",   script: "ಕನ್ನಡ",      color: "bg-yellow-500" },
  { name: "Malayalam", script: "മലയാളം",     color: "bg-green-500" },
  { name: "Marathi",   script: "मराठी",      color: "bg-purple-500" },
  { name: "Bengali",   script: "বাংলা",       color: "bg-teal-500" },
  { name: "Gujarati",  script: "ગુજરાતી",    color: "bg-cyan-500" },
  { name: "Punjabi",   script: "ਪੰਜਾਬੀ",    color: "bg-indigo-500" },
];

export function Languages() {
  return (
    <section id="languages" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold mb-4"
        >
          10 Indian Languages. One Platform.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-muted-foreground max-w-2xl mx-auto text-lg"
        >
          Break boundaries across India with seamless real-time translation.
        </motion.p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {languages.map((lang, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.04, duration: 0.35 }}
            className="glass-card p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-primary/30 transition-colors duration-200 cursor-default"
          >
            <div className={`w-12 h-12 rounded-full ${lang.color} bg-opacity-20 flex items-center justify-center`}>
              <span className="text-2xl font-serif text-white">{lang.script[0]}</span>
            </div>
            <div>
              <div className="font-semibold">{lang.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{lang.script}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
