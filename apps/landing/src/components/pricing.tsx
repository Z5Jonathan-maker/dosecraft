"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Zap,
  Crown,
  Infinity,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import TiltCard from "@/components/tilt-card";

gsap.registerPlugin(ScrollTrigger);

const TIERS = [
  {
    id: "free",
    icon: Zap,
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Get started — explore the platform",
    color: "#8888a0",
    featured: false,
    cta: "Start Free",
    features: [
      "3 peptides in your library",
      "Basic dose tracking",
      "1 active protocol",
      "Community protocols (read-only)",
      "Limited AI suggestions (5/mo)",
      "Mobile app access",
    ],
  },
  {
    id: "pro",
    icon: Sparkles,
    name: "Pro",
    monthlyPrice: 29,
    annualPrice: 23,
    description: "Full power for serious biohackers",
    color: "#ff6b35",
    featured: true,
    cta: "Start Pro",
    features: [
      "Full peptide library (35+ compounds)",
      "Unlimited dose tracking & rotation",
      "Unlimited protocols",
      "AI Protocol Engine (unlimited)",
      "Protocol Marketplace access",
      "Insight Engine & analytics",
      "Three-lane evidence system",
      "Contraindication checking",
      "Priority support",
    ],
  },
  {
    id: "lifetime",
    icon: Crown,
    name: "Lifetime",
    monthlyPrice: null,
    annualPrice: null,
    oneTime: 249,
    description: "Everything forever — founder pricing",
    color: "#b366ff",
    featured: false,
    cta: "Go Lifetime",
    features: [
      "Everything in Pro, forever",
      "Founder badge on profile",
      "Early access to new features",
      "Protocol creator tools",
      "Revenue share on published protocols",
      "Private founder community",
      "Direct team access",
    ],
  },
];

function PriceDisplay({
  tier,
  annual,
}: {
  tier: typeof TIERS[0];
  annual: boolean;
}) {
  if (tier.oneTime !== undefined) {
    return (
      <div className="flex items-end gap-1">
        <span className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-space)]" style={{ color: tier.color }}>
          ${tier.oneTime}
        </span>
        <span className="text-dc-text-muted text-sm mb-1.5">one-time</span>
      </div>
    );
  }

  if (tier.monthlyPrice === 0) {
    return (
      <div className="flex items-end gap-1">
        <span className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-space)]" style={{ color: tier.color }}>
          $0
        </span>
        <span className="text-dc-text-muted text-sm mb-1.5">/ mo</span>
      </div>
    );
  }

  const price = annual ? tier.annualPrice : tier.monthlyPrice;
  return (
    <div>
      <div className="flex items-end gap-1">
        <AnimatePresence mode="wait">
          <motion.span
            key={`${tier.id}-${annual}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-space)]"
            style={{ color: tier.color }}
          >
            ${price}
          </motion.span>
        </AnimatePresence>
        <span className="text-dc-text-muted text-sm mb-1.5">/ mo</span>
      </div>
      {annual && (
        <p className="text-xs text-dc-green mt-1">Billed annually · save 20%</p>
      )}
    </div>
  );
}

function PricingCard({
  tier,
  annual,
}: {
  tier: typeof TIERS[0];
  annual: boolean;
}) {
  const TierIcon = tier.icon;

  if (tier.featured) {
    return (
      <TiltCard className="h-full">
        <div className="glow-border-animated h-full flex flex-col p-6 sm:p-7 relative" style={{ minHeight: 560 }}>
          {/* Featured badge */}
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              background: "linear-gradient(135deg, #ff6b35, #ff9966)",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(255,107,53,0.5)",
            }}
          >
            Most Popular
          </div>

          <div className="flex items-start justify-between mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${tier.color}18`, border: `1px solid ${tier.color}30` }}
            >
              <TierIcon className="w-5 h-5" style={{ color: tier.color }} />
            </div>
            <span className="text-xs text-dc-text-muted px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              Recommended
            </span>
          </div>

          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: tier.color }}>
            {tier.name}
          </p>
          <PriceDisplay tier={tier} annual={annual} />
          <p className="mt-2 text-sm text-dc-text-muted mb-6">{tier.description}</p>

          <ul className="space-y-2.5 flex-1">
            {tier.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: tier.color }} />
                <span className="text-dc-text/85">{f}</span>
              </li>
            ))}
          </ul>

          <a
            href="https://dosecraft-web.vercel.app/auth"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-7 w-full flex items-center justify-center gap-2 group"
          >
            {tier.cta}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </TiltCard>
    );
  }

  return (
    <TiltCard className="h-full">
      <div
        className="h-full flex flex-col p-6 sm:p-7 rounded-2xl"
        style={{
          background: "rgba(10,10,16,0.8)",
          border: `1px solid ${tier.color}22`,
          minHeight: 520,
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
          style={{ background: `${tier.color}15`, border: `1px solid ${tier.color}28` }}
        >
          <TierIcon className="w-5 h-5" style={{ color: tier.color }} />
        </div>

        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: tier.color }}>
          {tier.name}
        </p>
        <PriceDisplay tier={tier} annual={annual} />
        <p className="mt-2 text-sm text-dc-text-muted mb-6">{tier.description}</p>

        <ul className="space-y-2.5 flex-1">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: tier.color }} />
              <span className="text-dc-text/75">{f}</span>
            </li>
          ))}
        </ul>

        <a
          href="https://dosecraft-web.vercel.app/auth"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary mt-7 w-full flex items-center justify-center gap-2 group"
          style={{ borderColor: `${tier.color}30` }}
        >
          {tier.cta}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </TiltCard>
  );
}

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const [annual, setAnnual] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pricing-header",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: ".pricing-header", start: "top 85%" },
        }
      );

      const cards = gsap.utils.toArray<HTMLElement>(".pricing-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".pricing-grid", start: "top 82%" },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" ref={ref} className="relative py-28 sm:py-36 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="pricing-header text-center mb-14 sm:mb-16">
          <p className="text-sm font-semibold text-dc-purple uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-space)] tracking-tight">
            Start Free,{" "}
            <span className="text-gradient-purple">Go Deep</span>
          </h2>
          <p className="mt-5 text-dc-text-muted text-lg max-w-2xl mx-auto">
            No gatekeeping. Free tier is real. Pro is for serious operators.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <button
              onClick={() => setAnnual(false)}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: !annual ? "rgba(255,255,255,0.08)" : "transparent",
                color: !annual ? "#e8e8f0" : "#8888a0",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2"
              style={{
                background: annual ? "rgba(0,255,136,0.1)" : "transparent",
                color: annual ? "#00ff88" : "#8888a0",
                border: annual ? "1px solid rgba(0,255,136,0.2)" : "1px solid transparent",
              }}
            >
              Annual
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(0,255,136,0.15)", color: "#00ff88" }}>
                −20%
              </span>
            </button>
          </div>
        </div>

        <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {TIERS.map((tier) => (
            <div key={tier.id} className="pricing-card" style={{ marginTop: tier.featured ? "-8px" : 0 }}>
              <PricingCard tier={tier} annual={annual} />
            </div>
          ))}
        </div>

        {/* Guarantee note */}
        <p className="mt-10 text-center text-sm text-dc-text-muted">
          <Infinity className="w-4 h-4 inline mr-1.5 text-dc-purple/60" />
          All plans include a 14-day money-back guarantee. No questions asked.
        </p>
      </div>

      <div className="section-divider mt-28 sm:mt-36" />
    </section>
  );
}
