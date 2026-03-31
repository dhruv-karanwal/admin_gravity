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
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-2 mb-12">
        <h1 className="headline-lg tracking-tight">Entry Verification</h1>
        <p className="text-sm text-on-surface-variant font-medium uppercase tracking-widest">Regent Fitness Club • Terminal 01</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <KineticCard className="p-8 bg-surface-low border-2 border-dashed border-outline-variant/30 relative overflow-hidden group">
            {!scanning ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Scan size={40} />
                </div>
                <div>
                  <h3 className="headline-sm mb-2">Ready to Scan</h3>
                  <p className="text-sm text-on-surface-variant max-w-[240px] mx-auto">Position the member QR code within the frame to authenticate</p>
                </div>
                <button 
                  onClick={() => setScanning(true)}
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary-high transition-all active:scale-95 shadow-xl shadow-primary/20"
                >
                  Active Terminal
                </button>
              </div>
            ) : (
              <div id="reader" className="w-full h-full rounded-2xl overflow-hidden animate-in zoom-in-95"></div>
            )}

            {scanning && (
              <button 
                onClick={() => setScanning(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-surface/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:bg-surface transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </KineticCard>

          <div className="flex items-center gap-4 p-6 rounded-3xl bg-secondary/5 border border-secondary/10">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-secondary uppercase tracking-widest">Optimization Active</p>
              <p className="text-[11px] text-on-surface-variant font-medium">Automatic member identification enabled</p>
            </div>
          </div>
        </div>

        <KineticCard className="p-8 h-full flex flex-col justify-center">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-8">Access Protocols</h3>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-low border border-outline-variant/30 flex items-center justify-center text-primary font-bold">1</div>
                <div>
                  <p className="text-sm font-bold mb-1">Position QR Code</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-medium">Ensure member app displays the unique QR code clearly. Avoid glare or excessive distance.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-low border border-outline-variant/30 flex items-center justify-center text-primary font-bold">2</div>
                <div>
                  <p className="text-sm font-bold mb-1">Verify Status</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-medium">System will instantly check membership validity, plan status, and outstanding payments.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-low border border-outline-variant/30 flex items-center justify-center text-primary font-bold">3</div>
                <div>
                  <p className="text-sm font-bold mb-1">Automated Entry</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-medium">Once verified, access log is updated. Manual override available for staff.</p>
                </div>
              </div>
            </div>
        </KineticCard>
      </div>

      {/* Result Modal */}
      {scanResult && (
        <GlassModal 
          open={!!scanResult} 
          onClose={() => setScanResult(null)}
          title={scanResult.success ? "Access Granted" : "Access Denied"}
        >
          <div className="text-center py-6 space-y-6">
            <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${scanResult.success ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
               {scanResult.success ? <ShieldCheck size={48} /> : <ShieldAlert size={48} />}
            </div>

            <div>
              <h2 className="headline-md mb-2">{scanResult.success ? "Access Authorized" : "Verification Failed"}</h2>
              <p className="text-sm text-on-surface-variant font-medium">{scanResult.message}</p>
            </div>

            {scanResult.member && (
              <div className="p-6 rounded-3xl bg-surface-low text-left space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-lowest border border-outline-variant/30 flex items-center justify-center text-primary font-bold">{scanResult.member.name[0]}</div>
                    <div>
                      <p className="text-sm font-bold">{scanResult.member.name}</p>
                      <p className="text-xs text-on-surface-variant font-medium">{scanResult.member.planName} Member</p>
                    </div>
                 </div>
                 <div className="h-[1px] bg-outline-variant/30"></div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant font-bold uppercase tracking-widest">Valid Until</span>
                    <span className="font-bold">{scanResult.member.planEndDate.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                 </div>
              </div>
            )}

            <button 
              onClick={() => {
                setScanResult(null);
                setScanning(true);
              }}
              className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${scanResult.success ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-surface-low hover:bg-surface-lowest text-on-surface'}`}
            >
              Continue Scanning
            </button>
          </div>
        </GlassModal>
      )}

      {/* Processing Loader */}
      <GlassModal open={processing} onClose={() => {}} title="Processing">
         <div className="py-20 flex flex-col items-center justify-center space-y-6">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Communicating with Server...</p>
         </div>
      </GlassModal>
    </div>
  );
}
