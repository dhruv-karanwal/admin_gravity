"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  Activity, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  RefreshCw,
  Clock,
  ChevronRight,
  Target,
  Zap,
  Award,
  Radio,
  UserPlus,
  CheckCircle2,
  BarChart as BarIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import KineticCard from '@/components/shared/KineticCard';
import StatusChip from '@/components/shared/StatusChip';
import LoadingShimmer from '@/components/shared/LoadingShimmer';
import Sparkline from '@/components/shared/Sparkline';
import InsightCard from '@/components/shared/InsightCard';
import { formatCurrency } from '@/lib/utils/currency';
import { getAllMembers, getActiveMembersCount, getExpiringMembers } from '@/lib/firestore/members';
import { getAttendanceSummaryByDay, getAttendanceToday } from '@/lib/firestore/attendance';
import { getMonthlyRevenue } from '@/lib/firestore/financials';

// --- MOCK DATA FOR ANALYTICS ---
const revenueTrends = [
  { name: 'Jan', value: 45000, prev: 38000 },
  { name: 'Feb', value: 52000, prev: 42000 },
  { name: 'Mar', value: 48000, prev: 45000 },
  { name: 'Apr', value: 61000, prev: 48000 },
  { name: 'May', value: 55000, prev: 52000 },
  { name: 'Jun', value: 67000, prev: 58000 },
  { name: 'Jul', value: 72000, prev: 62000 },
];

const sparkData = [
  { value: 400 }, { value: 300 }, { value: 600 }, { value: 1200 }, 
  { value: 500 }, { value: 1600 }, { value: 2100 }
];

const planDistribution = [
  { name: 'Basic', value: 45, color: '#f5f3f3' },
  { name: 'Premium', value: 35, color: '#af000b' },
  { name: 'Personal', value: 20, color: '#1b1c1c' },
];

const retentionData = [
  { name: 'Active', value: 84, color: '#0d631b' },
  { name: 'At Risk', value: 12, color: '#af000b' },
  { name: 'Inactive', value: 4, color: '#e7bdb7' },
];

const peakHours = [
  { hour: '6 AM', intensity: 0.2 }, { hour: '8 AM', intensity: 0.5 },
  { hour: '10 AM', intensity: 0.3 }, { hour: '12 PM', intensity: 0.2 },
  { hour: '2 PM', intensity: 0.4 }, { hour: '4 PM', intensity: 0.7 },
  { hour: '6 PM', intensity: 1.0 }, { hour: '8 PM', intensity: 0.9 },
  { hour: '10 PM', intensity: 0.4 }, { hour: '12 AM', intensity: 0.1 },
  { hour: '2 AM', intensity: 0.05 }, { hour: '4 AM', intensity: 0.1 }
];

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30 Days'); // 7, 30, 90
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalMembers: 1284,
    activeMembers: 1042,
    expiringSoon: 12,
    monthlyRevenue: 240000,
  });
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [recentCheckins, setRecentCheckins] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [timeframe]);

  async function loadDashboardData() {
    setRefreshing(true);
    try {
      const [
        members, 
        activeCount, 
        expiring, 
        revenue, 
        attendanceSummary,
        todayCheckins
      ] = await Promise.all([
        getAllMembers(),
        getActiveMembersCount(),
        getExpiringMembers(7),
        getMonthlyRevenue(),
        getAttendanceSummaryByDay(7),
        getAttendanceToday()
      ]);

      setStats({
        totalMembers: members.length || 1284,
        activeMembers: activeCount || 1042,
        expiringSoon: expiring.length || 12,
        monthlyRevenue: revenue || 240000,
      });

      setAttendanceData(attendanceSummary);
      setRecentCheckins(todayCheckins.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 800);
    }
  }

  if (loading) return <LoadingShimmer variant="dashboard" />;

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
      {/* --- DASHBOARD HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[#e7bdb7]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black tracking-tight text-[#1b1c1c]">Dashboard</h1>
            <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 ${refreshing ? 'bg-primary/20 text-primary animate-pulse' : 'bg-tertiary/10 text-tertiary'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${refreshing ? 'bg-primary animate-ping' : 'bg-tertiary shadow-[0_0_8px_rgba(13,99,27,0.5)]'}`}></div>
              {refreshing ? 'Refreshing...' : 'LIVE'}
            </div>
          </div>
          <p className="text-[11px] font-bold text-on-surface-variant/50 uppercase tracking-[0.3em]">
            Operational Intelligence Console • FY/2026
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-1 rounded-2xl border border-[#e7bdb7]/20 shadow-sm shadow-[#af000b]/5">
           {['7 Days', '30 Days', '90 Days'].map((t) => (
             <button
               key={t}
               onClick={() => setTimeframe(t)}
               className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${timeframe === t ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-on-surface-variant hover:bg-[#f5f3f3]'}`}
             >
               {t}
             </button>
           ))}
           <div className="w-[1px] h-6 bg-[#e7bdb7]/20 mx-1"></div>
           <button 
             onClick={loadDashboardData}
             disabled={refreshing}
             className={`w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-[#f5f3f3] transition-all ${refreshing ? 'animate-spin' : ''}`}
           >
             <RefreshCw size={18} />
           </button>
        </div>
      </div>

      {/* --- KPI SECTION — PREMIUM CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI: TOTAL MEMBERS */}
        <KineticCard className="p-7 bg-white border border-[#e7bdb7]/20 shadow-[0_12px_40px_-8px_rgba(27,28,28,0.04)] hover:shadow-2xl hover:shadow-[#af000b]/5 transition-all overflow-hidden relative group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-2xl bg-secondary/5 text-secondary border border-secondary/10">
              <Users size={22} className="group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-right">
               <div className="flex items-center gap-1.5 text-[11px] font-black text-tertiary px-2.5 py-1 bg-tertiary/5 rounded-full border border-tertiary/10">
                 <TrendingUp size={12} /> +12%
               </div>
               <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase mt-1.5">vs last month</p>
            </div>
          </div>
          <div className="space-y-0.5 mb-6">
            <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.25em]">Total Members</p>
            <h2 className="text-4xl font-black text-[#1b1c1c] tracking-tight">{stats.totalMembers.toLocaleString()}</h2>
          </div>
          <div className="mb-2">
            <Sparkline data={sparkData} color="#af000b" height={50} />
          </div>
          <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Growth Trajectory: EXPONENTIAL</p>
          <div className="absolute -right-8 -top-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-1000">
            <Users size={160} />
          </div>
        </KineticCard>

        {/* KPI: REVENUE */}
        <KineticCard className="p-7 bg-white border border-[#e7bdb7]/20 shadow-[0_12px_40px_-8px_rgba(27,28,28,0.04)] hover:shadow-2xl hover:shadow-[#af000b]/5 transition-all overflow-hidden relative group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-2xl bg-tertiary/5 text-tertiary border border-tertiary/10">
              <DollarSign size={22} className="group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-right">
               <div className="flex items-center gap-1.5 text-[11px] font-black text-tertiary px-2.5 py-1 bg-tertiary/5 rounded-full border border-tertiary/10">
                 <TrendingUp size={12} /> +18.4%
               </div>
               <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase mt-1.5">vs goal</p>
            </div>
          </div>
          <div className="space-y-0.5 mb-6">
            <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.25em]">Monthly Revenue</p>
            <h2 className="text-4xl font-black text-[#1b1c1c] tracking-tight">{formatCurrency(stats.monthlyRevenue)}</h2>
          </div>
          <div className="mb-2">
            <Sparkline data={sparkData.map(d => ({ value: d.value * 0.7 }))} color="#0d631b" height={50} />
          </div>
          <div className="absolute -right-8 -top-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-1000">
            <DollarSign size={160} />
          </div>
        </KineticCard>

        {/* KPI: MEMBER PULSE */}
        <KineticCard className="p-7 bg-white border border-[#e7bdb7]/20 shadow-[0_12px_40px_-8px_rgba(27,28,28,0.04)] hover:shadow-2xl hover:shadow-[#af000b]/5 transition-all overflow-hidden relative group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-2xl bg-primary/5 text-primary border border-primary/10">
              <Activity size={22} className="group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-right">
               <div className="flex items-center gap-1.5 text-[11px] font-black text-on-surface-variant/40 px-2.5 py-1 bg-[#f5f3f3] rounded-full">
                 <TrendingUp size={10} className="text-tertiary" /> 84% ACTIVE
               </div>
            </div>
          </div>
          <div className="space-y-0.5 mb-6">
            <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.25em]">Member Pulse</p>
            <h2 className="text-4xl font-black text-[#1b1c1c] tracking-tight">{stats.activeMembers}</h2>
          </div>
          <div className="mb-2">
            <Sparkline data={sparkData.map(d => ({ value: 500 + Math.random() * 200 }))} color="#1b1c1c" height={50} />
          </div>
        </KineticCard>

        {/* KPI: CRITICAL EXPIRED */}
        <KineticCard className={`p-7 border shadow-2xl transition-all overflow-hidden relative group ${stats.expiringSoon > 0 ? 'bg-primary border-primary shadow-primary/20 scale-105 z-10' : 'bg-white border-[#e7bdb7]/20'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-2xl border ${stats.expiringSoon > 0 ? 'bg-white/10 border-white/20 text-white animate-pulse' : 'bg-primary/5 text-primary border-primary/10'}`}>
              <AlertCircle size={22} />
            </div>
            {stats.expiringSoon > 0 && (
              <div className="px-3 py-1 bg-white text-primary rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                ACTION REQUIRED
              </div>
            )}
          </div>
          <div className="space-y-0.5 mb-6 relative z-10">
            <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${stats.expiringSoon > 0 ? 'text-white/60' : 'text-on-surface-variant/40'}`}>Expiring Soon</p>
            <h2 className={`text-4xl font-black tracking-tight ${stats.expiringSoon > 0 ? 'text-white' : 'text-[#1b1c1c]'}`}>{stats.expiringSoon} Members</h2>
          </div>
          <div className="py-2 relative z-10">
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${stats.expiringSoon > 0 ? 'bg-white/20' : 'bg-[#f5f3f3]'}`}>
               <div className={`h-full rounded-full transition-all duration-1000 ${stats.expiringSoon > 0 ? 'bg-white shadow-[0_0_12px_white]' : 'bg-primary'}`} style={{ width: stats.expiringSoon > 0 ? '70%' : '0%' }}></div>
            </div>
            <p className={`text-[9px] font-bold uppercase tracking-widest mt-3 ${stats.expiringSoon > 0 ? 'text-white/70' : 'text-on-surface-variant/40'}`}>Requires Manual Intervention</p>
          </div>
          {stats.expiringSoon > 0 && (
            <div className="absolute -right-8 -bottom-8 opacity-[0.1] scale-150 rotate-12">
               <AlertCircle size={200} color="white" />
            </div>
          )}
        </KineticCard>
      </div>

      {/* --- MAIN ANALYTICS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* LEFT: SMART INTELLIGENCE */}
        <div className="lg:col-span-1 space-y-6">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 rounded-lg bg-[#1b1c1c] text-white">
                <Target size={16} />
             </div>
             <h3 className="text-[11px] font-black text-[#1b1c1c] uppercase tracking-[0.2em]">Smart Intelligence</h3>
           </div>
           
           <div className="space-y-4">
              <InsightCard 
                title="Revenue Expansion"
                description="Monthly revenue has increased by 18% based on new memberships."
                type="positive"
                actionLabel="VIEW FINANCIAL RECAP"
              />
              <InsightCard 
                title="Retention Risk"
                description="8% of active members haven't visited in 14 days. High churn risk."
                type="negative"
                actionLabel="SEND PUSH ALERTS"
              />
              <InsightCard 
                title="Peak Velocity"
                description="Member check-ins are at 120% capacity between 6 PM – 8 PM daily."
                type="warning"
                actionLabel="ADJUST SCHEDULE"
              />
              <InsightCard 
                title="Demographic Shift"
                description="New member registrations are leaning 65% towards Premium plans."
                type="neutral"
              />
           </div>
        </div>

        {/* RIGHT: FINANCIAL & RETENTION */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* FINANCE CHART */}
           <KineticCard className="md:col-span-2 p-8 bg-white border border-[#e7bdb7]/20 shadow-sm relative">
              <div className="flex justify-between items-center mb-10">
                <div>
                   <h3 className="text-2xl font-black tracking-tight text-[#1b1c1c]">Financial Vitals</h3>
                   <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">Revenue & Benchmarks</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-[9px] font-black text-on-surface-variant/60 uppercase tracking-widest">Actual</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-on-surface-variant/20"></div>
                      <span className="text-[9px] font-black text-on-surface-variant/60 uppercase tracking-widest">Prev</span>
                   </div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#af000b" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#af000b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f3f3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#5d3f3c60', fontSize: 10, fontWeight: 900 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5d3f3c60', fontSize: 10, fontWeight: 900 }} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip 
                      cursor={{ stroke: '#af000b40', strokeWidth: 2 }}
                      contentStyle={{ backgroundColor: 'rgba(27,28,28,0.95)', borderRadius: '20px', border: 'none', color: 'white', padding: '15px' }}
                    />
                    <Area type="monotone" dataKey="prev" stroke="rgba(27,28,28,0.1)" strokeWidth={2} strokeDasharray="8 8" fill="transparent" />
                    <Area type="monotone" dataKey="value" stroke="#af000b" strokeWidth={4} fill="url(#revenueGrad)" activeDot={{ r: 8, stroke: '#fff', strokeWidth: 3, fill: '#af000b' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </KineticCard>

           {/* RETENTION DONUT */}
           <KineticCard className="p-8 bg-white border border-[#e7bdb7]/20 shadow-sm flex flex-col">
              <h3 className="text-[10px] font-black text-[#1b1c1c] uppercase tracking-[0.25em] mb-8 text-center">Retention Index</h3>
              <div className="h-[180px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={retentionData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" stroke="none">
                      {retentionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-3xl font-black text-[#1b1c1c]">84%</span>
                   <span className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest">LOYALTY</span>
                </div>
              </div>
              <div className="mt-8 space-y-2">
                 {retentionData.map(r => (
                   <div key={r.name} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-on-surface-variant/40">{r.name}</span>
                      <span>{r.value}%</span>
                   </div>
                 ))}
              </div>
           </KineticCard>
        </div>
      </div>

      {/* --- OPERATIONAL BENTO GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* ATTENDANCE VELOCITY */}
        <KineticCard className="lg:col-span-2 p-8 bg-white border border-[#e7bdb7]/20 shadow-sm">
           <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
                   <BarIcon size={14} className="text-primary" /> Attendance Velocity
                </h3>
                <p className="text-xl font-black text-[#1b1c1c] tracking-tight">Last 7 Sessions</p>
              </div>
              <p className="text-[10px] font-black text-tertiary uppercase">↑ 8.2% Avg</p>
           </div>
           <div className="h-[200px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={attendanceData}>
                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#5d3f3c60', fontSize: 10, fontWeight: 900 }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5d3f3c60', fontSize: 10, fontWeight: 900 }} />
                 <Tooltip cursor={{ fill: 'rgba(175,0,11,0.05)' }} contentStyle={{ borderRadius: '12px' }} />
                 <Bar dataKey="count" fill="#af000b" radius={[6, 6, 0, 0]} barSize={35} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </KineticCard>

        {/* 24H HEATMAP */}
        <KineticCard className="p-8 bg-white border border-[#e7bdb7]/20 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.15em] flex items-center gap-2">
              <Zap size={12} className="text-primary" /> Peak Intensity
            </h3>
            <span className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">24H CYCLE</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
             {peakHours.map((p) => (
                <div key={p.hour} className="group relative">
                  <div className={`h-10 w-full rounded-lg border transition-all duration-500 ${p.intensity > 0.8 ? 'bg-primary border-primary' : p.intensity > 0.4 ? 'bg-primary/40' : 'bg-[#f5f3f3] border-transparent'}`}></div>
                </div>
             ))}
          </div>
          <div className="mt-8">
             <p className="text-[10px] font-black uppercase text-primary mb-1">Peak: 6 PM — 8 PM</p>
             <p className="text-[10px] text-on-surface-variant/60 font-bold leading-relaxed">Red zones indicate max utilization.</p>
          </div>
        </KineticCard>

        {/* LIVE ACTIVITY STREAM */}
        <KineticCard className="p-8 bg-white border border-[#e7bdb7]/20 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.15em] flex items-center gap-2">
              <Radio size={12} className="text-primary animate-pulse" /> LIVE STREAM
            </h3>
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 max-h-[220px] pr-2 custom-scrollbar">
             {[
               { icon: <CheckCircle2 size={12} />, text: 'Rohit checked in', time: '2m ago', color: 'text-tertiary' },
               { icon: <DollarSign size={12} />, text: 'Payment received ₹2,000', time: '14m ago', color: 'text-primary' },
               { icon: <UserPlus size={12} />, text: 'New member registered', time: '41m ago', color: 'text-secondary' },
               { icon: <CheckCircle2 size={12} />, text: 'Aman checked in', time: '1h ago', color: 'text-tertiary' },
             ].map((event, i) => (
               <div key={i} className="flex items-start gap-3 border-l-2 border-[#f5f3f3] pl-3">
                  <div className={`mt-0.5 ${event.color}`}>{event.icon}</div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[#1b1c1c] leading-none mb-1">{event.text}</p>
                    <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest">{event.time}</p>
                  </div>
               </div>
             ))}
          </div>
        </KineticCard>
      </div>

      {/* --- TRAINER PERFORMANCE layer --- */}
      <div className="space-y-6">
         <div className="flex items-center gap-3">
           <Award size={16} className="text-secondary" />
           <h3 className="text-[11px] font-black text-[#1b1c1c] uppercase tracking-[0.2em]">Trainer Performance Index</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
               { name: 'Sameer J.', clients: 24, load: 85, tag: 'STRENGTH' },
               { name: 'Kushal P.', clients: 18, load: 60, tag: 'YOGA' },
               { name: 'Sneha R.', clients: 31, load: 95, tag: 'CROSSFIT' },
               { name: 'Anik S.', clients: 12, load: 35, tag: 'REHAB' },
            ].map((trainer) => (
               <KineticCard key={trainer.name} className="p-6 bg-white border border-[#e7bdb7]/20 shadow-sm relative group">
                  <div className="flex justify-between items-start mb-6">
                     <p className="text-xs font-black text-[#1b1c1c]">{trainer.name}</p>
                     <span className="text-[9px] font-black text-on-surface-variant/40 tracking-widest uppercase">{trainer.tag}</span>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between text-[8px] font-black uppercase text-on-surface-variant/40">
                        <span>Load</span>
                        <span>{trainer.load}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-[#f5f3f3] rounded-full overflow-hidden">
                        <div className={`h-full ${trainer.load > 90 ? 'bg-primary' : 'bg-tertiary'}`} style={{ width: `${trainer.load}%` }}></div>
                     </div>
                  </div>
               </KineticCard>
            ))}
         </div>
      </div>
    </div>
  );
}
