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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <UserCog size={20} />
             </div>
             <h1 className="text-2xl font-bold">Trainer Management</h1>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">Manage your professional gym staff and trainers</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 group">
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5d3f3c' }} />
            <input 
              type="text"
              placeholder="Search trainers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 bg-white border border-[#e7bdb7]/30 rounded-lg pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          <button className="h-11 px-5 flex items-center gap-2 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/20">
            <Plus size={16} />
            <span>Add Trainer</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {[1, 2, 3, 4].map(i => <div key={i} className="h-64 rounded-2xl bg-white/50 border border-[#e7bdb7]/10 animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredTrainers.map((trainer) => (
             <div key={trainer.id} className="bg-white rounded-2xl p-6 border border-[#e7bdb7]/20 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                   <div style={{
                     width: '56px', height: '56px', borderRadius: '16px',
                     background: 'linear-gradient(135deg, #af000b, #d81b1b)',
                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                     color: 'white', fontSize: '1.25rem', fontWeight: 800,
                     boxShadow: '0 8px 16px -4px rgba(175, 0, 11, 0.3)'
                   }}>
                      {trainer.name[0]}
                   </div>
                   <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f5f3f3] text-on-surface-variant transition-colors">
                      <MoreVertical size={16} />
                   </button>
                </div>

                <div className="space-y-4">
                   <div>
                      <h3 className="text-lg font-bold text-[#1b1c1c] mb-0.5">{trainer.name}</h3>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{trainer.specialization}</p>
                      </div>
                   </div>

                   <div className="pt-4 border-t border-[#f5f3f3] space-y-2.5">
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-[#5d3f3c]">
                         <Award size={14} className="text-secondary opacity-70" />
                         <span>{trainer.experience} Experience</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-[#1b1c1c]">
                         <Phone size={14} className="opacity-40" />
                         <span>{trainer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-[#1b1c1c]">
                         <Mail size={14} className="opacity-40" />
                         <span className="truncate">{trainer.email}</span>
                      </div>
                   </div>
                </div>

                {/* Decorative background element */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
             </div>
           ))}
        </div>
      )}

      {!loading && filteredTrainers.length === 0 && (
         <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#f5f3f3] flex items-center justify-center mb-4">
               <UserCog size={24} className="text-[#5d3f3c]/30" />
            </div>
            <h3 className="text-lg font-bold text-[#1b1c1c]">No trainers found</h3>
            <p className="text-sm text-on-surface-variant max-w-xs">Try adjusting your search or add a new trainer.</p>
         </div>
      )}
    </div>

  );
}
