import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import {
  ShieldCheck,
  CheckCircle2,
  Mail,
  Lock,
  ArrowRight,
  Sun,
  Moon,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

export const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const endpoint = isSignUp ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Hydrate Supabase client session if session returned
      if (data.session) {
        await supabase.auth.setSession(data.session);
      }

      if (isSignUp) {
        setSuccessMsg('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center font-sans relative overflow-hidden transition-colors duration-300 ${theme === 'dark'
      ? 'bg-[#0b0f19] text-white animated-bg-dark'
      : 'bg-background text-on-background animated-bg'
      }`}>
      {/* Decorative Elements (Glassmorphism blobs) */}
      <div className={`absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none transition-opacity duration-300 ${theme === 'dark' ? 'bg-indigo-600/30 opacity-60' : 'bg-primary-fixed-dim opacity-40'
        }`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none transition-opacity duration-300 ${theme === 'dark' ? 'bg-blue-600/30 opacity-60' : 'bg-secondary-container opacity-40'
        }`} />

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Inverted / Dark'} mode`}
          className="p-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700/60 backdrop-blur-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-all text-gray-700 dark:text-white flex items-center justify-center shadow-sm cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600" />
          )}
        </button>
      </div>

      {/* Main Login Card */}
      <main className="w-full max-w-[440px] px-4 relative z-10 my-8">
        <div className="bg-surface-container-lowest dark:bg-[#131927]/90 dark:border-slate-800/90 rounded-2xl shadow-xl border border-surface-variant backdrop-blur-xl p-8 flex flex-col items-center transition-colors duration-300">

          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-6 w-full">
            <div className="w-16 h-16 bg-primary-container text-on-primary-container dark:bg-indigo-600 dark:text-white rounded-xl flex items-center justify-center shadow-md mb-4 transition-colors">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <h1 className="text-2xl font-bold text-on-surface dark:text-white mb-1 text-center flex items-center justify-center gap-1.5 tracking-tight">
              Permit Tracker <CheckCircle2 className="w-5 h-5 text-primary dark:text-emerald-400" />
            </h1>
            <p className="text-sm text-on-surface-variant dark:text-slate-400 text-center">
              {isSignUp ? 'Create your account to manage permits' : 'Sign in to access your permits'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex w-full bg-surface-container dark:bg-slate-900/80 rounded-xl p-1 mb-6 relative border border-surface-variant/50 dark:border-slate-800">
            {/* Active background slider */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-surface-container-lowest dark:bg-indigo-600 rounded-lg shadow-sm z-0 transition-all duration-200 ${isSignUp ? 'left-[calc(50%+2px)]' : 'left-1'
                }`}
            />
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-xs uppercase tracking-wider font-semibold relative z-10 transition-colors text-center ${!isSignUp
                ? 'text-primary dark:text-white font-bold'
                : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white'
                }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-xs uppercase tracking-wider font-semibold relative z-10 transition-colors text-center ${isSignUp
                ? 'text-primary dark:text-white font-bold'
                : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white'
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="w-full mb-5 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-rose-600 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="w-full mb-5 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-2.5 text-emerald-600 dark:text-emerald-300 text-xs">
              <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="w-full flex flex-col gap-4">
            {/* Email Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider" htmlFor="email">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-5 h-5 absolute left-3 text-on-surface-variant dark:text-slate-500 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-lowest dark:bg-slate-950/80 border border-outline-variant dark:border-slate-800 rounded-xl pl-10 pr-4 h-11 text-sm text-on-surface dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-5 h-5 absolute left-3 text-on-surface-variant dark:text-slate-500 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-lowest dark:bg-slate-950/80 border border-outline-variant dark:border-slate-800 rounded-xl pl-10 pr-4 h-11 text-sm text-on-surface dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-primary dark:bg-indigo-600 text-on-primary dark:text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-tint dark:hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Text */}
          <div className="mt-6 pt-5 border-t border-surface-variant dark:border-slate-800 w-full text-center">
            <p className="text-[11px] text-on-surface-variant dark:text-slate-500">
              Powered by Permit Tracker Auth Service
            </p>
          </div>
        </div>
      </main>

      {/* Abstract Background Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div
          className="bg-cover bg-center w-full h-full grayscale"
          style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAi6bZCu-2ESqXD1zkIFYFPyXv0vqpbY2-lEx_d_mJRA_HcbFKQe3A9XOGy-VG7WOE5oRhlTEbxnuwno0gVPNhLBBq4Gmh6eEHRIuJxGkKrX-684CaCLgGpUCB1NXNuPPrKSvT8S46GUsmZRwGkTueK5HbX8bWHsQsyxtiONd4LVgZXjO2zP79HU8j_r-Z8qYAR46QBKt2lagKLlwcCYwKLJxQ_P9AOHf72WjLcl1W39hjcvqJMelB-_Q')` }}
        />
      </div>
    </div>
  );
};
