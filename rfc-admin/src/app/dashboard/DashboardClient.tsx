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

const peakIntensityData = [
  { day: 'M', slots: [2, 5, 8, 3, 4, 12] },
  { day: 'T', slots: [4, 8, 12, 5, 6, 18] },
  { day: 'W', slots: [3, 6, 9, 4, 5, 14] },
  { day: 'T', slots: [5, 9, 14, 6, 7, 20] },
  { day: 'F', slots: [4, 7, 11, 5, 6, 16] },
  { day: 'S', slots: [8, 12, 18, 10, 12, 24] },
  { day: 'S', slots: [6, 10, 15, 8, 10, 20] },
];

const timeSlots = ['5-7A', '7-9A', '9-11A', '11-1P', '1-3P', '6-10P'];

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
        <div className="lg:col-span-1 space-y-px">
           <div className="flex items-center gap-2 mb-4 px-2">
             <Target size={12} className="text-on-surface-variant" />
             <h3 className="text-[10px] font-medium text-on-surface-variant uppercase tracking-[0.1em]">Smart Intelligence</h3>
           </div>
           
           <div className="space-y-[1px] bg-outline-variant/10 rounded-xl overflow-hidden">
              <InsightCard 
                title="Revenue Expansion"
                description="Monthly revenue has increased by 18% based on new memberships."
                icon={<TrendingUp size={18} />}
                accentColor="#af000b"
                actionLabel="VIEW FINANCIAL RECAP →"
              />
              <InsightCard 
                title="Retention Risk"
                description="8% of active members haven't visited in 14 days. High churn risk."
                icon={<AlertCircle size={18} />}
                accentColor="#E65100"
                actionLabel="SEND PUSH ALERTS →"
              />
              <InsightCard 
                title="Peak Velocity"
                description="Member check-ins are at 120% capacity between 6 PM – 8 PM daily."
                icon={<Zap size={18} />}
                accentColor="#af000b"
                actionLabel="ADJUST SCHEDULE →"
              />
              <InsightCard 
                title="Demographic Shift"
                description="New member registrations are leaning 65% towards Premium plans."
                icon={<Users size={18} />}
                accentColor="#5d3f3c"
              />
           </div>
        </div>

        {/* RIGHT: FINANCIAL & RETENTION */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* FINANCE CHART */}
           <KineticCard className="md:col-span-2 p-5 bg-white relative">
              <div className="flex justify-between items-center mb-8">
                <div>
                   <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-[0.1em] mb-1">Revenue & Benchmarks</p>
                   <h3 className="text-lg font-semibold text-on-surface">Financial Vitals</h3>
                </div>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2">
                      <div className="w-4 h-[2px] bg-primary"></div>
                      <span className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider">Actual</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-4 h-[2px] border-b border-dashed border-on-surface-variant/40"></div>
                      <span className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider">Prev</span>
                   </div>
                </div>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#af000b" stopOpacity={0.08}/>
                        <stop offset="95%" stopColor="#af000b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5d3f3c" stopOpacity={0.05}/>
                        <stop offset="95%" stopColor="#5d3f3c" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f0eeec" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#5d3f3c', fontSize: 11 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5d3f3c', fontSize: 11 }} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.92)', 
                        backdropFilter: 'blur(12px)',
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        padding: '12px' 
                      }}
                      itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="prev" 
                      stroke="#5d3f3c" 
                      strokeWidth={1.5} 
                      strokeDasharray="6 3" 
                      fill="url(#prevGrad)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#af000b" 
                      strokeWidth={2.5} 
                      fill="url(#revenueGrad)" 
                      activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#af000b' }} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </KineticCard>

           {/* RETENTION INDEX */}
           <KineticCard className="p-5 bg-white flex flex-col">
              <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-[0.1em] mb-6 text-center">Retention Index</p>
              <div className="h-[180px] w-full relative mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={retentionData} innerRadius={64} outerRadius={82} paddingAngle={4} dataKey="value" stroke="none">
                       <Cell fill="#2E7D32" /> {/* Active */}
                       <Cell fill="#E65100" /> {/* At Risk */}
                       <Cell fill="#e0e0e0" /> {/* Inactive */}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-[28px] data-headline text-on-surface leading-none">84%</span>
                   <span className="text-[10px] font-medium text-on-surface-variant uppercase tracking-[0.1em] mt-1">LOYALTY</span>
                </div>
              </div>
              <div className="space-y-4">
                 {retentionData.map((r, i) => (
                   <div key={r.name} className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-medium uppercase tracking-widest text-on-surface-variant">
                         <span>{r.name}</span>
                         <span style={{ color: i === 0 ? '#2E7D32' : i === 1 ? '#E65100' : '#9e9e9e' }} className="font-semibold">{r.value}%</span>
                      </div>
                      <div className="w-full h-1 bg-[#f0eeec] rounded-full overflow-hidden">
                         <div 
                           className="h-full rounded-full" 
                           style={{ 
                             width: `${r.value}%`, 
                             backgroundColor: i === 0 ? '#2E7D32' : i === 1 ? '#E65100' : '#e0e0e0' 
                           }}
                         ></div>
                      </div>
                   </div>
                 ))}
              </div>
           </KineticCard>
        </div>
      </div>

      {/* --- OPERATIONAL BENTO GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* ATTENDANCE VELOCITY */}
        <KineticCard className="lg:col-span-2 p-5 bg-white relative overflow-hidden">
           <div className="flex justify-between items-start mb-10 px-2">
              <div>
                <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-[0.1em] mb-1 flex items-center gap-1.5">
                   <BarIcon size={12} className="text-primary" /> Attendance Velocity
                </p>
                <h3 className="text-lg font-semibold text-on-surface">Last 7 Sessions</h3>
              </div>
              <div className="px-2.5 py-1 bg-[#eaf3de] text-[#2E7D32] rounded-full text-[11px] font-semibold tracking-tight">
                 +8.2% AVG
              </div>
           </div>
           
           <div className="h-[210px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={attendanceData} margin={{ left: -30, right: 0, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#af000b" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#d81b1b" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0eeec" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#5d3f3c', fontSize: 11 }} 
                    dy={12} 
                    tickFormatter={(val) => val.split('/')[0] + '/' + val.split('/')[1]}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5d3f3c', fontSize: 11 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(175,0,11,0.03)' }} 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.92)', 
                      backdropFilter: 'blur(12px)',
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                      padding: '10px' 
                    }} 
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#barGrad)" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </KineticCard>

        {/* PEAK INTENSITY HEATMAP */}
        <KineticCard className="p-5 bg-white relative">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-[10px] font-medium text-on-surface-variant uppercase tracking-[0.1em] flex items-center gap-1.5">
              <Zap size={12} className="text-primary" /> Peak Intensity
            </h3>
            <span className="px-2 py-0.5 bg-surface-low rounded-md text-[9px] font-medium text-on-surface-variant uppercase tracking-widest">24H CYCLE</span>
          </div>

          <div className="flex flex-col gap-1.5">
             {/* Column Labels */}
             <div className="flex gap-1.5 pl-10 mb-1">
                {peakIntensityData.map(d => (
                  <span key={d.day} className="w-7 text-center text-[10px] font-medium text-on-surface-variant">{d.day}</span>
                ))}
             </div>

             {/* Heatmap Grid */}
             {timeSlots.map((slot, rowIdx) => (
               <div key={slot} className="flex items-center gap-1.5">
                  <span className="w-10 text-[10px] font-medium text-on-surface-variant">{slot}</span>
                  <div className="flex gap-1.5">
                    {peakIntensityData.map((d, colIdx) => {
                      const val = d.slots[rowIdx];
                      const intensity = val > 16 ? '#af000b' : val > 10 ? 'rgba(216,27,27,0.75)' : val > 5 ? 'rgba(216,27,27,0.5)' : val > 0 ? '#f5c4b3' : '#f0eeec';
                      return (
                        <div 
                          key={`${rowIdx}-${colIdx}`} 
                          className="w-7 h-7 rounded-md transition-all duration-300 hover:scale-115 cursor-help"
                          style={{ backgroundColor: intensity }}
                          title={`${val} check-ins @ ${slot}`}
                        ></div>
                      );
                    })}
                  </div>
               </div>
             ))}
          </div>

          <div className="mt-8 border-t border-outline-variant/10 pt-4">
             <p className="text-[11px] font-semibold text-primary mb-0.5">PEAK: 6 PM — 8 PM</p>
             <p className="text-[10px] text-on-surface-variant/60">Red zones indicate max utilisation.</p>
          </div>
        </KineticCard>

        {/* LIVE ACTIVITY STREAM */}
        <KineticCard className="p-5 bg-white flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-medium text-on-surface-variant uppercase tracking-[0.15em] flex items-center gap-1.5">
              <Radio size={12} className="text-primary" /> Activity Stream
            </h3>
            <div className="flex items-center gap-2 bg-[#eaf3de] text-[#2E7D32] px-2 py-0.5 rounded-full">
               <div className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse"></div>
               <span className="text-[10px] font-semibold">LIVE</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 max-h-[260px] pr-2 custom-scrollbar">
             {[
               { type: 'checkin', text: 'Rohit checked in', time: '2M AGO', color: '#2E7D32', bg: '#eaf3de', icon: <CheckCircle2 size={12} /> },
               { type: 'payment', text: 'Payment received ₹2,000', time: '14M AGO', color: '#af000b', bg: '#fdeaea', icon: <DollarSign size={12} /> },
               { type: 'member', text: 'New member registered', time: '41M AGO', color: '#1565C0', bg: '#e8f4fd', icon: <UserPlus size={12} /> },
               { type: 'checkin', text: 'Aman checked in', time: '1H AGO', color: '#2E7D32', bg: '#eaf3de', icon: <CheckCircle2 size={12} /> },
               { type: 'payment', text: 'Subscription renewal ₹4,500', time: '2H AGO', color: '#af000b', bg: '#fdeaea', icon: <DollarSign size={12} /> },
             ].map((event, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-low transition-all group relative border-l-2 border-transparent hover:border-primary">
                   <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: event.bg, color: event.color }}>
                      {event.icon}
                   </div>
                   <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-on-surface leading-tight mb-0.5">{event.text}</p>
                      <p className="text-[11px] font-normal text-on-surface-subtle uppercase tracking-tight">{event.time}</p>
                   </div>
                </div>
             ))}
          </div>
          <button className="mt-4 pt-4 border-t border-outline-variant/10 text-[12px] font-medium text-primary hover:gap-3 transition-all flex items-center gap-2 group">
             View all activity <ChevronRight size={14} />
          </button>
        </KineticCard>
      </div>

      {/* --- TRAINER PERFORMANCE layer --- */}
      <div className="space-y-4">
         <div className="flex items-center gap-2 px-2">
           <Award size={12} className="text-secondary" />
           <h3 className="text-[10px] font-medium text-on-surface-variant uppercase tracking-[0.2em]">Trainer Performance Index</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
               { name: 'Sameer J.', clients: 24, load: 85, tag: 'STRENGTH', color: '#af000b', bg: '#fdeaea', text: '#af000b', status: "High demand trainer" },
               { name: 'Kushal P.', clients: 18, load: 60, tag: 'YOGA', color: '#1565C0', bg: '#e8f4fd', text: '#1565C0', status: "Healthy schedule" },
               { name: 'Sneha R.', clients: 31, load: 95, tag: 'CROSSFIT', color: '#E65100', bg: '#fff3e0', text: '#E65100', status: "At capacity — urgent" },
               { name: 'Anik S.', clients: 12, load: 35, tag: 'REHAB', color: '#2E7D32', bg: '#eaf3de', text: '#2E7D32', status: "Available for new members" },
            ].map((trainer) => {
               const loadColor = trainer.load > 90 ? '#af000b' : trainer.load > 70 ? '#E65100' : trainer.load > 50 ? '#2E7D32' : '#9e9e9e';
               return (
                  <KineticCard key={trainer.name} className="p-5 bg-white relative group">
                     <div className="flex justify-between items-start mb-6">
                        <p className="text-[14px] font-semibold text-on-surface">{trainer.name}</p>
                        <span 
                          className="px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase"
                          style={{ backgroundColor: trainer.bg, color: trainer.text }}
                        >
                          {trainer.tag}
                        </span>
                     </div>
                     <div className="space-y-3">
                        <div className="flex justify-between items-end">
                           <span className="text-[10px] font-medium text-on-surface-variant uppercase">Current Load</span>
                           <span className="text-[20px] data-headline" style={{ color: loadColor }}>{trainer.load}%</span>
                        </div>
                        <div className="w-full h-[6px] bg-[#f0eeec] rounded-full overflow-hidden">
                           <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${trainer.load}%`, backgroundColor: loadColor }}></div>
                        </div>
                        <p className="text-[11px] text-on-surface-subtle font-normal">{trainer.status}</p>
                     </div>
                  </KineticCard>
               );
            })}
         </div>
      </div>
    </div>
  );
}
