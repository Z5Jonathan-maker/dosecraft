"use client";

import { Beaker, Github, Twitter } from "lucide-react";

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Evidence Lanes", href: "#lanes" },
      { label: "Pricing", href: "#pricing" },
      { label: "Waitlist", href: "#waitlist" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Docs", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-dc-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <Beaker className="w-6 h-6 text-dc-orange" />
              <span className="text-lg font-bold font-[family-name:var(--font-space)] tracking-tight">
                <span className="text-dc-text">Dose</span>
                <span className="text-dc-orange">Craft</span>
              </span>
            </a>
            <p className="text-sm text-dc-text-muted leading-relaxed max-w-xs">
              The peptide protocol lab for serious lifters, hybrid athletes, and
              biohackers. Track every pin, dose, and result.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="#"
                className="p-2 rounded-lg bg-dc-surface-2 border border-dc-border/30 text-dc-text-muted hover:text-dc-text hover:border-dc-border-light transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-dc-surface-2 border border-dc-border/30 text-dc-text-muted hover:text-dc-text hover:border-dc-border-light transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link groups */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.heading}>
              <h4 className="text-sm font-semibold text-dc-text uppercase tracking-wider mb-4">
                {group.heading}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-dc-text-muted hover:text-dc-text transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-dc-border/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-dc-text-muted">
              &copy; {new Date().getFullYear()} DoseCraft. All rights reserved.
            </p>
            <p className="text-xs text-dc-text-muted/60 max-w-lg text-center md:text-right leading-relaxed">
              <strong className="text-dc-text-muted/80">Disclaimer:</strong>{" "}
              DoseCraft is for educational and research purposes only. Nothing on
              this platform constitutes medical advice. Consult a licensed
              healthcare provider before using any peptide or compound.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
