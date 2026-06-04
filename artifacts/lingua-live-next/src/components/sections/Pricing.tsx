"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, X, CreditCard, Shield, Globe, Zap as ZapIcon, Users, FileText, CheckCircle } from "lucide-react";

const plans = [
  {
    name: "Free", price: "0", period: "/month",
    desc: "Perfect for individuals exploring AI translation",
    features: ["50 translations / day", "2 languages", "Web app access", "Standard voice quality", "Community support"],
    cta: "Get Started Free", highlight: false,
    gradient: "from-white/5 to-white/2", border: "border-white/10",
    ctaStyle: "border border-white/20 text-white hover:bg-white/5",
  },
  {
    name: "Pro", price: "19", period: "/month",
    desc: "For professionals who need unlimited translation power",
    features: ["Unlimited translations", "5 languages", "API access", "Natural voice output", "Priority email support", "Analytics dashboard"],
    cta: "Start Pro Trial", highlight: true, badge: "Most Popular",
    gradient: "from-primary/20 to-accent/10", border: "border-primary/40",
    ctaStyle: "bg-gradient-to-r from-primary to-accent text-white shadow-[0_0_30px_rgba(108,99,255,0.4)] hover:shadow-[0_0_50px_rgba(108,99,255,0.6)]",
  },
  {
    name: "Business", price: "49", period: "/month",
    desc: "For growing teams serving multilingual customers",
    features: ["Unlimited translations", "All 16 languages", "Team workspace (10 seats)", "Custom voice profiles", "Priority support", "SLA guarantee", "Admin controls"],
    cta: "Start Business Trial", highlight: false,
    gradient: "from-secondary/10 to-accent/5", border: "border-secondary/25",
    ctaStyle: "border border-secondary/40 text-secondary hover:bg-secondary/5",
  },
  {
    name: "Enterprise", price: "Custom", period: "",
    desc: "Built for large organizations with complex requirements",
    features: ["Unlimited everything", "Custom language models", "Dedicated infrastructure", "99.99% SLA uptime", "Dedicated success manager", "On-premise deployment", "HIPAA / SOC2 compliant"],
    cta: "Contact Sales", highlight: false,
    gradient: "from-accent/10 to-primary/5", border: "border-accent/25",
    ctaStyle: "border border-accent/40 text-accent hover:bg-accent/5",
  },
];

export function Pricing() {
  const scrollToContact = () => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);

  return (
    <section id="pricing" className="py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            className="inline-block text-xs uppercase tracking-widest text-primary font-semibold mb-4"
          >
            Pricing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white/50 max-w-xl mx-auto text-lg"
          >
            Start free and scale as your needs grow. No hidden fees, no surprises.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.09, duration: 0.45 }}
              className={`relative rounded-2xl border ${plan.border} bg-gradient-to-b ${plan.gradient} p-8 flex flex-col ${
                plan.highlight ? "shadow-[0_0_50px_rgba(108,99,255,0.15)]" : ""
              } cursor-pointer hover:scale-105 transition-transform duration-300 h-full`}
              onClick={() => setSelectedPlan(plan)}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    <Zap className="w-3 h-3" /> {plan.badge}
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{plan.desc}</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-white">
                  {plan.price === "Custom" ? "" : "$"}{plan.price}
                </span>
                <span className="text-white/40 text-sm">{plan.period}</span>
              </div>
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-white/70">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (plan.name === "Enterprise") {
                    scrollToContact();
                  } else {
                    setSelectedPlan(plan);
                  }
                }}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${plan.ctaStyle}`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Plan Details Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-w-2xl w-full bg-gradient-to-b from-[#0f172a] to-[#020617] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedPlan(null)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Plan Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  {selectedPlan.highlight && (
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                      <Zap className="w-3 h-3" /> Most Popular
                    </span>
                  )}
                  <h2 className="text-3xl font-bold text-white">{selectedPlan.name}</h2>
                </div>
                <p className="text-white/50 text-lg">{selectedPlan.desc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-white">
                    {selectedPlan.price === "Custom" ? "" : "$"}{selectedPlan.price}
                  </span>
                  <span className="text-white/40 text-lg">{selectedPlan.period}</span>
                </div>
              </div>

              {/* Features Grid */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">What's Included</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedPlan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-white/70 text-sm">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    // Handle plan purchase/selection
                    alert(`You selected the ${selectedPlan.name} plan! (This is a demo)`);
                    setSelectedPlan(null);
                  }}
                  className={`flex-1 py-4 rounded-2xl font-bold text-base transition-all duration-200 ${selectedPlan.ctaStyle}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    {selectedPlan.name === "Enterprise" ? "Contact Sales" : `Get ${selectedPlan.name}`}
                  </div>
                </button>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 py-4 rounded-2xl font-semibold text-base border border-white/20 text-white hover:bg-white/5 transition-all duration-200"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
