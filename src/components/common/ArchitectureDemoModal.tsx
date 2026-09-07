import React from 'react';
import {
  Cpu,
  X,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Ticket,
  Clock,
  FileText,
  AlertTriangle,
  IndianRupee,
  Layers
} from 'lucide-react';

interface ArchitectureDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDemoModal: React.FC<ArchitectureDemoModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const scenes = [
    {
      num: 1,
      title: 'Farmer Authentication & Session',
      actor: 'Farmer',
      engine: 'Auth & RBAC Service',
      desc: 'Farmer logs in; role-based access restricts data strictly to own profile, token #1024, and payment records.'
    },
    {
      num: 2,
      title: 'Intelligent Slot Allocation',
      actor: 'Intelligence Engine',
      engine: 'Slot Allocation Engine',
      desc: 'Explainable Intelligent Optimization evaluates capacity, queue load, and moisture bays to allocate 11:30 AM.'
    },
    {
      num: 3,
      title: 'Explainability ("Why This Slot?")',
      actor: 'Farmer',
      engine: 'Procurement Intelligence',
      desc: 'Farmer clicks "Why This Slot?" to review the 5 deterministic factors in simple Tamil/Hindi/English.'
    },
    {
      num: 4,
      title: 'Token Generation & Live Queue',
      actor: 'Queue Engine',
      engine: 'Queue & Waiting Estimation',
      desc: 'Token TK-1024 generated. Live queue computes 9 trolleys ahead with ~35 minutes estimated wait.'
    },
    {
      num: 5,
      title: 'Operator Advances Current Token',
      actor: 'Centre Operator',
      engine: 'Queue Engine',
      desc: 'Operator advances queue head to TK-1021. Waiting time instantly recalculates across all waiting farmers.'
    },
    {
      num: 6,
      title: 'Turn Approaching Notification',
      actor: 'Notification Service',
      engine: 'Centralized Notification & Voice',
      desc: 'When tokens ahead <= 3, automated In-App, SMS, and Voice Call alerts are triggered simultaneously.'
    },
    {
      num: 7,
      title: 'Procurement Lifecycle & Payout',
      actor: 'Tracking Engine',
      engine: 'Procurement Tracking Engine',
      desc: 'Progresses through Weighing -> Quality Check -> Acceptance -> DBT payment voucher at MSP ₹2,320/qtl.'
    },
    {
      num: 8,
      title: 'Disruption & Dynamic Rescheduling',
      actor: 'Disruption Engine',
      engine: 'Disruption & Rescheduling Engine',
      desc: '25-minute delay triggers automated queue recalculation and suggests convenient 02:00 PM slot.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gov-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-700 flex items-center justify-center">
              <Layers className="h-5 w-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                AgriFlow Complete System Architecture & 8-Scene Demo Flow
              </h3>
              <p className="text-xs text-gov-200">
                End-to-End Modular Orchestration for Judges & Evaluation Teams
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gov-800 hover:bg-gov-700 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Architecture Diagram Card */}
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-emerald-700" />
                <span>Modular Architecture Diagram (30–60 Second Judge Pitch)</span>
              </span>
              <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded font-mono font-bold">
                Decoupled Monolith
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-emerald-200 font-mono text-xs text-slate-800 leading-relaxed overflow-x-auto">
              <div>👨🌾 Farmer App ──▶ 🔐 Auth (RBAC) ──▶ 🔄 Event Bus</div>
              <div className="text-emerald-700">                          │</div>
              <div>     ┌────────────────────────┼────────────────────────┐</div>
              <div>     ▼                        ▼                        ▼</div>
              <div>🤖 Intelligence        🎫 Queue Engine          📊 Lifecycle</div>
              <div>   & Slot Allocation      & Wait Estimate           Tracking</div>
              <div>     │                        │                        │</div>
              <div>     └────────────────────────┼────────────────────────┘</div>
              <div className="text-emerald-700">                          ▼</div>
              <div>              🔔 Centralized Notification Service</div>
              <div>              ├── App ── SMS ── Voice (TTS) ── Push (Ready)</div>
            </div>
          </div>

          {/* 8-Scene Technical Flow */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900">
              The 8 Connected Scenes of the Technical Demo
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scenes.map(s => (
                <div
                  key={s.num}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gov-800">Scene {s.num}</span>
                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-semibold">
                      {s.engine}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900">{s.title}</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-gov-800 text-white text-xs font-bold hover:bg-gov-900 shadow-xs"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
};
