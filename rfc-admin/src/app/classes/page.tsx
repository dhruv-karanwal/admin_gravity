"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  Search,
  Clock,
  User,
  Plus,
  Users,
  ChevronRight
} from 'lucide-react';
import KineticCard from '@/components/shared/KineticCard';
import DataTable from '@/components/shared/DataTable';
import { useAppStore } from '@/store/appStore';
import { getClasses, ClassSchedule } from '@/lib/firestore/classes';
import { formatTime } from '@/lib/utils/dates';
import Link from 'next/link';

export default function ClassSchedulePage() {
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useAppStore();

  useEffect(() => {
    async function loadClasses() {
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (error) {
        showToast({ message: 'Failed to load class schedule', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
    loadClasses();
  }, [showToast]);

  const filteredClasses = classes.filter(c => 
    c.className.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.trainer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Class Name',
      accessor: (c: ClassSchedule) => (
        <div>
          <p className="font-bold text-on-surface">{c.className}</p>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{c.dayOfWeek}</p>
        </div>
      )
    },
    {
      header: 'Trainer',
      accessor: (c: ClassSchedule) => (
        <div className="flex items-center gap-2">
          <User size={14} className="text-primary/70" />
          <span className="text-xs font-bold text-on-surface">{c.trainer}</span>
        </div>
      )
    },
    {
      header: 'Time Slot',
      accessor: (c: ClassSchedule) => (
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-on-surface-variant/50" />
          <span className="text-xs font-bold text-on-surface tracking-tight">
            {formatTime(c.startTime)} - {formatTime(c.endTime)}
          </span>
        </div>
      )
    },
    {
      header: 'Attendance',
      accessor: (c: ClassSchedule) => {
        const percentage = (c.currentBookings / c.capacity) * 100;
        return (
          <div className="flex flex-col gap-1 w-32">
            <div className="flex justify-between items-center text-[10px] font-bold">
               <span className="text-on-surface-variant uppercase">Booked</span>
               <span className="text-primary">{c.currentBookings} / {c.capacity}</span>
            </div>
            <div className="h-1.5 w-full bg-surface-low rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-500 ${percentage > 80 ? 'bg-error' : 'bg-primary'}`} 
                 style={{ width: `${percentage}%` }}
               ></div>
            </div>
          </div>
        );
      }
    },
    {
      header: '',
      accessor: (c: ClassSchedule) => (
        <Link 
          href={`/classes/bookings?classId=${c.id}`}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-low text-on-surface-variant hover:text-primary transition-all group"
        >
          <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )
    }
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Calendar size={20} className="text-primary" />
             <h1 className="headline-lg tracking-tight">Class Schedule</h1>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">Manage group fitness sessions and schedules</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-surface-low rounded-xl pl-11 pr-4 text-xs font-bold border-none ring-primary/5 focus:ring-4 transition-all placeholder:text-on-surface-variant/30"
            />
          </div>

          <button className="h-12 px-6 flex items-center gap-3 rounded-xl bg-primary text-white text-[11px] font-bold uppercase tracking-widest hover:bg-primary-high transition-all active:scale-95 shadow-lg shadow-primary/20">
            <Plus size={16} />
            <span>Add Class</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
           <button key={day} className="p-4 rounded-2xl bg-surface-low hover:bg-surface-lowest border border-white/5 transition-all text-center group">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 group-hover:text-primary transition-colors">{day}</p>
              <p className="text-xs font-black text-on-surface">View Schedule</p>
           </button>
         ))}
      </div>

      <KineticCard className="p-1 overflow-hidden min-h-[500px]">
        <DataTable 
          data={filteredClasses}
          columns={columns}
          loading={loading}
          emptyTitle="No classes scheduled"
          emptyMessage="Plan your gym classes and they will appear in this interactive timeline."
        />
      </KineticCard>
    </div>
  );
}
