"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Activity, 
  AlertCircle,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell
} from 'recharts';
import KineticCard from '@/components/shared/KineticCard';
import MetricPulse from '@/components/shared/MetricPulse';
import StatusChip from '@/components/shared/StatusChip';
import LoadingShimmer from '@/components/shared/LoadingShimmer';
import { formatCurrency } from '@/lib/utils/currency';
import { getAllMembers, getActiveMembersCount, getExpiringMembers } from '@/lib/firestore/members';
import { getAttendanceSummaryByDay, getAttendanceToday } from '@/lib/firestore/attendance';
import { getMonthlyRevenue } from '@/lib/firestore/financials';

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    expiringSoon: 0,
    monthlyRevenue: 0,
  });
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [recentCheckins, setRecentCheckins] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
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
          totalMembers: members.length,
          activeMembers: activeCount,
          expiringSoon: expiring.length,
          monthlyRevenue: revenue,
        });

        setAttendanceData(attendanceSummary);
        setRecentCheckins(todayCheckins.slice(0, 5));
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <LoadingShimmer variant="cards" />
        <LoadingShimmer variant="detail" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricPulse 
          label="Total Members"
          value={stats.totalMembers.toString()}
          trend="up"
          delta="12%"
        />
        <MetricPulse 
          label="Active Members"
          value={stats.activeMembers.toString()}
        />
        <MetricPulse 
          label="Expiring Soon"
          value={stats.expiringSoon.toString()}
        />
        <MetricPulse 
          label="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          trend="up"
          delta="8%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <KineticCard className="lg:col-span-2 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="headline-sm mb-1">Attendance Pulse</h3>
              <p className="text-sm text-on-surface-variant font-medium">Daily check-ins for the past week</p>
            </div>
            <button className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest hover:opacity-80 transition-opacity">
              Full Report <ChevronRight size={14} />
            </button>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--on-surface-variant)', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'var(--surface-low)', opacity: 0.5 }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '16px', 
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#barGradient)" 
                  radius={[8, 8, 4, 4]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </KineticCard>

        {/* Recent Activity */}
        <KineticCard>
          <h3 className="headline-sm mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {recentCheckins.length > 0 ? recentCheckins.map((checkin, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer animate-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center text-primary border border-outline-variant/30 group-hover:scale-110 transition-transform">
                  <Users size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface line-clamp-1">{checkin.userName}</p>
                  <p className="text-xs text-on-surface-variant font-medium">
                    {new Date(checkin.checkInAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {checkin.method}
                  </p>
                </div>
                <StatusChip status="attended" />
              </div>
            )) : (
              <div className="py-12 text-center">
                <p className="text-sm text-on-surface-variant font-medium">No check-ins yet today</p>
              </div>
            )}
          </div>
          <button className="w-full mt-8 py-3 rounded-2xl bg-surface-low text-xs font-bold text-on-surface uppercase tracking-widest hover:bg-surface-lowest transition-colors border border-outline-variant/30">
            View All Check-ins
          </button>
        </KineticCard>
      </div>

      {/* Revenue Snapshot (Secondary Row) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KineticCard className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
              <TrendingUp size={24} />
            </div>
          </div>
          <h3 className="headline-sm mb-1">Growth Index</h3>
          <p className="text-sm text-on-surface-variant font-medium mb-8">Revenue performance vs goal</p>
          
          <div className="flex items-end gap-4 mb-2">
            <h2 className="headline-lg text-primary">{formatCurrency(stats.monthlyRevenue)}</h2>
            <div className="flex items-center gap-1 text-secondary text-sm font-bold mb-2">
              <ArrowUpRight size={16} /> 12.5%
            </div>
          </div>
          <div className="w-full h-2 bg-surface-low rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
          </div>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-3">75% of Monthly Target (1.2L)</p>
        </KineticCard>

        <KineticCard className="glass-modal border-none">
          <h3 className="headline-sm mb-6">System Health</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-surface-low/50">
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Database</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                <span className="text-sm font-bold">Synchronized</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-surface-low/50">
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Auth Service</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                <span className="text-sm font-bold">Operational</span>
              </div>
            </div>
          </div>
        </KineticCard>
      </div>
    </div>
  );
}
