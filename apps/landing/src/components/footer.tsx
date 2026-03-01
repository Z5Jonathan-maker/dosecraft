"use client";

import { FlaskConical, Twitter, Github, ExternalLink } from "lucide-react";

const WEB_APP = "https://dosecraft-web.vercel.app";

const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Evidence Lanes", href: "#lanes" },
      { label: "Pricing", href: "#pricing" },
      { label: "Waitlist", href: "#waitlist" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Peptide Library", href: `${WEB_APP}/library` },
      { label: "Dose Calculator", href: `${WEB_APP}/calculator` },
      { label: "Protocol Builder", href: `${WEB_APP}/protocols/builder` },
      { label: "Contact", href: "mailto:z5jonathan@icloud.com" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Disclaimer", href: "#" },
    ],
  },
];

export default function Footer() {
  const handleNavClick = (href: string) => {
    if (!href.startsWith("#") || href === "#") return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,107,53,0.3), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-14 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand column */}
          <div>
            <a href="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-dc-orange to-dc-orange/70 flex items-center justify-center shadow-lg shadow-dc-orange/25 group-hover:shadow-dc-orange/40 transition-shadow">
                <FlaskConical className="w-4 h-4 text-white" strokeWidth={2.2} />
              </div>
              <span className="font-[family-name:var(--font-space)] font-bold text-lg text-dc-text tracking-tight">
                DoseCraft
              </span>
            </a>
            <p className="text-sm text-dc-text-muted leading-relaxed mb-6">
              Your private protocol war room. Three evidence lanes, AI-powered stacks, creator marketplace.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://x.com/dosecraft"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-dc-text-muted hover:text-dc-text transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://github.com/Z5Jonathan-maker"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-dc-text-muted hover:text-dc-text transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://dosecraft-web.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-dc-text-muted hover:text-dc-text transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-dc-text mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("#") && link.href !== "#" ? (
                      <button
                        onClick={() => handleNavClick(link.href)}
                        className="text-sm text-dc-text-muted hover:text-dc-text transition-colors cursor-pointer"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        {...(link.href.startsWith("http") || link.href.startsWith("mailto:")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="text-sm text-dc-text-muted hover:text-dc-text transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: "rgba(255,255,255,0.05)" }} />

        {/* Bottom row */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-dc-text-muted">
            &copy; {new Date().getFullYear()} DoseCraft. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: "rgba(255,107,53,0.1)", color: "rgba(255,107,53,0.8)", border: "1px solid rgba(255,107,53,0.15)" }}
            >
              BETA
            </span>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div
          className="py-5 border-t text-center"
          style={{ borderColor: "rgba(255,255,255,0.04)" }}
        >
          <p className="text-[11px] text-dc-text-muted/50 leading-relaxed max-w-4xl mx-auto">
            <strong className="text-dc-text-muted/70">Disclaimer:</strong> DoseCraft is an information and personal tracking platform. We do not provide medical advice, diagnosis, or treatment. Peptide regulations vary by jurisdiction — research your local laws before obtaining any research compounds. Always consult a licensed healthcare professional before starting any protocol. Use at your own risk.
          </p>
        </div>
      </div>
    </footer>
  );
}
