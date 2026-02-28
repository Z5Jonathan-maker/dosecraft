"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
import Features from "@/components/features";
import Lanes from "@/components/lanes";
import StatsCounter from "@/components/stats-counter";
import Pricing from "@/components/pricing";
import WaitlistForm from "@/components/waitlist-form";
import Footer from "@/components/footer";

gsap.registerPlugin(ScrollTrigger);

/* ------ Problem Section with scroll-driven crack/dissolve ------ */
function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const PROBLEMS = [
    {
      icon: ShieldAlert,
      title: "FDA Crackdowns",
      description:
        "Peptide access is getting harder every month. You need to be smarter, not just connected. The window is closing for the unprepared.",
      color: "#ff6b35",
    },
    {
      icon: Bot,
      title: "Filtered AI Chatbots",
      description:
        "Ask ChatGPT about peptide doses. It'll tell you to see a doctor. Useless. You need an AI that actually speaks your language.",
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
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      /* Header reveal */
      gsap.fromTo(
        ".problem-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".problem-header",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      /* Card reveals with stagger */
      const cards = gsap.utils.toArray<HTMLElement>(".problem-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      /* On scroll past: cards dissolve/crack */
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
          {
            opacity: 0,
            scale: 0.85,
            y: -20,
            rotateX: 5,
            filter: "blur(4px)",
            duration: 0.3,
          },
          i * 0.08
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="problem-header text-center mb-16 sm:mb-20">
          <p className="text-sm font-medium text-red-400 uppercase tracking-wider mb-3">
            The Problem
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-space)] tracking-tight">
            The Current Landscape Is{" "}
            <span className="text-red-400">Broken</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {PROBLEMS.map((problem) => (
            <div key={problem.title} className="problem-card">
              <div className="glass-card glass-card-hover p-7 sm:p-8 h-full">
                <div
                  className="p-3 rounded-xl border inline-flex mb-5"
                  style={{
                    borderColor: `${problem.color}33`,
                    backgroundColor: `${problem.color}15`,
                  }}
                >
                  <problem.icon
                    className="w-6 h-6"
                    style={{ color: problem.color }}
                  />
                </div>
                <h3 className="text-xl font-semibold font-[family-name:var(--font-space)] text-dc-text mb-3">
                  {problem.title}
                </h3>
                <p className="text-dc-text-muted text-sm leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider mt-24 sm:mt-32" />
    </section>
  );
}

/* ------ Solution Section with scroll-build ------ */
function SolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      /* Text reveal from left */
      gsap.fromTo(
        ".solution-text",
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".solution-text",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      /* Mock UI assembles from pieces */
      gsap.fromTo(
        ".solution-mock",
        { opacity: 0, x: 60, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".solution-mock",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      /* Stagger the inner mock elements */
      const mockElements =
        gsap.utils.toArray<HTMLElement>(".solution-mock-row");
      mockElements.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.2 + i * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".solution-mock",
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="solution"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4 bg-grid-fine"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div className="solution-text">
            <p className="text-sm font-medium text-dc-green uppercase tracking-wider mb-3">
              The Solution
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-space)] tracking-tight leading-tight">
              Your Private{" "}
              <span className="text-gradient-green">Protocol War Room</span>
            </h2>
            <p className="mt-6 text-dc-text-muted text-lg leading-relaxed">
              DoseCraft is the command center for peptide biohackers who take
              their protocols seriously. Research compounds, engineer stacks,
              track every dose, and let AI analyze what&apos;s actually working.
            </p>
            <div className="mt-8 space-y-4">
              {[
                {
                  icon: Syringe,
                  text: "Log every injection with site rotation and timing",
                },
                {
                  icon: Activity,
                  text: "Track outcomes, side effects, and subjective scores",
                },
                {
                  icon: Users,
                  text: "Access protocols from verified coaches and clinicians",
                },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-start gap-3 text-dc-text/85"
                >
                  <item.icon className="w-5 h-5 text-dc-green mt-0.5 shrink-0" />
                  <span className="text-sm leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mock UI */}
          <div className="solution-mock relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-dc-green/[0.06] via-transparent to-dc-cyan/[0.04] rounded-3xl blur-2xl" />
            <div className="relative glass-card rounded-2xl overflow-hidden">
              {/* Top bar */}
              <div className="solution-mock-row flex items-center gap-2 px-5 py-3 border-b border-dc-border/40 bg-dc-surface/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-dc-text-muted ml-2 font-mono">
                  protocol-engineer
                </span>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                {/* AI Prompt */}
                <div className="solution-mock-row p-4 rounded-xl bg-dc-surface-2 border border-dc-border/30">
                  <p className="text-xs text-dc-text-muted mb-2 uppercase tracking-wider">
                    AI Prompt
                  </p>
                  <p className="text-sm text-dc-text">
                    &quot;Build me a 12-week recovery stack for a torn rotator
                    cuff. I&apos;m 34, 210 lbs, moderate risk tolerance.&quot;
                  </p>
                </div>

                {/* AI Response preview */}
                <div className="solution-mock-row p-4 rounded-xl bg-dc-orange/5 border border-dc-orange/15">
                  <p className="text-xs text-dc-orange mb-2 uppercase tracking-wider">
                    Protocol Engineer
                  </p>
                  <div className="space-y-2 text-sm text-dc-text/80">
                    <p>Recommended stack (12 weeks):</p>
                    <div className="flex items-center gap-2 pl-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-dc-cyan" />
                      <span>BPC-157: 250mcg 2x/day subQ (Clinical)</span>
                    </div>
                    <div className="flex items-center gap-2 pl-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-dc-orange" />
                      <span>TB-500: 2.5mg 2x/week subQ (Expert)</span>
                    </div>
                    <div className="flex items-center gap-2 pl-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-dc-purple" />
                      <span>GHK-Cu: 200mcg 1x/day subQ (Experimental)</span>
                    </div>
                  </div>
                </div>

                {/* Safety badge */}
                <div className="solution-mock-row flex items-center gap-2 px-3 py-2 rounded-lg bg-dc-green/5 border border-dc-green/15 text-xs text-dc-green">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  No known contraindications. All interactions checked.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-divider mt-24 sm:mt-32" />
    </section>
  );
}

/* ------ Creator / Coach Section ------ */
function CreatorSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".creator-mock",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".creator-mock",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".creator-text",
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".creator-text",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Mock dashboard */}
          <div className="creator-mock relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-dc-purple/[0.06] via-transparent to-dc-orange/[0.04] rounded-3xl blur-2xl" />
            <div className="relative glass-card rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-dc-border/40 bg-dc-surface/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-dc-text-muted ml-2 font-mono">
                  creator-dashboard
                </span>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-dc-text-muted uppercase tracking-wider">
                      Creator Dashboard
                    </p>
                    <h4 className="text-sm font-semibold font-[family-name:var(--font-space)] mt-1">
                      Dr. Mike&apos;s Protocols
                    </h4>
                  </div>
                  <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-dc-purple/10 text-dc-purple border border-dc-purple/20">
                    Pro Creator
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Published", value: "12" },
                    { label: "Subscribers", value: "843" },
                    { label: "Revenue", value: "$4.2k" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="text-center py-3 rounded-xl bg-dc-surface-2/50 border border-dc-border/20"
                    >
                      <p className="text-lg font-bold font-[family-name:var(--font-space)]">
                        {stat.value}
                      </p>
                      <p className="text-[10px] text-dc-text-muted">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {[
                    {
                      name: "Ultimate Recovery Stack",
                      subs: 234,
                      rating: 4.9,
                    },
                    { name: "Lean Mass Protocol", subs: 187, rating: 4.8 },
                    {
                      name: "Sleep Optimization v2",
                      subs: 156,
                      rating: 4.7,
                    },
                  ].map((proto) => (
                    <div
                      key={proto.name}
                      className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-dc-surface/80 border border-dc-border/30"
                    >
                      <span className="text-sm text-dc-text">{proto.name}</span>
                      <div className="flex items-center gap-3 text-xs text-dc-text-muted">
                        <span>{proto.subs} subs</span>
                        <span className="text-dc-orange">{proto.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="creator-text">
            <p className="text-sm font-medium text-dc-purple uppercase tracking-wider mb-3">
              For Creators & Coaches
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-space)] tracking-tight leading-tight">
              Built for{" "}
              <span className="text-gradient-purple">
                Creators & Coaches
              </span>
            </h2>
            <p className="mt-6 text-dc-text-muted text-lg leading-relaxed">
              Share protocols. Build your audience. Earn revenue. DoseCraft gives
              coaches and content creators a platform to publish, monetize, and
              support their community.
            </p>
            <div className="mt-8 space-y-4">
              {[
                {
                  icon: Share2,
                  text: "Publish and share protocols with your audience",
                },
                {
                  icon: DollarSign,
                  text: "Revenue sharing on premium protocol subscriptions",
                },
                {
                  icon: LayoutDashboard,
                  text: "Full creator dashboard with analytics and engagement",
                },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-start gap-3 text-dc-text/85"
                >
                  <item.icon className="w-5 h-5 text-dc-purple mt-0.5 shrink-0" />
                  <span className="text-sm leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section-divider mt-24 sm:mt-32" />
    </section>
  );
}

/* ------ Science & Governance Section ------ */
function ScienceSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const BADGES = [
    {
      icon: CheckCircle,
      title: "Every Dose Range Sourced",
      description:
        "Linked to the clinical trial, practitioner protocol, or user report it came from.",
    },
    {
      icon: AlertTriangle,
      title: "Every Interaction Flagged",
      description:
        "Compound interactions and contraindications checked automatically before you start.",
    },
    {
      icon: ShieldCheck,
      title: "Every Risk Labeled",
      description:
        "Honest risk classification. No sugarcoating, no fear-mongering. Just the data.",
    },
  ];

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".science-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".science-header",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      const cards = gsap.utils.toArray<HTMLElement>(".science-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4 bg-grid-fine"
    >
      <div className="max-w-7xl mx-auto">
        <div className="science-header text-center mb-16 sm:mb-20">
          <p className="text-sm font-medium text-dc-cyan uppercase tracking-wider mb-3">
            Trust & Safety
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-space)] tracking-tight">
            Transparent. Evidence-Literate.{" "}
            <span className="text-dc-cyan">Not Reckless.</span>
          </h2>
          <p className="mt-5 text-dc-text-muted max-w-2xl mx-auto text-lg">
            DoseCraft uses a two-layer AI system with human-in-the-loop safety.
            Contraindication checking, interaction flagging, and evidence
            sourcing are built into every protocol recommendation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {BADGES.map((badge) => (
            <div key={badge.title} className="science-card">
              <div className="glass-card glass-card-hover p-7 sm:p-8 h-full text-center">
                <div className="p-3 rounded-xl bg-dc-cyan/10 border border-dc-cyan/20 inline-flex mb-5">
                  <badge.icon className="w-6 h-6 text-dc-cyan" />
                </div>
                <h3 className="text-lg font-semibold font-[family-name:var(--font-space)] text-dc-text mb-2">
                  {badge.title}
                </h3>
                <p className="text-dc-text-muted text-sm leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider mt-24 sm:mt-32" />
    </section>
  );
}

/* ------ Main Page ------ */
export default function HomePage() {
  return (
    <GSAPProvider>
      <Nav />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <Features />
        <div className="section-divider" />
        <Lanes />
        <div className="section-divider" />
        <StatsCounter />
        <div className="section-divider" />
        <CreatorSection />
        <ScienceSection />
        <Pricing />
        <div className="section-divider" />
        <WaitlistForm />
      </main>
      <Footer />
    </GSAPProvider>
  );
}
