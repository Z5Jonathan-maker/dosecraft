"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, UserCheck, FlaskConical } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const LANES = [
  {
    icon: ShieldCheck,
    title: "Clinical",
    tag: "Conservative",
    color: "#00d4ff",
    items: [
      "Peer-reviewed clinical trials",
      "Published pharmacology data",
      "Conservative dose guidelines",
      "FDA/EMA documented safety profiles",
    ],
    description:
      "Trials, pharmacology, conservative guidelines. The foundation everything else is built on.",
  },
  {
    icon: UserCheck,
    title: "Expert",
    tag: "Practitioner",
    color: "#ff6b35",
    items: [
      "How serious clinicians actually dose",
      "Coach and practitioner protocols",
      "Proven stacking patterns",
      "Real-world timing and cycling data",
    ],
    description:
      "How serious clinicians and coaches actually run protocols. Not what the textbook says -- what works.",
  },
  {
    icon: FlaskConical,
    title: "Experimental",
    tag: "Higher Risk",
    color: "#b366ff",
    items: [
      "Curated N=1 user reports",
      "Emerging research patterns",
      "Novel stacking approaches",
      "Risk-labeled with full transparency",
    ],
    description:
      "Curated N=1 patterns. Higher risk, labeled honestly. For those who want the full picture.",
  },
];

export default function ParallaxLanes() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

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

    if (prefersReduced || isMobile || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".lane-card");

      /* Pin the section */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${cards.length * 100}%`,
        pin: true,
      });

      /* Stagger card reveals: each card slides up and overlaps the previous */
      cards.forEach((card, i) => {
        if (i === 0) return; /* First card is already visible */

        gsap.fromTo(
          card,
          {
            yPercent: 100,
            opacity: 0.5,
          },
          {
            yPercent: 0,
            opacity: 1,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: () => `${(i / cards.length) * 100}% top`,
              end: () => `${((i + 0.5) / cards.length) * 100}% top`,
              scrub: 1,
            },
          }
        );

        /* Scale down previous card slightly for depth */
        if (i > 0) {
          gsap.to(cards[i - 1], {
            scale: 0.92,
            opacity: 0.6,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: () => `${(i / cards.length) * 100}% top`,
              end: () => `${((i + 0.5) / cards.length) * 100}% top`,
              scrub: 1,
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      id="lanes"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dc-bg via-dc-surface/30 to-dc-bg pointer-events-none" />

      {/* Header */}
      <div className="relative z-20 text-center pt-20 pb-8 px-4">
        <p className="text-sm font-medium text-dc-green uppercase tracking-wider mb-3">
          Evidence Framework
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-space)] tracking-tight">
          Three Evidence Lanes,{" "}
          <span className="text-gradient-green">Zero Guesswork</span>
        </h2>
        <p className="mt-5 text-dc-text-muted max-w-2xl mx-auto text-lg">
          Every piece of information in DoseCraft is tagged by evidence quality.
          You always know exactly what you&apos;re looking at.
        </p>
      </div>

      {/* Lane cards stacked */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 mt-8">
        {isMobile ? (
          /* Mobile: simple stacked layout */
          <div className="space-y-5">
            {LANES.map((lane) => (
              <LaneCard key={lane.title} lane={lane} />
            ))}
          </div>
        ) : (
          /* Desktop: stacking cards */
          <div className="relative" style={{ height: "60vh" }}>
            {LANES.map((lane, i) => (
              <div
                key={lane.title}
                className="lane-card absolute inset-0"
                style={{ zIndex: i + 1 }}
              >
                <LaneCard lane={lane} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function LaneCard({ lane }: { lane: (typeof LANES)[number] }) {
  return (
    <div className="glass-card p-8 lg:p-10 relative overflow-hidden h-full">
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${lane.color}, transparent)`,
        }}
      />

      {/* Glow blob */}
      <div
        className="absolute -top-20 -right-20 w-[250px] h-[250px] rounded-full blur-[100px] opacity-20 pointer-events-none"
        style={{ backgroundColor: lane.color }}
      />

      <div className="relative z-10">
        {/* Icon + tag */}
        <div className="flex items-center justify-between mb-6">
          <div
            className="p-3 rounded-xl border"
            style={{
              borderColor: `${lane.color}33`,
              backgroundColor: `${lane.color}15`,
            }}
          >
            <lane.icon className="w-6 h-6" style={{ color: lane.color }} />
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border"
            style={{
              color: lane.color,
              borderColor: `${lane.color}33`,
              backgroundColor: `${lane.color}15`,
            }}
          >
            {lane.tag}
          </span>
        </div>

        <h3
          className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-space)] mb-3"
          style={{ color: lane.color }}
        >
          {lane.title}
        </h3>

        <p className="text-dc-text-muted text-base leading-relaxed mb-6">
          {lane.description}
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lane.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm text-dc-text/80"
            >
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{ backgroundColor: lane.color }}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
