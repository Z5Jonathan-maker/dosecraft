"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShieldAlert,
  Bot,
  BookX,
  Syringe,
  Activity,
  Users,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Share2,
  DollarSign,
  LayoutDashboard,
} from "lucide-react";

import { GSAPProvider } from "@/lib/gsap-provider";
import Nav from "@/components/nav";
import Hero from "@/components/hero";
import SocialProofBar from "@/components/social-proof-bar";
import Features from "@/components/features";
import ParallaxLanes from "@/components/parallax-lanes";
import StatsCounter from "@/components/stats-counter";
import Pricing from "@/components/pricing";
import Testimonials from "@/components/testimonials";
import FAQ from "@/components/faq";
import WaitlistForm from "@/components/waitlist-form";
import Footer from "@/components/footer";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   PROBLEM SECTION
   ============================================================ */
function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const PROBLEMS = [
    {
      icon: ShieldAlert,
      title: "FDA Crackdowns",
      description:
        "Peptide access is narrowing every month. You need to be smarter, not just connected. The window is closing for the unprepared.",
      color: "#ff6b35",
    },
    {
      icon: Bot,
      title: "Filtered AI Chatbots",
      description:
        "Ask ChatGPT about peptide doses — it'll tell you to see a doctor. Useless. You need an AI that actually speaks your language.",
      color: "#b366ff",
    },
    {
      icon: BookX,
      title: "Outdated Protocols",
      description:
        "Bro-science forums and 2019 guides don't cut it in 2026. The research has moved on. Your tools should too.",
      color: "#00d4ff",
    },
  ];

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".problem-header",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: ".problem-header", start: "top 85%" },
        }
      );

      const cards = gsap.utils.toArray<HTMLElement>(".problem-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );
      });

      /* Dissolve out as user scrolls past */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom 60%",
          end: "bottom 20%",
          scrub: 1,
        },
      });

      cards.forEach((card, i) => {
        tl.to(
          card,
          { opacity: 0, scale: 0.88, y: -20, rotateX: 6, filter: "blur(3px)", duration: 0.3 },
          i * 0.08
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="problem" ref={sectionRef} className="relative py-28 sm:py-36 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="problem-header text-center mb-14 sm:mb-16">
          <p className="text-sm font-semibold text-red-400/80 uppercase tracking-widest mb-3">
            The Problem
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-space)] tracking-tight">
            The Current Landscape Is{" "}
            <span className="text-red-400">Broken</span>
          </h2>
          <p className="mt-5 text-dc-text-muted text-lg max-w-xl mx-auto">
            Every serious biohacker hits the same walls. DoseCraft was built to tear them down.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="problem-card">
              <div className="glass-card glass-card-hover p-7 sm:p-8 h-full">
                <div
                  className="w-11 h-11 rounded-xl inline-flex items-center justify-center mb-5"
                  style={{ background: `${p.color}14`, border: `1px solid ${p.color}28` }}
                >
                  <p.icon className="w-5 h-5" style={{ color: p.color }} />
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-space)] text-dc-text mb-3">
                  {p.title}
                </h3>
                <p className="text-dc-text-muted text-sm leading-relaxed">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider mt-28 sm:mt-36" />
    </section>
  );
}

/* ============================================================
   SOLUTION SECTION
   ============================================================ */
function SolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".solution-text",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: ".solution-text", start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".solution-mock",
        { opacity: 0, x: 60, scale: 0.92 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".solution-mock", start: "top 80%" },
        }
      );

      const rows = gsap.utils.toArray<HTMLElement>(".solution-mock-row");
      rows.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.25 + i * 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: ".solution-mock", start: "top 78%" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="solution" ref={sectionRef} className="relative py-28 sm:py-36 px-4 bg-grid-fine">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="solution-text">
            <p className="text-sm font-semibold text-dc-green uppercase tracking-widest mb-3">
              The Solution
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-space)] tracking-tight leading-tight">
              Your Private{" "}
              <span className="text-gradient-green">Protocol War Room</span>
            </h2>
            <p className="mt-6 text-dc-text-muted text-lg leading-relaxed">
              DoseCraft is the command center for peptide biohackers who take their protocols seriously. Research compounds, engineer stacks, track every dose, and let AI analyze what&apos;s actually working.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: Syringe, text: "Log every injection with site rotation and timing logs" },
                { icon: Activity, text: "Track outcomes, side effects, and subjective scores" },
                { icon: Users, text: "Access protocols from verified coaches and clinicians" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.2)" }}
                  >
                    <item.icon className="w-4 h-4 text-dc-green" />
                  </div>
                  <span className="text-sm text-dc-text/80 leading-relaxed pt-1">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mock UI */}
          <div className="solution-mock relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-dc-green/[0.05] via-transparent to-dc-cyan/[0.04] rounded-3xl blur-3xl" />
            <div className="relative app-chrome">
              <div className="app-chrome-bar">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-xs text-dc-text-muted/60 font-mono ml-2">protocol-engineer</span>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div className="solution-mock-row p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[10px] text-dc-text-muted mb-2 uppercase tracking-wider">AI Prompt</p>
                  <p className="text-sm text-dc-text">
                    &ldquo;Build me a 12-week recovery stack for a torn rotator cuff. I&apos;m 34, 210 lbs, moderate risk tolerance.&rdquo;
                  </p>
                </div>

                <div className="solution-mock-row p-4 rounded-xl" style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.18)" }}>
                  <p className="text-[10px] text-dc-orange mb-3 uppercase tracking-wider">Protocol Engine</p>
                  <div className="space-y-2 text-sm">
                    <p className="text-dc-text/70 text-xs mb-2">Recommended stack (12 weeks):</p>
                    {[
                      { dot: "#00d4ff", text: "BPC-157: 250mcg 2x/day subQ", lane: "Clinical" },
                      { dot: "#ff6b35", text: "TB-500: 2.5mg 2x/week subQ", lane: "Expert" },
                      { dot: "#b366ff", text: "GHK-Cu: 200mcg 1x/day subQ", lane: "Experimental" },
                    ].map((row) => (
                      <div key={row.lane} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: row.dot }} />
                          <span className="text-xs text-dc-text/80">{row.text}</span>
                        </div>
                        <span
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded shrink-0"
                          style={{ color: row.dot, background: `${row.dot}18`, border: `1px solid ${row.dot}28` }}
                        >
                          {row.lane}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="solution-mock-row flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)" }}>
                  <ShieldCheck className="w-4 h-4 text-dc-green shrink-0" />
                  <p className="text-xs text-dc-green">No known contraindications. All interactions checked.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-divider mt-28 sm:mt-36" />
    </section>
  );
}

/* ============================================================
   CREATOR SECTION
   ============================================================ */
function CreatorSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".creator-mock",
        { opacity: 0, x: -50, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: ".creator-mock", start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".creator-text",
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: ".creator-text", start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 sm:py-36 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Creator dashboard mock */}
          <div className="creator-mock relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-dc-purple/[0.06] via-transparent to-dc-orange/[0.04] rounded-3xl blur-3xl" />
            <div className="relative app-chrome">
              <div className="app-chrome-bar">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-xs text-dc-text-muted/60 font-mono ml-2">creator-dashboard</span>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-dc-text-muted uppercase tracking-wider mb-1">Creator Dashboard</p>
                    <h4 className="text-sm font-bold font-[family-name:var(--font-space)]">Dr. Mike&apos;s Protocols</h4>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(179,102,255,0.12)", color: "#b366ff", border: "1px solid rgba(179,102,255,0.25)" }}
                  >
                    Pro Creator
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Published", value: "12", color: "#ff6b35" },
                    { label: "Subscribers", value: "843", color: "#b366ff" },
                    { label: "Revenue", value: "$4.2k", color: "#00ff88" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="text-center py-3 rounded-xl"
                      style={{ background: `${s.color}08`, border: `1px solid ${s.color}18` }}
                    >
                      <p className="text-lg font-bold font-[family-name:var(--font-space)]" style={{ color: s.color }}>
                        {s.value}
                      </p>
                      <p className="text-[9px] text-dc-text-muted">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {[
                    { name: "Ultimate Recovery Stack", subs: 234, rating: "4.9" },
                    { name: "Lean Mass Protocol", subs: 187, rating: "4.8" },
                    { name: "Sleep Optimization v2", subs: 156, rating: "4.7" },
                  ].map((proto) => (
                    <div
                      key={proto.name}
                      className="flex items-center justify-between py-2.5 px-3.5 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <span className="text-sm text-dc-text">{proto.name}</span>
                      <div className="flex items-center gap-3 text-xs text-dc-text-muted">
                        <span>{proto.subs} subs</span>
                        <span className="text-dc-orange font-semibold">{proto.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="creator-text">
            <p className="text-sm font-semibold text-dc-purple uppercase tracking-widest mb-3">
              For Creators & Coaches
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-space)] tracking-tight leading-tight">
              Protocol as{" "}
              <span className="text-gradient-purple">Content</span>
            </h2>
            <p className="mt-6 text-dc-text-muted text-lg leading-relaxed">
              Share protocols. Build your audience. Earn revenue. DoseCraft gives coaches and content creators a platform to publish, monetize, and support their community of biohackers.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: Share2, text: "Publish and share protocols with your audience" },
                { icon: DollarSign, text: "Revenue sharing on premium protocol subscriptions" },
                { icon: LayoutDashboard, text: "Full creator dashboard with analytics and engagement" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(179,102,255,0.1)", border: "1px solid rgba(179,102,255,0.2)" }}
                  >
                    <item.icon className="w-4 h-4 text-dc-purple" />
                  </div>
                  <span className="text-sm text-dc-text/80 leading-relaxed pt-1">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section-divider mt-28 sm:mt-36" />
    </section>
  );
}

/* ============================================================
   SCIENCE / TRUST SECTION
   ============================================================ */
function ScienceSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const BADGES = [
    {
      icon: CheckCircle,
      title: "Every Dose Range Sourced",
      description:
        "Linked to the clinical trial, practitioner protocol, or user report it came from. No floating claims.",
    },
    {
      icon: AlertTriangle,
      title: "Every Interaction Flagged",
      description:
        "Compound interactions and contraindications checked automatically before you start a protocol.",
    },
    {
      icon: ShieldCheck,
      title: "Every Risk Labeled",
      description:
        "Honest risk classification. No sugarcoating, no fear-mongering. Just the data, faithfully represented.",
    },
  ];

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".science-header",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: ".science-header", start: "top 85%" },
        }
      );

      const cards = gsap.utils.toArray<HTMLElement>(".science-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 45 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 sm:py-36 px-4 bg-grid-fine">
      <div className="max-w-7xl mx-auto">
        <div className="science-header text-center mb-14 sm:mb-16">
          <p className="text-sm font-semibold text-dc-cyan uppercase tracking-widest mb-3">
            Trust & Safety
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-space)] tracking-tight">
            Transparent.{" "}
            <span className="text-gradient-cyan">Not Reckless.</span>
          </h2>
          <p className="mt-5 text-dc-text-muted max-w-2xl mx-auto text-lg">
            DoseCraft uses a layered AI safety system with contraindication checking, interaction flagging, and source attribution built into every protocol recommendation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BADGES.map((badge) => (
            <div key={badge.title} className="science-card">
              <div className="glass-card glass-card-hover p-7 sm:p-8 h-full text-center">
                <div
                  className="w-11 h-11 rounded-xl mx-auto inline-flex items-center justify-center mb-5"
                  style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.22)" }}
                >
                  <badge.icon className="w-5 h-5 text-dc-cyan" />
                </div>
                <h3 className="text-lg font-bold font-[family-name:var(--font-space)] text-dc-text mb-3">
                  {badge.title}
                </h3>
                <p className="text-dc-text-muted text-sm leading-relaxed">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider mt-28 sm:mt-36" />
    </section>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function HomePage() {
  return (
    <GSAPProvider>
      <Nav />
      <main>
        <Hero />
        <SocialProofBar />
        <ProblemSection />
        <SolutionSection />
        <Features />
        <ParallaxLanes />
        <StatsCounter />
        <CreatorSection />
        <ScienceSection />
        <Pricing />
        <Testimonials />
        <FAQ />
        <WaitlistForm />
      </main>
      <Footer />
    </GSAPProvider>
  );
}
