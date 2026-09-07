import React, { useState, useEffect } from 'react';
import { quantityDemandEngine } from '../../services/engine/quantityDemandEngine';
import { QuantityDemandMetrics } from '../../types/procurement';
import {
  Building2,
  Truck,
  Tractor,
  Scale,
  Clock,
  Users,
  CheckCircle2,
  Activity,
  Layers,
  Radio,
  Sparkles
} from 'lucide-react';

interface InteractiveCentreVisualProps {
  isDark?: boolean;
}

export const InteractiveCentreVisual: React.FC<InteractiveCentreVisualProps> = ({ isDark = false }) => {
  const [centreData, setCentreData] = useState<QuantityDemandMetrics>(() =>
    quantityDemandEngine.getCentreMetrics('centre-c')
  );

  useEffect(() => {
    return quantityDemandEngine.subscribe(() => {
      setCentreData(quantityDemandEngine.getCentreMetrics('centre-c'));
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Section Subheading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gov-800 dark:text-emerald-400">
            Real-Time Mandi Architecture
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            Inside an AgriFlow-Enabled Procurement Centre
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intelligent coordination of gates, certified scales, moisture labs, and digital token boards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            LIVE TELEMETRY
          </span>
        </div>
      </div>

      {/* Main Centre Graphic Container */}
      <div
        className={`rounded-3xl border-2 p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all ${
          isDark
            ? 'bg-gradient-to-b from-[#0b1523] to-[#040912] border-slate-800 text-white'
            : 'bg-gradient-to-b from-white to-slate-50 border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Operational Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gov-800 text-white dark:bg-emerald-700 rounded-2xl shadow-sm">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-black">{centreData.centreName}</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  ● 🟢 LOW LOAD
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{centreData.location}</p>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
            <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] font-sans font-bold text-slate-500 block uppercase">Waiting</span>
              <strong className="text-sm text-slate-900 dark:text-white">20 Farmers</strong>
            </div>
            <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] font-sans font-bold text-slate-500 block uppercase">Counters</span>
              <strong className="text-sm text-gov-800 dark:text-emerald-400">3 Active</strong>
            </div>
            <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] font-sans font-bold text-slate-500 block uppercase">Est. Wait</span>
              <strong className="text-sm text-slate-900 dark:text-white">~25 Mins</strong>
            </div>
            <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-emerald-950/40 border-emerald-800/40' : 'bg-emerald-50 border-emerald-200'}`}>
              <span className="text-[10px] font-sans font-bold text-emerald-700 dark:text-emerald-400 block uppercase">Capacity</span>
              <strong className="text-sm text-emerald-700 dark:text-emerald-300">{centreData.quantityUtilizationPct}% Load</strong>
            </div>
          </div>
        </div>

        {/* Visual Architectural Map of the Yard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
          {/* LEFT: Intake Gates & Traffic Flow */}
          <div className="lg:col-span-4 space-y-4">
            <div
              className={`p-4 rounded-2xl border ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
              } space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-gov-800 dark:text-emerald-400" /> Gate Intake Queues
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">SMOOTH FLOW</span>
              </div>

              {/* Gate 1 Walk-ins */}
              <div
                className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Gate 1: Unbooked Walk-Ins</span>
                  <span className="text-[11px] text-slate-500">Predicted: +18t unannounced</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900">
                  4 Waiting
                </span>
              </div>

              {/* Gate 2 Scheduled Slots */}
              <div
                className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                  isDark ? 'bg-emerald-950/30 border-emerald-900' : 'bg-emerald-50/70 border-emerald-200'
                }`}
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Gate 2: Smart Booked Slots</span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400">Guaranteed Fast Intake</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">
                  Token AF-108
                </span>
              </div>
            </div>

            {/* Live Token LED Board Simulation */}
            <div className="bg-slate-950 border-2 border-emerald-500/50 rounded-2xl p-4 text-white font-mono shadow-lg space-y-2">
              <div className="flex items-center justify-between text-[10px] text-emerald-400 uppercase tracking-widest">
                <span>DIGITAL TOKEN CALL BOARD</span>
                <span className="animate-pulse">● LIVE</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-black/60 p-2.5 rounded-lg border border-emerald-500/30">
                  <span className="text-[9px] text-slate-400 block">SERVING NOW</span>
                  <span className="text-xl font-black text-amber-400">AF-098</span>
                  <span className="text-[9px] text-emerald-400 block mt-0.5">Weighbridge #1</span>
                </div>
                <div className="bg-black/60 p-2.5 rounded-lg border border-emerald-500/30">
                  <span className="text-[9px] text-slate-400 block">NEXT IN LINE</span>
                  <span className="text-xl font-black text-emerald-300">AF-108</span>
                  <span className="text-[9px] text-slate-300 block mt-0.5">Ravi Kumar (1.0t)</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Active Processing Stations (Weighing, Testing, Unloading) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Counter 1: Electronic Weighbridge */}
              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold">
                    <Scale className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>
                <div>
                  <strong className="text-sm text-slate-900 dark:text-white block">Weighbridge #1 (60t)</strong>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Automated Electronic Scale</p>
                </div>
                <div className={`p-2 rounded-lg font-mono text-[11px] border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span>Current: </span>
                  <strong className="text-blue-700 dark:text-blue-400">7,800 kg Gross</strong>
                </div>
              </div>

              {/* Counter 2: Quality & Moisture Desk */}
              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold">
                    <Activity className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>
                <div>
                  <strong className="text-sm text-slate-900 dark:text-white block">Moisture Testing Lab</strong>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Certified Digital Meter</p>
                </div>
                <div className={`p-2 rounded-lg font-mono text-[11px] border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span>Reading: </span>
                  <strong className="text-emerald-700 dark:text-emerald-400">13.2% (≤14% Pass)</strong>
                </div>
              </div>

              {/* Counter 3: Unloading Bay */}
              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                    <Layers className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>
                <div>
                  <strong className="text-sm text-slate-900 dark:text-white block">Intake Bay 3</strong>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Bulk Grain Offloading</p>
                </div>
                <div className={`p-2 rounded-lg font-mono text-[11px] border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span>Speed: </span>
                  <strong className="text-gov-800 dark:text-emerald-400">18 Tonnes / Hour</strong>
                </div>
              </div>
            </div>

            {/* Centre Capacity Gauge & Visual Load Bar */}
            <div
              className={`p-5 rounded-2xl border space-y-3 ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Facility Capacity Meter: {centreData.bookedQuantityTonnes + centreData.predictedWalkInQuantityTonnes}t / {centreData.capacityTonnes}t
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    72t Booked + 18t Predicted Walk-In Demand = 90t Expected
                  </span>
                </div>
                <span className="text-sm font-black font-mono text-gov-800 dark:text-emerald-300">
                  {centreData.quantityUtilizationPct}%
                </span>
              </div>

              {/* Multi-Segment Capacity Bar */}
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${(centreData.bookedQuantityTonnes / centreData.capacityTonnes) * 100}%` }}
                  className="bg-gov-800 dark:bg-emerald-600 h-full"
                  title="Booked Capacity"
                />
                <div
                  style={{ width: `${(centreData.predictedWalkInQuantityTonnes / centreData.capacityTonnes) * 100}%` }}
                  className="bg-amber-500 h-full"
                  title="Predicted Walk-In Volume"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-gov-800 dark:bg-emerald-600" /> Booked: {centreData.bookedQuantityTonnes}t
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> Predicted Walk-In: +{centreData.predictedWalkInQuantityTonnes}t
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" /> Headroom: {centreData.remainingCapacityTonnes.toFixed(0)}t Free
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
