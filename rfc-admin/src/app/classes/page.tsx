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

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
  const [selectedDay, setSelectedDay] = useState<typeof days[number]>(days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);

  const filteredClasses = classes.filter(c => {
    const matchesSearch = c.className.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.trainer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDay = c.dayOfWeek === selectedDay;
    return matchesSearch && matchesDay;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Calendar size={20} />
             </div>
             <h1 className="text-2xl font-bold">Class Schedule</h1>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">Manage group fitness sessions and schedules</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 group">
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5d3f3c' }} />
            <input 
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 bg-white border border-[#e7bdb7]/30 rounded-lg pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          <Link href="/classes/add" className="btn-primary h-11 px-6 flex items-center gap-2">
            <Plus size={16} />
            <span>Add Class</span>
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex gap-2 p-1.5 bg-white rounded-xl border border-[#e7bdb7]/20 w-fit overflow-x-auto scroller-hidden">
          {days.map((day) => (
            <button 
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedDay === day 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                  : 'text-[#5d3f3c] hover:bg-surface'
              }`}
            >
              {day.substring(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-white rounded-xl animate-pulse border border-[#e7bdb7]/10"></div>
          ))
        ) : filteredClasses.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-xl flex flex-col items-center justify-center">
             <div className="w-16 h-16 rounded-full bg-[#f5f3f3] flex items-center justify-center mb-4 text-[#5d3f3c] opacity-50">
                <Users size={32} />
             </div>
             <h3 className="text-lg font-bold">No classes for {selectedDay}</h3>
             <p className="text-sm text-on-surface-variant mt-1">Try switching days or search for a different session.</p>
          </div>
        ) : (
          filteredClasses.map((c) => {
            const percentage = (c.currentBookings / c.capacity) * 100;
            const isFull = c.currentBookings >= c.capacity;
            
            return (
              <div 
                key={c.id} 
                className="bg-white rounded-xl p-6 border border-[#e7bdb7]/20 relative overflow-hidden group hover:shadow-xl hover:shadow-[#af000b]/5 transition-all duration-300"
              >
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
                  background: 'linear-gradient(180deg, #af000b, #d81b1b)'
                }} />
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#af000b] uppercase tracking-widest mb-1">
                      <Clock size={12} />
                      {formatTime(c.startTime)} - {formatTime(c.endTime)}
                    </div>
                    <h3 className="text-lg font-black text-[#1b1c1c] tracking-tight">{c.className}</h3>
                  </div>
                  <div className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                    isFull ? 'bg-error/10 text-error' : 'bg-success/10 text-success'
                  }`}>
                    {isFull ? 'FULL' : 'AVAILABLE'}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                   <div style={{
                     width: '32px', height: '32px', borderRadius: '50%',
                     background: 'rgba(93,63,60,0.05)',
                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                     color: '#5d3f3c', fontSize: '0.75rem', fontWeight: 800
                   }}>
                     {c.trainer[0]}
                   </div>
                   <div>
                     <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest leading-none mb-0.5">Trainer</p>
                     <p className="text-sm font-semibold text-[#1b1c1c]">{c.trainer}</p>
                   </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-on-surface-variant">
                    <span>Capacity / Attendance</span>
                    <span>{c.currentBookings} / {c.capacity}</span>
                  </div>
                  <div className="h-2 w-full bg-[#f5f3f3] rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out bg-gradient-to-r from-[#af000b] to-[#d81b1b]`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <Link 
                  href={`/classes/bookings?classId=${c.id}`}
                  className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-[#e7bdb7]/30 text-[10px] font-black uppercase tracking-widest text-[#5d3f3c] hover:bg-[#af000b] hover:text-white hover:border-[#af000b] transition-all"
                >
                  Manage Bookings
                  <ChevronRight size={14} />
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>

  );
}
