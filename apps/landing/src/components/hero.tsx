"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Syringe, Activity, FlaskConical } from "lucide-react";

function MockAppPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      className="relative w-full max-w-2xl mx-auto mt-12 lg:mt-16"
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
          <span className="text-xs text-dc-text-muted ml-2 font-mono">dosecraft / protocol-engineer</span>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Active protocol header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-dc-text-muted uppercase tracking-wider">Active Protocol</p>
              <h4 className="text-sm font-semibold font-[family-name:var(--font-space)] text-dc-text mt-1">
                Recovery Stack v3
              </h4>
            </div>
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-dc-green/10 text-dc-green border border-dc-green/20">
              Week 4 of 8
            </span>
          </div>

          {/* Mock peptide rows */}
          <div className="space-y-2.5">
            {[
              { name: "BPC-157", dose: "250 mcg", freq: "2x daily", lane: "Clinical", color: "dc-cyan" },
              { name: "TB-500", dose: "2.5 mg", freq: "2x week", lane: "Expert", color: "dc-orange" },
              { name: "GHK-Cu", dose: "200 mcg", freq: "1x daily", lane: "Experimental", color: "dc-purple" },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-dc-surface/80 border border-dc-border/30"
              >
                <div className="flex items-center gap-3">
                  <Syringe className={`w-4 h-4 text-${item.color}`} />
                  <div>
                    <p className="text-sm font-medium text-dc-text">{item.name}</p>
                    <p className="text-xs text-dc-text-muted">{item.dose} &middot; {item.freq}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md bg-${item.color}/10 text-${item.color} border border-${item.color}/20`}>
                  {item.lane}
                </span>
              </div>
            ))}
          </div>

          {/* Stats row */}
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
                <p className="text-base font-bold font-[family-name:var(--font-space)] text-dc-text">{stat.value}</p>
                <p className="text-[10px] text-dc-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center hero-gradient bg-grid overflow-hidden pt-20 pb-16 px-4">
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/6 w-[400px] h-[400px] bg-dc-orange/[0.04] rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/6 w-[300px] h-[300px] bg-dc-purple/[0.04] rounded-full blur-[100px] animate-pulse-glow pointer-events-none" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/3 right-1/3 w-[250px] h-[250px] bg-dc-cyan/[0.03] rounded-full blur-[80px] animate-pulse-glow pointer-events-none" style={{ animationDelay: "3s" }} />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
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

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-space)] leading-[1.1] tracking-tight"
        >
          Run Peptide Stacks{" "}
          <span className="text-gradient-hero">Like the Pros</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 text-lg sm:text-xl text-dc-text-muted max-w-2xl mx-auto leading-relaxed"
        >
          Track every pin, dose, and result. Three evidence lanes. Zero corporate BS.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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

        {/* Mock preview */}
        <MockAppPreview />
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#problem" className="flex flex-col items-center gap-1 text-dc-text-muted/40 hover:text-dc-text-muted/70 transition-colors">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-scroll-hint" />
        </a>
      </motion.div>
    </section>
  );
}
