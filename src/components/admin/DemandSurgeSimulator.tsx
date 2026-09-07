import React, { useState, useEffect } from 'react';
import {
  demandSurgeSimulatorEngine,
  DemandSurgeState
} from '../../services/engine/demandSurgeSimulatorEngine';
import {
  Zap,
  RotateCcw,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Building2,
  CheckCircle2,
  Scale,
  Sparkles
} from 'lucide-react';

export const DemandSurgeSimulator: React.FC = () => {
  const [state, setState] = useState<DemandSurgeState>(
    demandSurgeSimulatorEngine.getState()
  );

  useEffect(() => {
    return demandSurgeSimulatorEngine.subscribe(updated => {
      setState(updated);
    });
  }, []);

  const handleApplySurge = (tonnes: number) => {
    demandSurgeSimulatorEngine.applySurge(tonnes);
  };

  const handleReset = () => {
    demandSurgeSimulatorEngine.resetSimulation();
  };

  const isOver = state.isOverCapacity;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-gov space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              SIH Grand Finale Killer Feature
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">v2.8 Rebalancing</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
            <span>Demand Surge & Dynamic Centre Redirection Simulator</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulate sudden unbooked crop volume spikes at Centre C to evaluate automatic overflow diversion to Centre B
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors self-start sm:self-auto border border-slate-300"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>RESET DEMO</span>
        </button>
      </div>

      {/* Interactive Surge Trigger Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Inject Demand Surge at Singanallur Hub (Centre C):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handleApplySurge(0)}
            className={`p-3 rounded-xl border text-left transition-all ${
              state.addedSurgeTonnes === 0
                ? 'border-gov-800 bg-gov-50 ring-2 ring-gov-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <span className="text-xs font-bold text-slate-900 block">Baseline (80t)</span>
            <span className="text-[11px] text-slate-500">65t Booked + 15t Walk-In</span>
          </button>

          <button
            onClick={() => handleApplySurge(10)}
            className={`p-3 rounded-xl border text-left transition-all ${
              state.addedSurgeTonnes === 10
                ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <span className="text-xs font-bold text-amber-900 block">+10 TONNES SURGE</span>
            <span className="text-[11px] text-amber-700">Total: 90t (90% Load)</span>
          </button>

          <button
            onClick={() => handleApplySurge(25)}
            className={`p-3 rounded-xl border text-left transition-all ${
              state.addedSurgeTonnes === 25
                ? 'border-rose-600 bg-rose-50 ring-2 ring-rose-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <span className="text-xs font-bold text-rose-900 block">+25 TONNES SURGE</span>
            <span className="text-[11px] text-rose-700">Total: 105t (OVER CAPACITY)</span>
          </button>

          <button
            onClick={() => handleApplySurge(50)}
            className={`p-3 rounded-xl border text-left transition-all ${
              state.addedSurgeTonnes === 50
                ? 'border-rose-700 bg-rose-100 ring-2 ring-rose-700/30'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <span className="text-xs font-bold text-rose-950 block">+50 TONNES SURGE</span>
            <span className="text-[11px] text-rose-800">Total: 130t (CRITICAL SPIKE)</span>
          </button>
        </div>
      </div>

      {/* Live Utilization Meter */}
      <div className={`rounded-2xl border p-5 transition-all ${
        isOver
          ? 'bg-rose-50 border-rose-300'
          : state.utilizationPct >= 90
          ? 'bg-amber-50 border-amber-300'
          : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Target Facility:</span>
            <h3 className="text-base font-black text-slate-900">{state.centreName}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full font-mono text-xs font-black ${
              isOver
                ? 'bg-rose-600 text-white animate-pulse'
                : state.utilizationPct >= 90
                ? 'bg-amber-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}>
              {state.status} • {state.utilizationPct}%
            </span>
          </div>
        </div>

        {/* Dual Metric Display: Farmer Count AND Tonnes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white rounded-xl p-3 border border-slate-200 text-center font-mono">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">Daily Capacity</span>
            <strong className="text-slate-900 text-lg">{state.capacityTonnes}t</strong>
            <span className="text-[10px] text-slate-400 block font-sans">~45 trolleys</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">Booked Load</span>
            <strong className="text-gov-800 text-lg">{state.baseBookedTonnes + state.addedSurgeTonnes}t</strong>
            <span className="text-[10px] text-slate-400 block font-sans">+{state.addedSurgeTonnes}t added</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">Predicted Walk-In</span>
            <strong className="text-amber-800 text-lg">+{state.baseWalkInTonnes}t</strong>
            <span className="text-[10px] text-slate-400 block font-sans">25% model ratio</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">Total Demand</span>
            <strong className={`text-lg ${isOver ? 'text-rose-700' : 'text-slate-900'}`}>
              {state.totalExpectedDemandTonnes}t
            </strong>
            <span className="text-[10px] text-slate-400 block font-sans">
              {isOver ? `+${state.totalExpectedDemandTonnes - 100}t surplus` : `${100 - state.totalExpectedDemandTonnes}t free`}
            </span>
          </div>
        </div>

        {/* Progress Bar with Overcapacity Indicator */}
        <div className="mt-4 space-y-1.5">
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${Math.min(100, state.utilizationPct)}%` }}
              className={`h-full transition-all duration-500 ${
                isOver ? 'bg-rose-600' : state.utilizationPct >= 90 ? 'bg-amber-500' : 'bg-gov-800'
              }`}
            />
          </div>
        </div>

        {/* Advisory Message */}
        <p className="text-xs font-semibold text-slate-700 mt-3 flex items-start gap-1.5">
          {isOver ? (
            <AlertTriangle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          )}
          <span>{state.systemAdvisory}</span>
        </p>
      </div>

      {/* AUTOMATIC REDIRECTION CARD WHEN OVER CAPACITY */}
      {isOver && (
        <div className="bg-gradient-to-br from-gov-900 to-slate-900 text-white rounded-2xl p-5 space-y-4 border border-rose-500/40 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/80 border border-rose-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5" /> Automated Load Balancer Active
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              Surplus: {state.totalExpectedDemandTonnes - 100} Tonnes
            </span>
          </div>

          <div>
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <span>Traffic Overflow Redirected to Sulur APMC (Centre B)</span>
              <ArrowRight className="h-4 w-4 text-emerald-400" />
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Singanallur capacity limit reached. AgriFlow intelligence has dynamically updated the farmer app and dispatching SMS/voice reroute advisories:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Absorbing Centre</span>
              <strong className="text-white text-sm">Centre B (Sulur)</strong>
              <span className="text-[11px] text-emerald-300 block mt-0.5">45 Tonnes Free Headroom</span>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Farmer Wait Impact</span>
              <strong className="text-white text-sm">~15 Mins at Sulur</strong>
              <span className="text-[11px] text-emerald-300 block mt-0.5">Avoids 80m Singanallur Gridlock</span>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Advisory Broadcast</span>
              <strong className="text-white text-sm">SMS & IVR Dispatched</strong>
              <span className="text-[11px] text-emerald-300 block mt-0.5">To 14 approaching tractors</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              New booking recommendations at Singanallur dynamically shifted to Sulur
            </span>
            <button
              onClick={handleReset}
              className="text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-lg transition-colors"
            >
              Reset to 80t Baseline
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
