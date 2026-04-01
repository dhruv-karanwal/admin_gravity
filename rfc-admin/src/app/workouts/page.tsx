"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Dumbbell,
  Clock,
  Flame,
  Calendar,
  History
} from 'lucide-react';
import KineticCard from '@/components/shared/KineticCard';
import DataTable from '@/components/shared/DataTable';
import { useAppStore } from '@/store/appStore';
import { getAllWorkouts, WorkoutLog } from '@/lib/firestore/workouts';
import { formatDate } from '@/lib/utils/dates';

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useAppStore();

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const data = await getAllWorkouts();
        setWorkouts(data);
      } catch (error) {
        showToast({ message: 'Failed to load workout logs', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
    loadWorkouts();
  }, [showToast]);

  const filteredWorkouts = workouts.filter(w => 
    w.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.workoutType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Member',
      accessor: (w: WorkoutLog) => (
        <div className="flex items-center gap-3">
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1b1c1c, #5d3f3c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontFamily: 'var(--font-plus-jakarta)',
            fontWeight: 700, fontSize: '0.875rem'
          }}>
            {w.userName[0].toUpperCase()}
          </div>
          <span className="font-semibold text-sm text-[#1b1c1c]">{w.userName}</span>
        </div>
      )
    },
    {
      header: 'Workout Type',
      accessor: (w: WorkoutLog) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Dumbbell size={14} />
          </div>
          <span className="text-xs font-bold text-[#1b1c1c] uppercase tracking-tight">{w.workoutType}</span>
        </div>
      )
    },
    {
      header: 'Duration',
      accessor: (w: WorkoutLog) => (
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-[#5d3f3c]/60" />
          <span className="text-sm font-medium text-[#1b1c1c]">{w.duration} mins</span>
        </div>
      )
    },
    {
      header: 'Calories',
      accessor: (w: WorkoutLog) => (
        <div className="flex items-center gap-2">
          <Flame size={14} className="text-secondary" />
          <span className="text-sm font-medium text-[#1b1c1c]">{w.caloriesBurned} kcal</span>
        </div>
      )
    },
    {
      header: 'Completed At',
      accessor: (w: WorkoutLog) => (
        <div className="flex items-center gap-2 font-medium text-[#5d3f3c]">
          <Calendar size={14} />
          <span className="text-sm">{formatDate(w.completedAt)}</span>
        </div>
      )
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <History size={20} />
             </div>
             <h1 className="text-2xl font-bold">Workout Logs</h1>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">Session history of all member workouts</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 group">
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5d3f3c' }} />
            <input 
              type="text"
              placeholder="Search by member or activity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 bg-white border border-[#e7bdb7]/30 rounded-lg pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden min-h-[500px]">
        <DataTable 
          data={filteredWorkouts}
          columns={columns}
          loading={loading}
          emptyTitle="No workouts found"
          emptyMessage="Member workout logs will appear here once they start recording sessions."
        />
      </div>
    </div>

  );
}
