"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  Clock, 
  Download,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import KineticCard from '@/components/shared/KineticCard';
import DataTable from '@/components/shared/DataTable';
import StatusChip from '@/components/shared/StatusChip';
import LoadingShimmer from '@/components/shared/LoadingShimmer';
import EmptyState from '@/components/shared/EmptyState';
import { getAttendanceToday, AttendanceRecord } from '@/lib/firestore/attendance';

export default function TodayAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadAttendance() {
      try {
        const data = await getAttendanceToday();
        setRecords(data);
      } catch (error) {
        console.error("Error loading attendance:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAttendance();
  }, []);

  const filteredRecords = records.filter(r => 
    r.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.userPhone.includes(searchTerm)
  );

  const columns = [
    {
      header: 'Member Details',
      accessor: (r: AttendanceRecord) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center font-bold text-primary text-sm">
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
      header: 'Check-in Time',
      accessor: (r: AttendanceRecord) => (
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-primary" />
          <span className="text-xs font-bold text-on-surface uppercase tracking-tight">
            {new Date(r.checkInAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )
    },
    {
      header: 'Method',
      accessor: (r: AttendanceRecord) => (
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${r.method === 'qr' ? 'bg-secondary' : 'bg-tertiary'}`}></div>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{r.method === 'qr' ? 'QR SCAN' : 'MANUAL'}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (r: AttendanceRecord) => (
        <StatusChip status="attended" />
      )
    }
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="headline-lg tracking-tight mb-1">Today's Attendance</h1>
          <p className="text-sm text-on-surface-variant font-medium">Real-time check-in log for {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search check-ins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-64 h-12 bg-surface-low rounded-xl pl-11 pr-4 text-xs font-bold border-none ring-primary/5 focus:ring-4 transition-all placeholder:text-on-surface-variant/30"
            />
          </div>

          <button className="h-12 px-6 flex items-center gap-3 rounded-xl bg-surface-low hover:bg-surface-lowest text-on-surface-variant transition-colors border border-outline-variant/30">
            <Download size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <KineticCard className="p-6 border-l-4 border-primary">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2">Total Check-ins</p>
          <div className="flex items-baseline gap-2">
            <h2 className="headline-lg text-primary">{records.length}</h2>
            <span className="text-xs font-bold text-on-surface-variant">MEMBERS</span>
          </div>
        </KineticCard>
        
        <KineticCard className="p-6 border-l-4 border-secondary">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2">Peak Hour</p>
          <div className="flex items-baseline gap-2">
            <h2 className="headline-lg text-secondary">07:00</h2>
            <span className="text-xs font-bold text-on-surface-variant">AM</span>
          </div>
        </KineticCard>
      </div>

      <KineticCard className="p-1 overflow-hidden">
        <DataTable 
          data={filteredRecords}
          columns={columns}
          loading={loading}
          emptyTitle="No check-ins today"
          emptyMessage="Attendance logs will appear here as members scan in."
        />
      </KineticCard>
    </div>
  );
}
