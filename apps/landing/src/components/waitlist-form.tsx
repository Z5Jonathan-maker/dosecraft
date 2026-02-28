"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, Loader2, Users, Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function WaitlistForm() {
  const ref = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".waitlist-inner",
        { opacity: 0, y: 50, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: "power4.out",
          scrollTrigger: { trigger: ".waitlist-inner", start: "top 82%" },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      setState("success");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <section id="waitlist" ref={ref} className="relative py-28 sm:py-36 px-4 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,107,53,0.07) 0%, rgba(179,102,255,0.04) 40%, transparent 70%)",
        }}
      />

      <div className="max-w-3xl mx-auto relative">
        <div className="waitlist-inner text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.22)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-dc-orange animate-pulse" />
            <span className="text-xs font-semibold text-dc-orange tracking-wide uppercase">
              Early Access — Limited Spots
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-space)] tracking-tight leading-tight">
            Join the{" "}
            <span className="text-gradient-hero">Protocol Lab</span>
          </h2>

          <p className="mt-6 text-lg text-dc-text-muted max-w-xl mx-auto leading-relaxed">
            Get early access to DoseCraft. First access to the AI Protocol Engine, three-lane evidence system, and creator marketplace.
          </p>

          {/* Social proof */}
          <div className="mt-7 flex items-center justify-center gap-5 flex-wrap text-sm text-dc-text-muted">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-dc-orange/60" />
              <span><strong className="text-dc-text">2,000+</strong> already joined</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-dc-border" />
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 text-dc-orange fill-dc-orange" />
              ))}
              <span className="ml-1"><strong className="text-dc-text">4.9/5</strong> from beta</span>
            </div>
          </div>

          {/* Form / Success state */}
          <div className="mt-10">
            <AnimatePresence mode="wait">
              {state === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-4 py-10"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,255,136,0.12)", border: "2px solid rgba(0,255,136,0.3)" }}
                  >
                    <CheckCircle className="w-8 h-8 text-dc-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-[family-name:var(--font-space)] text-dc-text">
                      You&apos;re on the list!
                    </h3>
                    <p className="mt-2 text-sm text-dc-text-muted">
                      We&apos;ll email you when DoseCraft opens. Welcome to the lab.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={state === "loading"}
                    className="flex-1 px-5 py-3.5 rounded-xl text-sm text-dc-text placeholder:text-dc-text-muted/50 outline-none transition-all disabled:opacity-60"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(255,107,53,0.4)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                  <button
                    type="submit"
                    disabled={state === "loading" || !email.trim()}
                    className="btn-primary px-7 py-3.5 inline-flex items-center justify-center gap-2 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed group"
                  >
                    {state === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        Join Waitlist
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {state === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-sm text-red-400 text-center"
              >
                {errorMsg}
              </motion.p>
            )}

            {state !== "success" && (
              <p className="mt-4 text-xs text-dc-text-muted/60">
                No spam. Unsubscribe anytime. We hate spam too.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
