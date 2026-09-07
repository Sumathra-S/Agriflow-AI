import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { MainAlertBanner } from './MainAlertBanner';
import { ForecastChart } from './ForecastChart';
import { DemandCapacityCard } from './DemandCapacityCard';
import { RecommendedActions } from './RecommendedActions';
import { LiveQueueTable } from './LiveQueueTable';
import { CommunicationCentre } from './CommunicationCentre';
import { AssistedBookingScreen } from './AssistedBookingScreen';
import { telecomManager, CallbackRequest } from '../../services/telecomService';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  MessageSquare,
  UserPlus,
  BarChart3,
  Settings,
  Clock,
  CheckCircle2,
  CalendarClock,
  ShieldAlert,
  Truck,
  Scale,
  Send,
  UserCheck,
  GraduationCap,
  Award,
  PhoneCall,
  CheckSquare,
  Square,
  TrendingUp,
  Activity,
  PhoneForwarded,
  Sliders,
  Building2,
  Brain,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { CrowdShiftSimulator } from './CrowdShiftSimulator';
import { OperationalControllerCard } from './OperationalControllerCard';
import { DistrictCommandCentre } from './DistrictCommandCentre';
import { WhatIfControlRoom } from './WhatIfControlRoom';
import { TamperEvidentAuditTrail } from './TamperEvidentAuditTrail';
import { ModelGovernanceCard } from './ModelGovernanceCard';
import { OperatorLifecycleWorkflow } from './OperatorLifecycleWorkflow';

export type OperatorTab =
  | 'dashboard'
  | 'overview'
  | 'queue'
  | 'arrivals'
  | 'tokens'
  | 'weighing'
  | 'quality'
  | 'procurement'
  | 'counters'
  | 'capacity'
  | 'alerts'
  | 'command-centre'
  | 'what-if'
  | 'audit-trail'
  | 'model-governance'
  | 'simulator'
  | 'bookings'
  | 'communication'
  | 'assisted'
  | 'training'
  | 'reports'
  | 'settings';

export const OperatorDashboard: React.FC = () => {
  const {
    currentQueue,
    expectedArrivals,
    congestionRisk,
    farmerAdvisorySent,
    backupStaffActive
  } = useSimulation();

  const { triggerUnauthorizedAlert } = useAuth();

  const [activeTab, setActiveTab] = useState<OperatorTab>('dashboard');

  // Operator Training Checklist State (Section 48)
  const [trainingChecks, setTrainingChecks] = useState<Record<string, boolean>>({
    step1: true,
    step2: true,
    step3: farmerAdvisorySent,
    step4: backupStaffActive,
    step5: true,
    step6: false
  });

  // Callbacks list state
  const [callbackList, setCallbackList] = useState<CallbackRequest[]>(telecomManager.getCallbacks());
  const [callingId, setCallingId] = useState<string | null>(null);

  const toggleCheck = (stepId: string) => {
    setTrainingChecks(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleTriggerCallbackCall = async (id: string) => {
    setCallingId(id);
    await telecomManager.triggerCallbackCall(id);
    setCallbackList([...telecomManager.getCallbacks()]);
    setTimeout(() => setCallingId(null), 1500);
  };

  const handleResolveCallback = (id: string) => {
    telecomManager.resolveCallback(id);
    setCallbackList([...telecomManager.getCallbacks()]);
  };

  const completedStepsCount = Object.values(trainingChecks).filter(Boolean).length;

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-12">
      {/* 1. LEFT SIDEBAR NAVIGATION (Section 49 & 10 Dedicated Operator Tabs) */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-gov sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto transition-colors">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Operations Control
            </span>
            <h3 className="text-xs font-black text-slate-900 dark:text-white mt-0.5">Singanallur Hub (Centre C)</h3>
          </div>

          {/* SECTION: 10 CORE OPERATOR TABS */}
          <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1 tracking-wider">
            Station Console (10 Tabs)
          </div>
          <nav className="space-y-1 text-xs font-semibold mb-3">
            {[
              { id: 'dashboard', label: 'Centre Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
              { id: 'queue', label: 'Live Queue', icon: <Users className="h-4 w-4 text-gov-800 dark:text-emerald-400" />, badge: `${currentQueue}` },
              { id: 'arrivals', label: 'Arrivals Desk', icon: <Truck className="h-4 w-4 text-slate-700 dark:text-slate-300" />, badge: 'Gates' },
              { id: 'tokens', label: 'Token Management', icon: <UserPlus className="h-4 w-4 text-amber-700 dark:text-amber-400" /> },
              { id: 'weighing', label: 'Weighing Console', icon: <Scale className="h-4 w-4 text-blue-700 dark:text-blue-400" />, badge: '60t' },
              { id: 'quality', label: 'Quality Check', icon: <CheckSquare className="h-4 w-4 text-purple-700 dark:text-purple-400" />, badge: 'Moisture' },
              { id: 'procurement', label: 'Procurement & MSP', icon: <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /> },
              { id: 'counters', label: 'Counters & Bays', icon: <Building2 className="h-4 w-4 text-slate-700 dark:text-slate-300" /> },
              { id: 'capacity', label: 'Capacity & Demand', icon: <Activity className="h-4 w-4 text-gov-800 dark:text-emerald-400" />, badge: '100t' },
              { id: 'alerts', label: 'Operational Alerts', icon: <ShieldAlert className="h-4 w-4 text-rose-700 dark:text-rose-400" />, badge: congestionRisk === 'HIGH' ? 'SURGE' : undefined },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as OperatorTab)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-gov-800 dark:bg-emerald-700 text-white font-bold shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && activeTab !== item.id && (
                  <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.2 rounded font-bold font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* SECTION: DECISION & PLANNING TOOLS */}
          <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1 tracking-wider border-t border-slate-100 dark:border-slate-800 pt-2">
            Decision Tools
          </div>
          <nav className="space-y-1 text-xs font-semibold mb-3">
            {[
              { id: 'command-centre', label: 'Regional Control', icon: <Building2 className="h-4 w-4 text-gov-700 dark:text-emerald-400" />, badge: 'Cluster' },
              { id: 'what-if', label: 'What-If Control Room', icon: <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />, badge: 'AI Levers' },
              { id: 'simulator', label: 'Crowd Shift Simulator', icon: <Sliders className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />, badge: 'Simulate' },
              { id: 'communication', label: 'Communication Hub', icon: <MessageSquare className="h-4 w-4 text-gov-700 dark:text-emerald-400" />, badge: 'Broadcast' },
              { id: 'training', label: 'Training & SOP', icon: <GraduationCap className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />, badge: 'Pilot' },
              { id: 'audit-trail', label: 'Tamper Audit Trail', icon: <ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /> },
              { id: 'model-governance', label: 'Model Governance', icon: <Brain className="h-4 w-4 text-purple-700 dark:text-purple-400" /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as OperatorTab)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-gov-800 dark:bg-emerald-700 text-white font-bold shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && activeTab !== item.id && (
                  <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.2 rounded font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* SECTION: STRICT RBAC BOUNDARY TESTING */}
          <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1 tracking-wider border-t border-slate-100 dark:border-slate-800 pt-2">
            Security Isolation Test
          </div>
          <div className="p-2 space-y-1.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px]">
            <button
              onClick={() => triggerUnauthorizedAlert("You don't have permission to access this area. Operator is locked strictly to Singanallur Centre C.")}
              className="w-full text-left py-1.5 px-2 rounded-lg text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold transition-colors flex items-center justify-between"
              title="Test RBAC Centre Isolation: Operator accessing Centre B"
            >
              <span>🚨 Access Sulur Hub</span>
              <span className="text-[9px] bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 px-1 rounded font-bold">403</span>
            </button>
            <button
              onClick={() => triggerUnauthorizedAlert("You don't have permission to access this area. District Administrator credentials required.")}
              className="w-full text-left py-1.5 px-2 rounded-lg text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-semibold transition-colors flex items-center justify-between"
              title="Test RBAC Role Privilege: Operator accessing Admin Portal"
            >
              <span>🛡️ Access Admin API</span>
              <span className="text-[9px] bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-1 rounded font-bold">403</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN OPERATOR CONTENT VIEWPORT */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* OPERATOR WORKFLOW STATION VIEWS */}
        {activeTab === 'arrivals' && <OperatorLifecycleWorkflow activeStation="arrivals" />}
        {activeTab === 'tokens' && <AssistedBookingScreen />}
        {activeTab === 'weighing' && <OperatorLifecycleWorkflow activeStation="weighing" />}
        {activeTab === 'quality' && <OperatorLifecycleWorkflow activeStation="quality" />}
        {activeTab === 'procurement' && <OperatorLifecycleWorkflow activeStation="procurement" />}
        {activeTab === 'counters' && <OperatorLifecycleWorkflow activeStation="counters" />}
        {activeTab === 'capacity' && <OperatorLifecycleWorkflow activeStation="capacity" />}
        {activeTab === 'alerts' && <OperatorLifecycleWorkflow activeStation="alerts" />}

        {/* REGIONAL COMMAND CENTRE TAB */}
        {activeTab === 'command-centre' && <DistrictCommandCentre />}

        {/* WHAT-IF SCENARIO CONTROL ROOM TAB */}
        {activeTab === 'what-if' && <WhatIfControlRoom />}

        {/* TAMPER-EVIDENT AUDIT TRAIL TAB */}
        {activeTab === 'audit-trail' && <TamperEvidentAuditTrail />}

        {/* AI MODEL GOVERNANCE & TECHNICAL DEFENSIBILITY TAB */}
        {activeTab === 'model-governance' && <ModelGovernanceCard />}

        {/* CROWD SHIFT SIMULATOR TAB (Section 6 & Module 3) */}
        {activeTab === 'simulator' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Crowd Shift Simulator & Decision Support
              </h2>
              <p className="text-xs text-slate-500">
                Simulate arrival redistribution before communicating advisories with farmers
              </p>
            </div>
            <CrowdShiftSimulator onApplyPlan={() => setActiveTab('communication')} />
          </div>
        )}

        {/* COMMUNICATION CENTRE TAB */}
        {activeTab === 'communication' && <CommunicationCentre />}

        {/* ASSISTED BOOKING TAB */}
        {activeTab === 'assisted' && <AssistedBookingScreen />}

        {/* TRAINING & PILOT METRICS TAB (Section 48) */}
        {activeTab === 'training' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-gov-800" />
                  <span>Operator Training Mode & Pilot Evaluation</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standard operating procedures and real-world impact metrics for Mandi Kalan
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                  Training Progress: {completedStepsCount}/6 Steps
                </span>
              </div>
            </div>

            {/* PART A: OPERATOR TRAINING CHECKLIST ("HOW TO USE AGRIFLOW") */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-gov space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    How to Use AgriFlow: 6-Step Operator Protocol
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mandatory operational workflow before and during procurement shifts
                  </p>
                </div>
                <span className="text-xs font-bold text-gov-800 bg-gov-50 px-2.5 py-1 rounded-lg border border-gov-200">
                  Standard Operating Procedure
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {[
                  {
                    id: 'step1',
                    num: '1',
                    title: 'Check Morning Baseline vs Hourly Capacity',
                    desc: 'Review 09:00 AM queue. Baseline throughput is 18/hr across weighbridge gate.'
                  },
                  {
                    id: 'step2',
                    num: '2',
                    title: 'Inspect Next 2 Hours Prediction & Risk Factors',
                    desc: 'Check if expected arrivals exceed 18/hr. Review the 3 explainability root causes.'
                  },
                  {
                    id: 'step3',
                    num: '3',
                    title: 'Dispatch Multi-Channel Advisory to Overlapping Farmers',
                    desc: 'Trigger SMS & automated voice call recommending arrival after 1:30 PM with guaranteed privilege.'
                  },
                  {
                    id: 'step4',
                    num: '4',
                    title: 'Bring Auxiliary Processing & Moisture Staff Online',
                    desc: 'Open auxiliary weighbridge lane and second moisture desk to boost throughput to 22/hr.'
                  },
                  {
                    id: 'step5',
                    num: '5',
                    title: 'Check Gate Queue & Support Unregistered Farmers',
                    desc: 'Use Assisted Booking desk or USSD (*384#) to issue tokens for walk-in tractor trolleys.'
                  },
                  {
                    id: 'step6',
                    num: '6',
                    title: 'Review Communication Delivery & Clear Helpline Callbacks',
                    desc: 'Verify SMS/voice broadcast delivery rate and return pending farmer helpline calls.'
                  }
                ].map(step => (
                  <div
                    key={step.id}
                    onClick={() => toggleCheck(step.id)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      trainingChecks[step.id]
                        ? 'border-emerald-300 bg-emerald-50/60'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5 text-emerald-700">
                      {trainingChecks[step.id] ? (
                        <CheckSquare className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-black text-gov-800">Step {step.num}:</span>
                        <h4 className="text-xs font-black text-slate-900">{step.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PART B: PILOT SUCCESS METRICS SECTION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  <span>Pilot Evaluation & Impact Success Metrics</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">Mandi Kalan Pilot Study • 14-Day Trial</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-gov">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
                    <span>Alert Lead Time</span>
                    <Clock className="h-4 w-4 text-gov-700" />
                  </div>
                  <p className="text-2xl font-black font-mono text-slate-900 mt-1">52 Mins</p>
                  <p className="text-xs text-emerald-700 font-bold mt-1">✓ Advance warning before gate rush</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Allows proactive farmer shift</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-gov">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
                    <span>Operator Response</span>
                    <TrendingUp className="h-4 w-4 text-emerald-700" />
                  </div>
                  <p className="text-2xl font-black font-mono text-slate-900 mt-1">3.8 Mins</p>
                  <p className="text-xs text-emerald-700 font-bold mt-1">✓ Mean action time</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">From alert to broadcast dispatch</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-gov">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
                    <span>Inclusive User Reach</span>
                    <Users className="h-4 w-4 text-amber-700" />
                  </div>
                  <p className="text-2xl font-black font-mono text-slate-900 mt-1">94.2%</p>
                  <p className="text-xs text-emerald-700 font-bold mt-1">✓ Cross-channel penetration</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">SMS: 38% • Voice: 26% • App: 21% • CSC: 15%</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-gov">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
                    <span>Wait Reduction</span>
                    <Activity className="h-4 w-4 text-blue-700" />
                  </div>
                  <p className="text-2xl font-black font-mono text-slate-900 mt-1">-38 Mins</p>
                  <p className="text-xs text-emerald-700 font-bold mt-1">✓ Peak queue cut nearly in half</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">From 78 mins down to 40 mins</p>
                </div>
              </div>
            </div>

            {/* PART C: HELPLINE CALLBACKS DESK */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-gov space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <PhoneForwarded className="h-5 w-5 text-emerald-800" />
                    <span>Pending Farmer Helpline Callbacks</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Inbound callback requests submitted via App, USSD (*384#) or Toll-Free IVR
                  </p>
                </div>
                <span className="font-mono text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded font-bold">
                  {callbackList.filter(c => c.status === 'PENDING').length} Pending Requests
                </span>
              </div>

              <div className="space-y-2.5">
                {callbackList.map(cb => (
                  <div
                    key={cb.id}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      cb.status === 'RESOLVED'
                        ? 'border-slate-200 bg-slate-50 opacity-60'
                        : 'border-amber-200 bg-amber-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border text-slate-700">
                          #{cb.id}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900">{cb.farmerName}</h4>
                        <span className="text-xs font-mono text-slate-600">+91 {cb.phone}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded uppercase font-bold">
                          {cb.language}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1 font-medium">{cb.issueCategory}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Requested: {cb.preferredTime} • Received: {cb.timestamp}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {cb.status !== 'RESOLVED' ? (
                        <>
                          <button
                            onClick={() => handleTriggerCallbackCall(cb.id)}
                            disabled={callingId === cb.id}
                            className="py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <PhoneCall className="h-3 w-3" />
                            <span>{callingId === cb.id ? 'Calling...' : 'Call Farmer'}</span>
                          </button>
                          <button
                            onClick={() => handleResolveCallback(cb.id)}
                            className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                          >
                            Mark Resolved
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Resolved</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* QUEUE TAB */}
        {activeTab === 'queue' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Live Weighbridge & Gate Queue</h2>
              <span className="font-mono text-xs bg-gov-100 text-gov-800 px-2.5 py-1 rounded font-bold">
                {currentQueue} Vehicles Active
              </span>
            </div>
            {/* Interactive Token Calling Workflow */}
            <OperatorLifecycleWorkflow activeStation="queue" />
            {/* Real-time Architecture Controller */}
            <OperationalControllerCard />
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

        {/* DEFAULT TAB: CORE DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Centre Subheader & Live Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Singanallur Procurement Centre
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    Live Operations
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Coimbatore District, Tamil Nadu • Intake Gates 1 & 2 • Shift: 08:00–19:00
                </p>

                {/* Model Status & Confidence Metadata (Module 1) */}
                <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] font-mono">
                  <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                    ● Model Status: Active (Inference Ready)
                  </span>
                  <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-semibold">
                    Confidence: High
                  </span>
                  <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    Last Updated: 11:15 AM
                  </span>
                  <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    Telemetry: 99.4% Available
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-slate-500 font-medium">Centre Status:</span>
                <StatusBadge risk={congestionRisk} size="lg" />
              </div>
            </div>

            {/* CORE CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="Farmers Waiting"
                value={`${currentQueue}`}
                subtext="Waiting inside & at gate approach"
                icon={<Users className="h-6 w-6" />}
                variant={currentQueue > 20 ? 'danger' : currentQueue > 10 ? 'warning' : 'success'}
              />

              <MetricCard
                label="Expected Arrivals"
                value={`${expectedArrivals}`}
                subtext={farmerAdvisorySent ? 'Advisory shifting ~14 farmers' : 'Next 60 minutes inflow'}
                icon={<CalendarClock className="h-6 w-6" />}
                variant={expectedArrivals > 30 ? 'danger' : expectedArrivals > 18 ? 'warning' : 'success'}
              />

              <MetricCard
                label="Processing Today"
                value="42"
                subtext="Weighbridge check-ins cleared"
                icon={<CheckCircle2 className="h-6 w-6" />}
                variant="success"
              />

              <MetricCard
                label="Centre Status"
                value={congestionRisk === 'HIGH' ? 'High Pressure' : congestionRisk === 'MEDIUM' ? 'Moderate' : 'Normal'}
                subtext={congestionRisk === 'HIGH' ? 'Impending gridlock at Gate 2' : 'Operational'}
                icon={<ShieldAlert className="h-6 w-6" />}
                variant={congestionRisk === 'HIGH' ? 'danger' : congestionRisk === 'MEDIUM' ? 'warning' : 'success'}
              />
            </div>

            {/* LIVE ARCHITECTURE CONTROLLER CARD */}
            <OperationalControllerCard />

            {/* MAIN OPERATIONAL ALERT BANNER */}
            <MainAlertBanner />

            {/* CONGESTION PREDICTION & WHY (Module 2: Explainable Risk) */}
            <div className="rounded-2xl border-2 border-rose-300 bg-rose-50/70 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-600 animate-ping"></span>
                  <span className="text-xs font-black uppercase tracking-wider text-rose-950">
                    NEXT 2 HOURS: 🔴 HIGH ARRIVAL PRESSURE PREDICTED
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-rose-800">Peak Window: 11:30 AM – 1:30 PM</span>
                  <button
                    onClick={() => setActiveTab('simulator')}
                    className="py-1 px-3 rounded-lg bg-gov-800 hover:bg-gov-900 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1"
                  >
                    <Sliders className="h-3 w-3" />
                    <span>Test Redistribution</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs text-rose-950">
                  <span className="font-extrabold block text-slate-900 mb-1">1. MORE MORNING BOOKINGS</span>
                  <p className="text-slate-600">Booking concentration is higher before noon (38 scheduled vs 20/hr capacity).</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs text-rose-950">
                  <span className="font-extrabold block text-slate-900 mb-1">2. QUEUE INCREASING</span>
                  <p className="text-slate-600">Current arrivals are increasing faster than processing (+24% velocity).</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs text-rose-950">
                  <span className="font-extrabold block text-slate-900 mb-1">3. PROCESSING SLOWER</span>
                  <p className="text-slate-600">Throughput at 18/hr is below recent average due to single weighbridge intake.</p>
                </div>
              </div>
            </div>

            {/* OPERATOR ACTIONS BAR */}
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
                  onClick={() => setActiveTab('training')}
                  className="py-2 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <GraduationCap className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Training SOP</span>
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

            {/* ARRIVAL TREND & DEMAND VS CAPACITY */}
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
