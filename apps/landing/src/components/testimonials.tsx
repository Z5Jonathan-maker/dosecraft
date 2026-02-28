"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    quote:
      "DoseCraft's three-lane evidence system completely changed how I think about peptide research. I finally know when I'm on solid ground versus exploring.",
    name: "Dr. Sarah K.",
    title: "Sports Medicine Physician",
    initials: "SK",
    color: "#00d4ff",
    lane: "Clinical",
  },
  {
    quote:
      "Finally a tool that doesn't treat peptide users like criminals. The AI protocol engine gave me a better ACL recovery stack than I could have built manually.",
    name: "Mike R.",
    title: "Competitive CrossFitter",
    initials: "MR",
    color: "#ff6b35",
    lane: "Expert",
  },
  {
    quote:
      "I've been using peptides for 3 years. DoseCraft is the first app that actually respects my intelligence — real dose ranges, real sources, no paternalistic BS.",
    name: "Alex T.",
    title: "Biohacker & Longevity Researcher",
    initials: "AT",
    color: "#b366ff",
    lane: "Experimental",
  },
  {
    quote:
      "Published my first protocol stack last week. Already 40 subscribers. DoseCraft is building the infrastructure for the peptide economy before anyone else.",
    name: "Coach David M.",
    title: "Performance Coach · 800 clients",
    initials: "DM",
    color: "#ff6b35",
    lane: "Creator",
  },
  {
    quote:
      "The compliance tracking alone is worth it. I was missing doses constantly with spreadsheets. Now I'm at 96% compliance 8 weeks in.",
    name: "Jordan L.",
    title: "Hybrid Athlete · Ultra Runner",
    initials: "JL",
    color: "#00ff88",
    lane: "Tracker",
  },
  {
    quote:
      "I was skeptical of another biohacking app, but DoseCraft's honest risk labeling won me over. They flag what's experimental without hiding it. Rare integrity.",
    name: "Dr. Ryan P.",
    title: "Functional Medicine MD",
    initials: "RP",
    color: "#00d4ff",
    lane: "Clinical",
  },
];

function StarRating({ count = 5, color }: { count?: number; color: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5" fill={color} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonials-header",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: ".testimonials-header", start: "top 85%" },
        }
      );

      const cards = gsap.utils.toArray<HTMLElement>(".testimonial-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            delay: (i % 3) * 0.1,
            scrollTrigger: { trigger: card, start: "top 90%" },
          }
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative py-28 sm:py-36 px-4 bg-grid-fine">
      <div className="max-w-7xl mx-auto">
        <div className="testimonials-header text-center mb-14 sm:mb-16">
          <p className="text-sm font-semibold text-dc-green uppercase tracking-widest mb-3">
            Beta Feedback
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-space)] tracking-tight">
            From the{" "}
            <span className="text-gradient-green">Community</span>
          </h2>
          <p className="mt-5 text-dc-text-muted text-lg max-w-xl mx-auto">
            What biohackers, coaches, and clinicians say about DoseCraft.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="testimonial-card glass-card glass-card-hover p-6 flex flex-col"
            >
              {/* Quote icon */}
              <Quote
                className="w-6 h-6 mb-4 opacity-40"
                style={{ color: t.color }}
              />

              {/* Stars */}
              <StarRating color={t.color} />

              {/* Quote text */}
              <p className="mt-4 text-sm text-dc-text/80 leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: `${t.color}18`, color: t.color, border: `1px solid ${t.color}28` }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-dc-text font-[family-name:var(--font-space)]">
                    {t.name}
                  </p>
                  <p className="text-[11px] text-dc-text-muted">{t.title}</p>
                </div>
                <div className="ml-auto">
                  <span
                    className="text-[9px] font-semibold px-2 py-1 rounded-md uppercase tracking-wide"
                    style={{ background: `${t.color}12`, color: `${t.color}cc`, border: `1px solid ${t.color}20` }}
                  >
                    {t.lane}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider mt-28 sm:mt-36" />
    </section>
  );
}
