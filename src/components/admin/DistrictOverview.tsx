import React, { useState } from 'react';
import { MOCK_CENTRES } from '../../services/dataAdapter';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';
import { ModelComparisonTab } from './ModelComparisonTab';
import { useSimulation } from '../../context/SimulationContext';
import { authService } from '../../services/authService';
import {
  Building2,
  AlertTriangle,
  Users,
  CalendarClock,
  Filter,
  Search,
  ExternalLink,
  ChevronRight,
  Sliders
} from 'lucide-react';
import { DistrictCommandCentre } from '../operator/DistrictCommandCentre';
import { TamperEvidentAuditTrail } from '../operator/TamperEvidentAuditTrail';

export const DistrictOverview: React.FC = () => {
  const { currentQueue, expectedArrivals, congestionRisk } = useSimulation();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [activeTab, setActiveTab] = useState<'centres' | 'cluster_rebalancing' | 'policies' | 'audit_logs' | 'model_comparison'>('cluster_rebalancing');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map 12 centres with realistic dynamic metrics
  const centresList = React.useMemo(() => {
    return MOCK_CENTRES.map(c => {
      if (c.id === 'mandi-kalan') {
        return {
          ...c,
          queue: currentQueue,
          expectedArrivals: expectedArrivals,
          risk: congestionRisk
        };
      }
      if (c.id === 'khanna-grain') {
        return {
          ...c,
          queue: 21,
          expectedArrivals: 39,
          risk: 'HIGH' as const
        };
      }
      if (c.id === 'jagraon-apmc') {
        return {
          ...c,
          queue: 19,
          expectedArrivals: 34,
          risk: 'HIGH' as const
        };
      }
      if (c.id === 'samrala-yard') {
        return {
          ...c,
          queue: 14,
          expectedArrivals: 22,
          risk: 'MEDIUM' as const
        };
      }
      if (c.id === 'doraha-depot') {
        return {
          ...c,
          queue: 12,
          expectedArrivals: 19,
          risk: 'MEDIUM' as const
        };
      }
      if (c.id === 'sahnewal-centre') {
        return {
          ...c,
          queue: 11,
          expectedArrivals: 18,
          risk: 'MEDIUM' as const
        };
      }
      // Rest are LOW
      return {
        ...c,
        queue: Math.floor(c.capacityPerHour * 0.4),
        expectedArrivals: Math.floor(c.capacityPerHour * 0.6),
        risk: 'LOW' as const
      };
    });
  }, [currentQueue, expectedArrivals, congestionRisk]);

  const highRiskCount = centresList.filter(c => c.risk === 'HIGH').length;
  const totalExpectedArrivals = centresList.reduce((acc, c) => acc + c.expectedArrivals, 0);
  const totalCurrentQueue = centresList.reduce((acc, c) => acc + c.queue, 0);

  const filteredCentres = centresList.filter(c => {
    if (selectedFilter !== 'ALL' && c.risk !== selectedFilter) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            District Procurement Overview — Ludhiana
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Regional procurement monitoring • 12 Active State Mandis • Department of Food & Civil Supplies
          </p>
        </div>

        {/* Tab switch between Centres, Policies, Audit Logs, and Model Comparison */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-md border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('cluster_rebalancing')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'cluster_rebalancing' ? 'bg-gov-800 text-white font-bold shadow-xs' : 'text-slate-700 hover:text-slate-950 font-bold'
            }`}
          >
            🏛️ Cluster Load Balancing
          </button>
          <button
            onClick={() => setActiveTab('centres')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'centres' ? 'bg-white text-gov-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mandi Centres ({centresList.length})
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'policies' ? 'bg-white text-gov-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Policy Management
          </button>
          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'audit_logs' ? 'bg-white text-gov-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            System Audit Log
          </button>
          <button
            onClick={() => setActiveTab('model_comparison')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'model_comparison' ? 'bg-white text-gov-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AI / ML Telemetry
          </button>
        </div>
      </div>

      {/* REGIONAL SUMMARY METRICS (Section 17) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Active Centres"
          value="12 Mandis"
          subtext="Ludhiana Sub-Divisions"
          icon={<Building2 className="h-6 w-6" />}
          variant="default"
        />

        <MetricCard
          label="Centres at High Risk"
          value={`${highRiskCount} Centres`}
          subtext="Require immediate operational relief"
          icon={<AlertTriangle className="h-6 w-6" />}
          variant={highRiskCount > 0 ? 'danger' : 'success'}
        />

        <MetricCard
          label="Total Expected Arrivals"
          value={`${totalExpectedArrivals} Farmers`}
          subtext="Next 60 minutes across district"
          icon={<CalendarClock className="h-6 w-6" />}
          variant="warning"
        />

        <MetricCard
          label="Total Queue Pressure"
          value={`${totalCurrentQueue} Waiting`}
          subtext="Tractors in gate lines"
          icon={<Users className="h-6 w-6" />}
          variant="default"
        />
      </div>

      {activeTab === 'model_comparison' && (
        <ModelComparisonTab
          metrics={{
            baselineName: 'Historical Seasonal Average',
            modelName: 'AgriFlow Gradient Boosting Flow Regressor',
            baselineMae: 5.72,
            modelMae: 5.25,
            maeImprovementPct: 8.2,
            peakDetectionAccuracyPct: 83.3,
            avgWaitReductionMinutes: 56,
            trainingSamples: 1320
          }}
        />
      )}

      {/* CLUSTER LOAD BALANCING TAB */}
      {activeTab === 'cluster_rebalancing' && (
        <DistrictCommandCentre />
      )}

      {/* POLICY MANAGEMENT TAB */}
      {activeTab === 'policies' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-gov space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sliders className="h-5 w-5 text-gov-800" />
                <span>District Procurement Policies & Rules</span>
              </h3>
              <p className="text-xs text-slate-500">
                Governance rules applied across all 12 procurement yards in Coimbatore District
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded">
              Status: Active Policy
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-sm">Throughput & Intake Gate Policy</span>
              <p className="text-slate-600">Max hourly capacity limit per weighbridge before diversion advisories.</p>
              <div className="flex items-center justify-between font-mono font-bold bg-white p-2.5 rounded-xl border border-slate-200">
                <span>Maximum Capacity:</span>
                <span className="text-gov-800">22 Trolleys / Hour</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-sm">Disruption Notification Threshold</span>
              <p className="text-slate-600">Minimum operational delay before broadcast SMS & voice notices are sent.</p>
              <div className="flex items-center justify-between font-mono font-bold bg-white p-2.5 rounded-xl border border-slate-200">
                <span>Delay Threshold:</span>
                <span className="text-amber-700">15 Minutes Delay</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-sm">FCI Minimum Support Price (MSP) Standard</span>
              <p className="text-slate-600">Official Government benchmark rate for 2026 Kharif season.</p>
              <div className="flex items-center justify-between font-mono font-bold bg-white p-2.5 rounded-xl border border-slate-200">
                <span>Paddy (PR-126):</span>
                <span className="text-emerald-700">₹2,320 / Quintal</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-sm">Maximum Permissible Moisture</span>
              <p className="text-slate-600">Strict moisture ceiling under FCI Grade-A procurement guidelines.</p>
              <div className="flex items-center justify-between font-mono font-bold bg-white p-2.5 rounded-xl border border-slate-200">
                <span>Moisture Ceiling:</span>
                <span className="text-gov-800">17.0%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SYSTEM AUDIT LOG TAB */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-6">
          <TamperEvidentAuditTrail />
        </div>
      )}

      {/* MANDI CENTRES VIEW */}
      {activeTab === 'centres' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Filter by Risk:
              </span>
              <div className="flex rounded bg-slate-100 p-0.5 border border-slate-200 text-xs">
                {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setSelectedFilter(f)}
                    className={`px-2.5 py-1 rounded font-medium ${
                      selectedFilter === f
                        ? 'bg-white text-slate-900 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mandi name..."
                className="w-full rounded-md border border-slate-300 pl-8 pr-3 py-1.5 text-xs focus:border-gov-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Multi-centre table (Section 17) */}
          <div className="rounded-lg border border-slate-200 bg-white shadow-gov overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Procurement Centre</th>
                    <th className="px-4 py-3 text-right">Current Queue</th>
                    <th className="px-4 py-3 text-right">Expected Arrivals (1h)</th>
                    <th className="px-4 py-3 text-right">Capacity / Hr</th>
                    <th className="px-4 py-3 text-center">Strain Ratio</th>
                    <th className="px-4 py-3 text-center">Congestion Risk</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {filteredCentres.map(centre => {
                    const strainRatio = ((centre.queue + centre.expectedArrivals) / centre.capacityPerHour).toFixed(1);
                    return (
                      <tr
                        key={centre.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          centre.risk === 'HIGH' ? 'bg-rose-50/30' : ''
                        }`}
                      >
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-gov-800 flex-shrink-0" />
                            <span>{centre.name}</span>
                            {centre.id === 'mandi-kalan' && (
                              <span className="bg-gov-100 text-gov-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-gov-300">
                                Primary Demo Mandi
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{centre.location}</div>
                        </td>

                        <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">
                          {centre.queue}
                        </td>

                        <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">
                          {centre.expectedArrivals}
                        </td>

                        <td className="px-4 py-3.5 text-right font-mono text-slate-600">
                          {centre.capacityPerHour}/hr
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <span
                            className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                              parseFloat(strainRatio) > 2.0
                                ? 'bg-rose-100 text-rose-800'
                                : parseFloat(strainRatio) > 1.2
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {strainRatio}x
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <StatusBadge risk={centre.risk} size="sm" />
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <span className="text-[11px] font-semibold text-slate-600">
                            {centre.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Showing {filteredCentres.length} of 12 procurement centres</span>
              <span className="font-mono">Telemetry sync: Real-time</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
