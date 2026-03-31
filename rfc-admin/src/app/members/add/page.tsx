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
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/members"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-low hover:bg-surface-lowest text-on-surface-variant transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="headline-lg tracking-tight mb-1">Enroll New Member</h1>
          <p className="text-sm text-on-surface-variant font-medium">Create a new membership profile for RFC</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <KineticCard className="p-8 space-y-6 bg-[radial-gradient(circle_at_top_left,_var(--primary-low),_transparent_40%)]">
            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">Personal Identity</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Johnathan Doe"
                  className="w-full bg-surface-low border-2 border-transparent focus:border-primary/20 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                <input 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+91 98765 43210"
                  className="w-full bg-surface-low border-2 border-transparent focus:border-primary/20 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Email Address (Optional)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                  className="w-full bg-surface-low border-2 border-transparent focus:border-primary/20 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium transition-all outline-none"
                />
              </div>
            </div>
          </KineticCard>

          <KineticCard className="p-8 space-y-6">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-2">Fitness Goal</h3>
            <div className="grid grid-cols-2 gap-3">
              {goals.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setFormData({...formData, goal: g.id})}
                  className={`
                    p-4 rounded-2xl text-left transition-all relative overflow-hidden group
                    ${formData.goal === g.id ? 'bg-primary/10 border-primary/20 ring-1 ring-primary/20' : 'bg-surface-low hover:bg-surface-lowest'}
                  `}
                >
                  <span className="text-xl mb-2 block">{g.icon}</span>
                  <span className={`text-[11px] font-bold uppercase tracking-widest ${formData.goal === g.id ? 'text-primary' : 'text-on-surface-variant'}`}>{g.label}</span>
                  {formData.goal === g.id && (
                    <div className="absolute top-2 right-2 text-primary">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <h3 className="text-xs font-bold text-tertiary uppercase tracking-[0.2em] mt-8 mb-2">Subscription Tier</h3>
            <div className="space-y-3">
              {plans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFormData({...formData, planName: p.id})}
                  className={`
                    w-full p-4 rounded-2xl flex items-center justify-between transition-all
                    ${formData.planName === p.id ? 'bg-secondary/10 ring-1 ring-secondary/20' : 'bg-surface-low hover:bg-surface-lowest'}
                  `}
                >
                  <span className={`text-xs font-bold ${formData.planName === p.id ? 'text-secondary' : 'text-on-surface'}`}>{p.label}</span>
                  {formData.planName === p.id && <CheckCircle2 size={16} className="text-secondary" />}
                </button>
              ))}
            </div>
          </KineticCard>
        </div>

        <div className="flex justify-end pt-4 pb-12">
          <button 
            type="submit"
            disabled={loading}
            className="h-16 px-12 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] hover:bg-primary-high transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-primary/30 flex items-center gap-4 group"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <Save size={20} className="group-hover:scale-110 transition-transform" />
                <span>Confirm Enrollment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
