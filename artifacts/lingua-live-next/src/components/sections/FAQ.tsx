"use client"
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How accurate is the real-time translation?", a: "LinguaLive AI achieves 99.4% translation accuracy across all 16 supported Indian languages. Our models are trained on billions of multilingual data points and continuously refined with enterprise feedback." },
  { q: "Which languages are currently supported?", a: "We support 16 languages: Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, Sanskrit, Nepali, Sinhala, and English (India)." },
  { q: "What is the translation latency?", a: "LinguaLive AI delivers translations in under 300 milliseconds end-to-end. Our edge infrastructure is distributed across 8 data centers in India to minimize latency." },
  { q: "Is my data secure and private?", a: "All audio is encrypted in transit with TLS 1.3 and at rest with AES-256. We do not store any conversation audio. Enterprise plans include optional on-premise deployment for complete data sovereignty." },
  { q: "Can I integrate LinguaLive AI into my existing app?", a: "Yes. Our REST API integrates with any platform in minutes. We provide SDKs for JavaScript, Python, Java, and Swift with comprehensive documentation and sandbox environments." },
  { q: "How does the free trial work?", a: "The Free plan is free forever with 50 translations per day and 2 language pairs. Pro and Business plans include a 14-day free trial with no credit card required." },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            className="inline-block text-xs uppercase tracking-widest text-accent font-semibold mb-4"
          >
            FAQ
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="glass-card rounded-2xl px-6 overflow-hidden data-[state=open]:border-primary/30 border border-white/8"
              >
                <AccordionTrigger className="text-left text-white font-semibold py-5 hover:no-underline hover:text-primary transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/60 text-sm leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
