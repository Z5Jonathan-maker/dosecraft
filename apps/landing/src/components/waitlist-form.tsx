"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  CheckCircle,
  Loader2,
  AlertCircle,
  Users,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type FormState = "idle" | "loading" | "success" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const isValidEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".waitlist-content",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* Success pulse animation */
  useEffect(() => {
    if (state === "success" && successRef.current) {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      gsap.fromTo(
        successRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        }
      );

      /* Pulse ring effect */
      const ring = successRef.current.querySelector(".success-ring");
      if (ring) {
        gsap.fromTo(
          ring,
          { scale: 0.5, opacity: 1 },
          {
            scale: 2.5,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
          }
        );
      }
    }
  }, [state]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Email is required.");
      setState("error");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      setState("error");
      return;
    }

    setState("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setState("success");
      setEmail("");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setState("error");
    }
  }

  return (
    <section
      id="waitlist"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4 aurora-bg"
    >
      {/* Additional aurora glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-dc-orange/[0.06] rounded-full blur-[180px]" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-dc-cyan/[0.04] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-dc-purple/[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="waitlist-content relative z-10 max-w-2xl mx-auto text-center">
        <p className="text-sm font-medium text-dc-orange uppercase tracking-wider mb-3">
          Early Access
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-space)] tracking-tight">
          Get Early Access
        </h2>
        <p className="mt-5 text-dc-text-muted text-lg max-w-lg mx-auto">
          Be the first to run protocols with DoseCraft. Early members get
          founder pricing and direct input on the roadmap.
        </p>

        <div className="mt-10">
          {state === "success" ? (
            <div
              ref={successRef}
              className="glass-card p-8 glow-green relative overflow-hidden"
            >
              {/* Pulse ring */}
              <div className="success-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-dc-green/50 pointer-events-none" />

              <CheckCircle className="w-10 h-10 text-dc-green mx-auto mb-4" />
              <h3 className="text-xl font-bold font-[family-name:var(--font-space)] text-dc-text mb-2">
                You&apos;re on the list.
              </h3>
              <p className="text-dc-text-muted">
                We&apos;ll reach out when it&apos;s your turn. Welcome to the
                lab.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="glass-card p-6 sm:p-8 relative"
              style={{ transform: "translateZ(20px)" }}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (state === "error") setState("idle");
                    }}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-dc-surface-2 border border-dc-border/50 text-dc-text placeholder:text-dc-text-muted/50 focus:outline-none focus:border-dc-orange/50 focus:ring-1 focus:ring-dc-orange/30 transition-all text-sm"
                    disabled={state === "loading"}
                    autoComplete="email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="btn-primary text-sm px-6 py-3.5 inline-flex items-center justify-center gap-2 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {state === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Join the Waitlist
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {state === "error" && errorMsg && (
                <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Social proof */}
        <div className="mt-6 flex items-center justify-center gap-2 text-dc-text-muted text-sm">
          <Users className="w-4 h-4" />
          <span>Join 2,000+ biohackers waiting for DoseCraft</span>
        </div>
      </div>
    </section>
  );
}
