"use client";

import React, { useState, useEffect } from 'react';
import { 
  Trophy,
  Search,
  Dumbbell,
  Clock,
  Zap,
  Target
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
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center font-bold text-secondary group-hover:scale-105 transition-transform text-sm uppercase">
            {r.userName[0]}
          </div>
          <span className="font-bold text-on-surface line-clamp-1">{r.userName}</span>
        </div>
      )
    },
    {
      header: 'Exercise',
      accessor: (r: PersonalRecord) => (
        <div className="flex items-center gap-2">
          <Target size={14} className="text-primary/70" />
          <span className="text-xs font-bold text-on-surface uppercase tracking-tight">{r.exercise}</span>
        </div>
      )
    },
    {
      header: 'Record Value',
      accessor: (r: PersonalRecord) => (
        <div className="px-4 py-2 rounded-xl bg-surface-low/50 inline-block">
          <span className="text-sm font-black text-primary font-headline">{r.value}</span>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: (r: PersonalRecord) => (
        <div className="flex items-center gap-2">
           <Zap size={12} className="text-secondary" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{r.category}</span>
        </div>
      )
    },
    {
      header: 'Achieved Date',
      accessor: (r: PersonalRecord) => (
        <span className="text-[11px] font-bold text-on-surface-variant">{formatDate(r.achievedAt)}</span>
      )
    }
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
                <Trophy size={20} className="text-primary" />
             </div>
             <h1 className="headline-lg tracking-tight">Personal Records</h1>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">Top achievements across all gym members</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search for records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-surface-low rounded-xl pl-11 pr-4 text-xs font-bold border-none ring-primary/5 focus:ring-4 transition-all placeholder:text-on-surface-variant/30"
            />
          </div>
        </div>
      </div>

      <KineticCard className="p-1 overflow-hidden min-h-[500px]">
        <DataTable 
          data={filteredRecords}
          columns={columns}
          loading={loading}
          emptyTitle="Hall of Fame is empty"
          emptyMessage="New personal records will show up here once members hit their targets."
        />
      </KineticCard>
    </div>
  );
}
