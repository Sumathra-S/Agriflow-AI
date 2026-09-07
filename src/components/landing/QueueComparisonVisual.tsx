import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserX,
  UserCheck,
  TrendingDown,
  Sparkles,
  Zap,
  Truck
} from 'lucide-react';

interface QueueComparisonVisualProps {
  isDark?: boolean;
}

export const QueueComparisonVisual: React.FC<QueueComparisonVisualProps> = ({ isDark = false }) => {
  const [activeMode, setActiveMode] = useState<'WITH' | 'WITHOUT'>('WITH');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-gov-800 dark:text-emerald-400 bg-gov-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-gov-200 dark:border-emerald-800">
          The Operational Difference
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Why Procurement Centres Need AgriFlow
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Compare the real-world reality of blind arrivals versus predictive arrival coordination.
        </p>

        {/* Toggle Pills */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveMode('WITHOUT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'WITHOUT'
                ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-300 dark:ring-rose-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            ❌ Without AgriFlow (Traditional)
          </button>
          <button
            onClick={() => setActiveMode('WITH')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'WITH'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300 dark:ring-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            ⭐ With AgriFlow (Predictive Coordination)
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* PANEL 1: WITHOUT AGRIFLOW */}
        <div
          className={`rounded-3xl border-2 p-6 sm:p-7 space-y-5 transition-all ${
            activeMode === 'WITHOUT'
              ? 'ring-2 ring-rose-400 dark:ring-rose-600'
              : 'opacity-85'
          } ${
            isDark ? 'bg-slate-900/90 border-rose-900/50 text-white' : 'bg-rose-50/50 border-rose-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between border-b border-rose-200 dark:border-rose-900/60 pb-3">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
              <h4 className="text-base font-black uppercase tracking-wide">Without AgriFlow</h4>
            </div>
            <span className="text-xs font-mono font-bold text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 px-2.5 py-0.5 rounded-full">
              4 to 6 Hours Wait
            </span>
          </div>

          {/* Crowded Queue Diagram */}
          <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 space-y-3 text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              Tractors Packed on Highway Roadside
            </span>
            <div className="text-2xl sm:text-3xl flex justify-center gap-2 py-1 animate-pulse">
              <span>🚜</span>
              <span>👨‍🌾</span>
              <span>🚜</span>
              <span>👨‍🌾</span>
              <span>🚜</span>
              <span>👨‍🌾</span>
            </div>
            <div className="text-xs font-black text-rose-600 dark:text-rose-400 font-mono">
              LONG CONGESTION QUEUE → 48 TROLLEYS
            </div>
          </div>

          {/* Negative Steps */}
          <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            {[
              { text: 'Unannounced Arrival', note: 'All farmers arrive at 9:00 AM hoping for early weighment' },
              { text: 'Weighbridge Bottleneck', note: 'Capacity is 18/hr; 48 arrive simultaneously' },
              { text: 'No Advance Warning', note: 'Farmers stand in extreme sun with grain exposed to weather' },
              { text: 'Distress & Highway Gridlock', note: 'Road blocked for 2 km outside mandi gates' }
            ].map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/70 dark:bg-slate-950/60 border border-rose-100 dark:border-rose-900/40"
              >
                <span className="h-5 w-5 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 font-black flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  ✕
                </span>
                <div>
                  <strong className="text-slate-900 dark:text-white block">{step.text}</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{step.note}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-rose-100/70 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-900 dark:text-rose-200 font-bold text-center">
            Result: Exhausted farmers, high demurrage costs, operational conflict.
          </div>
        </div>

        {/* PANEL 2: WITH AGRIFLOW */}
        <div
          className={`rounded-3xl border-2 p-6 sm:p-7 space-y-5 transition-all ${
            activeMode === 'WITH'
              ? 'ring-2 ring-emerald-400 dark:ring-emerald-600 shadow-xl'
              : 'opacity-85'
          } ${
            isDark ? 'bg-slate-900/90 border-emerald-900/60 text-white' : 'bg-emerald-50/50 border-emerald-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-900/60 pb-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              <h4 className="text-base font-black uppercase tracking-wide">With AgriFlow</h4>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
              ~15 Mins Turnaround
            </span>
          </div>

          {/* Orderly Virtual Queue Diagram */}
          <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 space-y-3 text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              Virtual Queue & Dynamic Arrival Alert
            </span>
            <div className="flex items-center justify-center gap-3 py-1 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                Book Slot
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
              <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                AF-108
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
              <span className="px-2 py-1 rounded-lg bg-emerald-600 text-white shadow-xs">
                Leave: 10:40 AM
              </span>
            </div>
            <div className="text-xs font-black text-emerald-700 dark:text-emerald-400 font-mono">
              ARRIVE EXACTLY WHEN NEEDED → ZERO HIGHWAY WAIT
            </div>
          </div>

          {/* Positive Steps */}
          <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            {[
              { text: 'Capacity-Aware Scheduling', note: 'Selects optimal mandi with available tonnes capacity' },
              { text: 'Virtual Queue State Machine', note: 'Token AF-108 tracks position (#8) while farmer stays home' },
              { text: 'Dynamic Smart Arrival Notice', note: 'Departure alert auto-adjusts if an earlier trolley delays' },
              { text: 'Fast Track Intake & DBT', note: 'Direct Gate 2 entry, 15-min weighment, instant PFMS credit' }
            ].map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/70 dark:bg-slate-950/60 border border-emerald-100 dark:border-emerald-900/40"
              >
                <span className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-black flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-slate-900 dark:text-white block">{step.text}</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{step.note}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-100/70 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 font-bold text-center">
            Result: -67% peak queue reduction, happy farmers, efficient public procurement.
          </div>
        </div>
      </div>
    </div>
  );
};
