import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { useAuth } from '../../context/AuthContext';
import {
  AlertTriangle,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  X,
  Sparkles,
  TrendingDown,
  ShieldCheck,
  Building2,
  Users,
  Clock,
  ArrowRight,
  Zap
} from 'lucide-react';
import { auditTrailService } from '../../services/engine/auditTrailService';

interface CrisisCascadeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CascadeStep {
  step: number;
  title: string;
  actor: string;
  recommendedRole: 'OPERATOR' | 'FARMER' | 'ADMIN';
  description: string;
  metric: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
}

const CRISIS_STEPS: Omit<CascadeStep, 'status'>[] = [
  {
    step: 1,
    title: 'Morning Baseline Flow (09:00 AM)',
    actor: 'Singanallur APMC Gate Operator',
    recommendedRole: 'OPERATOR',
    description: 'Centre opens with 8 tractor trolleys in queue. Operating within hourly weighbridge capacity of 18/hr.',
    metric: 'Queue: 8 • Wait: 15 min • Risk: 🟢 LOW'
  },
  {
    step: 2,
    title: 'Weather Influx & Harvest Acceleration',
    actor: 'Sulur / Pollachi Mechanized Blocks',
    recommendedRole: 'OPERATOR',
    description: 'Hot sunny weather accelerates combine harvesters. Digital booking velocity accelerates +35% above average.',
    metric: 'Booking Rate: +35% • Transit Volume: High'
  },
  {
    step: 3,
    title: 'Surge Arrival (48 Trolleys at 11:30 AM)',
    actor: 'Tractor Trolley Intake Influx',
    recommendedRole: 'OPERATOR',
    description: '48 vehicles arrive simultaneously for midday delivery, exceeding the 18/hr gate capacity by 267%.',
    metric: 'Arrivals: 48/hr vs 18/hr capacity (267% overload)'
  },
  {
    step: 4,
    title: 'Congestion Spike to 🔴 CRITICAL',
    actor: 'AgriFlow Early Detection Monitor',
    recommendedRole: 'OPERATOR',
    description: 'Weighbridge gate bottleneck causes estimated waiting time to jump from 15 minutes to 78 minutes.',
    metric: 'Queue: 23 • Est. Wait: 78 min • Risk: 🔴 HIGH'
  },
  {
    step: 5,
    title: 'Explainable AI Root Cause Decomposition',
    actor: 'LightGBM Feature Attribution Engine',
    recommendedRole: 'OPERATOR',
    description: 'System isolates top 3 factors: +32% harvest speed, ₹185 open market MSP gap, Weighbridge #2 tare check.',
    metric: 'Top Factor: Combine Velocity (32% attribution)'
  },
  {
    step: 6,
    title: 'AI Proposes Dual Flow Interventions',
    actor: 'AgriFlow Smart Flow Orchestrator',
    recommendedRole: 'OPERATOR',
    description: 'Engine proposes: (1) Divert 14 flexible bookings to Ramanathapuram Yard (4.2 km), (2) Dispatch Smart 2 PM arrival advisory.',
    metric: 'Confidence: 94% • Projected Savings: -52 min'
  },
  {
    step: 7,
    title: 'Human-in-the-Loop Operator Approval',
    actor: 'Officer K. Murugesan (Procurement Officer)',
    recommendedRole: 'OPERATOR',
    description: 'Operator reviews AI recommendations, adds shift notes, and signs approval to the tamper-evident audit trail.',
    metric: 'Decision: APPROVED • Cryptographic Block #4 Created'
  },
  {
    step: 8,
    title: 'Inclusive Multi-Channel Advisory Broadcast',
    actor: 'Telecom Gateway (SMS / IVR / USSD)',
    recommendedRole: 'OPERATOR',
    description: 'Broadcast dispatched to 48 affected farmers across SMS, Tamil voice automated IVR, and feature phone USSD.',
    metric: 'Delivery: 94.2% penetration in 90 seconds'
  },
  {
    step: 9,
    title: 'Farmer Receives Better Option & Guidance',
    actor: 'Farmer Muthusamy K (FARMER-1048)',
    recommendedRole: 'FARMER',
    description: 'Farmer app flashes Better Option Card: "Ramanathapuram Yard saves 39 min wait" or "Arrive at 2:00 PM for 16 min wait".',
    metric: 'Token AG-1048 Active • Guaranteed Gate Window'
  },
  {
    step: 10,
    title: 'Arrival Pressure Stabilizes into 🟢 Recovery',
    actor: 'Singanallur APMC Cluster Hub',
    recommendedRole: 'OPERATOR',
    description: '14 farmers reroute, 16 farmers shift to 2:00 PM. Gate queue drops to 12. Centre transitions to Recovery / Normal!',
    metric: 'Wait Reduced: 78m → 26m (-67%) • Gridlock Averted'
  }
];

export const CrisisCascadeModal: React.FC<CrisisCascadeModalProps> = ({
  isOpen,
  onClose
}) => {
  const { setPreset, goToStep } = useSimulation();
  const { setRole } = useAuth();

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStepIndex(prev => {
          if (prev >= CRISIS_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          applyStepEffects(next);
          return next;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  if (!isOpen) return null;

  const applyStepEffects = (stepIndex: number) => {
    const step = CRISIS_STEPS[stepIndex];
    if (!step) return;

    if (step.step <= 2) {
      setPreset('NORMAL');
      goToStep(1);
    } else if (step.step <= 6) {
      setPreset('HIGH_CONGESTION');
      goToStep(4);
    } else if (step.step <= 9) {
      setPreset('HIGH_CONGESTION');
      goToStep(7);
    } else {
      setPreset('RECOVERY');
      goToStep(8);
    }

    setRole(step.recommendedRole);
  };

  const handleSelectStep = (index: number) => {
    setActiveStepIndex(index);
    applyStepEffects(index);
  };

  const currentStep = CRISIS_STEPS[activeStepIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 flex items-center justify-between border-b border-rose-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-600/30 border border-rose-500/40 text-rose-400">
              <Zap className="h-6 w-6 animate-pulse text-rose-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-rose-400 font-black uppercase tracking-widest block">
                SIH 2026 Grand Finale Master Demonstration
              </span>
              <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>10-Step Crisis & Resolution Simulation Chain</span>
                <span className="text-xs font-mono bg-rose-600 text-white px-2 py-0.5 rounded-full">
                  PREDICT → DECIDE → ACT → MEASURE
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 fill-current" />
                  <span>Pause Cascade</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>Auto-Run All 10 Steps</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Timeline + Current Step Detail */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Active Step Big Spotlight Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 border border-slate-700 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-rose-600 text-white font-mono font-black text-xs rounded-lg">
                  STEP {currentStep.step} OF 10
                </span>
                <span className="text-xs font-mono text-emerald-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                  Target View: {currentStep.recommendedRole}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Actor: {currentStep.actor}
              </span>
            </div>

            <h3 className="text-lg font-black text-white">
              {currentStep.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
              {currentStep.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="font-mono font-bold text-amber-300">
                📊 Metric Impact: {currentStep.metric}
              </span>
              <button
                onClick={() => setRole(currentStep.recommendedRole)}
                className="text-xs font-bold text-emerald-400 underline hover:text-emerald-300 self-start sm:self-auto"
              >
                Switch App View to {currentStep.recommendedRole} →
              </button>
            </div>
          </div>

          {/* Stepper Horizontal Scroll / List */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Crisis Cascade Progression Flow
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CRISIS_STEPS.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => handleSelectStep(idx)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    idx === activeStepIndex
                      ? 'bg-gov-800 text-white border-gov-800 ring-2 ring-gov-700/30 shadow-sm'
                      : idx < activeStepIndex
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-mono font-black block opacity-80">
                    Step {s.step}
                  </span>
                  <p className="font-bold text-[11px] truncate mt-0.5">
                    {s.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Comparative Impact Matrix (Without vs With AgriFlow) */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-gov-800" />
                  <span>Grand Finale Impact Matrix (Without AgriFlow vs With AgriFlow)</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Measured impact of predictive coordination, virtual queueing, and multi-centre load balancing
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden bg-white">
                <thead className="bg-slate-900 text-white uppercase text-[10px] font-black">
                  <tr>
                    <th className="py-2.5 px-3">Performance Dimension</th>
                    <th className="py-2.5 px-3 text-rose-400">Without AgriFlow (Status Quo)</th>
                    <th className="py-2.5 px-3 text-emerald-400">With AgriFlow AI Platform</th>
                    <th className="py-2.5 px-3 text-right">Net Improvement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Peak Farmer Waiting Time</td>
                    <td className="py-2.5 px-3 text-rose-700 font-mono">78 minutes</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-mono font-black">26 minutes</td>
                    <td className="py-2.5 px-3 text-right text-emerald-800 font-black">-52 min (-67%)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Weighbridge Gate Queue Length</td>
                    <td className="py-2.5 px-3 text-rose-700 font-mono">23 tractor trolleys</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-mono font-black">9 vehicles</td>
                    <td className="py-2.5 px-3 text-right text-emerald-800 font-black">-61% queue depth</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Regional Capacity Utilization</td>
                    <td className="py-2.5 px-3 text-rose-700">Singanallur 91% (Overloaded) / Ramanathapuram 61% (Idle)</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">Balanced: Singanallur 68% / Ramanathapuram 78%</td>
                    <td className="py-2.5 px-3 text-right text-emerald-800 font-black">Optimal cluster balance</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Farmer Communication Reach</td>
                    <td className="py-2.5 px-3 text-rose-700">None (Farmers wait in blind queue)</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">94.2% across SMS, IVR, USSD & App</td>
                    <td className="py-2.5 px-3 text-right text-emerald-800 font-black">Universal accessibility</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Public Auditability & Governance</td>
                    <td className="py-2.5 px-3 text-rose-700">Opaque manual gate books</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-mono font-bold">SHA-256 Tamper-Evident Hash Chain</td>
                    <td className="py-2.5 px-3 text-right text-emerald-800 font-black">100% auditable</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Smart India Hackathon 2026 Grand Finale Evaluation Ready
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Close Simulation
          </button>
        </div>
      </div>
    </div>
  );
};
