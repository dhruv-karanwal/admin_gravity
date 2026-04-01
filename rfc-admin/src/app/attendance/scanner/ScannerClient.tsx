"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Scan, 
  SwitchCamera, 
  Zap, 
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import KineticCard from '@/components/shared/KineticCard';
import GlassModal from '@/components/shared/GlassModal';
import StatusChip from '@/components/shared/StatusChip';
import { useAppStore } from '@/store/appStore';
import { getMemberById, Member } from '@/lib/firestore/members';
import { markAttendance } from '@/lib/firestore/attendance';

export default function ScannerClient() {
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; member?: Member; message: string } | null>(null);
  const { showToast } = useAppStore();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (scanning) {
        scannerRef.current = new Html5QrcodeScanner(
            "reader", 
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );
        
        scannerRef.current.render(onScanSuccess, onScanFailure);
    } else {
        if (scannerRef.current) {
            scannerRef.current.clear();
        }
    }

    return () => {
        if (scannerRef.current) {
            scannerRef.current.clear();
        }
    };
  }, [scanning]);

  async function onScanSuccess(decodedText: string) {
    if (processing) return;
    setProcessing(true);
    setScanning(false); // Stop scanner once we have a hit

    try {
        const member = await getMemberById(decodedText);
        
        if (!member) {
            setScanResult({ success: false, message: "Member record not found. Please verify the QR code." });
        } else if (!member.isActive) {
            setScanResult({ success: false, member, message: "This membership has been suspended or deactivated." });
        } else {
            // Check expiry
            const isExpired = member.planEndDate.toDate() < new Date();
            if (isExpired) {
                setScanResult({ success: false, member, message: "Membership has expired. Renewal required." });
            } else {
                await markAttendance(member.uid, member.name, member.phone, 'qr');
                setScanResult({ success: true, member, message: "Attendance marked successfully." });
                showToast({ message: `Welcome back, ${member.name}!`, type: 'success' });
            }
        }
    } catch (error) {
        setScanResult({ success: false, message: "System error occurred during check-in." });
    } finally {
        setProcessing(false);
    }
  }

  function onScanFailure(error: any) {
    // Just ignore reading failures (they happen constantly while searching)
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full border border-primary/10">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Active Terminal</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Entry Verification</h1>
        <p className="text-sm text-on-surface-variant font-medium uppercase tracking-widest opacity-60">Regent Fitness Club • Terminal 01</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-[#e7bdb7]/20 shadow-sm relative overflow-hidden group min-h-[400px] flex flex-col justify-center">
            {!scanning ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 rounded-3xl bg-[#f5f3f3] flex items-center justify-center text-primary border border-primary/5 group-hover:scale-105 transition-transform duration-500">
                  <Scan size={44} strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#1b1c1c]">Ready to Scan</h3>
                  <p className="text-sm text-on-surface-variant max-w-[240px] mx-auto font-medium">Position the member QR code within the frame to authenticate</p>
                </div>
                <button 
                  onClick={() => setScanning(true)}
                  className="px-10 py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary-container transition-all active:scale-95 shadow-xl shadow-primary/20"
                >
                  Start Scanning
                </button>
              </div>
            ) : (
              <div id="reader" className="w-full h-full rounded-2xl overflow-hidden animate-in zoom-in-95 border-2 border-primary/10"></div>
            )}

            {scanning && (
              <button 
                onClick={() => setScanning(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md border border-[#e7bdb7]/20 flex items-center justify-center text-on-surface hover:bg-white transition-colors z-10"
              >
                <X size={20} />
              </button>
            )}
            
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-secondary/5 border border-secondary/10">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/5">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Optimization Active</p>
              <p className="text-xs text-on-surface-variant font-semibold">Automatic member identification enabled</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#e7bdb7]/20 shadow-sm flex flex-col justify-center">
            <h3 className="text-[10px] font-black text-[#5d3f3c]/40 uppercase tracking-[0.25em] mb-8 flex items-center gap-2">
              <div className="w-4 h-[1px] bg-[#5d3f3c]/20"></div>
              Access Protocols
            </h3>
            
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 flex-shrink-0 rounded-2xl bg-[#f5f3f3] border border-[#e7bdb7]/20 flex items-center justify-center text-primary font-black text-lg">1</div>
                <div>
                  <p className="text-sm font-bold text-[#1b1c1c] mb-1">Position QR Code</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-medium">Ensure member app displays the unique QR code clearly. Avoid glare or excessive distance.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 flex-shrink-0 rounded-2xl bg-[#f5f3f3] border border-[#e7bdb7]/20 flex items-center justify-center text-primary font-black text-lg">2</div>
                <div>
                  <p className="text-sm font-bold text-[#1b1c1c] mb-1">Verify Status</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-medium">System will instantly check membership validity, plan status, and outstanding payments.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 flex-shrink-0 rounded-2xl bg-[#f5f3f3] border border-[#e7bdb7]/20 flex items-center justify-center text-primary font-black text-lg">3</div>
                <div>
                  <p className="text-sm font-bold text-[#1b1c1c] mb-1">Automated Entry</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-medium">Once verified, access log is updated. Manual override available for staff.</p>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Result Modal */}
      {scanResult && (
        <GlassModal 
          open={!!scanResult} 
          onClose={() => setScanResult(null)}
          title={scanResult.success ? "Access Granted" : "Access Denied"}
        >
          <div className="text-center py-6 space-y-8">
            <div className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center ${scanResult.success ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-error/10 text-error border-error/20'} border-4 shadow-xl`}>
               {scanResult.success ? <ShieldCheck size={56} /> : <ShieldAlert size={56} />}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#1b1c1c]">{scanResult.success ? "Access Authorized" : "Verification Failed"}</h2>
              <p className="text-sm text-on-surface-variant font-semibold uppercase tracking-widest">{scanResult.message}</p>
            </div>

            {scanResult.member && (
              <div className="p-6 rounded-2xl bg-[#f5f3f3] text-left border border-[#e7bdb7]/20 relative overflow-hidden">
                 <div className="flex items-center gap-4 relative z-10">
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      background: 'linear-gradient(135deg, #af000b, #d81b1b)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 800, fontSize: '1.25rem'
                    }}>{scanResult.member.name[0]}</div>
                    <div>
                      <p className="text-base font-bold text-[#1b1c1c]">{scanResult.member.name}</p>
                      <p className="text-xs text-primary font-black uppercase tracking-widest">{scanResult.member.planName} Member</p>
                    </div>
                 </div>
                 <div className="h-[1px] bg-[#e7bdb7]/30 my-5 relative z-10"></div>
                 <div className="flex justify-between items-center text-xs relative z-10">
                    <span className="text-[#5d3f3c] font-bold uppercase tracking-widest opacity-60">Membership Expiry</span>
                    <span className="font-bold text-[#1b1c1c] bg-white px-3 py-1 rounded-full border border-[#e7bdb7]/20 shadow-sm">
                      {scanResult.member.planEndDate.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                 </div>
                 
                 <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 rounded-full blur-2xl -mr-12 -mt-12"></div>
              </div>
            )}

            <button 
              onClick={() => {
                setScanResult(null);
                setScanning(true);
              }}
              className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${scanResult.success ? 'bg-secondary text-white shadow-xl shadow-secondary/20 hover:bg-secondary/90' : 'bg-primary text-white shadow-xl shadow-primary/20 hover:bg-primary/90'}`}
            >
              Continue Scanning
            </button>
          </div>
        </GlassModal>
      )}

      {/* Processing Loader */}
      <GlassModal open={processing} onClose={() => {}} title="Processing">
         <div className="py-20 flex flex-col items-center justify-center space-y-6">
            <Loader2 className="animate-spin text-primary" size={56} strokeWidth={1.5} />
            <p className="text-sm font-black uppercase tracking-widest text-[#5d3f3c]">Communicating with Server...</p>
         </div>
      </GlassModal>
    </div>

  );
}
