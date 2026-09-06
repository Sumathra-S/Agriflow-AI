import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Scale, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const DemandCapacityCard: React.FC = () => {
  const {
    currentQueue,
    expectedArrivals,
    capacityPerHour,
    congestionRisk,
    backupStaffActive
  } = useSimulation();

  // Core system logic: Predicted Demand > Effective Capacity = Higher Congestion Risk
  const isOverloaded = expectedArrivals > capacityPerHour;
  const totalPressureRatio = ((currentQueue + expectedArrivals) / capacityPerHour).toFixed(1);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-gov">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-gov-800" />
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            Demand vs Processing Capacity
          </h2>
        </div>
        <span className="text-xs font-mono font-bold text-slate-500">
          Flow Ratio: {totalPressureRatio}x
        </span>
      </div>

      {/* Main Comparative Metric Rows */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* Demand Column */}
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3.5 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Expected Arrivals (Next Hour)
          </span>
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <span className={`text-3xl font-extrabold ${isOverloaded ? 'text-rose-700' : 'text-slate-900'}`}>
              {expectedArrivals}
            </span>
            <span className="text-xs text-slate-500 font-medium">Farmers</span>
          </div>
          <span className="mt-1 inline-block text-[11px] text-slate-500">
            Incoming arrival pressure
          </span>
        </div>

        {/* Capacity Column */}
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3.5 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Processing Capacity
          </span>
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <span className="text-3xl font-extrabold text-gov-800">
              {capacityPerHour}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ Hour</span>
          </div>
          <span className="mt-1 inline-block text-[11px] text-slate-500">
            {backupStaffActive ? 'Aux Weighbridge Active' : 'Single Weighbridge'}
          </span>
        </div>
      </div>

      {/* Visual Balance Bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="text-slate-600">Capacity Strain Index</span>
          <span className={isOverloaded ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>
            {Math.round((expectedArrivals / capacityPerHour) * 100)}% of Hourly Limit
          </span>
        </div>
        <div className="h-3.5 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              expectedArrivals / capacityPerHour > 1.8
                ? 'bg-rose-600'
                : expectedArrivals / capacityPerHour > 1.0
                ? 'bg-amber-500'
                : 'bg-emerald-600'
            }`}
            style={{ width: `${Math.min(100, (expectedArrivals / (capacityPerHour * 2)) * 100)}%` }}
          />
        </div>
      </div>

      {/* Logic Principle Card */}
      <div className={`mt-4 rounded-md p-3 text-xs border ${
        isOverloaded
          ? 'bg-rose-50 border-rose-200 text-rose-900'
          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
      }`}>
        <div className="flex items-start gap-2">
          {isOverloaded ? (
            <AlertCircle className="h-4 w-4 text-rose-700 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-700 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-bold">
              {isOverloaded
                ? 'Risk: Capacity may not handle expected arrival pressure.'
                : 'Balanced: Centre throughput matches incoming farmer flow.'}
            </p>
            <p className="mt-0.5 text-[11px] opacity-90">
              <span className="font-mono font-semibold">Core System Rule:</span> Predicted Demand ({expectedArrivals}) {isOverloaded ? '>' : '≤'} Effective Capacity ({capacityPerHour}/hr) → {congestionRisk} Congestion Risk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
