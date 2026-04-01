"use client";

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Search, 
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  RefreshCcw,
  Bell
} from 'lucide-react';
import KineticCard from '@/components/shared/KineticCard';
import DataTable from '@/components/shared/DataTable';
import StatusChip from '@/components/shared/StatusChip';
import { useAppStore } from '@/store/appStore';
import { getExpiringMembers, Member } from '@/lib/firestore/members';
import { formatDate } from '@/lib/utils/dates';
import Link from 'next/link';

export default function ExpiringSoonPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [daysLimit, setDaysLimit] = useState(15);
  const { showToast } = useAppStore();

  useEffect(() => {
    async function loadExpiring() {
      setLoading(true);
      try {
        const data = await getExpiringMembers(daysLimit);
        setMembers(data);
      } catch (error) {
        showToast({ message: 'Failed to load expiring members', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
    loadExpiring();
  }, [showToast, daysLimit]);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.phone.includes(searchTerm)
  );

  const columns = [
    {
      header: 'Member',
      accessor: (m: Member) => (
        <div className="flex items-center gap-3">
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #af000b, #d81b1b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontFamily: 'var(--font-plus-jakarta)',
            fontWeight: 700, fontSize: '0.875rem'
          }}>
            {m.name[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm text-[#1b1c1c] line-clamp-1">{m.name}</p>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{m.phone}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Plan',
      accessor: (m: Member) => (
        <span className="text-xs font-bold text-[#1b1c1c] uppercase tracking-tight">{m.planName}</span>
      )
    },
    {
      header: 'Expiry Date',
      accessor: (m: Member) => {
        const today = new Date();
        const expiry = m.planEndDate.toDate();
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Clock size={12} className={diffDays <= 3 ? 'text-error' : 'text-primary'} />
              <p className={`text-xs font-bold ${diffDays <= 3 ? 'text-error animate-pulse' : 'text-primary'}`}>
                In {diffDays} days
              </p>
            </div>
            <p className="text-[10px] font-medium text-on-surface-variant uppercase">{formatDate(m.planEndDate)}</p>
            <div className="w-28 h-1 bg-[#f5f3f3] rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-1000 ${diffDays <= 3 ? 'bg-error' : 'bg-primary'}`} 
                 style={{ width: `${Math.max(0, Math.min(100, 100 - (diffDays * 3)))}%` }}
               ></div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Actions',
      accessor: (m: Member) => (
        <div className="flex items-center gap-2">
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
            title="Send Membership Reminder"
          >
            <Bell size={14} />
          </button>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary/5 text-secondary hover:bg-secondary hover:text-white transition-all shadow-sm"
            title="Renew Plan"
          >
            <RefreshCcw size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Clock size={20} />
             </div>
             <h1 className="text-2xl font-bold">Expiring Soon</h1>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">Memberships ending in the next {daysLimit} days</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 group">
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5d3f3c' }} />
            <input 
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 bg-white border border-[#e7bdb7]/30 rounded-lg pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          <select 
            value={daysLimit}
            onChange={(e) => setDaysLimit(Number(e.target.value))}
            className="h-11 px-4 bg-white border border-[#e7bdb7]/30 rounded-lg text-xs font-bold focus:ring-2 focus:ring-primary/10 transition-all text-on-surface outline-none"
          >
            <option value={7}>Next 7 days</option>
            <option value={15}>Next 15 days</option>
            <option value={30}>Next 30 days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         <div className="p-5 bg-white rounded-xl border border-[#e7bdb7]/20 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center text-error border border-error/5">
                <AlertCircle size={22} />
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#5d3f3c] mb-0.5 opacity-60">Critical (3 Days)</p>
                <p className="text-2xl font-black text-on-surface">{members.filter(m => {
                  const diff = m.planEndDate.toDate().getTime() - new Date().getTime();
                  return diff / (1000 * 60 * 60 * 24) <= 3;
                }).length}</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden min-h-[500px]">
        <DataTable 
          data={filteredMembers}
          columns={columns}
          loading={loading}
          emptyTitle="No expiring memberships"
          emptyMessage={`Hurray! No memberships are expiring within the next ${daysLimit} days.`}
        />
      </div>
    </div>

  );
}
