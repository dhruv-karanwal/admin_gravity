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
          <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center font-bold text-error group-hover:scale-105 transition-transform text-sm uppercase">
            {m.name[0]}
          </div>
          <div>
            <p className="font-bold text-on-surface line-clamp-1">{m.name}</p>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{m.phone}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Plan',
      accessor: (m: Member) => (
        <span className="text-xs font-bold text-on-surface uppercase tracking-tight">{m.planName}</span>
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
          <div className="flex flex-col gap-1">
            <p className={`text-xs font-black ${diffDays <= 3 ? 'text-error' : 'text-primary'}`}>
              In {diffDays} days ({formatDate(m.planEndDate)})
            </p>
            <div className="w-24 h-1.5 bg-surface-low rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-1000 ${diffDays <= 3 ? 'bg-error' : 'bg-primary'}`} 
                 style={{ width: `${Math.max(0, 100 - (diffDays * 5))}%` }}
               ></div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Actions',
      accessor: (m: Member) => (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="h-8 px-3 flex items-center gap-2 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider hover:bg-primary/20 transition-all"
            onClick={() => {/* Trigger notification */}}
          >
            <Bell size={12} />
            <span>Remind</span>
          </button>
          <button 
            className="h-8 px-3 flex items-center gap-2 rounded-lg bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider hover:bg-secondary/20 transition-all"
            onClick={() => {/* Trigger renewal modal */}}
          >
            <RefreshCcw size={12} />
            <span>Renew</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Clock size={20} className="text-error" />
             <h1 className="headline-lg tracking-tight">Expiring Soon</h1>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">Memberships ending in the next {daysLimit} days</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-surface-low rounded-xl pl-11 pr-4 text-xs font-bold border-none ring-primary/5 focus:ring-4 transition-all placeholder:text-on-surface-variant/30"
            />
          </div>

          <select 
            value={daysLimit}
            onChange={(e) => setDaysLimit(Number(e.target.value))}
            className="h-12 px-4 bg-surface-low rounded-xl text-xs font-bold border-none focus:ring-4 ring-primary/5 transition-all text-on-surface"
          >
            <option value={7}>Next 7 days</option>
            <option value={15}>Next 15 days</option>
            <option value={30}>Next 30 days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <KineticCard className="p-6 bg-error/5 border-error/10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-error/20 flex items-center justify-center text-error shadow-lg shadow-error/10">
                  <AlertCircle size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-error/60 mb-0.5">Critical Expiry</p>
                  <p className="text-2xl font-black text-on-surface">{members.filter(m => {
                    const diff = m.planEndDate.toDate().getTime() - new Date().getTime();
                    return diff / (1000 * 60 * 60 * 24) <= 3;
                  }).length}</p>
               </div>
            </div>
         </KineticCard>
      </div>

      <KineticCard className="p-1 overflow-hidden min-h-[500px]">
        <DataTable 
          data={filteredMembers}
          columns={columns}
          loading={loading}
          emptyTitle="No expiring memberships"
          emptyMessage={`Hurray! No memberships are expiring within the next ${daysLimit} days.`}
        />
      </KineticCard>
    </div>
  );
}
