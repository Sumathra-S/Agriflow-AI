import React from 'react';
import {
  Users,
  Scale,
  TrendingUp,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Cpu
} from 'lucide-react';

interface IntelligenceDataFlowVisualProps {
  isDark?: boolean;
}

export const IntelligenceDataFlowVisual: React.FC<IntelligenceDataFlowVisualProps> = ({
  isDark = false
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-gov-800 dark:text-emerald-400 bg-gov-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-gov-200 dark:border-emerald-800">
          Operational Intelligence Pipeline
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Demand → Prediction → Recommendation → Action
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          No vague AI buzzwords. Defensible, quantity-aware mathematical flow modeling.
        </p>
      </div>

      {/* 4-Stage Connected Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {/* STAGE 1: DEMAND INPUTS */}
        <div
          className={`p-5 rounded-2xl border-2 space-y-3 transition-all relative ${
            isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-gov-800 dark:text-emerald-400 uppercase bg-gov-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-gov-200 dark:border-emerald-800">
              Stage 1
            </span>
            <Users className="h-4 w-4 text-gov-700 dark:text-emerald-400" />
          </div>

          <h4 className="text-base font-black">1. Multi-Stream Demand</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Captures booked slots PLUS explicit unbooked walk-in estimations:
          </p>

          <div className={`p-3 rounded-xl border text-xs font-mono space-y-1.5 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between">
              <span className="text-slate-500">Booked:</span>
              <strong>72 Tonnes</strong>
            </div>
            <div className="flex justify-between text-amber-700 dark:text-amber-400">
              <span>+25% Walk-in:</span>
              <strong>+18 Tonnes</strong>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1 font-bold">
              <span>Expected Load:</span>
              <strong className="text-gov-800 dark:text-emerald-400">90 Tonnes</strong>
            </div>
          </div>
        </div>

        {/* STAGE 2: PHYSICAL CAPACITY CONSTRAINTS */}
        <div
          className={`p-5 rounded-2xl border-2 space-y-3 transition-all relative ${
            isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-gov-800 dark:text-emerald-400 uppercase bg-gov-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-gov-200 dark:border-emerald-800">
              Stage 2
            </span>
            <Scale className="h-4 w-4 text-blue-700 dark:text-blue-400" />
          </div>

          <h4 className="text-base font-black">2. Capacity Limits</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cross-referenced with physical infrastructure throughput:
          </p>

          <div className={`p-3 rounded-xl border text-xs font-mono space-y-1.5 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between">
              <span className="text-slate-500">Centre C Cap:</span>
              <strong>100 Tonnes</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Weighbridges:</span>
              <strong>2 Installed (60t)</strong>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1 font-bold">
              <span>Intake Rate:</span>
              <strong className="text-blue-700 dark:text-blue-400">18t / Hour</strong>
            </div>
          </div>
        </div>

        {/* STAGE 3: CONGESTION PREDICTION */}
        <div
          className={`p-5 rounded-2xl border-2 space-y-3 transition-all relative ${
            isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-gov-800 dark:text-emerald-400 uppercase bg-gov-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-gov-200 dark:border-emerald-800">
              Stage 3
            </span>
            <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>

          <h4 className="text-base font-black">3. Risk Prediction</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gradient boosting model forecasts queue curves 2 hours ahead:
          </p>

          <div className={`p-3 rounded-xl border text-xs font-mono space-y-1.5 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between">
              <span className="text-slate-500">Peak Window:</span>
              <strong>11:30–13:00</strong>
            </div>
            <div className="flex justify-between text-amber-700 dark:text-amber-400">
              <span>Risk Tier:</span>
              <strong>NEAR_CAPACITY</strong>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1 font-bold">
              <span>Wait Without Flow:</span>
              <strong className="text-rose-600">~58 Mins</strong>
            </div>
          </div>
        </div>

        {/* STAGE 4: COORDINATED ACTION */}
        <div
          className={`p-5 rounded-2xl border-2 space-y-3 transition-all relative ${
            isDark
              ? 'bg-emerald-950/40 border-emerald-800/80 text-white'
              : 'bg-emerald-50/80 border-emerald-300 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 uppercase bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded">
              Stage 4
            </span>
            <Compass className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
          </div>

          <h4 className="text-base font-black">4. Coordinated Action</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Dispatches automated recommendations to prevent congestion:
          </p>

          <div className={`p-3 rounded-xl border text-xs font-mono space-y-1.5 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-emerald-200'
          }`}>
            <div className="text-emerald-800 dark:text-emerald-400 font-bold">
              ✓ Smart Arrival: 10:40 AM
            </div>
            <div className="text-slate-700 dark:text-slate-300">
              ✓ Sulur Hub Bypass Offered
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-1 font-bold text-emerald-700 dark:text-emerald-300">
              Final Wait: ~18 Mins (-67%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
