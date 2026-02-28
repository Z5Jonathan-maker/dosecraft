"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import {
  Microscope,
  UserCheck,
  Beaker,
  ChevronRight,
  FileText,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Zap,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const LANES = [
  {
    id: "clinical",
    name: "Clinical",
    color: "#00d4ff",
    glowColor: "rgba(0, 212, 255, 0.15)",
    borderColor: "rgba(0, 212, 255, 0.28)",
    bgColor: "rgba(0, 212, 255, 0.04)",
    icon: Microscope,
    tagline: "Research-Backed Evidence",
    description:
      "Compounds with peer-reviewed clinical trials, published safety data, and established pharmacokinetics. The gold standard for biohackers who want certainty.",
    sources: ["PubMed trials", "FDA IND data", "Phase I/II data", "Pharmacokinetics"],
    example: {
      compound: "BPC-157",
      dose: "250 mcg × 2/day",
      route: "Subcutaneous",
      evidence: "Multiple human + rat trials",
      confidence: 94,
      safety: "High",
    },
    features: [
      { icon: FileText, text: "Linked to published studies" },
      { icon: CheckCircle, text: "FDA status documented" },
      { icon: TrendingUp, text: "Pharmacokinetic profiles included" },
    ],
  },
  {
    id: "expert",
    name: "Expert",
    color: "#ff6b35",
    glowColor: "rgba(255, 107, 53, 0.15)",
    borderColor: "rgba(255, 107, 53, 0.28)",
    bgColor: "rgba(255, 107, 53, 0.04)",
    icon: UserCheck,
    tagline: "Practitioner Protocols",
    description:
      "Clinician-derived dosing from sports medicine doctors, TRT specialists, and longevity practitioners who run these compounds with patients every day.",
    sources: ["Sports medicine MDs", "TRT/longevity clinics", "Anti-aging specialists", "Peptide therapy MDs"],
    example: {
      compound: "TB-500",
      dose: "2.5–5 mg × 2/week",
      route: "Subcutaneous",
      evidence: "Practitioner consensus",
      confidence: 81,
      safety: "Moderate",
    },
    features: [
      { icon: UserCheck, text: "Verified practitioner sources" },
      { icon: Users, text: "Real clinical experience data" },
      { icon: AlertTriangle, text: "Risk-stratified dosing ranges" },
    ],
  },
  {
    id: "experimental",
    name: "Experimental",
    color: "#b366ff",
    glowColor: "rgba(179, 102, 255, 0.15)",
    borderColor: "rgba(179, 102, 255, 0.28)",
    bgColor: "rgba(179, 102, 255, 0.04)",
    icon: Beaker,
    tagline: "Cutting-Edge Community Data",
    description:
      "Community-reported protocols, anecdotal stacks, and experimental compounds at the frontier of biohacking. High-signal, appropriately caveated — never filtered.",
    sources: ["Community N=1 reports", "Forum aggregation", "Research chemical data", "Biomarker tracking"],
    example: {
      compound: "GHK-Cu",
      dose: "200 mcg × 1/day",
      route: "Subcutaneous",
      evidence: "Community aggregated",
      confidence: 58,
      safety: "Unknown",
    },
    features: [
      { icon: Beaker, text: "N=1 experimental tracking" },
      { icon: Zap, text: "Frontier compounds included" },
      { icon: TrendingUp, text: "Community outcome aggregation" },
    ],
  },
];

function ConfidenceBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="mt-3">
      <div className="flex justify-between mb-1.5">
        <span className="text-[10px] text-dc-text-muted uppercase tracking-wider">Evidence Confidence</span>
        <span className="text-[10px] font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
      </div>
    </div>
  );
}

function LaneCard({
  lane,
  isActive,
  onClick,
}: {
  lane: typeof LANES[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const LaneIcon = lane.icon;

  return (
    <motion.div
      onClick={onClick}
      className="relative cursor-pointer rounded-2xl overflow-hidden"
      style={{
        border: `1px solid ${isActive ? lane.borderColor : "rgba(255,255,255,0.065)"}`,
        background: isActive ? lane.bgColor : "rgba(10,10,16,0.6)",
        boxShadow: isActive ? `0 0 60px ${lane.glowColor}, 0 0 120px ${lane.glowColor}55` : "none",
        transition: "border-color 0.35s, background 0.35s, box-shadow 0.35s",
      }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${lane.color}18`, border: `1px solid ${lane.color}30` }}
            >
              <LaneIcon className="w-5 h-5" style={{ color: lane.color }} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: lane.color }}>
                {lane.name}
              </p>
              <p className="text-sm font-semibold text-dc-text font-[family-name:var(--font-space)] leading-tight">
                {lane.tagline}
              </p>
            </div>
          </div>
          <ChevronRight
            className="w-4 h-4 text-dc-text-muted/40 mt-0.5 shrink-0 transition-transform duration-300"
            style={{ transform: isActive ? "rotate(90deg)" : "rotate(0deg)" }}
          />
        </div>

        <p className="text-sm text-dc-text-muted leading-relaxed">{lane.description}</p>

        <div className="mt-4 space-y-2">
          {lane.features.map((feat) => (
            <div key={feat.text} className="flex items-center gap-2">
              <feat.icon className="w-3.5 h-3.5 shrink-0" style={{ color: lane.color }} />
              <span className="text-[11px] text-dc-text-muted">{feat.text}</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div
              className="mx-5 mb-5 p-4 rounded-xl"
              style={{ background: `${lane.color}09`, border: `1px solid ${lane.color}22` }}
            >
              <p className="text-[10px] uppercase tracking-widest mb-3 font-semibold" style={{ color: lane.color }}>
                Example · {lane.example.compound}
              </p>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {[
                  ["Dose", lane.example.dose],
                  ["Route", lane.example.route],
                  ["Evidence", lane.example.evidence],
                  ["Safety", lane.example.safety],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-dc-text-muted text-[10px] mb-0.5">{label}</p>
                    <p
                      className="font-medium text-dc-text"
                      style={label === "Safety" ? { color: lane.color } : undefined}
                    >
                      {val}
                    </p>
                  </div>
                ))}
              </div>
              <ConfidenceBar value={lane.example.confidence} color={lane.color} />
            </div>

            <div className="px-5 pb-5">
              <p className="text-[10px] uppercase tracking-widest text-dc-text-muted mb-2">Data Sources</p>
              <div className="flex flex-wrap gap-1.5">
                {lane.sources.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-2.5 py-1 rounded-lg"
                    style={{
                      background: `${lane.color}10`,
                      color: `${lane.color}cc`,
                      border: `1px solid ${lane.color}20`,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ParallaxLanes() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeLane, setActiveLane] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".lanes-header",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power4.out",
          scrollTrigger: { trigger: ".lanes-header", start: "top 85%" },
        }
      );

      const cards = gsap.utils.toArray<HTMLElement>(".lane-card-wrapper");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.14,
          scrollTrigger: { trigger: ".lanes-grid", start: "top 82%" },
        }
      );

      gsap.fromTo(
        ".lane-orb",
        { y: 0 },
        {
          y: -70,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.8,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="lanes" ref={ref} className="relative py-28 sm:py-36 px-4 overflow-hidden">
      {/* Ambient orbs */}
      <div
        className="lane-orb absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none opacity-30"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        className="lane-orb absolute top-1/3 -right-20 w-96 h-96 rounded-full pointer-events-none opacity-25"
        style={{ background: "radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        className="lane-orb absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, rgba(179,102,255,0.1) 0%, transparent 70%)", filter: "blur(80px)" }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="lanes-header text-center mb-16 sm:mb-20">
          <p className="text-sm font-semibold text-dc-cyan uppercase tracking-widest mb-3">
            The Signature System
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-space)] tracking-tight">
            Three Evidence{" "}
            <span className="text-gradient-cyan">Lanes</span>
          </h2>
          <p className="mt-5 text-dc-text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Not all peptide data is equal. DoseCraft classifies every compound and every dose range by its evidence quality — so you always know what you&apos;re working with.
          </p>

          {/* Lane filter pills */}
          <div className="mt-8 inline-flex items-center gap-2 p-1.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {LANES.map((lane, i) => (
              <button
                key={lane.id}
                onClick={() => setActiveLane(i)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-250"
                style={{
                  background: activeLane === i ? `${lane.color}18` : "transparent",
                  color: activeLane === i ? lane.color : "#8888a0",
                  border: activeLane === i ? `1px solid ${lane.color}35` : "1px solid transparent",
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: lane.color, opacity: activeLane === i ? 1 : 0.5 }} />
                {lane.name}
              </button>
            ))}
          </div>
        </div>

        <div className="lanes-grid grid grid-cols-1 lg:grid-cols-3 gap-4">
          {LANES.map((lane, i) => (
            <div key={lane.id} className="lane-card-wrapper">
              <LaneCard lane={lane} isActive={activeLane === i} onClick={() => setActiveLane(i)} />
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-dc-text-muted max-w-lg mx-auto">
          Every protocol transparently labeled. You choose your risk tolerance — we show you exactly what the evidence supports.
        </p>
      </div>

      <div className="section-divider mt-28 sm:mt-36" />
    </section>
  );
}
