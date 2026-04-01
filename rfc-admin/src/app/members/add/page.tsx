"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Phone, 
  Mail, 
  Target, 
  CreditCard, 
  Calendar,
  ChevronLeft,
  Save,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import KineticCard from '@/components/shared/KineticCard';
import { useAppStore } from '@/store/appStore';
import { addMember } from '@/lib/firestore/members';
import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';

const goals = [
  { id: 'weight_loss', label: 'Weight Loss', icon: '🔥' },
  { id: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
  { id: 'endurance', label: 'Endurance', icon: '🏃' },
  { id: 'general', label: 'General Fitness', icon: '✨' },
];

const plans = [
  { id: 'Monthly', label: 'Monthly (₹1,500)', months: 1 },
  { id: 'Quarterly', label: 'Quarterly (₹4,000)', months: 3 },
  { id: 'Half-yearly', label: 'Half-yearly (₹7,500)', months: 6 },
  { id: 'Annual', label: 'Annual (₹12,000)', months: 12 },
];

export default function AddMemberPage() {
  const router = useRouter();
  const { showToast } = useAppStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    goal: 'general',
    planName: 'Monthly',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast({ message: 'Name and Phone are required', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const plan = plans.find(p => p.id === formData.planName);
      const months = plan?.months || 1;
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(startDate.getMonth() + months);

      await addMember({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        goal: formData.goal as any,
        planName: formData.planName as any,
        planStartDate: Timestamp.fromDate(startDate),
        planEndDate: Timestamp.fromDate(endDate),
        isActive: true,
      });

      showToast({ message: 'Member enrolled successfully!', type: 'success' });
      router.push('/members');
    } catch (error) {
      showToast({ message: 'Enrollment failed. Try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-5 mb-10">
        <Link 
          href="/members"
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-[#e7bdb7]/20 text-on-surface-variant hover:bg-[#f5f3f3] transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <div className="flex items-center gap-3 mb-0.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <User size={20} />
            </div>
            <h1 className="text-2xl font-bold">Enroll New Member</h1>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">Create a new membership profile for RFC</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl p-8 border border-[#e7bdb7]/20 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full"></div>
              Personal Identity
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#5d3f3c] uppercase tracking-widest ml-1 opacity-70">Full Name</label>
                <div className="relative group">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5d3f3c]/40 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Dhruv Karanwal"
                    className="w-full bg-[#f5f3f3] border-none focus:ring-2 focus:ring-primary/10 rounded-xl py-3.5 pl-11 pr-4 text-sm font-semibold transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#5d3f3c] uppercase tracking-widest ml-1 opacity-70">Phone Number</label>
                <div className="relative group">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5d3f3c]/40 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 00000 00000"
                    className="w-full bg-[#f5f3f3] border-none focus:ring-2 focus:ring-primary/10 rounded-xl py-3.5 pl-11 pr-4 text-sm font-semibold transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-[#5d3f3c] uppercase tracking-widest ml-1 opacity-70">Email Address (Optional)</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5d3f3c]/40 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@email.com"
                    className="w-full bg-[#f5f3f3] border-none focus:ring-2 focus:ring-primary/10 rounded-xl py-3.5 pl-11 pr-4 text-sm font-semibold transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-[#e7bdb7]/20 shadow-sm">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <div className="w-1 h-4 bg-secondary rounded-full"></div>
              Fitness Objective
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {goals.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setFormData({...formData, goal: g.id})}
                  className={`
                    p-5 rounded-2xl text-center transition-all relative border border-transparent
                    ${formData.goal === g.id 
                      ? 'bg-primary/5 border-primary/10 shadow-inner' 
                      : 'bg-[#f5f3f3] hover:bg-white hover:border-[#e7bdb7]/30'}
                  `}
                >
                  <span className="text-2xl mb-2 block">{g.icon}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${formData.goal === g.id ? 'text-primary' : 'text-[#5d3f3c]/60'}`}>
                    {g.label}
                  </span>
                  {formData.goal === g.id && (
                    <div className="absolute top-2 right-2 text-primary">
                      <CheckCircle2 size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-8 border border-[#e7bdb7]/20 shadow-sm">
            <h3 className="text-xs font-bold text-tertiary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <div className="w-1 h-4 bg-tertiary rounded-full"></div>
              Plan Selection
            </h3>
            <div className="space-y-3">
              {plans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFormData({...formData, planName: p.id})}
                  className={`
                    w-full p-4 rounded-xl flex items-center justify-between border-2 transition-all
                    ${formData.planName === p.id 
                      ? 'bg-white border-secondary shadow-md' 
                      : 'bg-[#f5f3f3] border-transparent hover:border-[#e7bdb7]/30'}
                  `}
                >
                  <span className={`text-xs font-bold ${formData.planName === p.id ? 'text-secondary' : 'text-[#1b1c1c]'}`}>
                    {p.label}
                  </span>
                  {formData.planName === p.id && <CheckCircle2 size={16} className="text-secondary" />}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:translate-y-[-2px] active:translate-y-[0px] transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                <Save size={18} className="group-hover:scale-110 transition-transform" />
                <span>Confirm enrollment</span>
              </>
            )}
          </button>
          
          <div className="p-5 rounded-2xl bg-[#5d3f3c]/5 border border-[#5d3f3c]/10">
            <div className="flex gap-3">
              <div className="mt-1"><CreditCard size={16} className="text-[#5d3f3c]/40" /></div>
              <p className="text-[10px] font-medium text-[#5d3f3c]/70 leading-relaxed uppercase tracking-widest">
                Payment confirmation will be processed after enrollment is recorded.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>

  );
}
