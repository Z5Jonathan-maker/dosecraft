"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Database, Layers, FlaskConical, Cpu } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  {
    icon: Database,
    value: 5000,
    suffix: "+",
    label: "Data Points",
    sublabel: "across compounds and protocols",
    color: "#ff6b35",
  },
  {
    icon: Layers,
    value: 3,
    suffix: "",
    label: "Evidence Lanes",
    sublabel: "Clinical, Expert, Experimental",
    color: "#00d4ff",
  },
  {
    icon: FlaskConical,
    value: 35,
    suffix: "+",
    label: "Peptides",
    sublabel: "fully catalogued with dose ranges",
    color: "#b366ff",
  },
  {
    icon: Cpu,
    value: 1,
    suffix: "",
    label: "AI Protocol Engine",
    sublabel: "biohacker-native, not filtered",
    color: "#00ff88",
    isText: true,
  },
];

function AnimatedNumber({ target, isText }: { target: number; isText?: boolean }) {
  const [display, setDisplay] = useState(isText ? target : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (isText) return;
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        if (triggered.current) return;
        triggered.current = true;

        if (prefersReduced) {
          setDisplay(target);
          return;
        }

        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => setDisplay(Math.round(obj.val)),
        });
      },
    });

    return () => st.kill();
  }, [target, isText]);

  return (
    <span ref={ref}>
      {isText ? "AI" : display.toLocaleString()}
    </span>
  );
}

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stats-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".stats-header", start: "top 85%" },
        }
      );

      const items = gsap.utils.toArray<HTMLElement>(".stat-item");
      gsap.fromTo(
        items,
        { opacity: 0, y: 40, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".stats-grid", start: "top 85%" },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative py-20 sm:py-28 px-4 bg-grid-fine overflow-hidden">
      {/* Subtle center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,107,53,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        <div className="stats-header text-center mb-14 sm:mb-16">
          <p className="text-sm font-semibold text-dc-orange uppercase tracking-widest mb-3">By the Numbers</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-space)] tracking-tight">
            Built for Serious Biohackers
          </h2>
        </div>

        <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="stat-item glass-card text-center p-6 sm:p-8 group hover:scale-[1.02] transition-transform duration-300"
            >
              <div
                className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div
                className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-space)] tracking-tight stat-glow"
                style={{ color: stat.color }}
              >
                <AnimatedNumber target={stat.value} isText={stat.isText} />
                {!stat.isText && (
                  <span className="text-3xl sm:text-4xl">{stat.suffix}</span>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-dc-text font-[family-name:var(--font-space)]">
                {stat.label}
              </p>
              <p className="mt-1 text-xs text-dc-text-muted">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider mt-20 sm:mt-28" />
    </section>
  );
}
