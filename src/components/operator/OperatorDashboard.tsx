import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { MainAlertBanner } from './MainAlertBanner';
import { ExplainabilityCard } from './ExplainabilityCard';
import { ForecastChart } from './ForecastChart';
import { DemandCapacityCard } from './DemandCapacityCard';
import { RecommendedActions } from './RecommendedActions';
import { LiveQueueTable } from './LiveQueueTable';
import { CommunicationCentre } from './CommunicationCentre';
import { AssistedBookingScreen } from './AssistedBookingScreen';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  MessageSquare,
  UserPlus,
  BarChart3,
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle2,
  CalendarClock,
  ShieldAlert,
  ArrowRight,
  Send,
  UserCheck
} from 'lucide-react';

type OperatorTab = 'dashboard' | 'queue' | 'bookings' | 'communication' | 'assisted' | 'reports' | 'settings';

export const OperatorDashboard: React.FC = () => {
  const {
    currentQueue,
    expectedArrivals,
    capacityPerHour,
    congestionRisk,
    farmerAdvisorySent,
    backupStaffActive
  } = useSimulation();

  const [activeTab, setActiveTab] = useState<OperatorTab>('dashboard');

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-12">
      {/* 1. LEFT SIDEBAR NAVIGATION (Section 49) */}
      <aside className="w-full lg:w-60 flex-shrink-0">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-gov sticky top-20">
          <div className="px-3 py-2 border-b border-slate-100 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Operations Control
            </span>
            <h3 className="text-xs font-black text-slate-900 mt-0.5">Mandi Kalan Centre</h3>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
              { id: 'queue', label: 'Queue Management', icon: <Users className="h-4 w-4" /> },
              { id: 'bookings', label: 'Bookings Register', icon: <CalendarDays className="h-4 w-4" /> },
              { id: 'communication', label: 'Communication Centre', icon: <MessageSquare className="h-4 w-4 text-gov-700" />, badge: 'Broadcast' },
              { id: 'assisted', label: 'Assisted Booking', icon: <UserPlus className="h-4 w-4 text-amber-700" />, badge: 'Desk' },
              { id: 'reports', label: 'Flow Reports', icon: <BarChart3 className="h-4 w-4" /> },
              { id: 'settings', label: 'Centre Settings', icon: <Settings className="h-4 w-4" /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as OperatorTab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-gov-800 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && activeTab !== item.id && (
                  <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* 2. MAIN OPERATOR CONTENT VIEWPORT */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* COMMUNICATION CENTRE TAB */}
        {activeTab === 'communication' && <CommunicationCentre />}

        {/* ASSISTED BOOKING TAB */}
        {activeTab === 'assisted' && <AssistedBookingScreen />}

        {/* QUEUE TAB */}
        {activeTab === 'queue' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Live Weighbridge & Gate Queue</h2>
              <span className="font-mono text-xs bg-gov-100 text-gov-800 px-2.5 py-1 rounded font-bold">
                {currentQueue} Vehicles Active
              </span>
            </div>
            <LiveQueueTable />
          </div>
        )}

        {/* BOOKINGS REGISTER TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Today's Registered Bookings</h2>
                <p className="text-xs text-slate-500">Mandi Kalan • Slot allotments for 06 Sep 2026</p>
              </div>
              <button
                onClick={() => setActiveTab('assisted')}
                className="py-2 px-3 bg-gov-800 text-white text-xs font-bold rounded-xl hover:bg-gov-900 shadow-xs flex items-center gap-1.5"
              >
                <UserPlus className="h-4 w-4" />
                <span>+ Assisted Booking</span>
              </button>
            </div>
            <LiveQueueTable />
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Flow Telemetry & Arrival Reports</h2>
            <ForecastChart />
            <DemandCapacityCard />
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-gov space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Procurement Centre Operational Settings</h2>
            <div className="space-y-3 text-xs text-slate-700 max-w-lg">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span>Total Weighbridges Installed</span>
                <span className="font-bold">2 Weighbridges</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span>Target Throughput Rate</span>
                <span className="font-bold">18 Farmers / Hour</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span>Automated SMS Dispatch Gateway</span>
                <span className="font-bold text-emerald-700">✓ CDAC / NIC Active</span>
              </div>
            </div>
          </div>
        )}

        {/* DEFAULT TAB: CORE DASHBOARD (Section 25, 26, 27, 28) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Centre Subheader & Live Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Mandi Kalan Procurement Centre
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    Live Operations
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  District Ludhiana, Punjab • Gate 1 & Gate 2 Intake • Paddy Season 2026-27
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-slate-500 font-medium">Centre Status:</span>
                <StatusBadge risk={congestionRisk} size="lg" />
              </div>
            </div>

            {/* CORE CARDS (Section 25) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Farmers Waiting */}
              <MetricCard
                label="Farmers Waiting"
                value={`${currentQueue}`}
                subtext="Waiting inside & at gate approach"
                icon={<Users className="h-6 w-6" />}
                variant={currentQueue > 20 ? 'danger' : currentQueue > 10 ? 'warning' : 'success'}
              />

              {/* Card 2: Expected Arrivals */}
              <MetricCard
                label="Expected Arrivals"
                value={`${expectedArrivals}`}
                subtext={farmerAdvisorySent ? 'Advisory shifting ~14 farmers' : 'Next 60 minutes inflow'}
                icon={<CalendarClock className="h-6 w-6" />}
                variant={expectedArrivals > 30 ? 'danger' : expectedArrivals > 18 ? 'warning' : 'success'}
              />

              {/* Card 3: Processing Today */}
              <MetricCard
                label="Processing Today"
                value="42"
                subtext="Weighbridge check-ins cleared"
                icon={<CheckCircle2 className="h-6 w-6" />}
                variant="success"
              />

              {/* Card 4: Centre Status */}
              <MetricCard
                label="Centre Status"
                value={congestionRisk === 'HIGH' ? 'High Pressure' : congestionRisk === 'MEDIUM' ? 'Moderate' : 'Normal'}
                subtext={congestionRisk === 'HIGH' ? 'Impending gridlock at Gate 2' : 'Operational'}
                icon={<ShieldAlert className="h-6 w-6" />}
                variant={congestionRisk === 'HIGH' ? 'danger' : congestionRisk === 'MEDIUM' ? 'warning' : 'success'}
              />
            </div>

            {/* MAIN OPERATIONAL ALERT BANNER */}
            <MainAlertBanner />

            {/* CONGESTION PREDICTION & WHY (Section 27) */}
            <div className="rounded-2xl border-2 border-rose-300 bg-rose-50/70 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-600 animate-ping"></span>
                  <span className="text-xs font-black uppercase tracking-wider text-rose-950">
                    NEXT 2 HOURS: 🔴 HIGH PRESSURE EXPECTED
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-rose-800">Peak Window: 11:30 AM – 1:30 PM</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs text-rose-950">
                  <span className="font-extrabold block text-slate-900 mb-1">1. Heavy Arrival Concentration</span>
                  <p className="text-slate-600">More farmers expected between 11 AM – 12 PM as 38 bookings overlap.</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs text-rose-950">
                  <span className="font-extrabold block text-slate-900 mb-1">2. Accelerating Gate Queue</span>
                  <p className="text-slate-600">Current queue is increasing faster than morning baseline (+28% velocity).</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs text-rose-950">
                  <span className="font-extrabold block text-slate-900 mb-1">3. Processing Speed Slower</span>
                  <p className="text-slate-600">Throughput is 18/hr due to single weighbridge operation.</p>
                </div>
              </div>
            </div>

            {/* OPERATOR ACTIONS BAR (Section 28) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-gov flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                Operator Action Hub
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('communication')}
                  className="py-2 px-3.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-extrabold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Farmer Alert</span>
                </button>

                <button
                  onClick={() => setActiveTab('bookings')}
                  className="py-2 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors"
                >
                  Review Bookings
                </button>

                <button
                  onClick={() => setActiveTab('queue')}
                  className="py-2 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors"
                >
                  Check Queue
                </button>

                <button
                  onClick={() => setActiveTab('assisted')}
                  className="py-2 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <UserCheck className="h-3.5 w-3.5 text-gov-800" />
                  <span>Assist Farmer</span>
                </button>
              </div>
            </div>

            {/* ARRIVAL TREND (Section 26) & DEMAND VS CAPACITY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <ForecastChart />
              </div>
              <div className="lg:col-span-5">
                <DemandCapacityCard />
              </div>
            </div>

            {/* RECOMMENDED ACTIONS CHECKLIST & QUEUE TABLE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <RecommendedActions />
              </div>
              <div className="lg:col-span-7">
                <LiveQueueTable />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
