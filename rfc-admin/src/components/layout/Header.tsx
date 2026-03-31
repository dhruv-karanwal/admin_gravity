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
  '/workouts':             'Workout Logs',
  '/workouts/records':     'Personal Records',
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
          className="p-1 rounded-lg hover:bg-surface-low lg:hidden"
        >
          <Menu size={20} />
        </button>
        <h2 className="headline-sm animate-in fade-in slide-in-from-left-4 duration-500">
          {getPageTitle()}
        </h2>
      </div>

      {/* Center: Global Search */}
      <div className="hidden md:block flex-1 max-w-md mx-8 group">
        <div className={`
          relative flex items-center transition-all duration-300
          ${searchFocused ? 'scale-[1.02]' : ''}
        `}>
          <Search 
            size={16} 
            className={`absolute left-3 transition-colors ${searchFocused ? 'text-primary' : 'text-on-surface-variant'}`}
          />
          <input 
            type="text"
            placeholder="Search members, classes or payments..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full bg-surface-low border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50"
          />
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-low transition-colors text-on-surface-variant relative"
          >
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full animate-pulse border-2 border-white"></span>
          </button>
          
          <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-low transition-colors text-on-surface-variant">
            <HelpCircle size={18} />
          </button>
        </div>

        <div className="h-6 w-[1px] bg-outline-variant/30 mx-2"></div>

        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-surface-low transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-low border border-outline-variant/30 flex items-center justify-center text-primary font-bold overflow-hidden">
              {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold leading-none mb-1 group-hover:text-primary transition-colors">
                {user?.displayName || 'Administrator'}
              </p>
              <p className="text-[10px] text-on-surface-variant font-medium leading-none uppercase tracking-wider">
                {role || 'Staff'}
              </p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 glass-modal p-2 animate-in zoom-in-95 fade-in duration-200 shadow-2xl">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-on-surface hover:bg-surface-low transition-colors"
              >
                <LogOut size={16} className="text-primary" />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Menu Backdrop */}
      {showProfileMenu && (
        <div className="fixed inset-0 z-[-1]" onClick={() => setShowProfileMenu(false)} />
      )}
    </header>
  );
}
