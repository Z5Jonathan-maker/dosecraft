"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    q: "What exactly is DoseCraft?",
    a: "DoseCraft is a peptide biohacking protocol lab — an all-in-one platform to research compounds, build AI-powered protocols, track every dose, and share stacks with a community of serious biohackers. Think of it as your private protocol war room.",
  },
  {
    q: "What are the three evidence lanes?",
    a: "Clinical, Expert, and Experimental. Clinical data comes from peer-reviewed trials and published pharmacokinetics. Expert data comes from practitioner protocols used by sports medicine MDs and longevity clinicians. Experimental data is community-sourced N=1 reports and anecdotal stacks — labeled honestly as such. Every compound and dose range in DoseCraft is tagged to one of these three lanes so you always know the evidence quality.",
  },
  {
    q: "Is DoseCraft safe to use?",
    a: "DoseCraft is an information and tracking platform. We label evidence quality transparently, flag known contraindications automatically, and classify risk for every compound. We don't sell peptides. We don't provide medical advice. We help informed individuals research and track their own protocols. Always consult a healthcare provider before starting any peptide protocol.",
  },
  {
    q: "Do I need a prescription to use DoseCraft?",
    a: "No. DoseCraft is a research and tracking app. Peptide regulations vary by country — we document FDA status where relevant. The platform is for educational and personal tracking use. We are not a pharmacy and do not facilitate purchases.",
  },
  {
    q: "How does the AI Protocol Engine work?",
    a: "You describe your goal — recovery, performance, longevity, body composition. The AI engine (trained on practitioner protocols and clinical data, not a general chatbot) generates a full protocol with compounds, doses, timing, cycling schedules, and contraindication checks. It respects your risk tolerance and labels every recommendation by evidence lane.",
  },
  {
    q: "Can I share my protocols with others?",
    a: "Yes — Pro and Lifetime members can publish protocols to the DoseCraft marketplace. Coaches and creators can build a subscriber base and earn revenue from premium protocol subscriptions. All published protocols go through basic quality checks and must include evidence sourcing.",
  },
  {
    q: "What's included in the free plan?",
    a: "The free plan includes 3 compounds in your library, basic dose tracking for 1 active protocol, read-only access to community protocols, and 5 AI protocol suggestions per month. It's a real tier — not a demo. Upgrade to Pro for the full experience.",
  },
  {
    q: "Is my health and tracking data private?",
    a: "Yes. Your dose logs, biomarker data, and protocol details are private by default. You control what's shared. We do not sell personal data. Published protocols share protocol details only — not your personal tracking data.",
  },
];

function FAQItem({ item, index }: { item: typeof FAQS[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b last:border-b-0 transition-colors duration-200"
      style={{ borderColor: open ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.06)" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span
          className="text-sm sm:text-base font-medium pr-8 transition-colors duration-200"
          style={{ color: open ? "#e8e8f0" : "#c0c0d0" }}
        >
          <span className="text-dc-orange/50 font-mono text-xs mr-3">
            {String(index + 1).padStart(2, "0")}.
          </span>
          {item.q}
        </span>
        <ChevronDown
          className="w-5 h-5 shrink-0 transition-all duration-300"
          style={{
            color: open ? "#ff6b35" : "#8888a0",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-dc-text-muted leading-relaxed pl-9">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-header",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: ".faq-header", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".faq-list",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".faq-list", start: "top 85%" },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative py-28 sm:py-36 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="faq-header text-center mb-14 sm:mb-16">
          <p className="text-sm font-semibold text-dc-orange uppercase tracking-widest mb-3">
            FAQ
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-space)] tracking-tight">
            Common Questions
          </h2>
          <p className="mt-5 text-dc-text-muted text-lg">
            Straight answers. No corporate hedge language.
          </p>
        </div>

        <div
          className="faq-list glass-card px-6 sm:px-8 py-2"
        >
          {FAQS.map((item, i) => (
            <FAQItem key={item.q} item={item} index={i} />
          ))}
        </div>
      </div>

      <div className="section-divider mt-28 sm:mt-36" />
    </section>
  );
}
