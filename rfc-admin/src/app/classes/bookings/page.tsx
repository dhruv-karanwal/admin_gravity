"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar,
  Clock,
  User,
  History,
  Download,
  BookOpen,
  CheckCircle2,
  XCircle,
  MoreVertical
} from 'lucide-react';
import KineticCard from '@/components/shared/KineticCard';
import DataTable from '@/components/shared/DataTable';
import LoadingShimmer from '@/components/shared/LoadingShimmer';
import { useAppStore } from '@/store/appStore';
import { getClassBookings, Booking } from '@/lib/firestore/classes';
import { formatDate, formatTime } from '@/lib/utils/dates';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function BookingsContent() {
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useAppStore();

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await getClassBookings(classId || undefined);
        setBookings(data);
      } catch (error) {
        showToast({ message: 'Failed to load class bookings', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, [showToast, classId]);

  const filteredBookings = bookings.filter(b => 
    b.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Member',
      accessor: (b: Booking) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center font-bold text-primary group-hover:scale-105 transition-transform text-sm uppercase">
            {b.userName[0]}
          </div>
          <div>
            <p className="font-bold text-on-surface line-clamp-1">{b.userName}</p>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{b.userPhone}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Class',
      accessor: (b: Booking) => (
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-secondary/70" />
          <span className="text-xs font-bold text-on-surface uppercase tracking-tight">{b.className}</span>
        </div>
      )
    },
    {
      header: 'Booked On',
      accessor: (b: Booking) => (
        <span className="text-[11px] font-bold text-on-surface-variant tracking-tight">
          {formatDate(b.bookedAt)} at {formatTime(b.bookedAt)}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (b: Booking) => {
        const statusColors = {
          confirmed: 'bg-primary/10 text-primary',
          attended: 'bg-emerald/10 text-emerald-500',
          cancelled: 'bg-error/10 text-error'
        };
        return (
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[b.status as keyof typeof statusColors] || 'bg-surface-low text-on-surface'}`}>
            {b.status}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      accessor: (b: Booking) => (
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-low text-on-surface-variant transition-colors">
           <MoreVertical size={16} />
        </button>
      )
    }
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <BookOpen size={20} className="text-primary" />
             <h1 className="headline-lg tracking-tight">Class Bookings</h1>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">Manage all member reservations for classes</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-surface-low rounded-xl pl-11 pr-4 text-xs font-bold border-none ring-primary/5 focus:ring-4 transition-all placeholder:text-on-surface-variant/30"
            />
          </div>
        </div>
      </div>

      <KineticCard className="p-1 overflow-hidden min-h-[500px]">
        <DataTable 
          data={filteredBookings}
          columns={columns}
          loading={loading}
          emptyTitle="No bookings found"
          emptyMessage="Member class reservations will appear here."
        />
      </KineticCard>
    </div>
  );
}

export default function ClassBookingsPage() {
  return (
    <Suspense fallback={
       <div className="p-8 space-y-8">
          <LoadingShimmer variant="detail" />
          <LoadingShimmer variant="table" />
       </div>
    }>
       <BookingsContent />
    </Suspense>
  );
}
