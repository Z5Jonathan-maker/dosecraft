"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Menu, X, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Lanes", href: "#lanes" },
  { label: "Pricing", href: "#pricing" },
];

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    if (!prefersReduced && navRef.current) {
      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.1 }
      );
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(5, 5, 8, 0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-dc-orange to-dc-orange/70 flex items-center justify-center shadow-lg shadow-dc-orange/30 group-hover:shadow-dc-orange/50 transition-shadow">
                <FlaskConical className="w-4 h-4 text-white" strokeWidth={2.2} />
              </div>
              <span className="font-[family-name:var(--font-space)] font-bold text-lg text-dc-text tracking-tight">
                DoseCraft
              </span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-2 text-sm font-medium text-dc-text-muted hover:text-dc-text transition-colors rounded-lg hover:bg-white/[0.04] cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://dosecraft-web.vercel.app/auth"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-1.5 group"
                style={{ padding: "10px 20px", fontSize: "0.875rem" }}
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl text-dc-text-muted hover:text-dc-text hover:bg-white/[0.06] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-16 left-0 right-0 z-40 overflow-hidden"
            style={{
              background: "rgba(5, 5, 8, 0.97)",
              backdropFilter: "blur(24px)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-dc-text-muted hover:text-dc-text rounded-xl hover:bg-white/[0.04] transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}
              <div className="pt-2 pb-1">
                <a
                  href="https://dosecraft-web.vercel.app/auth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm w-full flex items-center justify-center gap-2"
                  style={{ padding: "12px 20px" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
