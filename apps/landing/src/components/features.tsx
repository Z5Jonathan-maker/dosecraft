"use client";

import { motion } from "framer-motion";
import { BookOpen, Cpu, ClipboardList, BarChart3 } from "lucide-react";

const PILLARS = [
  {
    icon: BookOpen,
    title: "Peptide Library",
    description:
      "Three-lane knowledge base: Clinical trials, Expert protocols, Experimental intelligence. Every compound documented with sourced dose ranges and interaction data.",
    glow: "glow-cyan",
    iconColor: "text-dc-cyan",
    borderHover: "hover:border-dc-cyan/20",
  },
  {
    icon: Cpu,
    title: "Protocol Engineer",
    description:
      "AI-powered stack builder that respects your risk appetite and constraints. Input your goals, history, and budget. Get a protocol, not a disclaimer.",
    glow: "glow-orange",
    iconColor: "text-dc-orange",
    borderHover: "hover:border-dc-orange/20",
  },
  {
    icon: ClipboardList,
    title: "Tracker & Lab Notebook",
    description:
      "Every dose, every site, every outcome. Your personal research log. Pin schedules, side-effect tracking, and progress photos in one encrypted vault.",
    glow: "glow-green",
    iconColor: "text-dc-green",
    borderHover: "hover:border-dc-green/20",
  },
  {
    icon: BarChart3,
    title: "Insight Engine",
    description:
      "See what's working. AI-powered analysis of your protocols and outcomes. Correlation detection, dose-response curves, and outcome scoring.",
    glow: "glow-purple",
    iconColor: "text-dc-purple",
    borderHover: "hover:border-dc-purple/20",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
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

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32 px-4 bg-grid-fine">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <p className="text-sm font-medium text-dc-orange uppercase tracking-wider mb-3">
            The Platform
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-space)] tracking-tight">
            Built on Four Pillars
          </h2>
          <p className="mt-5 text-dc-text-muted max-w-xl mx-auto text-lg">
            Everything you need to research, build, track, and optimize peptide protocols.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6"
        >
          {PILLARS.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={cardVariants}
              className={`glass-card glass-card-hover p-7 sm:p-8 ${pillar.borderHover} group`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-dc-surface-2 border border-dc-border/30 ${pillar.glow} transition-shadow duration-500`}>
                  <pillar.icon className={`w-6 h-6 ${pillar.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold font-[family-name:var(--font-space)] text-dc-text mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-dc-text-muted leading-relaxed text-[15px]">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
