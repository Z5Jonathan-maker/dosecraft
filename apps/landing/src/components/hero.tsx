"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Syringe,
  Activity,
  FlaskConical,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ---- Mock App Preview with mouse parallax ---- */
function MockAppPreview() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

    gsap.to(cardRef.current, {
      rotateY: x * 8,
      rotateX: -y * 5,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const parent = el.parentElement;
    if (!parent) return;

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div
      ref={cardRef}
      className="hero-card relative w-full max-w-2xl mx-auto mt-12 lg:mt-16"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      {/* Glow behind */}
      <div className="absolute -inset-4 bg-gradient-to-r from-dc-orange/10 via-dc-purple/5 to-dc-cyan/10 rounded-3xl blur-3xl" />

      {/* Card */}
      <div className="relative glass-card rounded-2xl overflow-hidden border border-dc-border/60">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-dc-border/40 bg-dc-surface/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-dc-text-muted ml-2 font-mono">
            dosecraft / protocol-engineer
          </span>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-dc-text-muted uppercase tracking-wider">
                Active Protocol
              </p>
              <h4 className="text-sm font-semibold font-[family-name:var(--font-space)] text-dc-text mt-1">
                Recovery Stack v3
              </h4>
            </div>
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-dc-green/10 text-dc-green border border-dc-green/20">
              Week 4 of 8
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              {
                name: "BPC-157",
                dose: "250 mcg",
                freq: "2x daily",
                lane: "Clinical",
                color: "#00d4ff",
              },
              {
                name: "TB-500",
                dose: "2.5 mg",
                freq: "2x week",
                lane: "Expert",
                color: "#ff6b35",
              },
              {
                name: "GHK-Cu",
                dose: "200 mcg",
                freq: "1x daily",
                lane: "Experimental",
                color: "#b366ff",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-dc-surface/80 border border-dc-border/30"
              >
                <div className="flex items-center gap-3">
                  <Syringe className="w-4 h-4" style={{ color: item.color }} />
                  <div>
                    <p className="text-sm font-medium text-dc-text">
                      {item.name}
                    </p>
                    <p className="text-xs text-dc-text-muted">
                      {item.dose} &middot; {item.freq}
                    </p>
                  </div>
                </div>
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md border"
                  style={{
                    color: item.color,
                    borderColor: `${item.color}33`,
                    backgroundColor: `${item.color}15`,
                  }}
                >
                  {item.lane}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { label: "Compliance", value: "94%", icon: Activity },
              { label: "Doses Logged", value: "127", icon: Syringe },
              { label: "Active Peptides", value: "3", icon: FlaskConical },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center py-2.5 rounded-xl bg-dc-surface-2/50 border border-dc-border/20"
              >
                <stat.icon className="w-3.5 h-3.5 mx-auto text-dc-text-muted mb-1" />
                <p className="text-base font-bold font-[family-name:var(--font-space)] text-dc-text">
                  {stat.value}
                </p>
                <p className="text-[10px] text-dc-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Hero Section ---- */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [wordsRevealed, setWordsRevealed] = useState(false);

  /* GSAP scroll-driven: pin hero, scale text down, slide card up */
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced || !sectionRef.current) {
      setWordsRevealed(true);
      return;
    }

    const ctx = gsap.context(() => {
      /* Word reveal on load */
      const words = gsap.utils.toArray<HTMLElement>(".hero-word");
      gsap.fromTo(
        words,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
          delay: 0.2,
          onComplete: () => setWordsRevealed(true),
        }
      );

      /* Scroll-driven: shrink hero content, fade, parallax card */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      tl.to(".hero-text-group", {
        scale: 0.85,
        opacity: 0,
        y: -60,
        duration: 1,
      })
        .to(
          ".hero-card",
          {
            y: -120,
            scale: 1.05,
            duration: 1,
          },
          "<"
        )
        .to(
          ".hero-mesh-blobs",
          {
            opacity: 0,
            duration: 0.5,
          },
          "<0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-4"
    >
      {/* Animated mesh gradient blobs */}
      <div className="hero-mesh-blobs absolute inset-0 pointer-events-none">
        <div className="mesh-blob mesh-blob-1 absolute top-[10%] left-[10%]" />
        <div className="mesh-blob mesh-blob-2 absolute top-[20%] right-[5%]" />
        <div className="mesh-blob mesh-blob-3 absolute bottom-[15%] left-[30%]" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-40" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="hero-text-group">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dc-orange/10 border border-dc-orange/20 mb-8"
          >
            <FlaskConical className="w-3.5 h-3.5 text-dc-orange" />
            <span className="text-xs font-medium text-dc-orange tracking-wide uppercase">
              Early Access &mdash; Coming Soon
            </span>
          </motion.div>

          {/* Headline with word-by-word reveal */}
          <h1
            ref={headlineRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-space)] leading-[1.1] tracking-tight"
          >
            {"Run Peptide Stacks ".split(" ").map((word, i) => (
              <span key={i} className="hero-word inline-block mr-[0.3em]">
                {word}
              </span>
            ))}
            <br className="hidden sm:block" />
            {"Like the ".split(" ").map((word, i) => (
              <span
                key={`b-${i}`}
                className="hero-word inline-block mr-[0.3em]"
              >
                {word}
              </span>
            ))}
            <span className="hero-word inline-block text-gradient-hero">
              Pros
            </span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6 text-lg sm:text-xl text-dc-text-muted max-w-2xl mx-auto leading-relaxed"
          >
            Track every pin, dose, and result. Three evidence lanes. Zero
            corporate BS.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#waitlist"
              className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2 group"
            >
              Join the Waitlist
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#solution"
              className="btn-secondary text-base px-8 py-3.5 inline-flex items-center gap-2"
            >
              See How It Works
            </a>
          </motion.div>
        </div>

        {/* Mock preview with parallax */}
        <MockAppPreview />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a
          href="#problem"
          className="flex flex-col items-center gap-1 text-dc-text-muted/40 hover:text-dc-text-muted/70 transition-colors"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-chevron-bounce" />
        </a>
      </div>
    </section>
  );
}
