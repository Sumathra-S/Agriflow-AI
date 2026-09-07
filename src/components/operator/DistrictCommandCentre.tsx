import React, { useState } from 'react';
import { smartCentreAllocationEngine, COIMBATORE_CENTRE_NETWORK } from '../../services/engine/smartCentreAllocationEngine';
import { CentreNetworkNode, CentreHealthStatus } from '../../types/procurement';
import {
  Building2,
  AlertTriangle,
  Users,
  Clock,
  Send,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Scale,
  Sparkles,
  MapPin,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { auditTrailService } from '../../services/engine/auditTrailService';

export const DistrictCommandCentre: React.FC = () => {
  const [network, setNetwork] = useState<CentreNetworkNode[]>(smartCentreAllocationEngine.getNetwork());
  const [isRebalancingDispatched, setIsRebalancingDispatched] = useState<boolean>(false);
  const [weights, setWeights] = useState(smartCentreAllocationEngine.getWeights());
  const [showConfig, setShowConfig] = useState<boolean>(false);

  const handleDispatchRebalance = () => {
    setIsRebalancingDispatched(true);

    // Update Singanallur & Ramanathapuram load
    smartCentreAllocationEngine.updateCentreNode('CENTRE-01', {
      currentQueue: 14,
      utilizationPct: 68,
      averageWaitMinutes: 28,
      healthStatus: 'WATCH'
    });

    smartCentreAllocationEngine.updateCentreNode('CENTRE-02', {
      currentQueue: 15,
      utilizationPct: 78,
      averageWaitMinutes: 25,
      spareCapacitySlots: 20
    });

    setNetwork(smartCentreAllocationEngine.getNetwork());

    auditTrailService.logEvent(
      'REGIONAL_REBALANCING_EXECUTED',
      'District Operations Controller (ADMIN)',
      'ADMIN',
      {
        divertedFarmersCount: 14,
        fromCentre: 'Singanallur Central APMC',
        toCentre: 'Ramanathapuram Yard',
        projectedSinganallurWaitReduction: '-30 min',
        newUtilization: '68%'
      }
    );
  };

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    const updated = smartCentreAllocationEngine.updateWeights({ [key]: value });
    setWeights(updated);
  };

  const getStatusBadge = (status: CentreHealthStatus) => {
    switch (status) {
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white animate-pulse">🔴 CRITICAL</span>;
      case 'HIGH_LOAD':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-600 text-white">🟠 HIGH LOAD</span>;
      case 'WATCH':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">🟡 WATCH</span>;
      case 'STABLE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">🟢 STABLE</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Cluster Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gov-100 rounded-xl text-gov-800">
              <Building2 className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Coimbatore Regional Procurement Cluster Control
              </h2>
              <p className="text-xs text-slate-500">
                Multi-centre predictive arrival monitoring, live weighbridge utilization & load balancing
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors"
          >
            <Sliders className="h-4 w-4" />
            <span>Allocation Weights ({showConfig ? 'Hide' : 'Configure'})</span>
          </button>
        </div>
      </div>

      {/* Configurable Allocation Weights Panel */}
      {showConfig && (
        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wider">
                Configurable Allocation Scoring Formula Weights
              </h3>
              <p className="text-xs text-slate-400">
                Score = w_wait · S_wait + w_dist · S_dist + w_pref · S_pref + w_cap · S_cap + w_slot · S_slot
              </p>
            </div>
            <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 font-mono">
              Total Weight: {Math.round((weights.waitWeight + weights.distanceWeight + weights.preferenceWeight + weights.capacityWeight + weights.slotWeight) * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[
              { key: 'waitWeight', label: 'Wait Time', val: weights.waitWeight },
              { key: 'distanceWeight', label: 'Distance', val: weights.distanceWeight },
              { key: 'preferenceWeight', label: 'Preferences', val: weights.preferenceWeight },
              { key: 'capacityWeight', label: 'Capacity', val: weights.capacityWeight },
              { key: 'slotWeight', label: 'Slots Ready', val: weights.slotWeight },
            ].map(w => (
              <div key={w.key} className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">{w.label}</span>
                  <span className="font-mono text-emerald-400 font-black">{Math.round(w.val * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.60"
                  step="0.05"
                  value={w.val}
                  onChange={e => handleWeightChange(w.key as any, parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cluster Load Rebalancing Recommendation Banner */}
      <div className={`p-5 rounded-2xl border-2 transition-all ${
        isRebalancingDispatched
          ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
          : 'bg-amber-50 border-amber-400 text-slate-900'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl ${
              isRebalancingDispatched ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
            }`}>
              {isRebalancingDispatched ? <CheckCircle2 className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/70 border border-current">
                {isRebalancingDispatched ? 'Active Load Rebalancing Dispatched' : 'AI Rebalancing Advisory Detected'}
              </span>
              <h3 className="text-base font-black mt-1">
                {isRebalancingDispatched
                  ? 'Rebalancing Advisory Active: 14 Flexible Bookings Re-routed'
                  : 'Severe Imbalance: Singanallur APMC is at 91% Capacity (58 min wait)'}
              </h3>
              <p className="text-xs mt-0.5 max-w-2xl text-slate-700 leading-relaxed">
                {isRebalancingDispatched
                  ? 'SMS & IVR advisory dispatched to 14 opted-in flexible farmers. Singanallur wait reduced to 28m (-52%). Ramanathapuram Yard safely absorbed load with 25m wait.'
                  : 'Ramanathapuram Yard is only 4.2 km away with 61% utilization (19 min wait) and 34 spare slots. Diverting 14 flexible bookings resolves the bottleneck before gridlock.'}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            {!isRebalancingDispatched ? (
              <button
                onClick={handleDispatchRebalance}
                className="px-5 py-3 rounded-xl bg-gov-800 hover:bg-gov-900 text-white font-black text-xs flex items-center gap-2 shadow-md transition-all hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span>Dispatch Automated Rebalancing (14 Farmers)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-white px-3 py-2 rounded-xl border border-emerald-300 shadow-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Logged in Cryptographic Audit Trail</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Centres Network Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {network.map(centre => (
          <div
            key={centre.centreId}
            className={`rounded-2xl p-5 border-2 transition-all bg-white shadow-sm hover:shadow-md ${
              centre.healthStatus === 'HIGH_LOAD'
                ? 'border-amber-400 ring-2 ring-amber-400/20'
                : centre.healthStatus === 'CRITICAL'
                ? 'border-rose-500'
                : 'border-slate-200'
            }`}
          >
            {/* Top row: Status & ID */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {centre.centreId}
              </span>
              {getStatusBadge(centre.healthStatus)}
            </div>

            <h3 className="text-sm font-black text-slate-900 truncate" title={centre.name}>
              {centre.name}
            </h3>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
              <span>{centre.location}</span>
            </p>

            <div className="text-[11px] font-bold text-slate-600 mt-1">
              {centre.distanceFromCentralKm === 0 ? '📍 Central Hub' : `🚗 +${centre.distanceFromCentralKm} km from hub`}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
              <div className="bg-slate-50 p-2 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Queue</span>
                <span className="text-base font-black font-mono text-slate-900">
                  {centre.currentQueue}
                </span>
              </div>

              <div className="bg-slate-50 p-2 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Wait</span>
                <span className={`text-base font-black font-mono ${
                  centre.averageWaitMinutes >= 45 ? 'text-rose-600' : 'text-slate-900'
                }`}>
                  ~{centre.averageWaitMinutes}m
                </span>
              </div>
            </div>

            {/* Utilization Bar */}
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-500">Utilization</span>
                <span className={centre.utilizationPct >= 85 ? 'text-rose-600' : 'text-slate-800'}>
                  {centre.utilizationPct}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    centre.utilizationPct >= 85
                      ? 'bg-rose-600'
                      : centre.utilizationPct >= 65
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, centre.utilizationPct)}%` }}
                ></div>
              </div>
            </div>

            {/* Weighbridges & Spare Slots */}
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <Scale className="h-3.5 w-3.5 text-slate-400" />
                <span>{centre.activeWeighbridges}/{centre.totalWeighbridges} Scales</span>
              </span>
              <span className="font-bold text-gov-800">
                {centre.spareCapacitySlots} spare slots
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
