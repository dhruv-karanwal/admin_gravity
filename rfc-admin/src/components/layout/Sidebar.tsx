"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAppStore } from '@/store/appStore';
import { 
  BarChart3, 
  Users, 
  UserPlus, 
  Clock, 
  UserX, 
  CheckSquare, 
  History, 
  QrCode, 
  Dumbbell, 
  Trophy, 
  Calendar, 
  BookOpen, 
  UserCog, 
  IndianRupee, 
  CreditCard, 
  RefreshCcw, 
  Bell, 
  FileText, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
  adminOnly?: boolean;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();

  const navSections: NavSection[] = [
    {
      title: "OVERVIEW",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: BarChart3 }
      ]
    },
    {
      title: "MEMBERS",
      items: [
        { label: "All Members", href: "/members", icon: Users },
        { label: "Add Member", href: "/members/add", icon: UserPlus },
        { label: "Expiring Soon", href: "/members/expiring", icon: Clock },
        { label: "Inactive Members", href: "/members?status=inactive", icon: UserX },
      ]
    },
    {
      title: "ATTENDANCE",
      items: [
        { label: "Today's Check-ins", href: "/attendance/today", icon: CheckSquare },
        { label: "Attendance History", href: "/attendance/history", icon: History },
        { label: "QR Scanner", href: "/attendance/scanner", icon: QrCode },
      ]
    },
    {
      title: "WORKOUTS",
      items: [
        { label: "Workout Logs", href: "/workouts", icon: Dumbbell },
        { label: "Personal Records", href: "/workouts/records", icon: Trophy },
      ]
    },
    {
      title: "CLASSES",
      items: [
        { label: "Class Schedule", href: "/classes", icon: Calendar },
        { label: "Bookings", href: "/classes/bookings", icon: BookOpen },
        { label: "Manage Trainers", href: "/classes/trainers", icon: UserCog },
      ]
    },
    {
      title: "FINANCIALS",
      adminOnly: true,
      items: [
        { label: "Revenue Overview", href: "/financials", icon: IndianRupee },
        { label: "Renewal Tracker", href: "/financials/renewals", icon: RefreshCcw },
        { label: "Payment History", href: "/financials/payments", icon: CreditCard },
      ]
    },
    {
      title: "NOTIFICATIONS",
      items: [
        { label: "Send Notification", href: "/notifications", icon: Bell },
        { label: "Notification Logs", href: "/notifications/logs", icon: History },
      ]
    },
    {
      title: "REPORTS",
      adminOnly: true,
      items: [
        { label: "Monthly Reports", href: "/reports", icon: FileText },
      ]
    },
    {
      title: "SETTINGS",
      adminOnly: true,
      items: [
        { label: "Gym Profile", href: "/settings", icon: Settings },
      ]
    }
  ];

  const filteredSections = navSections.filter(section => 
    !section.adminOnly || (role === 'super_admin')
  );

  return (
    <aside 
      className={`sidebar scrollbar-hide overflow-y-auto ${sidebarCollapsed ? 'w-20' : 'w-sidebar'}`}
      style={{ width: sidebarCollapsed ? '80px' : 'var(--sidebar-width)' }}
    >
      {/* Brand Header */}
      <div className="px-6 py-8 mb-4 flex items-center gap-3 overflow-hidden">
        <div className="flex-shrink-0 text-white font-bold bg-primary rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-lg">
          R
        </div>
        {!sidebarCollapsed && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <h1 className="text-white font-bold text-sm font-headline leading-tight whitespace-nowrap">
              Regent Fitness Club
            </h1>
            <p className="text-red-100/50 text-[10px] uppercase tracking-widest font-bold">
              Admin Console
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-1 space-y-6 pb-20">
        {filteredSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!sidebarCollapsed && (
              <h3 className="px-5 sidebar-label mb-2 animate-in fade-in duration-500">
                {section.title}
              </h3>
            )}
            <div className="space-y-0.5">
              {section.items.map((item, itemIdx) => {
                const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href.split('?')[0]));
                return (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    className={`
                      flex items-center gap-4 py-3 px-5 transition-all duration-200 group
                      ${active 
                        ? 'nav-item active' 
                        : 'nav-item'
                      }
                      ${sidebarCollapsed ? 'justify-center rounded-lg mx-2' : ''}
                    `}
                  >
                    <item.icon size={18} className={active ? 'text-primary' : 'group-hover:scale-110 transition-transform'} />
                    {!sidebarCollapsed && (
                      <span className="text-sm font-semibold whitespace-nowrap animate-in fade-in duration-300">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Profile Section */}
      <div className="mt-auto p-4 border-t border-white/10 bg-black/10">
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} mb-4`}>
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs font-bold font-headline overflow-hidden">
            {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.displayName || 'Admin User'}</p>
              <p className="text-[10px] text-red-100/40 uppercase font-bold tracking-wider">{role || 'Staff'}</p>
            </div>
          )}
        </div>
        
        <button 
          onClick={logout}
          className={`
            w-full flex items-center gap-3 py-2 px-3 text-red-100/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors
            ${sidebarCollapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut size={16} />
          {!sidebarCollapsed && <span className="text-xs font-bold uppercase tracking-wider">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute top-20 -right-3 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 border-2 border-white/10"
      >
        {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
