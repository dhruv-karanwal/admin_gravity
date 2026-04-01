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
          <div className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center font-bold text-primary group-hover:scale-105 transition-transform text-sm uppercase">
            {w.userName[0]}
          </div>
          <span className="font-bold text-on-surface line-clamp-1">{w.userName}</span>
        </div>
      )
    },
    {
      header: 'Workout Type',
      accessor: (w: WorkoutLog) => (
        <div className="flex items-center gap-2">
          <Dumbbell size={14} className="text-primary/70" />
          <span className="text-xs font-bold text-on-surface uppercase">{w.workoutType}</span>
        </div>
      )
    },
    {
      header: 'Duration',
      accessor: (w: WorkoutLog) => (
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-on-surface-variant/50" />
          <span className="text-xs font-bold text-on-surface">{w.duration} mins</span>
        </div>
      )
    },
    {
      header: 'Calories',
      accessor: (w: WorkoutLog) => (
        <div className="flex items-center gap-2">
          <Flame size={14} className="text-secondary" />
          <span className="text-xs font-bold text-on-surface">{w.caloriesBurned} kcal</span>
        </div>
      )
    },
    {
      header: 'Completed At',
      accessor: (w: WorkoutLog) => (
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-on-surface-variant/50" />
          <span className="text-xs font-bold text-on-surface-variant tracking-tight">{formatDate(w.completedAt)}</span>
        </div>
      )
    }
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <History size={20} className="text-primary" />
             <h1 className="headline-lg tracking-tight">Workout Logs</h1>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">Session history of all member workouts</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search by member or activity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-surface-low rounded-xl pl-11 pr-4 text-xs font-bold border-none ring-primary/5 focus:ring-4 transition-all placeholder:text-on-surface-variant/30"
            />
          </div>
        </div>
      </div>

      <KineticCard className="p-1 overflow-hidden min-h-[500px]">
        <DataTable 
          data={filteredWorkouts}
          columns={columns}
          loading={loading}
          emptyTitle="No workouts found"
          emptyMessage="Member workout logs will appear here once they start recording sessions."
        />
      </KineticCard>
    </div>
  );
}
