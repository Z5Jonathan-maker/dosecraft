"use client";

import { motion } from "framer-motion";
import { Check, Zap, Crown, Rocket } from "lucide-react";

const TIERS = [
  {
    name: "Base",
    price: "$29",
    period: "/mo",
    description: "Everything you need to start tracking protocols with confidence.",
    icon: Zap,
    color: "dc-cyan",
    featured: false,
    features: [
      "Full dose tracking & logging",
      "Standard peptide library",
      "Basic AI protocol suggestions",
      "Side-effect tracking",
      "Mobile-friendly dashboard",
      "Community access",
    ],
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    description: "For serious biohackers who want AI power and creator access.",
    icon: Crown,
    color: "dc-orange",
    featured: true,
    features: [
      "Everything in Base",
      "Creator protocol marketplace",
      "Advanced AI protocol engine",
      "Insight Engine analytics",
      "Lab work integration",
      "Export & share protocols",
      "Priority support",
    ],
  },
  {
    name: "Lifetime",
    price: "TBD",
    period: "",
    description: "Founder pricing for early believers. Limited spots.",
    icon: Rocket,
    color: "dc-purple",
    featured: false,
    features: [
      "Everything in Pro, forever",
      "Founder pricing (locked)",
      "Lifetime updates",
      "Private founder community",
      "Direct input on roadmap",
      "Early access to all features",
    ],
    comingSoon: true,
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

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32 px-4">
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
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-space)] tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-5 text-dc-text-muted max-w-xl mx-auto text-lg">
            No hidden fees. No surprise upsells. Cancel anytime.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dc-green/10 border border-dc-green/20">
            <span className="text-sm text-dc-green font-medium">Save 20% with annual billing</span>
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto"
        >
          {TIERS.map((tier) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={`relative glass-card p-7 sm:p-8 flex flex-col ${
                tier.featured
                  ? "glow-orange border-dc-orange/20 lg:scale-105"
                  : ""
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-dc-orange text-white text-xs font-semibold uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              {tier.comingSoon && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-${tier.color} text-white text-xs font-semibold uppercase tracking-wider`}>
                  Coming Soon
                </div>
              )}

              {/* Icon + name */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl bg-${tier.color}/10 border border-${tier.color}/20`}>
                  <tier.icon className={`w-5 h-5 text-${tier.color}`} />
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-space)]">
                  {tier.name}
                </h3>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold font-[family-name:var(--font-space)] text-dc-text">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-dc-text-muted text-sm">{tier.period}</span>
                )}
              </div>

              <p className="text-sm text-dc-text-muted mb-6 leading-relaxed">
                {tier.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-dc-text/85">
                    <Check className={`w-4 h-4 text-${tier.color} mt-0.5 shrink-0`} />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#waitlist"
                className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  tier.featured
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
              >
                {tier.comingSoon ? "Get Notified" : "Join Waitlist"}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
