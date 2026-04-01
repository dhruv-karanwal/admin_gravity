"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar,
  Clock,
  User,
  History,
  Download
} from 'lucide-react';
import KineticCard from '@/components/shared/KineticCard';
import DataTable from '@/components/shared/DataTable';
import { useAppStore } from '@/store/appStore';
import { getAttendanceHistory, AttendanceRecord } from '@/lib/firestore/attendance';
import { formatDate, formatTime } from '@/lib/utils/dates';

export default function AttendanceHistoryPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useAppStore();

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getAttendanceHistory(60); // Load last 60 days
        setRecords(data);
      } catch (error) {
        showToast({ message: 'Failed to load attendance history', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [showToast]);

  const filteredRecords = records.filter(r => 
    r.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.userPhone.includes(searchTerm)
  );

  const columns = [
    {
      header: 'Member',
      accessor: (r: AttendanceRecord) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center font-bold text-primary group-hover:scale-105 transition-transform text-sm uppercase">
            {r.userName[0]}
          </div>
          <div>
            <p className="font-bold text-on-surface line-clamp-1">{r.userName}</p>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{r.userPhone}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Date',
      accessor: (r: AttendanceRecord) => (
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-on-surface-variant/50" />
          <span className="text-xs font-bold text-on-surface tracking-tight">
            {formatDate(r.checkInAt)}
          </span>
        </div>
      )
    },
    {
      header: 'Check-in Time',
      accessor: (r: AttendanceRecord) => (
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-on-surface-variant/50" />
          <span className="text-xs font-bold text-on-surface">
            {formatTime(r.checkInAt)}
          </span>
        </div>
      )
    },
    {
      header: 'Method',
      accessor: (r: AttendanceRecord) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          r.method === 'qr' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
        }`}>
          {r.method}
        </span>
      )
    }
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <History size={20} className="text-primary" />
             <h1 className="headline-lg tracking-tight">Attendance History</h1>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">Historical logs of all member entries</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-surface-low rounded-xl pl-11 pr-4 text-xs font-bold border-none ring-primary/5 focus:ring-4 transition-all placeholder:text-on-surface-variant/30"
            />
          </div>

          <button className="h-12 px-6 flex items-center gap-3 rounded-xl bg-surface-low text-on-surface text-[11px] font-bold uppercase tracking-widest hover:bg-surface-lowest transition-all active:scale-95">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <KineticCard className="p-1 overflow-hidden min-h-[500px]">
        <DataTable 
          data={filteredRecords}
          columns={columns}
          loading={loading}
          emptyTitle="No history records"
          emptyMessage="No attendance logs found for the selected period."
        />
      </KineticCard>
    </div>
  );
}
