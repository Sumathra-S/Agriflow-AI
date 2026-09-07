import React, { useState } from 'react';
import { MOCK_CENTRES } from '../../services/dataAdapter';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';
import { ModelComparisonTab } from './ModelComparisonTab';
import { useSimulation } from '../../context/SimulationContext';
import { authService } from '../../services/authService';
import { quantityDemandEngine } from '../../services/engine/quantityDemandEngine';
import { DistrictCommandCentre } from '../operator/DistrictCommandCentre';
import { TamperEvidentAuditTrail } from '../operator/TamperEvidentAuditTrail';
import { DemandSurgeSimulator } from './DemandSurgeSimulator';
import { AdminNavigationTab } from '../../types/procurement';
import {
  Building2,
  Users,
  UserCheck,
  CalendarDays,
  Scale,
  AlertTriangle,
  BarChart3,
  CreditCard,
  ShieldCheck,
  Zap,
  Settings,
  Activity,
  Filter,
  Search,
  CheckCircle2,
  Check,
  RotateCcw,
  ArrowRight,
  HardDrive,
  Cpu,
  Radio,
  Clock,
  MapPin,
  TrendingUp,
  FileText
} from 'lucide-react';

export const DistrictOverview: React.FC = () => {
  const { currentQueue, expectedArrivals, congestionRisk } = useSimulation();
  const [activeTab, setActiveTab] = useState<AdminNavigationTab>('simulator');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 12 centres with dynamic metrics
  const centresList = React.useMemo(() => {
    return MOCK_CENTRES.map(c => {
      if (c.id === 'mandi-kalan') {
        return {
          ...c,
          name: 'Singanallur Procurement Centre (Centre C)',
          queue: currentQueue,
          expectedArrivals: expectedArrivals,
          risk: congestionRisk,
          capacityTonnes: 100,
          bookedTonnes: 72,
          walkInTonnes: 18
        };
      }
      if (c.id === 'khanna-grain') {
        return {
          ...c,
          name: 'Sulur APMC Yard (Centre B)',
          queue: 8,
          expectedArrivals: 14,
          risk: 'LOW' as const,
          capacityTonnes: 120,
          bookedTonnes: 60,
          walkInTonnes: 15
        };
      }
      return {
        ...c,
        capacityTonnes: 80,
        bookedTonnes: Math.floor(c.capacityPerHour * 2.5),
        walkInTonnes: Math.floor(c.capacityPerHour * 0.6),
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

  const tabsConfig: { id: AdminNavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'simulator', label: 'Demand Surge Simulator', icon: <Zap className="h-4 w-4 text-amber-500" />, badge: 'KILLER FEATURE' },
    { id: 'centres', label: 'All Centres', icon: <Building2 className="h-4 w-4" /> },
    { id: 'demand', label: 'Quantity Demand', icon: <Scale className="h-4 w-4 text-gov-700" />, badge: 'Tonnes' },
    { id: 'congestion', label: 'Congestion Monitor', icon: <AlertTriangle className="h-4 w-4 text-rose-600" /> },
    { id: 'farmers', label: 'Farmers', icon: <Users className="h-4 w-4" /> },
    { id: 'operators', label: 'Operators', icon: <UserCheck className="h-4 w-4" /> },
    { id: 'bookings', label: 'Bookings', icon: <CalendarDays className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'payments', label: 'PFMS Payments', icon: <CreditCard className="h-4 w-4 text-emerald-600" />, badge: 'DBT' },
    { id: 'audit_logs', label: 'Audit Logs', icon: <ShieldCheck className="h-4 w-4" />, badge: 'SHA-256' },
    { id: 'settings', label: 'System Settings', icon: <Settings className="h-4 w-4" /> },
    { id: 'health', label: 'System Health', icon: <Activity className="h-4 w-4 text-emerald-600" />, badge: '200 OK' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Government District Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gov-800 bg-gov-100 px-2.5 py-0.5 rounded-full border border-gov-200">
              State Agricultural Marketing Board • District Command
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">Tamil Nadu / Coimbatore</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 mt-1">
            District Procurement & Operations Control Centre
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time multi-centre coordination, quantity capacity balancing, and PFMS financial settlement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping"></span>
            12 Mandis Online
          </span>
        </div>
      </div>

      {/* 2. Top Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Active Centres"
          value="12 APMCs"
          subtext="Coimbatore & Sub-Divisions"
          icon={<Building2 className="h-6 w-6" />}
          variant="default"
        />

        <MetricCard
          label="Centres at High Risk"
          value={`${highRiskCount} Centres`}
          subtext="Require automated load diversion"
          icon={<AlertTriangle className="h-6 w-6" />}
          variant={highRiskCount > 0 ? 'danger' : 'success'}
        />

        <MetricCard
          label="Expected Arrivals"
          value={`${totalExpectedArrivals} Farmers`}
          subtext="Next 60 minutes across district"
          icon={<Clock className="h-6 w-6" />}
          variant="warning"
        />

        <MetricCard
          label="Total Intake Pressure"
          value={`${totalCurrentQueue} Waiting`}
          subtext="Tractor trolleys at weighbridges"
          icon={<Users className="h-6 w-6" />}
          variant="default"
        />
      </div>

      {/* 3. 12-Tab Administrative Navigation Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {tabsConfig.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-gov-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-black ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : tab.badge === 'KILLER FEATURE'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 4. MAIN VIEWPORT (12 TABS) */}

      {/* TAB 10: DEMAND SURGE SIMULATOR (SIH Grand Finale Killer Feature) */}
      {activeTab === 'simulator' && <DemandSurgeSimulator />}

      {/* TAB 1: ALL CENTRES */}
      {activeTab === 'centres' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Filter by Risk:
              </span>
              <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs">
                {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setSelectedFilter(f)}
                    className={`px-3 py-1 rounded-md font-bold transition-all ${
                      selectedFilter === f
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search centres..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gov-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCentres.map(c => (
              <div
                key={c.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-gov-400 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{c.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {c.location || 'Coimbatore Sub-Division'}
                    </p>
                  </div>
                  <StatusBadge risk={c.risk} />
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Queue</span>
                    <strong className="text-slate-900">{c.queue}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Capacity</span>
                    <strong className="text-gov-800">{c.capacityTonnes}t</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Walk-In</span>
                    <strong className="text-amber-800">+{c.walkInTonnes}t</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FARMERS DIRECTORY */}
      {activeTab === 'farmers' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-gov space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">District Registered Farmers Directory</h3>
              <p className="text-xs text-slate-500">PM-KISAN authenticated farmer records with Aadhaar seed status</p>
            </div>
            <span className="text-xs font-mono font-bold bg-gov-50 text-gov-800 px-3 py-1 rounded-full">
              4,120 Registered Farmers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Farmer ID & Name</th>
                  <th className="p-3">Village</th>
                  <th className="p-3">Land Holding</th>
                  <th className="p-3">Primary Crop</th>
                  <th className="p-3">Vehicle Registered</th>
                  <th className="p-3">Aadhaar Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {[
                  { id: 'MH-2024-8841', name: 'Ravi Kumar', village: 'Singanallur', land: '3.5 Acres', crop: 'Paddy', vehicle: 'Tractor Trolley' },
                  { id: 'PB-2024-1102', name: 'Harpreet Singh', village: 'Sulur', land: '5.2 Acres', crop: 'Wheat', vehicle: 'Mini Truck' },
                  { id: 'PB-2024-7721', name: 'Gurmukh Gill', village: 'Ondipudur', land: '2.0 Acres', crop: 'Paddy', vehicle: 'Tractor Trolley' },
                  { id: 'PB-2024-3391', name: 'Jaswinder Kaur', village: 'Singanallur', land: '4.8 Acres', crop: 'Paddy', vehicle: 'Mini Truck' },
                  { id: 'PB-2024-9981', name: 'Baldev Singh', village: 'Singanallur', land: '7.5 Acres', crop: 'Paddy', vehicle: 'Tractor Trolley' },
                ].map(f => (
                  <tr key={f.id} className="hover:bg-slate-50/80">
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{f.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">{f.id}</span>
                    </td>
                    <td className="p-3">{f.village}</td>
                    <td className="p-3 font-mono">{f.land}</td>
                    <td className="p-3">{f.crop}</td>
                    <td className="p-3 text-slate-600">{f.vehicle}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                        <CheckCircle2 className="h-3 w-3" /> Seeded
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: OPERATORS DIRECTORY */}
      {activeTab === 'operators' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-gov space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">Centre Operational Personnel & RBAC</h3>
              <p className="text-xs text-slate-500">Role-Based Access Control enforcement and shift assignments</p>
            </div>
            <span className="text-xs font-mono font-bold bg-gov-50 text-gov-800 px-3 py-1 rounded-full">
              12 Operators Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: 'OP-4109', name: 'Balwinder Dhillon', centre: 'Singanallur Hub (Centre C)', shift: 'Morning (08:00–16:00)', role: 'OPERATOR', status: 'ON_DUTY' },
              { id: 'OP-4110', name: 'Rajesh Sharma', centre: 'Sulur APMC (Centre B)', shift: 'Morning (08:00–16:00)', role: 'OPERATOR', status: 'ON_DUTY' },
              { id: 'OP-4111', name: 'Manpreet Kaur', centre: 'Jagraon Yard', shift: 'Afternoon (12:00–20:00)', role: 'OPERATOR', status: 'SCHEDULED' },
              { id: 'ADM-01', name: 'Dr. Harpreet Sandhu, IAS', centre: 'District Command HQ', shift: 'General Shift', role: 'ADMIN', status: 'ON_DUTY' }
            ].map(op => (
              <div key={op.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{op.name}</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    op.status === 'ON_DUTY' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {op.status}
                  </span>
                </div>
                <p className="text-slate-600">Assigned: <strong>{op.centre}</strong></p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span className="font-mono">{op.id}</span>
                  <span className="font-bold text-gov-800">{op.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BOOKINGS REGISTER */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-gov space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">District Master Slot Bookings</h3>
              <p className="text-xs text-slate-500">Live slot register across all 12 mandis for 06 Sep 2026</p>
            </div>
            <span className="text-xs font-mono font-bold bg-gov-50 text-gov-800 px-3 py-1 rounded-full">
              842 Bookings Today • 1,240 Tonnes
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block font-bold text-[10px] uppercase">Paddy Allotments</span>
              <strong className="text-lg font-mono text-gov-800">620 Bookings</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block font-bold text-[10px] uppercase">Wheat Allotments</span>
              <strong className="text-lg font-mono text-gov-800">180 Bookings</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block font-bold text-[10px] uppercase">Other Crops</span>
              <strong className="text-lg font-mono text-gov-800">42 Bookings</strong>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-emerald-800 block font-bold text-[10px] uppercase">Completion Rate</span>
              <strong className="text-lg font-mono text-emerald-800">92.4%</strong>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: QUANTITY DEMAND ANALYSIS */}
      {activeTab === 'demand' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-gov space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">Quantity Demand & Capacity Breakdown</h3>
              <p className="text-xs text-slate-500">Dual Metric Tracking: Farmer Headcount AND Tonnes Volume (+25% Predicted Walk-In Demand)</p>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
              Quantity-Aware Engine Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {quantityDemandEngine.getAllCentres().map(c => (
              <div key={c.centreId} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{c.centreName}</h4>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    c.congestionState === 'NEAR_CAPACITY' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {c.congestionState}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 bg-white p-2.5 rounded-lg border border-slate-200 text-center font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Capacity</span>
                    <strong className="text-slate-900">{c.capacityTonnes}t</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Booked</span>
                    <strong className="text-gov-800">{c.bookedQuantityTonnes}t</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans text-amber-700">Walk-In</span>
                    <strong className="text-amber-800">+{c.predictedWalkInQuantityTonnes}t</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans text-emerald-700">Free</span>
                    <strong className="text-emerald-700">{c.remainingCapacityTonnes.toFixed(0)}t</strong>
                  </div>
                </div>

                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                  <div style={{ width: `${(c.bookedQuantityTonnes / c.capacityTonnes) * 100}%` }} className="bg-gov-800 h-full" />
                  <div style={{ width: `${(c.predictedWalkInQuantityTonnes / c.capacityTonnes) * 100}%` }} className="bg-amber-500 h-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CONGESTION MONITOR */}
      {activeTab === 'congestion' && <DistrictCommandCentre />}

      {/* TAB 7: PREDICTIVE ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
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
        </div>
      )}

      {/* TAB 8: PFMS PAYMENTS LEDGER */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-gov space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">PFMS Direct Benefit Transfer (DBT) Audit Ledger</h3>
              <p className="text-xs text-slate-500">Real-time payment sanctioning and Aadhaar payment bridge settlement</p>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
              ₹2,84,50,000 Disbursed Today
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Transactions</span>
              <strong className="text-xl font-mono text-slate-900">1,237 Vouchers</strong>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">Success Rate</span>
              <strong className="text-xl font-mono text-emerald-800">99.8% (Zero Failures)</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Average Payout Speed</span>
              <strong className="text-xl font-mono text-gov-800">3.2 Hours Post-Weighing</strong>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: AUDIT LOGS */}
      {activeTab === 'audit_logs' && <TamperEvidentAuditTrail />}

      {/* TAB 11: SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-gov space-y-4">
          <h2 className="text-base font-black text-slate-900">District Policy & Configuration Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900">Moisture Threshold Ceiling</span>
              <p className="text-slate-600">Maximum allowable grain moisture under FCI standards.</p>
              <span className="font-mono font-bold text-gov-800 bg-white px-2 py-1 rounded border block w-fit">14.0% Grade A</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900">Predicted Walk-In Multiplier</span>
              <p className="text-slate-600">Historical ratio added to booked demand.</p>
              <span className="font-mono font-bold text-amber-800 bg-white px-2 py-1 rounded border block w-fit">+25% Base Factor</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 12: SYSTEM HEALTH & TELEMETRY */}
      {activeTab === 'health' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-gov space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-600" />
                <span>AgriFlow System Health & Telemetry (/api/health)</span>
              </h3>
              <p className="text-xs text-slate-500">Live operational telemetry across API endpoints, databases and gateways</p>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              HEALTHY (200 OK)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">API Gateway</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <strong className="text-base font-mono text-slate-900 block">4 ms Latency</strong>
              <span className="text-[11px] text-slate-500">Uptime: 99.99%</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">SMS / CDAC Gateway</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <strong className="text-base font-mono text-slate-900 block">Active (NIC)</strong>
              <span className="text-[11px] text-slate-500">Queue: 0 msgs pending</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Weighbridge IoT Sync</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <strong className="text-base font-mono text-slate-900 block">12/12 Scales</strong>
              <span className="text-[11px] text-slate-500">Heartbeat: 2s ago</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Tamper Audit Engine</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <strong className="text-base font-mono text-slate-900 block">SHA-256 Valid</strong>
              <span className="text-[11px] text-slate-500">Zero chain breaks</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
