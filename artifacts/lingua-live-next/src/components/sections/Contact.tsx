"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Send, CheckCircle2 } from "lucide-react";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Simple form validation
      if (!form.name || !form.email || !form.message) {
        throw new Error("Please fill in all required fields");
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        throw new Error("Please enter a valid email address");
      }
      
      // API call to backend
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      setSubmitted(true);
      setForm({ name: "", email: "", company: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError(""); // Clear error on typing
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-xs uppercase tracking-widest text-primary font-semibold mb-4"
          >
            Get In Touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Let's Start a Conversation
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg"
          >
            Whether you're a startup or Fortune 500, we'd love to hear from you.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 flex flex-col justify-center gap-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white/60 mb-1">Email</div>
                <a
                  href="mailto:hello@lingualive.ai"
                  className="text-white hover:text-primary transition-colors"
                  data-testid="link-contact-email"
                >
                  hello@lingualive.ai
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-secondary/15 border border-secondary/25 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white/60 mb-1">Phone</div>
                <a
                  href="tel:+918012345678"
                  className="text-white hover:text-secondary transition-colors"
                  data-testid="link-contact-phone"
                >
                  +91 80 1234 5678
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-white/40 text-sm mb-4">Follow us</p>
              <div className="flex gap-3">
                {[
                  { label: "X", href: "https://x.com/lingualive_ai" },
                  { label: "LinkedIn", href: "https://linkedin.com/company/lingualive-ai" },
                  { label: "GitHub", href: "https://github.com/lingualive-ai" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="px-4 py-2 rounded-lg border border-white/15 text-white/50 text-xs font-medium hover:border-primary/50 hover:text-primary transition-all duration-200"
                    data-testid={`link-social-${social.label.toLowerCase()}`}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-3"
          >
            {submitted ? (
              <div className="glass-card p-12 flex flex-col items-center justify-center text-center h-full min-h-[350px]">
                <CheckCircle2 className="w-14 h-14 text-primary mb-6" />
                <h3 className="text-2xl font-bold mb-3">Message Sent!</h3>
                <p className="text-white/60">
                  Thanks for reaching out. Our team will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2 block">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
                      data-testid="input-contact-email"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2 block">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Your company (optional)"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
                    data-testid="input-contact-company"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2 block">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us about your use case..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all resize-none"
                    data-testid="textarea-contact-message"
                  />
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm shadow-[0_0_25px_rgba(108,99,255,0.35)] hover:shadow-[0_0_40px_rgba(108,99,255,0.55)] hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  data-testid="button-contact-submit"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

