import React, { useState, useEffect } from 'react';
import { whatIfSimulatorEngine } from '../../services/engine/whatIfSimulatorEngine';
import {
  WhatIfLevers,
  WhatIfSimulationResult,
  AiInterventionProposal
} from '../../types/procurement';
import {
  Sliders,
  TrendingDown,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Scale,
  Zap,
  ArrowRight
} from 'lucide-react';
import { AiInterventionModal } from './AiInterventionModal';

export const WhatIfControlRoom: React.FC = () => {
  const [levers, setLevers] = useState<WhatIfLevers>(whatIfSimulatorEngine.getLevers());
  const [result, setResult] = useState<WhatIfSimulationResult>(whatIfSimulatorEngine.calculateSimulation());
  const [proposals, setProposals] = useState<AiInterventionProposal[]>(whatIfSimulatorEngine.getProposals());
  const [selectedProposal, setSelectedProposal] = useState<AiInterventionProposal | null>(null);

  useEffect(() => {
    const unsubSim = whatIfSimulatorEngine.subscribe(res => {
      setResult(res);
    });
    const unsubProp = whatIfSimulatorEngine.subscribeProposals(props => {
      setProposals(props);
    });
    return () => {
      unsubSim();
      unsubProp();
    };
  }, []);

  const handleLeverChange = (updates: Partial<WhatIfLevers>) => {
    const newLevers = { ...levers, ...updates };
    setLevers(newLevers);
    const newResult = whatIfSimulatorEngine.updateLevers(newLevers);
    setResult(newResult);
  };

  const applyPreset = (presetName: string) => {
    let preset: WhatIfLevers;
    switch (presetName) {
      case 'SURGE':
        preset = {
          extraArrivals: 15,
          surgePercentage: 45,
          capacityModifierPct: 0,
          weighbridgesOffline: 0,
          temporaryCounterAdded: true,
          advisoryShiftAcceptancePct: 70
        };
        break;
      case 'BREAKDOWN':
        preset = {
          extraArrivals: 0,
          surgePercentage: 15,
          capacityModifierPct: -25,
          weighbridgesOffline: 1,
          temporaryCounterAdded: true,
          advisoryShiftAcceptancePct: 75
        };
        break;
      case 'GRIDLOCK':
        preset = {
          extraArrivals: 30,
          surgePercentage: 75,
          capacityModifierPct: -30,
          weighbridgesOffline: 1,
          temporaryCounterAdded: false,
          advisoryShiftAcceptancePct: 50
        };
        break;
      default: // BALANCED
        preset = {
          extraArrivals: 0,
          surgePercentage: 0,
          capacityModifierPct: 0,
          weighbridgesOffline: 0,
          temporaryCounterAdded: false,
          advisoryShiftAcceptancePct: 60
        };
        break;
    }
    setLevers(preset);
    const newResult = whatIfSimulatorEngine.updateLevers(preset);
    setResult(newResult);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gov-100 rounded-xl text-gov-800">
              <Sliders className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                What-If Scenario Simulation Control Room
              </h2>
              <p className="text-xs text-slate-500">
                Simulate demand spikes, weighbridge outages, and dynamic human-in-the-loop AI interventions
              </p>
            </div>
          </div>
        </div>

        {/* Preset Quick Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('SURGE')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors"
          >
            🌾 Harvest Surge (+45%)
          </button>
          <button
            onClick={() => applyPreset('BREAKDOWN')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 transition-colors"
          >
            ⚠️ Weighbridge Breakdown (-1 WB)
          </button>
          <button
            onClick={() => applyPreset('GRIDLOCK')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-900 text-white hover:bg-red-800 transition-colors"
          >
            🚨 Max Crisis Gridlock
          </button>
          <button
            onClick={() => applyPreset('BALANCED')}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Reset to Balanced Baseline"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Simulator Levers & Real-Time Impact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Levers (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              <span>Operational Simulation Levers</span>
            </h3>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
              Live Queuing Math
            </span>
          </div>

          {/* Lever 1: Harvest Surge % */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-bold">Unannounced Arrival Surge</span>
              <span className="font-mono text-amber-400 font-black">+{levers.surgePercentage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={levers.surgePercentage}
              onChange={e => handleLeverChange({ surgePercentage: parseInt(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Lever 2: Extra Volume (Farmers) */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-bold">Additional Inflow Volume</span>
              <span className="font-mono text-amber-400 font-black">+{levers.extraArrivals} farmers</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={levers.extraArrivals}
              onChange={e => handleLeverChange({ extraArrivals: parseInt(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Lever 3: Weighbridges Offline */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-bold">Weighbridges Offline / Maintenance</span>
              <span className="font-mono text-rose-400 font-black">{levers.weighbridgesOffline} of 2 offline</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleLeverChange({ weighbridgesOffline: num })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                    levers.weighbridgesOffline === num
                      ? 'bg-rose-700 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {num === 0 ? 'All 2 Active' : `${num} Offline`}
                </button>
              ))}
            </div>
          </div>

          {/* Lever 4: Advisory Shift Acceptance Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-bold">Farmer Advisory Shift Acceptance</span>
              <span className="font-mono text-emerald-400 font-black">{levers.advisoryShiftAcceptancePct}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="5"
              value={levers.advisoryShiftAcceptancePct}
              onChange={e => handleLeverChange({ advisoryShiftAcceptancePct: parseInt(e.target.value) })}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Lever 5: Temporary Counter Toggle */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-white block">Auxiliary Gate / Temp Counter</span>
              <span className="text-[11px] text-slate-400">+8 farmers/hr throughput expansion</span>
            </div>
            <button
              onClick={() => handleLeverChange({ temporaryCounterAdded: !levers.temporaryCounterAdded })}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                levers.temporaryCounterAdded
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {levers.temporaryCounterAdded ? 'ENABLED (+8/hr)' : 'DISABLED'}
            </button>
          </div>
        </div>

        {/* Right Column: Without vs With AgriFlow Side-by-Side (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* WITHOUT AgriFlow (Status Quo) */}
            <div className="bg-rose-50/90 border-2 border-rose-300 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-200/80 px-2 py-0.5 rounded">
                  Without AgriFlow (Status Quo)
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  result.withoutIntervention.riskLevel === 'HIGH'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-500 text-slate-950'
                }`}>
                  {result.withoutIntervention.riskLevel} CONGESTION
                </span>
              </div>

              <div>
                <span className="text-xs text-rose-800 font-bold block">Peak Waiting Time</span>
                <span className="text-3xl font-black font-mono text-rose-950 block mt-0.5">
                  {result.withoutIntervention.peakWaitMinutes} min
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-rose-200 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Queue Length</span>
                  <span className="font-black font-mono text-slate-900">
                    {result.withoutIntervention.queueLength} vehicles
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Over-Capacity</span>
                  <span className="font-black font-mono text-slate-900">
                    {result.withoutIntervention.overCapacityHours} hrs gridlock
                  </span>
                </div>
              </div>
            </div>

            {/* WITH AgriFlow (Active Orchestration) */}
            <div className="bg-emerald-50/90 border-2 border-emerald-500 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded-bl-lg uppercase">
                Optimized
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded">
                  With AgriFlow AI
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white">
                  {result.withIntervention.riskLevel} STABLE
                </span>
              </div>

              <div>
                <span className="text-xs text-emerald-800 font-bold block">Peak Waiting Time</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black font-mono text-emerald-950">
                    {result.withIntervention.peakWaitMinutes} min
                  </span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-200/90 px-2 py-0.5 rounded-full">
                    -{result.withIntervention.waitReductionMinutes} min saved
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Queue Length</span>
                  <span className="font-black font-mono text-slate-900">
                    {result.withIntervention.queueLength} vehicles
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Shifted Inflow</span>
                  <span className="font-black font-mono text-emerald-800">
                    {result.withIntervention.farmersShifted} farmers to 2 PM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Intervention Proposals Review Section */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-gov-800" />
                  <span>AI Intervention Proposals (Human-in-the-Loop Review)</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  AgriFlow recommends interventions; Procurement Officer retains 100% discretionary authority.
                </p>
              </div>
              <span className="text-[10px] bg-gov-100 text-gov-800 px-2.5 py-1 rounded-full font-bold">
                {proposals.filter(p => p.state === 'APPROVED').length}/{proposals.length} Approved
              </span>
            </div>

            <div className="space-y-2.5">
              {proposals.map(prop => (
                <div
                  key={prop.id}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    prop.state === 'APPROVED'
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : prop.state === 'REJECTED'
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-white border-slate-300 hover:border-gov-400'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black text-slate-500">
                        {prop.id}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        prop.state === 'APPROVED'
                          ? 'bg-emerald-600 text-white'
                          : prop.state === 'REJECTED'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-400 text-slate-950'
                      }`}>
                        {prop.state.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                        {prop.confidencePct}% confidence
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-slate-900">
                      {prop.title}
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      {prop.impactEstimate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setSelectedProposal(prop)}
                      className="px-3 py-1.5 bg-gov-800 hover:bg-gov-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                    >
                      {prop.state === 'PENDING_REVIEW' ? 'Review & Decide' : 'View Audit Details'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Operator Intervention Decision Modal */}
      {selectedProposal && (
        <AiInterventionModal
          isOpen={true}
          proposal={selectedProposal}
          onClose={() => setSelectedProposal(null)}
        />
      )}
    </div>
  );
};
