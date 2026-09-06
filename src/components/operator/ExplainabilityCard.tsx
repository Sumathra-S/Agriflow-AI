import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  CalendarDays,
  Gauge,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';

export const ExplainabilityCard: React.FC = () => {
  const { congestionRisk, backupStaffActive, farmerAdvisorySent } = useSimulation();

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-gov">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            Why is congestion {congestionRisk === 'HIGH' ? 'high' : congestionRisk === 'MEDIUM' ? 'moderate' : 'low'}?
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational root cause decomposition — transparent multi-factor analysis
          </p>
        </div>
        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          Explainable Flow Logic
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Factor 1: Bookings */}
        <div className="rounded-md border border-slate-200 bg-slate-50/70 p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded bg-gov-100 p-1.5 text-gov-800">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900">
                  {congestionRisk === 'LOW' ? 'Normal Bookings' : 'High bookings today'}
                </h3>
              </div>
              <span className={`inline-flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded ${
                congestionRisk === 'LOW'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {congestionRisk === 'LOW' ? '↓ Baseline' : '↑ Increasing risk'}
              </span>
            </div>

            <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
              {congestionRisk === 'LOW'
                ? 'Scheduled bookings match the standard 30-day baseline for Wednesday.'
                : '+35% compared to usual demand due to sunny harvest weather in Ludhiana block.'}
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Slot Bookings Volume:</span>
            <span className="font-mono font-bold text-slate-900">
              {congestionRisk === 'LOW' ? '18 Bookings' : '38 Bookings (+35%)'}
            </span>
          </div>
        </div>

        {/* Factor 2: Arrival Pace / Velocity */}
        <div className="rounded-md border border-slate-200 bg-slate-50/70 p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded bg-amber-100 p-1.5 text-amber-900">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900">
                  {congestionRisk === 'LOW' ? 'Punctual Arrivals' : 'Faster than usual arrivals'}
                </h3>
              </div>
              <span className={`inline-flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded ${
                congestionRisk === 'LOW'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {congestionRisk === 'LOW' ? '↓ Stable pace' : '↑ Increasing risk'}
              </span>
            </div>

            <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
              {congestionRisk === 'LOW'
                ? 'Farmers are checking in within their assigned 30-minute windows.'
                : '+28% arrival rate since morning as farmers arrived earlier than assigned slots.'}
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Arrival Velocity:</span>
            <span className="font-mono font-bold text-slate-900">
              {congestionRisk === 'LOW' ? 'Normal (1.0x)' : '+28% ahead of schedule'}
            </span>
          </div>
        </div>

        {/* Factor 3: Processing Capacity */}
        <div className="rounded-md border border-slate-200 bg-slate-50/70 p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded bg-slate-200 p-1.5 text-slate-700">
                  <Gauge className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900">
                  {backupStaffActive ? 'Auxiliary Capacity Added' : 'Processing capacity is lower'}
                </h3>
              </div>
              <span className={`inline-flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded ${
                backupStaffActive
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {backupStaffActive ? '↑ Restoring flow' : '↓ Reducing capacity'}
              </span>
            </div>

            <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
              {backupStaffActive
                ? 'Auxiliary weighbridge & additional moisture technician brought online (+4 farmers/hr).'
                : '18 farmers per hour. Weighbridge #2 in routine calibration; throughput throttled.'}
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Active Processing Rate:</span>
            <span className="font-mono font-bold text-slate-900">
              {backupStaffActive ? '22 Farmers / Hour' : '18 Farmers / Hour'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
