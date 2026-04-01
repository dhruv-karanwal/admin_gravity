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
  XCircle,
  RefreshCcw,
  Pen
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
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #af000b, #d81b1b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontFamily: 'var(--font-plus-jakarta)',
            fontWeight: 700, fontSize: '1rem', flexShrink: 0
          }}>
            {m.name[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm text-[#1b1c1c]">{m.name}</p>
            <p className="text-xs text-[#5d3f3c] mt-0.5">{m.phone}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Membership Plan',
      accessor: (m: Member) => (
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-[#5d3f3c]" />
          <span className="text-xs font-medium text-[#1b1c1c]">{m.planName}</span>
        </div>
      )
    },
    {
      header: 'Expiry Date',
      accessor: (m: Member) => (
        <p className="text-sm font-medium text-[#1b1c1c]">
          {formatDate(m.planEndDate)}
        </p>
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
        <div className="flex items-center gap-2">
          <button title="View Profile" style={{ background: 'none', border: 'none', color: '#5d3f3c', cursor: 'pointer', padding: '4px' }}>
            <Eye size={15} />
          </button>
          <button title="Edit" style={{ background: 'none', border: 'none', color: '#5d3f3c', cursor: 'pointer', padding: '4px' }}>
            {/* Using Lucide Pencil icon if imported, or Pen */}
             <div className="w-4 h-4 flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
             </div>
          </button>
          <button title="Renew" style={{ background: 'none', border: 'none', color: '#af000b', cursor: 'pointer', padding: '4px' }}>
             <RefreshCcw size={15} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Members List</h1>
          <p className="text-sm text-on-surface-variant font-medium">Manage all RFC memberships and member profiles</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 group">
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5d3f3c' }} />
            <input 
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 bg-white border border-[#e7bdb7]/30 rounded-lg pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          <button className="h-11 w-11 flex items-center justify-center rounded-lg bg-white border border-[#e7bdb7]/30 hover:bg-surface transition-colors text-on-surface-variant group relative">
             <Filter size={18} />
          </button>

          <Link 
            href="/members/add"
            className="btn-primary h-11 px-6 flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Enroll New</span>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #f5f3f3', marginBottom: '1rem' }}>
          {(['all', 'active', 'inactive'] as const).map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              fontFamily: 'var(--font-inter)', fontSize: '0.75rem', fontWeight: filter === t ? 600 : 400,
              color: filter === t ? '#af000b' : '#5d3f3c',
              borderBottom: filter === t ? '2px solid #af000b' : '2px solid transparent',
              marginBottom: '-2px', padding: '8px 20px',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'all 0.15s ease',
              textTransform: 'uppercase'
            }}>
              {t === 'all' ? 'All Members' : t === 'active' ? 'Active Only' : 'Inactive'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden min-h-[500px]">
        <DataTable 
          data={filteredMembers}
          columns={columns}
          loading={loading}
          emptyTitle="No members found"
          emptyMessage="Try adjusting your search or enroll a new member."
        />
      </div>
    </div>

  );
}
