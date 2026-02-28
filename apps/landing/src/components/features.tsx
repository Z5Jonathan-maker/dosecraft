"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FlaskConical,
  Cpu,
  Syringe,
  LineChart,
  ArrowUpRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function PillList() {
  const peptides = [
    { name: "BPC-157", color: "#00d4ff", lane: "C" },
    { name: "TB-500", color: "#ff6b35", lane: "E" },
    { name: "GHK-Cu", color: "#b366ff", lane: "X" },
    { name: "Ipamorelin", color: "#00d4ff", lane: "C" },
    { name: "CJC-1295", color: "#ff6b35", lane: "E" },
    { name: "Epithalon", color: "#b366ff", lane: "X" },
  ];

  return (
    <div className="mt-4 space-y-1.5">
      {peptides.map((p) => (
        <div
          key={p.name}
          className="flex items-center justify-between px-3 py-1.5 rounded-lg"
          style={{ background: `${p.color}08`, border: `1px solid ${p.color}18` }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
            <span className="text-xs font-medium text-dc-text/80">{p.name}</span>
          </div>
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{ color: p.color, background: `${p.color}20` }}
          >
            {p.lane}
          </span>
        </div>
      ))}
    </div>
  );
}

function AIBuilderMock() {
  return (
    <div className="mt-4 space-y-2">
      <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-[10px] text-dc-text-muted mb-1.5 uppercase tracking-wider">Your Goal</p>
        <p className="text-xs text-dc-text/85">&ldquo;Recovery stack for torn ACL, 16 weeks&rdquo;</p>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-dc-orange px-1">
        <div className="flex gap-0.5 items-end">
          {[8, 12, 10].map((h, i) => (
            <div key={i} className="w-1 rounded-sm bg-dc-orange/60" style={{ height: h }} />
          ))}
        </div>
        AI building stack...
      </div>
      <div className="p-3 rounded-xl" style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.18)" }}>
        <p className="text-[10px] text-dc-orange mb-2 uppercase tracking-wider">Protocol Engine</p>
        <div className="space-y-1">
          {["BPC-157 · 250mcg · 2x/day", "TB-500 · 5mg · 2x/wk", "Ipamorelin · 200mcg · 3x/day"].map((line) => (
            <div key={line} className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-dc-orange/60" />
              <span className="text-[10px] text-dc-text/75">{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DoseLogMock() {
  return (
    <div className="mt-4 space-y-2">
      {[
        { site: "Abd-L", time: "07:12", peptide: "BPC-157", done: true },
        { site: "Abd-R", time: "19:45", peptide: "BPC-157", done: true },
        { site: "Delt-L", time: "Next", peptide: "TB-500", done: false },
      ].map((d) => (
        <div
          key={d.site + d.time}
          className="flex items-center gap-2 px-2.5 py-2 rounded-lg"
          style={{
            background: d.done ? "rgba(0,255,136,0.06)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${d.done ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.06)"}`,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: d.done ? "#00ff88" : "#8888a0" }} />
          <span className="text-[10px] font-medium text-dc-text-muted w-10">{d.time}</span>
          <span className="text-[10px] text-dc-text/80 flex-1">{d.peptide}</span>
          <span className="text-[9px] text-dc-text-muted">{d.site}</span>
        </div>
      ))}
    </div>
  );
}

function InsightMock() {
  const bars = [40, 55, 48, 70, 65, 80, 75, 90];
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-dc-text-muted">Recovery Score</span>
        <span className="text-sm font-bold text-dc-green font-[family-name:var(--font-space)]">+34%</span>
      </div>
      <div className="flex items-end gap-1 h-12">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${h}%`,
              background: i < 4
                ? `rgba(0,255,136,${0.3 + i * 0.05})`
                : `rgba(0,212,255,${0.3 + (i - 4) * 0.1})`,
            }}
          />
        ))}
      </div>
      <div className="mt-2 text-[10px] text-dc-text-muted text-center">Last 8 weeks</div>
      <div className="mt-3 p-2.5 rounded-lg" style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.12)" }}>
        <p className="text-[10px] text-dc-green leading-relaxed">AI: BPC-157 correlates strongly with joint mobility improvement (+28% in 6 weeks).</p>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    id: "library",
    icon: FlaskConical,
    color: "#00d4ff",
    label: "Peptide Library",
    title: "35+ Peptides with Three-Lane Evidence",
    description:
      "Every compound classified by Clinical research, Expert practitioner protocols, or Experimental community data. Real dose ranges with source attribution — no guessing.",
    visual: <PillList />,
    large: true,
  },
  {
    id: "engine",
    icon: Cpu,
    color: "#ff6b35",
    label: "Protocol Engine",
    title: "AI Builds Your Stack in Seconds",
    description:
      "Describe your goal. Get a full protocol with doses, timing, cycling, and contraindication checks. Not a generic chatbot — a biohacker-native AI.",
    visual: <AIBuilderMock />,
    large: true,
  },
  {
    id: "tracker",
    icon: Syringe,
    color: "#00ff88",
    label: "Dose Tracker",
    title: "Log Every Pin with Site Rotation",
    description:
      "Injection site rotation, timing logs, compliance streaks. Never double-dose. Never miss a window.",
    visual: <DoseLogMock />,
    large: false,
  },
  {
    id: "insights",
    icon: LineChart,
    color: "#b366ff",
    label: "Insight Engine",
    title: "AI Analyzes What's Working",
    description:
      "Correlate dose logs with subjective scores. See which compounds drive results, which to cut.",
    visual: <InsightMock />,
    large: false,
  },
];

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".features-header",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: ".features-header", start: "top 85%" },
        }
      );

      const cards = gsap.utils.toArray<HTMLElement>(".feature-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: "power3.out",
            delay: (i % 2) * 0.12,
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  const largeCards = FEATURES.filter((f) => f.large);
  const smallCards = FEATURES.filter((f) => !f.large);

  return (
    <section id="features" ref={ref} className="relative py-28 sm:py-36 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="features-header text-center mb-16 sm:mb-20">
          <p className="text-sm font-semibold text-dc-orange uppercase tracking-widest mb-3">
            The Platform
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-space)] tracking-tight">
            Four Pillars of{" "}
            <span className="text-gradient-hero">Precision</span>
          </h2>
          <p className="mt-5 text-dc-text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to run serious peptide protocols. Research, engineer, track, analyze.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {largeCards.map((f) => (
            <div key={f.id} className="feature-card bento-card p-7 sm:p-8 group">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}28` }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-dc-text-muted/30 group-hover:text-dc-text-muted/70 transition-colors" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: f.color }}>
                {f.label}
              </p>
              <h3 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-space)] text-dc-text leading-tight">
                {f.title}
              </h3>
              <p className="mt-3 text-sm text-dc-text-muted leading-relaxed">{f.description}</p>
              <div className="mt-5">{f.visual}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {smallCards.map((f) => (
            <div key={f.id} className="feature-card bento-card p-6 sm:p-7 group">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}28` }}
                >
                  <f.icon className="w-4 h-4" style={{ color: f.color }} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-dc-text-muted/30 group-hover:text-dc-text-muted/70 transition-colors" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: f.color }}>
                {f.label}
              </p>
              <h3 className="text-lg sm:text-xl font-bold font-[family-name:var(--font-space)] text-dc-text leading-tight">
                {f.title}
              </h3>
              <p className="mt-2.5 text-sm text-dc-text-muted leading-relaxed">{f.description}</p>
              <div>{f.visual}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider mt-28 sm:mt-36" />
    </section>
  );
}
