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
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #af000b, #d81b1b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontFamily: 'var(--font-plus-jakarta)',
            fontWeight: 700, fontSize: '0.875rem'
          }}>
            {r.userName[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm line-clamp-1">{r.userName}</p>
            <p className="text-xs text-on-surface-variant/70">{r.userPhone}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Date',
      accessor: (r: AttendanceRecord) => (
        <div className="flex items-center gap-2">
          <Calendar size={13} className="text-[#5d3f3c]" />
          <span className="text-sm font-medium">
            {formatDate(r.checkInAt)}
          </span>
        </div>
      )
    },
    {
      header: 'Check-in Time',
      accessor: (r: AttendanceRecord) => (
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-[#5d3f3c]" />
          <span className="text-sm font-medium">
            {formatTime(r.checkInAt)}
          </span>
        </div>
      )
    },
    {
      header: 'Method',
      accessor: (r: AttendanceRecord) => (
        <span style={{
          background: r.method === 'qr' ? 'rgba(175,0,11,0.08)' : 'rgba(93,63,60,0.08)',
          color: r.method === 'qr' ? '#af000b' : '#5d3f3c',
          borderRadius: '9999px', padding: '3px 10px',
          fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: '0.7rem',
          textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>
          {r.method === 'qr' ? '⬡ QR' : '✎ MANUAL'}
        </span>
      )
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <History size={20} />
             </div>
             <h1 className="text-2xl font-bold">Attendance History</h1>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">Historical logs of all member entries</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 group">
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5d3f3c' }} />
            <input 
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 bg-white border border-[#e7bdb7]/30 rounded-lg pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          <button className="h-11 px-6 flex items-center gap-2 rounded-lg bg-white border border-[#e7bdb7]/30 hover:bg-surface text-on-surface-variant transition-colors whitespace-nowrap">
            <Download size={15} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Export History</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden min-h-[500px]">
        <DataTable 
          data={filteredRecords}
          columns={columns}
          loading={loading}
          emptyTitle="No history records"
          emptyMessage="No attendance logs found for the selected period."
        />
      </div>
    </div>

  );
}
