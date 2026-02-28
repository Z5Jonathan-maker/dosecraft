'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FlaskConical, Shield, TrendingUp, Layers, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import clsx from 'clsx';

type Tab = 'login' | 'register';

const FEATURES = [
  {
    icon: FlaskConical,
    title: "Three-Lane Evidence",
    desc: "Clinical, Expert, and Experimental lanes for every compound",
    color: "#00d4ff",
  },
  {
    icon: Layers,
    title: "Protocol Builder",
    desc: "AI-powered stack design with interaction checking",
    color: "#ff6b35",
  },
  {
    icon: TrendingUp,
    title: "Outcome Analytics",
    desc: "Track sleep, recovery, and biomarkers vs. your protocols",
    color: "#b366ff",
  },
  {
    icon: Shield,
    title: "Evidence-Based",
    desc: "Every compound backed by sourced research — not anecdote",
    color: "#00ff88",
  },
] as const;

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuthStore();
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        const success = await login(email, password);
        if (success) { router.push('/'); }
        else { setError('Invalid email or password. Check your credentials and try again.'); }
      } else {
        if (password !== confirmPassword) { setError('Passwords do not match.'); setLoading(false); return; }
        if (password.length < 8) { setError('Password must be at least 8 characters.'); setLoading(false); return; }
        const success = await register(email, password);
        if (success) { router.push('/'); }
        else { setError('Registration failed. This email may already be in use.'); }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-dc-bg">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 20% 40%, rgba(0,212,255,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 80%, rgba(179,102,255,0.07) 0%, transparent 60%), #0a0a0f",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(255,107,53,0.22) 0%, rgba(179,102,255,0.12) 100%)" }}
            >
              <FlaskConical className="w-5 h-5 text-dc-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-dc-text leading-none">
                Dose<span className="text-dc-accent">Craft</span>
              </h1>
              <p className="text-[10px] text-dc-text-faint uppercase tracking-[0.2em] mt-0.5">Protocol Lab</p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-bold text-dc-text leading-tight mb-4">
              Precision peptide<br />
              <span className="gradient-text-multi">protocol design.</span>
            </h2>
            <p className="text-dc-text-muted text-base leading-relaxed max-w-md">
              Build evidence-based biohacking stacks with three-lane research, AI-powered
              dose optimization, and outcome tracking that actually works.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-4 rounded-xl border"
                  style={{ borderColor: `${f.color}20`, background: `${f.color}08` }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ background: `${f.color}18` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: f.color }} />
                  </div>
                  <h4 className="text-xs font-semibold text-dc-text mb-1">{f.title}</h4>
                  <p className="text-[10px] text-dc-text-muted leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            {[
              { label: "Clinical", color: "#00d4ff" },
              { label: "Expert", color: "#ff6b35" },
              { label: "Experimental", color: "#b366ff" },
            ].map((lane) => (
              <span
                key={lane.label}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-medium"
                style={{ color: lane.color, borderColor: `${lane.color}30`, background: `${lane.color}10` }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: lane.color, boxShadow: `0 0 6px ${lane.color}` }} />
                {lane.label}
              </span>
            ))}
          </div>
          <p className="text-xs text-dc-text-faint">Not medical advice. Educational and research purposes only.</p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <FlaskConical className="w-6 h-6 text-dc-accent" />
            <span className="text-xl font-bold text-dc-text">Dose<span className="text-dc-accent">Craft</span></span>
          </div>

          <div className="glass rounded-2xl p-8 glow-accent">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-dc-text">
                {tab === 'login' ? 'Welcome back' : 'Create account'}
              </h3>
              <p className="text-sm text-dc-text-muted mt-1">
                {tab === 'login'
                  ? 'Sign in to access your protocol lab.'
                  : 'Start your evidence-based biohacking journey.'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-dc-surface rounded-xl mb-6">
              {(['login', 'register'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(''); }}
                  className={clsx(
                    "flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    tab === t ? "bg-dc-surface-alt text-dc-text shadow-sm" : "text-dc-text-muted hover:text-dc-text",
                  )}
                >
                  {t === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all"
                    placeholder="••••••••"
                    autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dc-text-muted hover:text-dc-text transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {tab === 'register' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Confirm password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2.5 bg-dc-danger/8 border border-dc-danger/25 rounded-xl px-4 py-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-dc-danger mt-1.5 flex-shrink-0" />
                  <p className="text-sm text-dc-danger">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
                style={{
                  background: "linear-gradient(135deg, #ff6b35 0%, #ff8a55 100%)",
                  boxShadow: "0 4px 20px rgba(255,107,53,0.3)",
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {tab === 'login' ? 'Sign In' : 'Create Account'}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-dc-border text-center">
              <p className="text-[11px] text-dc-text-muted leading-relaxed">
                By continuing, you confirm this platform is{" "}
                <span className="text-dc-accent font-medium">not medical advice</span>.
                Consult a physician before using any peptide compounds.
              </p>
              <Link
                href="/"
                className="mt-3 inline-flex items-center gap-1 text-xs text-dc-text-muted hover:text-dc-accent transition-colors"
              >
                Back to landing page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
