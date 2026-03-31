"use client";

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  ArrowUpRight,
  ChevronRight,
  Download,
  Calendar,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import KineticCard from '@/components/shared/KineticCard';
import MetricPulse from '@/components/shared/MetricPulse';
import DataTable from '@/components/shared/DataTable';
import StatusChip from '@/components/shared/StatusChip';
import LoadingShimmer from '@/components/shared/LoadingShimmer';
import EmptyState from '@/components/shared/EmptyState';
import { formatCurrency } from '@/lib/utils/currency';
import { getFinancialSummary, getRecentPayments, PaymentRecord } from '@/lib/firestore/financials';

const COLORS = ['var(--primary)', 'var(--secondary)', 'var(--tertiary)', 'var(--on-surface-variant)'];

export default function FinancialsClient() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [recentPayments, setRecentPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    async function loadFinancials() {
      try {
        const [sum, payments] = await Promise.all([
          getFinancialSummary(30),
          getRecentPayments(10)
        ]);
        setSummary(sum);
        setRecentPayments(payments);
      } catch (error) {
        console.error("Error loading financials:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFinancials();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <LoadingShimmer variant="cards" />
        <LoadingShimmer variant="detail" />
      </div>
    );
  }

  const columns = [
    {
      header: 'Transaction ID',
      accessor: (p: PaymentRecord) => (
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">
          {p.id.slice(0, 8)}...
        </span>
      )
    },
    {
      header: 'Member Name',
      accessor: (p: PaymentRecord) => (
        <span className="text-sm font-bold text-on-surface">{p.userName}</span>
      )
    },
    {
      header: 'Amount',
      accessor: (p: PaymentRecord) => (
        <span className="text-sm font-bold text-primary">{formatCurrency(p.amount)}</span>
      )
    },
    {
      header: 'Gateway',
      accessor: (p: PaymentRecord) => (
        <div className="flex items-center gap-2">
          <CreditCard size={14} className="text-on-surface-variant/50" />
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{p.method}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (p: PaymentRecord) => (
        <StatusChip status={p.status === 'completed' ? 'attended' : 'inactive'} />
      )
    }
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="headline-lg tracking-tight mb-1">Financial Intelligence</h1>
          <p className="text-sm text-on-surface-variant font-medium">Monthly revenue performance and transaction audits</p>
        </div>
        
        <button className="h-12 px-6 flex items-center gap-3 rounded-xl bg-primary text-white text-[11px] font-bold uppercase tracking-widest hover:bg-primary-high transition-all shadow-lg shadow-primary/20">
          <Download size={16} />
          <span>Full Audit Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricPulse 
          label="Gross Revenue"
          value={formatCurrency(summary.totalRevenue)}
          trend="up"
          delta="14%"
        />
        <MetricPulse 
          label="Average Order"
          value={formatCurrency(summary.totalRevenue / (recentPayments.length || 1))}
        />
        <MetricPulse 
          label="Growth Velocity"
          value="+12.2%"
          trend="up"
          delta="Dynamic"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <KineticCard className="lg:col-span-2 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 px-2">
            <div>
              <h3 className="headline-sm mb-1">Revenue Stream</h3>
              <p className="text-sm text-on-surface-variant font-medium">Daily income trajectory for past 30 days</p>
            </div>
          </div>

          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.dailyRevenue}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--on-surface-variant)', fontSize: 10, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '16px', 
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }}
                  formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </KineticCard>

        {/* Payment Method Pie Chart */}
        <KineticCard className="flex flex-col">
          <h3 className="headline-sm mb-6">Gateway Distribution</h3>
          <div className="h-[240px] w-full flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary.methodDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="method"
                >
                  {summary.methodDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total</span>
               <span className="text-xl font-bold">{recentPayments.length}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {summary.methodDistribution.map((entry: any, i: number) => (
               <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">{entry.method}</span>
               </div>
            ))}
          </div>
        </KineticCard>
      </div>

      <KineticCard className="p-1 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30">
          <h3 className="headline-sm">Recent Ledger Entries</h3>
        </div>
        <DataTable 
          data={recentPayments}
          columns={columns}
          emptyTitle="No transactions yet"
          emptyMessage="Financial records will appear here after initial payment synchronization."
        />
      </KineticCard>
    </div>
  );
}
