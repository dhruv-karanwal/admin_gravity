"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Download,
  AlertCircle,
  Clock,
  Eye,
  Trash2,
  Calendar,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import KineticCard from '@/components/shared/KineticCard';
import DataTable from '@/components/shared/DataTable';
import StatusChip from '@/components/shared/StatusChip';
import LoadingShimmer from '@/components/shared/LoadingShimmer';
import EmptyState from '@/components/shared/EmptyState';
import { useAppStore } from '@/store/appStore';
import { getAllMembers, Member, deactivateMember } from '@/lib/firestore/members';
import { formatDate } from '@/lib/utils/dates';
import Link from 'next/link';

export default function MembersClient() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const { showToast } = useAppStore();

  useEffect(() => {
    async function loadMembers() {
      try {
        const data = await getAllMembers();
        setMembers(data);
      } catch (error) {
        showToast({ message: 'Failed to load members', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, [showToast]);

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.phone.includes(searchTerm);
    const matchesFilter = filter === 'all' || 
                          (filter === 'active' && m.isActive) || 
                          (filter === 'inactive' && !m.isActive);
    return matchesSearch && matchesFilter;
  });

  const columns = [
    {
      header: 'Member Name',
      accessor: (m: Member) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center font-bold text-primary group-hover:scale-105 transition-transform text-sm uppercase">
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
      header: 'Membership Plan',
      accessor: (m: Member) => (
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-on-surface-variant/50" />
          <span className="text-xs font-bold text-on-surface uppercase tracking-tight">{m.planName}</span>
        </div>
      )
    },
    {
      header: 'Expiry Date',
      accessor: (m: Member) => (
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold">{formatDate(m.planEndDate)}</p>
          <div className="w-24 h-1 bg-surface-low rounded-full overflow-hidden">
             <div className="h-full bg-secondary" style={{ width: '60%' }}></div>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (m: Member) => (
        <StatusChip status={m.isActive ? 'active' : 'inactive'} />
      )
    },
    {
      header: 'Actions',
      accessor: (m: Member) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link 
            href={`/members/${m.uid}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-low text-on-surface-variant hover:text-primary transition-all"
          >
            <Eye size={16} />
          </Link>
          <button 
            onClick={() => {/* Trigger deactivate */}}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="headline-lg tracking-tight mb-1">Members List</h1>
          <p className="text-sm text-on-surface-variant font-medium">Manage all RFC memberships and member profiles</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-surface-low rounded-xl pl-11 pr-4 text-xs font-bold border-none ring-primary/5 focus:ring-4 transition-all placeholder:text-on-surface-variant/30"
            />
          </div>

          <button className="h-12 w-12 flex items-center justify-center rounded-xl bg-surface-low hover:bg-surface-lowest transition-colors text-on-surface-variant group relative">
             <Filter size={18} />
             <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-primary rounded-full"></div>
          </button>

          <Link 
            href="/members/add"
            className="h-12 px-6 flex items-center gap-3 rounded-xl bg-primary text-white text-[11px] font-bold uppercase tracking-widest hover:bg-primary-high transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            <Plus size={16} />
            <span>Enroll New</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-1.5 rounded-2xl bg-surface-low/50 flex gap-1">
            <button 
              onClick={() => setFilter('all')}
              className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              All Members
            </button>
            <button 
              onClick={() => setFilter('active')}
              className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'active' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Active Only
            </button>
            <button 
              onClick={() => setFilter('inactive')}
              className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'inactive' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Inactive
            </button>
         </div>
      </div>

      <KineticCard className="p-1 overflow-hidden min-h-[500px]">
        <DataTable 
          data={filteredMembers}
          columns={columns}
          loading={loading}
          emptyTitle="No members found"
          emptyMessage="Try adjusting your search or enroll a new member."
        />
      </KineticCard>
    </div>
  );
}
