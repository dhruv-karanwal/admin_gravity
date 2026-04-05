"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAppStore } from '@/store/appStore';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  LogOut, 
  User as UserIcon,
  Menu,
  X
} from 'lucide-react';

const pageTitleMap: Record<string, string> = {
  '/dashboard':            'Dashboard',
  '/members':              'All Members',
  '/members/add':          'Add Member',
  '/members/expiring':     'Expiring Soon',
  '/attendance/today':     "Today's Check-ins",
  '/attendance/history':   'Attendance History',
  '/attendance/scanner':   'QR Scanner',
  '/classes':              'Class Schedule',
  '/classes/bookings':     'Bookings',
  '/classes/trainers':     'Manage Trainers',
  '/financials':           'Revenue Overview',
  '/financials/renewals':  'Renewal Tracker',
  '/financials/payments':  'Payment History',
  '/notifications':        'Send Notification',
  '/notifications/logs':   'Notification Logs',
  '/reports':              'Monthly Reports',
  '/settings':             'Settings',
};

export default function Header() {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Get title from map, or find prefix match for dynamic routes like /members/[uid]
  const getPageTitle = () => {
    if (pageTitleMap[pathname]) return pageTitleMap[pathname];
    
    if (pathname.startsWith('/members/')) return 'Member Profile';
    if (pathname.startsWith('/classes/')) return 'Class Details';
    
    return 'Admin Console';
  };

  return (
    <header 
      className="header flex justify-between items-center transition-all duration-300"
      style={{ left: sidebarCollapsed ? '80px' : 'var(--sidebar-width)' }}
    >
      {/* Left side: Hamburger + Title */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded-lg hover:bg-surface-low lg:hidden transition-colors"
        >
          <Menu size={18} className="text-on-surface-variant" />
        </button>
        <h2 className="text-lg font-semibold text-on-surface tracking-tight animate-in fade-in slide-in-from-left-4 duration-500">
          {getPageTitle()}
        </h2>
      </div>

      {/* Center: Global Search */}
      <div className="hidden md:block flex-1 max-w-md mx-8 group">
        <div className={`
          relative flex items-center transition-all duration-300
          ${searchFocused ? 'scale-[1.01]' : ''}
        `}>
          <Search 
            size={14} 
            className={`absolute left-3.5 transition-colors ${searchFocused ? 'text-primary' : 'text-on-surface-variant/40'}`}
          />
          <input 
            type="text"
            placeholder="Search console..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full bg-[#f0eeec] border-none rounded-lg py-2 pl-10 pr-4 text-[13px] font-medium focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-on-surface-variant/30"
          />
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-low transition-colors text-on-surface-variant relative"
          >
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-surface"></span>
          </button>
          
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-low transition-colors text-on-surface-variant">
            <HelpCircle size={16} />
          </button>
        </div>

        <div className="h-4 w-[1px] bg-outline-variant/10 mx-3"></div>

        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1 rounded-lg hover:bg-surface-low transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-low border border-outline-variant/10 flex items-center justify-center text-primary font-bold overflow-hidden shadow-sm shadow-primary/5">
              {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-[12px] font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">
                {user?.displayName || 'Administrator'}
              </p>
              <p className="text-[10px] text-on-surface-variant/50 font-semibold leading-none uppercase tracking-wider mt-0.5">
                {role || 'Staff'}
              </p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-outline-variant/10 p-1.5 rounded-xl animate-in zoom-in-95 fade-in duration-200 shadow-[0_12px_48px_rgba(0,0,0,0.12)] z-50">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-on-surface hover:bg-surface-low transition-colors"
              >
                <LogOut size={14} className="text-primary" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Menu Backdrop */}
      {showProfileMenu && (
        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowProfileMenu(false)} />
      )}
    </header>
  );
}
