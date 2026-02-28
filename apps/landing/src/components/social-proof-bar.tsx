"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FlaskConical, ShieldCheck, Users, Star, Zap, BookOpen } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const TRUST_BADGES = [
  {
    icon: Users,
    value: "2,000+",
    label: "Biohackers Waitlisted",
    color: "#ff6b35",
  },
  {
    icon: Star,
    value: "4.9 / 5",
    label: "Beta Tester Rating",
    color: "#ff6b35",
  },
  {
    icon: FlaskConical,
    value: "35+",
    label: "Peptides in Library",
    color: "#00d4ff",
  },
  {
    icon: BookOpen,
    value: "3 Lanes",
    label: "Evidence System",
    color: "#b366ff",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Interaction Checked",
    color: "#00ff88",
  },
  {
    icon: Zap,
    value: "AI-Powered",
    label: "Protocol Engine",
    color: "#ff6b35",
  },
];

export default function SocialProofBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".spb-badge",
        { opacity: 0, y: 20, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="social-proof" ref={ref} className="relative py-10 px-4 overflow-hidden">
      {/* Subtle gradient line above */}
      <div className="section-divider mb-10" />

      <div className="max-w-7xl mx-auto">
        <p className="text-center text-xs font-medium text-dc-text-muted uppercase tracking-widest mb-8">
          Trusted by biohackers, coaches, and clinicians
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="spb-badge glass-card glass-card-hover p-4 text-center"
            >
              <div
                className="w-8 h-8 rounded-lg mx-auto mb-2.5 flex items-center justify-center"
                style={{ background: `${badge.color}15`, border: `1px solid ${badge.color}25` }}
              >
                <badge.icon className="w-4 h-4" style={{ color: badge.color }} />
              </div>
              <p
                className="text-base font-bold font-[family-name:var(--font-space)] leading-none mb-1"
                style={{ color: badge.color }}
              >
                {badge.value}
              </p>
              <p className="text-[10px] text-dc-text-muted leading-tight">{badge.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider mt-10" />
    </section>
  );
}
