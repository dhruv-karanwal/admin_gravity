"use client";

import React from 'react';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Users, 
  Clock, 
  ChevronRight,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Calendar
} from 'lucide-react';
import KineticCard from '@/components/shared/KineticCard';

const reportTypes = [
  { title: "Monthly Revenue Digest", description: "Consolidated breakdown of subscription renewals and new enrollments.", icon: <TrendingUp size={20} />, color: "text-primary" },
  { title: "Member Engagement Audit", description: "Attendance frequency analysis and churn probability indicators.", icon: <Users size={20} />, color: "text-secondary" },
  { title: "Trainer Productivity Log", description: "Class attendance stats mapped against trainer performance KPIs.", icon: <Clock size={20} />, color: "text-tertiary" },
  { title: "FCM Broadcast Efficacy", description: "Open rates and interaction counts for push notifications.", icon: <FileText size={20} />, color: "text-on-surface" },
];

export default function ReportsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="headline-lg tracking-tight mb-1">Analytical Reports</h1>
          <p className="text-sm text-on-surface-variant font-medium">Deep-dive intelligence for RFC business performance</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-12 px-6 flex items-center gap-3 rounded-xl bg-surface-low hover:bg-surface-lowest text-on-surface transition-colors border border-outline-variant/30 text-[10px] font-bold uppercase tracking-widest">
            <Calendar size={16} />
            <span>Last 30 Days</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report, i) => (
          <KineticCard key={i} className="p-8 group cursor-pointer hover:scale-[1.02] transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl bg-surface-low flex items-center justify-center ${report.color} group-hover:scale-110 transition-transform`}>
                {report.icon}
              </div>
              <button className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                <Download size={18} />
              </button>
            </div>
            
            <h3 className="headline-sm mb-2">{report.title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed font-medium mb-8">
              {report.description}
            </p>

            <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-[0.2em] group-hover:gap-2 transition-all">
              <span>Generate Analysis</span>
              <ChevronRight size={14} />
            </div>
          </KineticCard>
        ))}
      </div>

      <KineticCard className="p-12 text-center bg-[radial-gradient(circle_at_center,_var(--primary-low),_transparent_70%)] relative overflow-hidden group">
         <div className="absolute inset-0 bg-surface/40 backdrop-blur-3xl"></div>
         <div className="relative z-10 space-y-6">
            <div className="w-20 h-20 rounded-[2.5rem] bg-surface flex items-center justify-center mx-auto shadow-2xl rotate-3 group-hover:rotate-12 transition-transform">
               <FileText className="text-primary" size={32} />
            </div>
            <div>
               <h2 className="headline-md mb-2">Custom Audit Builder</h2>
               <p className="text-sm text-on-surface-variant max-w-md mx-auto font-medium">Create a proprietary report template by selecting specific metrics, dimensions, and time grains.</p>
            </div>
            <button className="h-14 px-10 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary-high transition-all active:scale-95 shadow-xl shadow-primary/20">
               Launch Report Architect
            </button>
         </div>
      </KineticCard>
    </div>
  );
}
