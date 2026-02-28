"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, Cpu, ClipboardList, BarChart3 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    icon: BookOpen,
    title: "Peptide Library",
    description:
      "Three-lane knowledge base: Clinical trials, Expert protocols, Experimental intelligence. Every compound documented with sourced dose ranges and interaction data.",
    color: "#00d4ff",
    gradient: "from-[#00d4ff]/20 to-[#00d4ff]/5",
  },
  {
    icon: Cpu,
    title: "Protocol Engineer",
    description:
      "AI-powered stack builder that respects your risk appetite and constraints. Input your goals, history, and budget. Get a protocol, not a disclaimer.",
    color: "#ff6b35",
    gradient: "from-[#ff6b35]/20 to-[#ff6b35]/5",
  },
  {
    icon: ClipboardList,
    title: "Tracker & Lab Notebook",
    description:
      "Every dose, every site, every outcome. Your personal research log. Pin schedules, side-effect tracking, and progress photos in one encrypted vault.",
    color: "#00ff88",
    gradient: "from-[#00ff88]/20 to-[#00ff88]/5",
  },
  {
    icon: BarChart3,
    title: "Insight Engine",
    description:
      "See what's working. AI-powered analysis of your protocols and outcomes. Correlation detection, dose-response curves, and outcome scoring.",
    color: "#b366ff",
    gradient: "from-[#b366ff]/20 to-[#b366ff]/5",
  },
];

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced || isMobile || !sectionRef.current || !trackRef.current)
      return;

    const cards = trackRef.current.querySelectorAll(".pillar-card");
    const totalScroll = trackRef.current.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      const tween = gsap.to(trackRef.current, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalScroll}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(
              Math.floor(self.progress * PILLARS.length),
              PILLARS.length - 1
            );
            setActiveIndex(idx);
          },
        },
      });

      /* Stagger card reveal */
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0.3, scale: 0.92 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 80%",
              end: "left 40%",
              scrub: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  /* Mobile: stacked layout */
  if (isMobile) {
    return (
      <section id="features" className="relative py-20 px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-dc-orange uppercase tracking-wider mb-3">
            The Platform
          </p>
          <h2 className="text-3xl font-bold font-[family-name:var(--font-space)] tracking-tight">
            Built on Four Pillars
          </h2>
          <p className="mt-4 text-dc-text-muted max-w-xl mx-auto">
            Everything you need to research, build, track, and optimize peptide
            protocols.
          </p>
        </div>

        <div className="space-y-5 max-w-lg mx-auto">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="glass-card p-6 relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${pillar.color}, transparent)`,
                }}
              />
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-xl border shrink-0"
                  style={{
                    borderColor: `${pillar.color}33`,
                    backgroundColor: `${pillar.color}15`,
                  }}
                >
                  <pillar.icon
                    className="w-6 h-6"
                    style={{ color: pillar.color }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-[family-name:var(--font-space)] text-dc-text mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-dc-text-muted text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* Desktop: horizontal scroll */
  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative overflow-hidden"
    >
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-12 pb-6 px-8 pointer-events-none">
        <p className="text-sm font-medium text-dc-orange uppercase tracking-wider mb-2">
          The Platform
        </p>
        <h2 className="text-3xl lg:text-5xl font-bold font-[family-name:var(--font-space)] tracking-tight">
          Built on Four Pillars
        </h2>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {PILLARS.map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                i === activeIndex ? PILLARS[i].color : "#2a2a3e",
              boxShadow:
                i === activeIndex
                  ? `0 0 12px ${PILLARS[i].color}80`
                  : "none",
              transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Scrolling track */}
      <div
        ref={trackRef}
        className="flex items-center gap-8 pl-8 pr-[50vw] h-screen"
        style={{ width: `${PILLARS.length * 80 + 20}vw` }}
      >
        {/* Spacer for the header */}
        <div className="shrink-0 w-[15vw]" />

        {PILLARS.map((pillar, i) => (
          <div
            key={pillar.title}
            className="pillar-card shrink-0 w-[65vw] h-[60vh] relative"
          >
            <div className="glass-card h-full p-10 lg:p-14 flex flex-col justify-center relative overflow-hidden group">
              {/* Top glow line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${pillar.color}, transparent)`,
                }}
              />

              {/* Background glow */}
              <div
                className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full blur-[120px] opacity-20 pointer-events-none transition-opacity duration-700 group-hover:opacity-40"
                style={{ backgroundColor: pillar.color }}
              />

              <div className="relative z-10">
                <div
                  className="p-4 rounded-2xl border inline-flex mb-6"
                  style={{
                    borderColor: `${pillar.color}33`,
                    backgroundColor: `${pillar.color}15`,
                  }}
                >
                  <pillar.icon
                    className="w-8 h-8"
                    style={{ color: pillar.color }}
                  />
                </div>

                <span
                  className="block text-sm font-medium uppercase tracking-wider mb-3"
                  style={{ color: pillar.color }}
                >
                  Pillar {i + 1}
                </span>

                <h3 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-space)] text-dc-text mb-4">
                  {pillar.title}
                </h3>

                <p className="text-dc-text-muted text-lg leading-relaxed max-w-xl">
                  {pillar.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
