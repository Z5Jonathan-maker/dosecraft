"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Syringe,
  Activity,
  FlaskConical,
  CheckCircle,
  TrendingUp,
  Users,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ---- Real App Dashboard Preview ---- */
function AppDashboard() {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    gsap.to(cardRef.current, {
      rotateY: x * 10,
      rotateX: -y * 7,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.7,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", onMouseLeave);
    return () => {
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [onMouseMove, onMouseLeave]);

  const peptides = [
    {
      name: "BPC-157",
      dose: "250 mcg",
      freq: "2x daily · subQ",
      lane: "Clinical",
      color: "#00d4ff",
      progress: 87,
    },
    {
      name: "TB-500",
      dose: "2.5 mg",
      freq: "2x week · subQ",
      lane: "Expert",
      color: "#ff6b35",
      progress: 72,
    },
    {
      name: "GHK-Cu",
      dose: "200 mcg",
      freq: "1x daily · subQ",
      lane: "Experimental",
      color: "#b366ff",
      progress: 64,
    },
  ];

  return (
    <div className="hero-card relative w-full max-w-lg mx-auto" style={{ perspective: "1200px" }}>
      {/* Ambient glow */}
      <div className="absolute -inset-8 opacity-60 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-dc-orange/12 via-dc-purple/8 to-dc-cyan/10 rounded-[40px] blur-3xl" />
      </div>

      {/* Main dashboard card */}
      <div
        ref={cardRef}
        className="relative app-chrome"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Window chrome bar */}
        <div className="app-chrome-bar justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-xs text-dc-text-muted/60 ml-1 font-mono tracking-tight">
              DoseCraft · Protocol War Room
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-dc-green/10 text-dc-green border border-dc-green/20">
              <span className="w-1.5 h-1.5 rounded-full bg-dc-green animate-pulse" />
              Live
            </span>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-5 space-y-4">
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-dc-text-muted uppercase tracking-widest mb-1">
                Active Protocol
              </p>
              <h3 className="text-base font-bold font-[family-name:var(--font-space)] text-dc-text">
                Recovery Stack v3
              </h3>
              <p className="text-xs text-dc-text-muted mt-0.5">Week 4 of 8 · Started Jan 14</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold font-[family-name:var(--font-space)] text-dc-green">94%</div>
              <div className="text-[10px] text-dc-text-muted">Compliance</div>
            </div>
          </div>

          {/* Stats mini-row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Activity, label: "Doses Logged", value: "127", color: "#00d4ff" },
              { icon: Syringe, label: "Active", value: "3", color: "#ff6b35" },
              { icon: TrendingUp, label: "Streak", value: "28d", color: "#00ff88" },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center py-2.5 rounded-xl border"
                style={{
                  background: `${s.color}08`,
                  borderColor: `${s.color}18`,
                }}
              >
                <s.icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: s.color }} />
                <p className="text-sm font-bold font-[family-name:var(--font-space)]" style={{ color: s.color }}>
                  {s.value}
                </p>
                <p className="text-[9px] text-dc-text-muted leading-none mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Peptide rows */}
          <div className="space-y-2">
            {peptides.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${p.color}18`, border: `1px solid ${p.color}30` }}
                >
                  <FlaskConical className="w-4 h-4" style={{ color: p.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold font-[family-name:var(--font-space)] text-dc-text">
                      {p.name}
                    </span>
                    <span
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md shrink-0"
                      style={{
                        color: p.color,
                        background: `${p.color}15`,
                        border: `1px solid ${p.color}30`,
                      }}
                    >
                      {p.lane}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-dc-text-muted truncate">{p.dose} · {p.freq}</p>
                    <span className="text-[10px] text-dc-text-muted ml-2 shrink-0">{p.progress}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-1.5 h-0.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${p.progress}%`, background: p.color, opacity: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Safety check */}
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{
              background: "rgba(0, 255, 136, 0.05)",
              border: "1px solid rgba(0, 255, 136, 0.15)",
            }}
          >
            <CheckCircle className="w-3.5 h-3.5 text-dc-green shrink-0" />
            <p className="text-[10px] text-dc-green font-medium">
              No contraindications detected · All interactions clear
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Hero Section ---- */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      /* Word-by-word headline reveal */
      const words = gsap.utils.toArray<HTMLElement>(".hero-word");
      gsap.fromTo(
        words,
        { y: 80, opacity: 0, rotateX: 25 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.07,
          duration: 0.8,
          ease: "power4.out",
          delay: 0.3,
        }
      );

      /* Scroll-driven parallax: text fades/shrinks, card rises */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      tl.to(".hero-text-group", {
        scale: 0.88,
        opacity: 0,
        y: -80,
        duration: 1,
        ease: "none",
      })
        .to(".hero-card", { y: -100, scale: 1.04, duration: 1, ease: "none" }, "<")
        .to(".hero-mesh-blobs", { opacity: 0, duration: 0.6, ease: "none" }, "<0.2");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-12"
    >
      {/* Animated mesh blobs */}
      <div className="hero-mesh-blobs absolute inset-0 pointer-events-none overflow-hidden">
        <div className="mesh-blob mesh-blob-1 absolute top-[5%] left-[5%]" />
        <div className="mesh-blob mesh-blob-2 absolute top-[15%] right-[0%]" />
        <div className="mesh-blob mesh-blob-3 absolute bottom-[10%] left-[25%]" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-35" />

      {/* Radial fade mask at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #050508)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: text */}
          <div className="text-center lg:text-left">
            <div className="hero-text-group" style={{ transformOrigin: "center top" }}>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
                style={{
                  background: "rgba(255,107,53,0.1)",
                  border: "1px solid rgba(255,107,53,0.22)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-dc-orange animate-pulse" />
                <span className="text-xs font-semibold text-dc-orange tracking-wide uppercase">
                  The Evolution of Peptide Tracking
                </span>
              </motion.div>

              {/* Headline */}
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-space)] leading-[1.05] tracking-tight"
                style={{ perspective: "600px" }}
              >
                {"Your Private".split(" ").map((word, i) => (
                  <span key={i} className="hero-word inline-block mr-[0.28em] opacity-0">
                    {word}
                  </span>
                ))}
                <br />
                {"Protocol".split(" ").map((word, i) => (
                  <span
                    key={`b${i}`}
                    className="hero-word inline-block mr-[0.28em] text-gradient-hero opacity-0"
                  >
                    {word}
                  </span>
                ))}
                {"War Room".split(" ").map((word, i) => (
                  <span
                    key={`c${i}`}
                    className="hero-word inline-block mr-[0.28em] opacity-0"
                  >
                    {word}
                  </span>
                ))}
              </h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="mt-7 text-lg sm:text-xl text-dc-text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Three evidence lanes — Clinical, Expert, Experimental. AI builds your stack in seconds. Creator marketplace. Zero filtered AI nonsense.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3"
              >
                <a
                  href="#pricing"
                  onClick={scrollToPricing}
                  className="btn-primary text-base inline-flex items-center gap-2 group"
                >
                  Start Free
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#features"
                  onClick={scrollToFeatures}
                  className="btn-secondary text-base inline-flex items-center gap-2"
                >
                  See How It Works
                </a>
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 text-sm text-dc-text-muted"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-dc-orange/70" />
                  <span>
                    <strong className="text-dc-text font-semibold">2,000+</strong> biohackers waitlisted
                  </span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-dc-border" />
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-3.5 h-3.5 text-dc-orange" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1">
                    <strong className="text-dc-text font-semibold">4.9/5</strong> from beta testers
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right: App preview */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <AppDashboard />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#social-proof"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector("#social-proof")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-dc-text-muted/40 hover:text-dc-text-muted/70 transition-colors"
      >
        <span className="text-[9px] uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-chevron-bounce" />
      </a>
    </section>
  );
}
