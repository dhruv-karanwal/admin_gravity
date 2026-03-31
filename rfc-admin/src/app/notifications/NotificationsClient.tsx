"use client";

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Users, 
  User, 
  MessageSquare, 
  Bell, 
  History,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  Filter
} from 'lucide-react';
import KineticCard from '@/components/shared/KineticCard';
import StatusChip from '@/components/shared/StatusChip';
import EmptyState from '@/components/shared/EmptyState';
import DataTable from '@/components/shared/DataTable';
import { useAppStore } from '@/store/appStore';
import { getAllMembers, Member } from '@/lib/firestore/members';

export default function NotificationsClient() {
  const { showToast } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [target, setTarget] = useState<'topic' | 'single'>('topic');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    async function loadMembers() {
      const data = await getAllMembers();
      setMembers(data);
    }
    loadMembers();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationTitle || !notificationMessage) {
      showToast({ message: 'Please fill in title and message', type: 'error' });
      return;
    }

    if (target === 'single' && !selectedMember) {
        showToast({ message: 'Please select a member', type: 'error' });
        return;
    }

    setLoading(true);
    try {
        const res = await fetch('/api/send-notification', {
            method: 'POST',
            body: JSON.stringify({
                title: notificationTitle,
                message: notificationMessage,
                target: target,
                token: selectedMember?.fcmToken || null
            })
        });

        const data = await res.json();
        if (data.success) {
            showToast({ message: 'Notification broadcasted successfully', type: 'success' });
            setNotificationTitle('');
            setNotificationMessage('');
            setSelectedMember(null);
        } else {
            showToast({ message: data.error || 'Failed to send notification', type: 'error' });
        }
    } catch (error) {
        showToast({ message: 'System error during broadcast', type: 'error' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="headline-lg tracking-tight mb-1">Push Notifications</h1>
          <p className="text-sm text-on-surface-variant font-medium">Broadcast updates, alerts, and offers to member devices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <KineticCard className="lg:col-span-2 p-8 space-y-8">
          <form onSubmit={handleSend} className="space-y-6">
            <div className="space-y-4">
               <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Audience Target</label>
               <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setTarget('topic')}
                    className={`flex-1 p-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${target === 'topic' ? 'bg-primary/10 border-primary/20 ring-1 ring-primary/20 text-primary' : 'bg-surface-low hover:bg-surface-lowest text-on-surface-variant'}`}
                  >
                    <Users size={18} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Broadcast All</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setTarget('single')}
                    className={`flex-1 p-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${target === 'single' ? 'bg-secondary/10 border-secondary/20 ring-1 ring-secondary/20 text-secondary' : 'bg-surface-low hover:bg-surface-lowest text-on-surface-variant'}`}
                  >
                    <User size={18} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Single Member</span>
                  </button>
               </div>
            </div>

            {target === 'single' && (
              <div className="space-y-2 animate-in slide-in-from-top-2">
                 <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Search Member</label>
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                    <select 
                      value={selectedMember?.uid || ''}
                      onChange={(e) => setSelectedMember(members.find(m => m.uid === e.target.value) || null)}
                      className="w-full bg-surface-low border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium transition-all outline-none appearance-none"
                    >
                      <option value="">Select a member...</option>
                      {members.map(m => (
                        <option key={m.uid} value={m.uid}>{m.name} ({m.phone})</option>
                      ))}
                    </select>
                 </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Message Title</label>
              <input 
                type="text"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                placeholder="RFC Special Offer • 20% Off Renewals"
                className="w-full bg-surface-low border-2 border-transparent focus:border-primary/20 rounded-2xl py-4 px-4 text-sm font-medium transition-all outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Content Body</label>
              <textarea 
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                rows={4}
                placeholder="Write your broadcast message here..."
                className="w-full bg-surface-low border-2 border-transparent focus:border-primary/20 rounded-2xl py-4 px-4 text-sm font-medium transition-all outline-none resize-none"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] hover:bg-primary-high transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <Send size={18} className="-rotate-12" />
                  <span>Execute Broadcast</span>
                </>
              )}
            </button>
          </form>
        </KineticCard>

        <div className="space-y-6">
          <KineticCard className="p-6">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-4">Device Statistics</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-on-surface-variant">Authenticated Devices</span>
                  <span className="text-sm font-bold">{members.filter(m => m.fcmToken).length}</span>
               </div>
               <div className="w-full h-1 bg-surface-low rounded-full overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: '85%' }}></div>
               </div>
               <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed">System has identified 85% of members with active app licenses.</p>
            </div>
          </KineticCard>

          <KineticCard className="p-6">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-4">Notification Guidelines</h3>
            <ul className="space-y-3">
               {[
                 "Avoid excessive broadcasting (max 1/day)",
                 "Use clear, actionable call-to-actions",
                 "Messages are delivered instantly to devices",
                 "System logs all sent notifications for audit"
               ].map((item, i) => (
                 <li key={i} className="flex gap-2 text-[11px] text-on-surface-variant font-medium">
                    <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0"></div>
                    {item}
                 </li>
               ))}
            </ul>
          </KineticCard>
        </div>
      </div>
    </div>
  );
}
