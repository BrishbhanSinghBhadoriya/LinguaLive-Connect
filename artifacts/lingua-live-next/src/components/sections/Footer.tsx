"use client"
import { Mic2 } from "lucide-react";

const footerLinks = {
  Product: ["Features", "How It Works", "Languages", "Pricing"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"],
  Support: ["Documentation", "API Reference", "Status", "Contact"],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 pt-16 pb-8 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-14">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 md:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_rgba(108,99,255,0.3)]">
                <Mic2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                LinguaLive <span className="text-primary">AI</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-[200px]">
              Breaking language barriers with real-time AI voice translation.
            </p>
            <div className="flex gap-3 mt-6">
              {["X", "LinkedIn", "GitHub"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 text-xs hover:border-primary/40 hover:text-primary transition-all duration-200"
                  data-testid={`link-footer-social-${social.toLowerCase()}`}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-5">
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/40 text-sm hover:text-white transition-colors duration-200"
                      data-testid={`link-footer-${link.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-sm">
            © 2025 LinguaLive AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookies"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/25 text-xs hover:text-white/60 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

