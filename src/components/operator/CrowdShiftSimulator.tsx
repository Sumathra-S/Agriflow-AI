import React, { useState } from 'react';
import {
  Sliders,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Send,
  Sparkles
} from 'lucide-react';

interface CrowdShiftSimulatorProps {
  onApplyPlan?: (shiftedCount: number) => void;
  compact?: boolean;
}

export const CrowdShiftSimulator: React.FC<CrowdShiftSimulatorProps> = ({
  onApplyPlan,
  compact = false
}) => {
  // Slider: 0 to 15 flexible farmers (default 8)
  const [shiftCount, setShiftCount] = useState<number>(8);
  const [isPlanApplied, setIsPlanApplied] = useState<boolean>(false);

  // Baseline values (10 AM & 2 PM)
  const baseline10am = 38;
  const baseline2pm = 9;
  const hourlyCapacity = 20;

  // Dynamic simulation values
  const simulated10am = Math.max(15, baseline10am - shiftCount);
  const simulated2pm = baseline2pm + Math.floor(shiftCount * 1.5); // some natural afternoon expansion

  const getPressureLabel = (count: number) => {
    if (count > 30) return { text: 'HIGH PRESSURE', color: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-600' };
    if (count > 18) return { text: 'MODERATE', color: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500' };
    return { text: 'LOW PRESSURE', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500' };
  };

  const before10Status = getPressureLabel(baseline10am);
  const before2Status = getPressureLabel(baseline2pm);
  const after10Status = getPressureLabel(simulated10am);
  const after2Status = getPressureLabel(simulated2pm);

  const handleApply = () => {
    setIsPlanApplied(true);
    if (onApplyPlan) {
      onApplyPlan(shiftCount);
    }
  };

  return (
    <div className={`rounded-3xl border border-slate-200 bg-white shadow-gov overflow-hidden ${compact ? 'p-5' : 'p-6'}`}>
      {/* Simulation Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Decision Support Only
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-bold text-slate-600">Simulated Operational Scenario</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 mt-1">
            Arrival Redistribution Simulator
          </h3>
          <p className="text-xs text-slate-500">
            Simulate moving flexible uncommitted arrivals to the afternoon before sending advisories.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>Official schedules remain untouched</span>
        </div>
      </div>

      {/* Main Interactive Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* LEFT: Current Plan */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Plan</span>
            <span className="text-[11px] font-mono text-slate-500">Uncoordinated</span>
          </div>

          {/* 10 AM Slot */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-slate-500">10:00 AM</span>
              <p className="text-xl font-black font-mono text-slate-900">{baseline10am} Arrivals</p>
              <span className="text-[10px] text-slate-400">Hourly Capacity: {hourlyCapacity}</span>
            </div>
            <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${before10Status.color}`}>
              <span className={`h-2 w-2 rounded-full ${before10Status.dot}`}></span>
              <span>{before10Status.text}</span>
            </div>
          </div>

          {/* 2 PM Slot */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-slate-500">02:00 PM</span>
              <p className="text-xl font-black font-mono text-slate-900">{baseline2pm} Arrivals</p>
              <span className="text-[10px] text-slate-400">Hourly Capacity: {hourlyCapacity}</span>
            </div>
            <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${before2Status.color}`}>
              <span className={`h-2 w-2 rounded-full ${before2Status.dot}`}></span>
              <span>{before2Status.text}</span>
            </div>
          </div>
        </div>

        {/* MIDDLE: Interactive Redistribution Slider */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center p-2 text-center space-y-2">
          <span className="text-xs font-bold text-slate-700">Move Flexible Arrivals</span>

          <div className="w-full max-w-[140px]">
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={shiftCount}
              onChange={e => {
                setShiftCount(Number(e.target.value));
                setIsPlanApplied(false);
              }}
              className="w-full accent-gov-800 cursor-pointer"
            />
          </div>

          <div className="bg-gov-800 text-white font-mono font-black text-sm px-3 py-1 rounded-xl shadow-xs">
            {shiftCount} Farmers
          </div>

          <span className="text-[10px] text-slate-400 leading-tight">
            Redistribute to recommended 2 PM arrival
          </span>
        </div>

        {/* RIGHT: Simulated Plan */}
        <div className="lg:col-span-5 bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
            <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">Simulated Plan</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Pressure Smoothed
            </span>
          </div>

          {/* 10 AM Slot (Simulated) */}
          <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-slate-500">10:00 AM</span>
              <div className="flex items-center gap-2">
                <p className="text-xl font-black font-mono text-emerald-900">{simulated10am} Arrivals</p>
                <span className="text-xs font-bold text-emerald-700 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-0.5" /> -{shiftCount}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Within manageable throughput</span>
            </div>
            <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${after10Status.color}`}>
              <span className={`h-2 w-2 rounded-full ${after10Status.dot}`}></span>
              <span>{after10Status.text}</span>
            </div>
          </div>

          {/* 2 PM Slot (Simulated) */}
          <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-slate-500">02:00 PM</span>
              <div className="flex items-center gap-2">
                <p className="text-xl font-black font-mono text-slate-900">{simulated2pm} Arrivals</p>
                <span className="text-xs font-bold text-amber-700 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" /> +{Math.floor(shiftCount * 1.5)}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Utilizes afternoon idle capacity</span>
            </div>
            <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${after2Status.color}`}>
              <span className={`h-2 w-2 rounded-full ${after2Status.dot}`}></span>
              <span>{after2Status.text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Outcome Note & Action Button */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>Result:</strong> Potential arrival pressure distribution improved by {Math.round((shiftCount / baseline10am) * 100)}%. Overcrowding averted before peak.
          </span>
        </div>

        <button
          onClick={handleApply}
          className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gov-800 hover:bg-gov-900 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          {isPlanApplied ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              <span>Applied to Review Workflow!</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Apply as Communication Plan</span>
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] text-slate-400 text-center mt-2.5">
        Does not alter official government booking records. Generates targeted guidance advisories for operator approval.
      </p>
    </div>
  );
};
