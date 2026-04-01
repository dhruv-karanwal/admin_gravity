"use client";

import React, { useState, useEffect } from 'react';
import { 
  UserCog,
  Search,
  Plus,
  Mail,
  Phone,
  Award,
  MoreVertical,
  Briefcase
} from 'lucide-react';
import KineticCard from '@/components/shared/KineticCard';
import { useAppStore } from '@/store/appStore';
import { getTrainers, Trainer } from '@/lib/firestore/classes';
import LoadingShimmer from '@/components/shared/LoadingShimmer';

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useAppStore();

  useEffect(() => {
    async function loadTrainers() {
      try {
        const data = await getTrainers();
        setTrainers(data);
      } catch (error) {
        showToast({ message: 'Failed to load trainers', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
    loadTrainers();
  }, [showToast]);

  const filteredTrainers = trainers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <UserCog size={20} className="text-primary" />
             <h1 className="headline-lg tracking-tight">Trainer Management</h1>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">Manage your professional gym staff and trainers</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search trainers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-surface-low rounded-xl pl-11 pr-4 text-xs font-bold border-none ring-primary/5 focus:ring-4 transition-all placeholder:text-on-surface-variant/30"
            />
          </div>

          <button className="h-12 px-6 flex items-center gap-3 rounded-xl bg-primary text-white text-[11px] font-bold uppercase tracking-widest hover:bg-primary-high transition-all active:scale-95 shadow-lg shadow-primary/20">
            <Plus size={16} />
            <span>Add Trainer</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-3xl bg-surface-low animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredTrainers.map((trainer) => (
             <KineticCard key={trainer.id} className="p-6 relative group overflow-hidden border border-white/5">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-16 h-16 rounded-2xl bg-surface-lowest flex items-center justify-center text-2xl font-black text-primary border border-white/10 group-hover:scale-110 transition-transform">
                      {trainer.name[0]}
                   </div>
                   <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-lowest text-on-surface-variant transition-colors">
                      <MoreVertical size={16} />
                   </button>
                </div>

                <div className="space-y-4">
                   <div>
                      <h3 className="text-lg font-black text-on-surface mb-0.5">{trainer.name}</h3>
                      <div className="flex items-center gap-2">
                         <Briefcase size={12} className="text-primary/60" />
                         <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{trainer.specialization}</p>
                      </div>
                   </div>

                   <div className="pt-4 border-t border-white/5 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant">
                         <Award size={14} className="text-secondary" />
                         <span>{trainer.experience} Experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-on-surface">
                         <Phone size={14} className="opacity-40" />
                         <span>{trainer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-on-surface">
                         <Mail size={14} className="opacity-40" />
                         <span>{trainer.email}</span>
                      </div>
                   </div>
                </div>

                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
             </KineticCard>
           ))}
        </div>
      )}

      {!loading && filteredTrainers.length === 0 && (
         <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-surface-low flex items-center justify-center mb-4">
               <UserCog size={32} className="text-on-surface-variant/30" />
            </div>
            <h3 className="text-lg font-bold">No trainers found</h3>
            <p className="text-on-surface-variant max-w-xs">Try adjusting your search or add a new trainer.</p>
         </div>
      )}
    </div>
  );
}
