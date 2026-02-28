'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

type Tab = 'login' | 'register';

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuthStore();
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        const success = await login(email, password);
        if (success) {
          router.push('/');
        } else {
          setError('Invalid email or password');
        }
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const success = await register(email, password);
        if (success) {
          router.push('/');
        } else {
          setError('Registration failed');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-dc-bg">
      <div className="w-full max-w-md glass rounded-lg p-8">
        <h1 className="text-3xl font-bold text-dc-text mb-8 text-center neon-text-accent">
          DoseCraft
        </h1>

        <div className="flex gap-4 mb-8 border-b border-dc-border">
          <button
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              tab === 'login'
                ? 'text-dc-accent border-b-2 border-dc-accent'
                : 'text-dc-text-muted hover:text-dc-text'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              tab === 'register'
                ? 'text-dc-accent border-b-2 border-dc-accent'
                : 'text-dc-text-muted hover:text-dc-text'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dc-text mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-dc-surface border border-dc-border rounded px-4 py-2 text-dc-text placeholder-dc-text-muted focus:outline-none focus:border-dc-accent transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dc-text mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-dc-surface border border-dc-border rounded px-4 py-2 text-dc-text placeholder-dc-text-muted focus:outline-none focus:border-dc-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-sm font-medium text-dc-text mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-dc-surface border border-dc-border rounded px-4 py-2 text-dc-text placeholder-dc-text-muted focus:outline-none focus:border-dc-accent transition-colors"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <div className="bg-dc-danger/10 border border-dc-danger rounded px-4 py-2 text-dc-danger text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dc-accent hover:bg-dc-accent-hover text-white font-semibold py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed glow-accent"
          >
            {loading ? 'Processing...' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
