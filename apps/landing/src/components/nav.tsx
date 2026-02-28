"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Beaker } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Features", href: "#features" },
  { label: "Evidence", href: "#lanes" },
  { label: "Pricing", href: "#pricing" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!navRef.current) return;

    /* Scroll-based background transition with GSAP */
    if (!prefersReduced) {
      ScrollTrigger.create({
        trigger: document.body,
        start: "40px top",
        onEnter: () => setScrolled(true),
        onLeaveBack: () => setScrolled(false),
      });

      /* Initial reveal */
      gsap.fromTo(
        navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }

    return () => {
      ScrollTrigger.getAll()
        .filter(
          (st) =>
            st.trigger === document.body && st.vars.start === "40px top"
        )
        .forEach((st) => st.kill());
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-dc-bg/80 backdrop-blur-xl border-b border-dc-border/50 shadow-lg shadow-black/20"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Beaker className="w-7 h-7 text-dc-orange transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-dc-orange/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-lg font-bold font-[family-name:var(--font-space)] tracking-tight">
              <span className="text-dc-text">Dose</span>
              <span className="text-dc-orange">Craft</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm text-dc-text-muted hover:text-dc-text transition-colors duration-200 rounded-lg hover:bg-white/[0.03]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#waitlist"
              className="btn-primary text-sm px-5 py-2.5 inline-flex items-center"
            >
              Join Waitlist
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-dc-text-muted hover:text-dc-text transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-dc-bg/95 backdrop-blur-xl border-b border-dc-border/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm text-dc-text-muted hover:text-dc-text hover:bg-white/[0.03] rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 px-4">
                <a
                  href="#waitlist"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary text-sm px-5 py-2.5 inline-flex items-center w-full justify-center"
                >
                  Join Waitlist
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
