"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Loader2, AlertCircle, Users } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isValidEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

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
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  return (
    <section id="waitlist" className="relative py-24 sm:py-32 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-dc-orange/[0.06] rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium text-dc-orange uppercase tracking-wider mb-3">
            Early Access
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-space)] tracking-tight">
            Get Early Access
          </h2>
          <p className="mt-5 text-dc-text-muted text-lg max-w-lg mx-auto">
            Be the first to run protocols with DoseCraft.
            Early members get founder pricing and direct input on the roadmap.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10"
        >
          {state === "success" ? (
            <div className="glass-card p-8 glow-green">
              <CheckCircle className="w-10 h-10 text-dc-green mx-auto mb-4" />
              <h3 className="text-xl font-bold font-[family-name:var(--font-space)] text-dc-text mb-2">
                You&apos;re on the list.
              </h3>
              <p className="text-dc-text-muted">
                We&apos;ll reach out when it&apos;s your turn. Welcome to the lab.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8">
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
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 flex items-center justify-center gap-2 text-dc-text-muted text-sm"
        >
          <Users className="w-4 h-4" />
          <span>Join 2,000+ biohackers waiting for DoseCraft</span>
        </motion.div>
      </div>
    </section>
  );
}
