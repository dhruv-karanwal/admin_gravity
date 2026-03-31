"use client";

import React from 'react';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Smartphone, 
  Database, 
  Globe, 
  ChevronRight,
  LogOut,
  CreditCard,
  Target
} from 'lucide-react';
import KineticCard from '@/components/shared/KineticCard';
import { useAuth } from '@/context/AuthContext';

const settingSections = [
  { 
    title: "Account Identity", 
    icon: <User size={18} />, 
    items: ["Profile Details", "Administrative Roles", "Security Protocols"],
    color: "text-primary"
  },
  { 
    title: "System Parameters", 
    icon: <Settings size={18} />, 
    items: ["Regional Localization", "Financial Constants", "Member Goals Configuration"],
    color: "text-secondary"
  },
  { 
    title: "Messaging Architecture", 
    icon: <Bell size={18} />, 
    items: ["FCM Logic", "Push Templates", "Broadcast Throttle"],
    color: "text-tertiary"
  },
  { 
    title: "Device Management", 
    icon: <Smartphone size={18} />, 
    items: ["Terminal Auth", "Scanner Calibration", "Hardware Logs"],
    color: "text-on-surface"
  }
];

export default function SettingsPage() {
  const { logout } = useAuth();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="headline-lg tracking-tight mb-1">System Configuration</h1>
        <p className="text-sm text-on-surface-variant font-medium">Global parameters and administrative sovereignty control</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingSections.map((section, i) => (
          <KineticCard key={i} className="p-8 group overflow-hidden">
             <div className="flex items-center gap-4 mb-8">
                <div className={`w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center ${section.color}`}>
                   {section.icon}
                </div>
                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em]">{section.title}</h3>
             </div>
             
             <div className="space-y-1">
                {section.items.map((item, j) => (
                  <button 
                    key={j} 
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-surface-low transition-all group/item"
                  >
                    <span className="text-sm font-bold text-on-surface-variant group-hover/item:text-on-surface transition-colors">{item}</span>
                    <ChevronRight size={16} className="text-on-surface-variant/20 group-hover/item:text-primary transition-all group-hover/item:translate-x-1" />
                  </button>
                ))}
             </div>
          </KineticCard>
        ))}
      </div>

      <KineticCard className="p-8 border-none bg-error/5 group">
         <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center text-error">
                  <LogOut size={24} />
               </div>
               <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-error">Danger Zone</h3>
                  <p className="text-xs text-on-surface-variant font-medium">Terminate administrative session and revoke access tokens.</p>
               </div>
            </div>
            <button 
              onClick={logout}
              className="px-8 py-4 bg-error text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-error/90 transition-all active:scale-95 shadow-xl shadow-error/20"
            >
              Terminate Session
            </button>
         </div>
      </KineticCard>

      <div className="text-center py-12">
         <p className="text-[10px] text-on-surface-variant/30 font-bold uppercase tracking-[0.4em] mb-4">Regent Fitness Club • RFC Admin System v1.0.4</p>
         <div className="flex items-center justify-center gap-6 opacity-30">
            <Shield size={16} />
            <Database size={16} />
            <Globe size={16} />
         </div>
      </div>
    </div>
  );
}
