"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAppStore } from '@/store/appStore';
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import KineticCard from '@/components/shared/KineticCard';

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const { showToast } = useAppStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast({ message: 'Please fill in all fields', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast({ message: 'Welcome back, Admin', type: 'success' });
      router.push('/dashboard');
    } catch (error: any) {
      showToast({ message: error.message || 'Login failed. Check credentials.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-surface flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--primary-low),_transparent_50%),_radial-gradient(circle_at_bottom_left,_var(--surface-low),_transparent_50%)]">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-surface-low rounded-2xl border border-outline-variant/30 flex items-center justify-center mx-auto mb-6 shadow-2xl relative group">
            <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <LogIn className="text-primary relative z-10" size={32} />
          </div>
          <h1 className="headline-lg mb-2 tracking-tight">Regent Fitness Club</h1>
          <p className="text-sm text-on-surface-variant font-medium tracking-wide uppercase">Admin Console System</p>
        </div>

        <KineticCard className="p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@regentfitness.com"
                  className="w-full bg-surface-lowest border-2 border-transparent focus:border-primary/20 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-lowest border-2 border-transparent focus:border-primary/20 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium transition-all outline-none"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] hover:bg-primary-high transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Authenticate"}
            </button>
          </form>
        </KineticCard>

        <p className="text-center mt-12 text-[11px] text-on-surface-variant/50 font-bold uppercase tracking-[0.3em]">
          Powered by Kinetic Editorial v1.0
        </p>
      </div>
    </div>
  );
}
