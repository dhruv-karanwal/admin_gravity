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
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
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

  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const count = records.filter(r => new Date(r.checkInAt.toDate()).getHours() === hour).length;
    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      count
    };
  }).filter(h => h.count > 0 || (parseInt(h.hour) >= 5 && parseInt(h.hour) <= 23));

  const columns = [
    {
      header: 'Member Details',
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
      header: 'Check-in Time',
      accessor: (r: AttendanceRecord) => (
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-[#5d3f3c]" />
          <span className="text-sm font-medium">
            {new Date(r.checkInAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
    },
    {
      header: 'Status',
      accessor: (r: AttendanceRecord) => (
        <StatusChip status="attended" />
      )
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Today's Attendance</h1>
          <p className="text-sm text-on-surface-variant font-medium">Real-time check-in log for {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 group">
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5d3f3c' }} />
            <input 
              type="text"
              placeholder="Search check-ins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 bg-white border border-[#e7bdb7]/30 rounded-lg pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          <button className="h-11 px-6 flex items-center gap-2 rounded-lg bg-white border border-[#e7bdb7]/30 hover:bg-surface text-on-surface-variant transition-colors whitespace-nowrap">
            <Download size={15} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border-l-4 border-[#af000b]">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Total Check-ins</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-[#1b1c1c]">{records.length}</h2>
            <span className="text-sm text-on-surface-variant">members today</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border-l-4 border-[#d81b1b]">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Peak Hour</p>
          <div className="flex items-baseline gap-1">
            <h2 className="text-4xl font-bold text-[#1b1c1c]">07:00</h2>
            <span className="text-sm text-on-surface-variant">AM</span>
          </div>
        </div>
      </div>

      {/* Hourly Distribution */}
      <div className="bg-white rounded-xl p-6 mb-6">
        <h3 className="text-base font-bold mb-6">Check-in Distribution</h3>
        <div className="h-[150px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <CartesianGrid stroke="transparent" />
              <XAxis dataKey="hour" tick={{ fontFamily:'var(--font-inter)', fontSize:10, fill:'#5d3f3c' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                 cursor={{ fill: '#f5f3f3' }}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '0.75rem' }}
              />
              <defs>
                <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#af000b" />
                  <stop offset="100%" stopColor="#d81b1b" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <Bar dataKey="count" fill="url(#hourGrad)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden min-h-[400px]">
        {loading ? (
          <LoadingShimmer variant="table" />
        ) : filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 rounded-full bg-[#f5f3f3] flex items-center justify-center mb-4 text-[#5d3f3c]">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-bold">No check-ins yet today</h3>
            <p className="text-sm text-on-surface-variant opacity-70 mt-1 mb-6">Attendance logs will appear here as members scan in.</p>
            <button className="btn-primary h-11 px-8">Manual Check-in</button>
          </div>
        ) : (
          <DataTable 
            data={filteredRecords}
            columns={columns}
            loading={loading}
          />
        )}
      </div>
    </div>

  );
}
