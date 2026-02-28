"use client";

import { motion } from "framer-motion";
import { ShieldCheck, UserCheck, FlaskConical } from "lucide-react";

const LANES = [
  {
    icon: ShieldCheck,
    title: "Clinical",
    tag: "Conservative",
    color: "dc-cyan",
    bgGlow: "from-dc-cyan/10 to-transparent",
    borderColor: "border-dc-cyan/20",
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
    color: "dc-orange",
    bgGlow: "from-dc-orange/10 to-transparent",
    borderColor: "border-dc-orange/20",
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
    color: "dc-purple",
    bgGlow: "from-dc-purple/10 to-transparent",
    borderColor: "border-dc-purple/20",
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

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Lanes() {
  return (
    <section id="lanes" className="relative py-24 sm:py-32 px-4">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-dc-bg via-dc-surface/30 to-dc-bg pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
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
        </motion.div>

        {/* Lane cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6"
        >
          {LANES.map((lane) => (
            <motion.div
              key={lane.title}
              variants={cardVariants}
              className={`glass-card glass-card-hover p-7 sm:p-8 relative overflow-hidden group`}
            >
              {/* Top glow */}
              <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-${lane.color} to-transparent opacity-40`} />

              {/* Icon + tag */}
              <div className="flex items-center justify-between mb-5">
                <div className={`p-3 rounded-xl bg-${lane.color}/10 border border-${lane.color}/20`}>
                  <lane.icon className={`w-6 h-6 text-${lane.color}`} />
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-${lane.color}/10 text-${lane.color} border border-${lane.color}/20`}>
                  {lane.tag}
                </span>
              </div>

              {/* Title + description */}
              <h3 className={`text-2xl font-bold font-[family-name:var(--font-space)] text-${lane.color} mb-2`}>
                {lane.title}
              </h3>
              <p className="text-dc-text-muted text-sm leading-relaxed mb-5">
                {lane.description}
              </p>

              {/* Items */}
              <ul className="space-y-2.5">
                {lane.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-dc-text/80">
                    <span className={`w-1.5 h-1.5 rounded-full bg-${lane.color} mt-1.5 shrink-0`} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
