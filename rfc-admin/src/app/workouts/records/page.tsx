"use client";

import React, { useState, useEffect } from 'react';
import { 
  Trophy,
  Search, 
  Dumbbell,
  Clock,
  Zap,
  Target,
  Calendar
} from 'lucide-react';
import KineticCard from '@/components/shared/KineticCard';
import DataTable from '@/components/shared/DataTable';
import { useAppStore } from '@/store/appStore';
import { getPersonalRecords, PersonalRecord } from '@/lib/firestore/workouts';
import { formatDate } from '@/lib/utils/dates';

export default function PersonalRecordsPage() {
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useAppStore();

  useEffect(() => {
    async function loadRecords() {
      try {
        const data = await getPersonalRecords();
        setRecords(data);
      } catch (error) {
        showToast({ message: 'Failed to load personal records', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
    loadRecords();
  }, [showToast]);

  const filteredRecords = records.filter(r => 
    r.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.exercise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Champion',
      accessor: (r: PersonalRecord) => (
        <div className="flex items-center gap-3">
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #af000b, #d81b1b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontFamily: 'var(--font-plus-jakarta)',
            fontWeight: 700, fontSize: '0.875rem'
          }}>
            {r.userName[0].toUpperCase()}
          </div>
          <span className="font-semibold text-sm text-[#1b1c1c]">{r.userName}</span>
        </div>
      )
    },
    {
      header: 'Exercise',
      accessor: (r: PersonalRecord) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Target size={14} />
          </div>
          <span className="text-xs font-bold text-[#1b1c1c] uppercase tracking-tight">{r.exercise}</span>
        </div>
      )
    },
    {
      header: 'Record Value',
      accessor: (r: PersonalRecord) => (
        <div className="px-5 py-2 rounded-lg bg-[#f5f3f3] border border-[#e7bdb7]/20 inline-block">
          <span className="text-lg font-black text-[#af000b] tracking-tight">{r.value}</span>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: (r: PersonalRecord) => (
        <div className="flex items-center gap-2">
           <Zap size={13} className="text-[#5d3f3c]" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-[#5d3f3c]/70">{r.category}</span>
        </div>
      )
    },
    {
      header: 'Achieved Date',
      accessor: (r: PersonalRecord) => (
        <div className="flex items-center gap-2 text-[#5d3f3c]">
          <Calendar size={13} />
          <span className="text-sm font-medium">{formatDate(r.achievedAt)}</span>
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
                <Trophy size={20} />
             </div>
             <h1 className="text-2xl font-bold">Personal Records</h1>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">Top achievements across all gym members</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 group">
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5d3f3c' }} />
            <input 
              type="text"
              placeholder="Search for records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 bg-white border border-[#e7bdb7]/30 rounded-lg pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden min-h-[500px]">
        <DataTable 
          data={filteredRecords}
          columns={columns}
          loading={loading}
          emptyTitle="Hall of Fame is empty"
          emptyMessage="New personal records will show up here once members hit their targets."
        />
      </div>
    </div>

  );
}
