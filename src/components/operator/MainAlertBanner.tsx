import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { AlertTriangle, BellRing, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';

export const MainAlertBanner: React.FC = () => {
  const {
    congestionRisk,
    farmerAdvisorySent,
    backupStaffActive,
    executeAction,
    operatorActions
  } = useSimulation();

  if (congestionRisk === 'LOW') {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-emerald-100 p-2 text-emerald-800">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-emerald-900">Procurement Flow Normal</h3>
                <span className="rounded bg-emerald-200 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                  LOW RISK
                </span>
              </div>
              <p className="mt-0.5 text-xs text-emerald-800">
                Current arrival rate is comfortably within centre processing capacity. No operational bottleneck detected.
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-xs font-mono font-medium text-emerald-700">Estimated gate wait: ~12 min</span>
          </div>
        </div>
      </div>
    );
  }

  if (congestionRisk === 'MEDIUM') {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50/90 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-amber-100 p-2 text-amber-800 mt-0.5">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-amber-950">Moderate Arrival Pressure Approaching</h3>
                <span className="rounded bg-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                  MEDIUM RISK
                </span>
              </div>
              <p className="mt-0.5 text-xs text-amber-900">
                Demand is closely matching hourly capacity. Recommended action: Monitor weighbridge flow and ensure moisture testing desks remain staffed.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => executeAction('act-1')}
              className="rounded bg-amber-800 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-900 transition-colors"
            >
              {farmerAdvisorySent ? 'Advisory Active' : 'Send Farmer Advisory'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // HIGH CONGESTION (Core operational alert as requested in Section 6)
  return (
    <div className="rounded-lg border-2 border-rose-400 bg-rose-50 p-4 sm:p-5 shadow-gov-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="rounded-md bg-rose-600 p-2.5 text-white shadow-xs mt-0.5">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-rose-950">High Congestion Expected</h2>
              <span className="rounded-md bg-rose-600 px-2.5 py-0.5 text-xs font-extrabold text-white uppercase tracking-wider">
                Risk: HIGH
              </span>
              <span className="rounded-md bg-rose-200/80 px-2 py-0.5 text-xs font-semibold text-rose-900">
                Peak Window: 12:00 PM – 1:00 PM
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-rose-900">
              Peak arrival pressure expected within the next 45–60 minutes.
            </p>
            <p className="mt-0.5 text-xs text-rose-800">
              <span className="font-semibold">Recommended Action:</span> Notify upcoming farmers and prepare available processing capacity.
            </p>
          </div>
        </div>

        {/* Operational Dispatch Actions */}
        <div className="flex flex-wrap items-center gap-2.5 lg:self-center border-t lg:border-t-0 pt-2 lg:pt-0 border-rose-200">
          <button
            onClick={() => executeAction('act-1')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-bold shadow-xs transition-colors ${
              farmerAdvisorySent
                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                : 'bg-rose-700 text-white hover:bg-rose-800 ring-2 ring-rose-300'
            }`}
          >
            {farmerAdvisorySent ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Advisory Broadcasted</span>
              </>
            ) : (
              <>
                <BellRing className="h-4 w-4" />
                <span>Notify Upcoming Farmers</span>
              </>
            )}
          </button>

          <button
            onClick={() => executeAction('act-2')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold border transition-colors ${
              backupStaffActive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {backupStaffActive ? 'Aux Weighbridge Active' : 'Add Processing Capacity'}
          </button>
        </div>
      </div>
    </div>
  );
};
