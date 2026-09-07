import React, { useState } from 'react';
import { quantityDemandEngine } from '../../services/engine/quantityDemandEngine';
import { eventBus } from '../../services/engine/eventBus';
import { authService } from '../../services/authService';
import {
  Truck,
  Tractor,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Play,
  Check,
  X,
  CreditCard,
  FileCheck,
  Layers,
  Building2,
  Users,
  ShieldCheck,
  Lock,
  ArrowRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export interface WorkflowFarmerItem {
  tokenNumber: string;
  farmerName: string;
  farmerId: string;
  village: string;
  vehicle: string;
  crop: string;
  estimatedWeightKg: number;
  grossWeightKg?: number;
  tareWeightKg?: number;
  netWeightKg?: number;
  moisturePercent?: number;
  foreignMatterPercent?: number;
  qualityGrade?: 'GRADE_A' | 'FAQ' | 'REJECTED';
  mspRatePerKg: number;
  totalPayoutAmount?: number;
  stage:
    | 'EXPECTED'
    | 'ARRIVED'
    | 'CALLED'
    | 'WEIGHING'
    | 'WEIGHED'
    | 'QUALITY_CHECK'
    | 'QUALITY_PASSED'
    | 'QUALITY_FLAGGED'
    | 'PROCURED'
    | 'PAYMENT_INITIATED';
}

const INITIAL_FARMERS: WorkflowFarmerItem[] = [
  {
    tokenNumber: 'AF-108',
    farmerName: 'Ravi Kumar',
    farmerId: 'MH-2024-8841',
    village: 'Singanallur',
    vehicle: 'Tractor Trolley (PB-10-CZ-4412)',
    crop: 'Paddy (Grade A)',
    estimatedWeightKg: 1000,
    mspRatePerKg: 23.0,
    stage: 'EXPECTED'
  },
  {
    tokenNumber: 'AF-107',
    farmerName: 'Harpreet Singh',
    farmerId: 'PB-2024-1102',
    village: 'Sulur',
    vehicle: 'Mini Truck (PB-08-AB-9921)',
    crop: 'Wheat (Sharbati)',
    estimatedWeightKg: 2500,
    mspRatePerKg: 22.75,
    stage: 'ARRIVED'
  },
  {
    tokenNumber: 'AF-106',
    farmerName: 'Gurmukh Gill',
    farmerId: 'PB-2024-7721',
    village: 'Ondipudur',
    vehicle: 'Tractor Trolley (PB-10-DK-1120)',
    crop: 'Paddy (Common)',
    estimatedWeightKg: 4000,
    grossWeightKg: 7800,
    tareWeightKg: 3800,
    netWeightKg: 4000,
    mspRatePerKg: 23.0,
    stage: 'WEIGHING'
  },
  {
    tokenNumber: 'AF-105',
    farmerName: 'Jaswinder Kaur',
    farmerId: 'PB-2024-3391',
    village: 'Singanallur',
    vehicle: 'Mini Truck (PB-08-FF-4412)',
    crop: 'Paddy (Grade A)',
    estimatedWeightKg: 3000,
    grossWeightKg: 6200,
    tareWeightKg: 3200,
    netWeightKg: 3000,
    moisturePercent: 13.4,
    foreignMatterPercent: 0.8,
    stage: 'QUALITY_CHECK',
    mspRatePerKg: 23.0
  },
  {
    tokenNumber: 'AF-104',
    farmerName: 'Baldev Singh',
    farmerId: 'PB-2024-9981',
    village: 'Singanallur',
    vehicle: 'Tractor Trolley (PB-10-EE-2201)',
    crop: 'Paddy (Grade A)',
    estimatedWeightKg: 5000,
    grossWeightKg: 9500,
    tareWeightKg: 4500,
    netWeightKg: 5000,
    moisturePercent: 12.8,
    foreignMatterPercent: 0.5,
    qualityGrade: 'GRADE_A',
    mspRatePerKg: 23.0,
    totalPayoutAmount: 115000,
    stage: 'PROCURED'
  }
];

interface OperatorLifecycleWorkflowProps {
  activeStation:
    | 'arrivals'
    | 'queue'
    | 'tokens'
    | 'weighing'
    | 'quality'
    | 'procurement'
    | 'counters'
    | 'capacity'
    | 'alerts';
}

export const OperatorLifecycleWorkflow: React.FC<OperatorLifecycleWorkflowProps> = ({
  activeStation
}) => {
  const [items, setItems] = useState<WorkflowFarmerItem[]>(INITIAL_FARMERS);
  const [centreLockViolation, setCentreLockViolation] = useState<string | null>(null);

  // Operational Action Handlers
  const handleMarkArrived = (tokenNumber: string) => {
    setItems(prev =>
      prev.map(i => (i.tokenNumber === tokenNumber ? { ...i, stage: 'ARRIVED' } : i))
    );
    authService.logAction(
      'Balwinder Dhillon',
      'OPERATOR',
      'MARK_ARRIVED',
      `Token ${tokenNumber}`,
      'Farmer vehicle arrived at Gate 2 intake line'
    );
  };

  const handleCallToken = (tokenNumber: string) => {
    setItems(prev =>
      prev.map(i => (i.tokenNumber === tokenNumber ? { ...i, stage: 'CALLED' } : i))
    );
    authService.logAction(
      'Balwinder Dhillon',
      'OPERATOR',
      'CALL_TOKEN',
      `Token ${tokenNumber}`,
      'Operator called token to Weighbridge #1'
    );
  };

  const handleStartWeighing = (tokenNumber: string) => {
    setItems(prev =>
      prev.map(i => (i.tokenNumber === tokenNumber ? { ...i, stage: 'WEIGHING' } : i))
    );
  };

  const handleCompleteWeighing = (tokenNumber: string) => {
    setItems(prev =>
      prev.map(i =>
        i.tokenNumber === tokenNumber
          ? {
              ...i,
              stage: 'WEIGHED',
              grossWeightKg: 7800,
              tareWeightKg: 3800,
              netWeightKg: 4000
            }
          : i
      )
    );
    authService.logAction(
      'Balwinder Dhillon',
      'OPERATOR',
      'COMPLETE_WEIGHING',
      `Token ${tokenNumber}`,
      'Weighbridge gross & tare recorded. Net weight: 4,000 kg (4.0t)'
    );
  };

  const handleStartQualityCheck = (tokenNumber: string) => {
    setItems(prev =>
      prev.map(i =>
        i.tokenNumber === tokenNumber
          ? {
              ...i,
              stage: 'QUALITY_CHECK',
              moisturePercent: 13.2,
              foreignMatterPercent: 0.6
            }
          : i
      )
    );
  };

  const handlePassQuality = (tokenNumber: string) => {
    setItems(prev =>
      prev.map(i =>
        i.tokenNumber === tokenNumber
          ? {
              ...i,
              stage: 'QUALITY_PASSED',
              qualityGrade: 'GRADE_A',
              moisturePercent: 13.2
            }
          : i
      )
    );
    authService.logAction(
      'Balwinder Dhillon',
      'OPERATOR',
      'PASS_QUALITY',
      `Token ${tokenNumber}`,
      'Grain quality passed (Moisture: 13.2% within 14.0% limit)'
    );
  };

  const handleFlagQuality = (tokenNumber: string) => {
    setItems(prev =>
      prev.map(i =>
        i.tokenNumber === tokenNumber
          ? {
              ...i,
              stage: 'QUALITY_FLAGGED',
              moisturePercent: 17.4
            }
          : i
      )
    );
    authService.logAction(
      'Balwinder Dhillon',
      'OPERATOR',
      'FLAG_QUALITY',
      `Token ${tokenNumber}`,
      'Grain moisture at 17.4% flagged for drying bin'
    );
  };

  const handleCompleteProcurement = (tokenNumber: string) => {
    setItems(prev =>
      prev.map(i => {
        if (i.tokenNumber === tokenNumber) {
          const net = i.netWeightKg || i.estimatedWeightKg;
          const payout = net * i.mspRatePerKg;
          return {
            ...i,
            stage: 'PROCURED',
            totalPayoutAmount: payout
          };
        }
        return i;
      })
    );
    authService.logAction(
      'Balwinder Dhillon',
      'OPERATOR',
      'COMPLETE_PROCUREMENT',
      `Token ${tokenNumber}`,
      'Procurement approved under MSP scheme. Weighment slip sanctioned.'
    );
  };

  const handleInitiatePayment = (tokenNumber: string) => {
    setItems(prev =>
      prev.map(i => (i.tokenNumber === tokenNumber ? { ...i, stage: 'PAYMENT_INITIATED' } : i))
    );
    authService.logAction(
      'Balwinder Dhillon',
      'OPERATOR',
      'PAYMENT_INITIATED',
      `Token ${tokenNumber}`,
      'DBT PFMS batch payload dispatched to Aadhaar Payment Bridge'
    );
  };

  const centreMetrics = quantityDemandEngine.getCentreMetrics('centre-c');

  // Strict RBAC Centre Isolation test
  const handleAttemptSwitchCentre = (targetCentre: string) => {
    const isAllowed = authService.canAccessCentre('OPERATOR', 'centre-c', targetCentre);
    if (!isAllowed) {
      setCentreLockViolation(
        `403 Forbidden: Operator Balwinder Dhillon is strictly isolated to Singanallur Centre (Centre C). Access to ${targetCentre} is restricted to District Administrators.`
      );
      setTimeout(() => setCentreLockViolation(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Strict Isolation Bar & Centre Identification */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gov-800 text-white rounded-xl">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">
                Singanallur Procurement Centre (Centre C)
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                <Lock className="h-3 w-3" /> ISOLATED (OPERATOR RBAC)
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Assigned Operator: Balwinder Dhillon (EMP-OP-4109) • Gate 2 Weighbridge
            </p>
          </div>
        </div>

        {/* Multi-centre isolation check button for evaluator */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">Test RBAC Isolation:</span>
          <button
            onClick={() => handleAttemptSwitchCentre('centre-b')}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] border border-slate-300"
            title="Attempt switching to Sulur Centre B"
          >
            Access Sulur Hub (Centre B)
          </button>
        </div>
      </div>

      {/* RBAC Violation Notice */}
      {centreLockViolation && (
        <div className="bg-rose-50 border-2 border-rose-300 text-rose-900 rounded-xl p-3 text-xs flex items-center gap-2 animate-bounce font-mono">
          <AlertTriangle className="h-5 w-5 text-rose-600 flex-shrink-0" />
          <span>{centreLockViolation}</span>
        </div>
      )}

      {/* STATION: ARRIVALS */}
      {activeStation === 'arrivals' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Gate Arrivals & Check-In Desk</h3>
              <p className="text-xs text-slate-500">
                Incoming farmer vehicles from Singanallur, Sulur, and Ondipudur
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-gov-50 text-gov-800 px-3 py-1 rounded-full border border-gov-200">
              Gate 2 Active
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {items.map(farmer => (
              <div
                key={farmer.tokenNumber}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gov-800 text-sm">
                      #{farmer.tokenNumber}
                    </span>
                    <span className="font-bold text-slate-900">{farmer.farmerName}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({farmer.farmerId})</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Tractor className="h-3 w-3" /> {farmer.vehicle}
                    </span>
                    <span>• {farmer.village}</span>
                    <span>• {farmer.crop} ({farmer.estimatedWeightKg} kg)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      farmer.stage === 'EXPECTED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {farmer.stage}
                  </span>

                  {farmer.stage === 'EXPECTED' ? (
                    <button
                      onClick={() => handleMarkArrived(farmer.tokenNumber)}
                      className="bg-gov-800 hover:bg-gov-900 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <Check className="h-3.5 w-3.5" /> MARK ARRIVED
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Checked In
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STATION: LIVE QUEUE & CALLING */}
      {activeStation === 'queue' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Live Intake Queue & Token Call</h3>
              <p className="text-xs text-slate-500">
                Call farmers forward to Weighbridge #1 and Intake Bay 3
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
              8 Vehicles in Yard
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {items.map(farmer => (
              <div
                key={farmer.tokenNumber}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-gov-800 text-sm">
                      #{farmer.tokenNumber}
                    </span>
                    <span className="font-bold text-slate-900">{farmer.farmerName}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {farmer.crop} • {(farmer.estimatedWeightKg / 1000).toFixed(1)}t • {farmer.vehicle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {farmer.stage}
                  </span>

                  {farmer.stage === 'ARRIVED' && (
                    <button
                      onClick={() => handleCallToken(farmer.tokenNumber)}
                      className="bg-gov-800 hover:bg-gov-900 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-xs"
                    >
                      <Play className="h-3.5 w-3.5" /> CALL TOKEN
                    </button>
                  )}

                  {farmer.stage === 'CALLED' && (
                    <button
                      onClick={() => handleStartWeighing(farmer.tokenNumber)}
                      className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-xs"
                    >
                      <Scale className="h-3.5 w-3.5" /> TO WEIGHBRIDGE
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STATION: WEIGHING */}
      {activeStation === 'weighing' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Weighbridge Console (Weighbridge #1)</h3>
              <p className="text-xs text-slate-500">
                Certified electronic scale integration • Tare & Gross weight recording
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
              60t Capacity Scale
            </span>
          </div>

          <div className="space-y-3">
            {items
              .filter(i => ['CALLED', 'WEIGHING', 'WEIGHED', 'QUALITY_CHECK'].includes(i.stage))
              .map(farmer => (
                <div
                  key={farmer.tokenNumber}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-gov-800 text-sm">
                        #{farmer.tokenNumber}
                      </span>
                      <span className="font-bold text-slate-900">{farmer.farmerName}</span>
                      <span className="text-[11px] text-slate-500">({farmer.crop})</span>
                    </div>
                    <span className="font-mono font-bold text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">
                      {farmer.stage}
                    </span>
                  </div>

                  {farmer.grossWeightKg ? (
                    <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-lg border border-slate-200 text-center font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Gross Weight</span>
                        <strong className="text-slate-900">{farmer.grossWeightKg} kg</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Tare Weight</span>
                        <strong className="text-slate-600">{farmer.tareWeightKg} kg</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block text-emerald-700">Net Weight</span>
                        <strong className="text-emerald-700 text-sm">{farmer.netWeightKg} kg (4.0t)</strong>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">Vehicle positioned on scale. Awaiting sensor sync...</p>
                  )}

                  <div className="flex justify-end gap-2 pt-1">
                    {farmer.stage === 'CALLED' && (
                      <button
                        onClick={() => handleStartWeighing(farmer.tokenNumber)}
                        className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                      >
                        <Scale className="h-3.5 w-3.5" /> START WEIGHING
                      </button>
                    )}
                    {farmer.stage === 'WEIGHING' && (
                      <button
                        onClick={() => handleCompleteWeighing(farmer.tokenNumber)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
                      >
                        <Check className="h-3.5 w-3.5" /> COMPLETE WEIGHING
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* STATION: QUALITY CHECK */}
      {activeStation === 'quality' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Quality Inspection & Moisture Desk</h3>
              <p className="text-xs text-slate-500">
                FCI Specifications: Moisture ≤ 14.0% • Foreign Matter ≤ 1.0%
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-purple-50 text-purple-800 px-3 py-1 rounded-full border border-purple-200">
              Lab Desk #1
            </span>
          </div>

          <div className="space-y-3">
            {items
              .filter(i =>
                ['WEIGHED', 'QUALITY_CHECK', 'QUALITY_PASSED', 'QUALITY_FLAGGED'].includes(i.stage)
              )
              .map(farmer => (
                <div
                  key={farmer.tokenNumber}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-gov-800 text-sm">
                        #{farmer.tokenNumber}
                      </span>
                      <span className="font-bold text-slate-900">{farmer.farmerName}</span>
                    </div>
                    <span className="font-mono font-bold text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">
                      {farmer.stage}
                    </span>
                  </div>

                  {farmer.moisturePercent !== undefined && (
                    <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-slate-200 font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Moisture Reading</span>
                        <strong
                          className={
                            farmer.moisturePercent <= 14.0 ? 'text-emerald-700' : 'text-rose-700'
                          }
                        >
                          {farmer.moisturePercent}% (Limit: 14.0%)
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Foreign Matter</span>
                        <strong className="text-slate-800">
                          {farmer.foreignMatterPercent ?? 0.8}%
                        </strong>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-1">
                    {farmer.stage === 'WEIGHED' && (
                      <button
                        onClick={() => handleStartQualityCheck(farmer.tokenNumber)}
                        className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                      >
                        <Play className="h-3.5 w-3.5" /> START QUALITY CHECK
                      </button>
                    )}

                    {farmer.stage === 'QUALITY_CHECK' && (
                      <>
                        <button
                          onClick={() => handlePassQuality(farmer.tokenNumber)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
                        >
                          <Check className="h-3.5 w-3.5" /> PASS (GRADE A)
                        </button>
                        <button
                          onClick={() => handleFlagQuality(farmer.tokenNumber)}
                          className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
                        >
                          <X className="h-3.5 w-3.5" /> FLAG HIGH MOISTURE
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* STATION: PROCUREMENT & PAYMENTS */}
      {activeStation === 'procurement' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Procurement Sanctioning & DBT Payments
              </h3>
              <p className="text-xs text-slate-500">
                Sanction MSP purchase and dispatch PFMS electronic payout batch
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
              PFMS Gateway Ready
            </span>
          </div>

          <div className="space-y-3">
            {items
              .filter(i => ['QUALITY_PASSED', 'PROCURED', 'PAYMENT_INITIATED'].includes(i.stage))
              .map(farmer => (
                <div
                  key={farmer.tokenNumber}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-gov-800 text-sm">
                          #{farmer.tokenNumber}
                        </span>
                        <span className="font-bold text-slate-900">{farmer.farmerName}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {farmer.crop} • Net Weight: {farmer.netWeightKg ?? farmer.estimatedWeightKg} kg
                      </p>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-[10px] text-slate-500 block">Total MSP Payout</span>
                      <strong className="text-emerald-700 text-sm">
                        ₹
                        {(
                          (farmer.netWeightKg ?? farmer.estimatedWeightKg) * farmer.mspRatePerKg
                        ).toLocaleString('en-IN')}
                        .00
                      </strong>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    {farmer.stage === 'QUALITY_PASSED' && (
                      <button
                        onClick={() => handleCompleteProcurement(farmer.tokenNumber)}
                        className="bg-gov-800 hover:bg-gov-900 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
                      >
                        <FileCheck className="h-3.5 w-3.5" /> COMPLETE PROCUREMENT
                      </button>
                    )}

                    {farmer.stage === 'PROCURED' && (
                      <button
                        onClick={() => handleInitiatePayment(farmer.tokenNumber)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
                      >
                        <CreditCard className="h-3.5 w-3.5" /> PAYMENT INITIATED (DBT)
                      </button>
                    )}

                    {farmer.stage === 'PAYMENT_INITIATED' && (
                      <span className="text-emerald-700 font-bold flex items-center gap-1 font-mono text-xs">
                        <CheckCircle2 className="h-4 w-4" /> PFMS Batch Dispatched
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* STATION: COUNTERS & BAY MANAGEMENT */}
      {activeStation === 'counters' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Counters & Intake Bays</h3>
              <p className="text-xs text-slate-500">
                Operational status of weighbridges, labs, and unloading bays at Singanallur
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
              4 Counters Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { id: 'cnt-1', name: 'Weighbridge #1 (Electronic 60t)', status: 'ACTIVE', servingToken: 'AF-106', throughputPerHour: 18 },
              { id: 'cnt-2', name: 'Weighbridge #2 (Backup Scale)', status: 'STANDBY', servingToken: undefined, throughputPerHour: 18 },
              { id: 'cnt-3', name: 'Moisture Testing Lab #1', status: 'ACTIVE', servingToken: 'AF-105', throughputPerHour: 22 },
              { id: 'cnt-4', name: 'Unloading Bay 3 (Bulk Bags)', status: 'ACTIVE', servingToken: 'AF-104', throughputPerHour: 15 }
            ].map(c => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{c.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      c.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Serving: {c.servingToken ? `#${c.servingToken}` : 'Idle'}</span>
                  <span>Throughput: {c.throughputPerHour} tonnes / hr</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STATION: CAPACITY & DEMAND METRICS */}
      {activeStation === 'capacity' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Quantity-Aware Capacity & Demand
              </h3>
              <p className="text-xs text-slate-500">
                Real-time tonnes tracking including +25% predicted walk-in demand
              </p>
            </div>
            <span
              className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                centreMetrics.congestionState === 'NEAR_CAPACITY'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {centreMetrics.congestionState} ({centreMetrics.quantityUtilizationPct}%)
            </span>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Capacity</span>
              <span className="text-xl font-black font-mono text-slate-900">
                {centreMetrics.capacityTonnes}t
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Booked Volume</span>
              <span className="text-xl font-black font-mono text-gov-800">
                {centreMetrics.bookedQuantityTonnes}t
              </span>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">
                Predicted Walk-In
              </span>
              <span className="text-xl font-black font-mono text-amber-900">
                +{centreMetrics.predictedWalkInQuantityTonnes}t
              </span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                Free Capacity
              </span>
              <span className="text-xl font-black font-mono text-emerald-800">
                {centreMetrics.remainingCapacityTonnes.toFixed(0)}t
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Intake Load: {centreMetrics.expectedTotalDemandTonnes}t of {centreMetrics.capacityTonnes}t</span>
              <span className="font-mono">{centreMetrics.quantityUtilizationPct}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(centreMetrics.bookedQuantityTonnes / centreMetrics.capacityTonnes) * 100}%` }}
                className="bg-gov-800 h-full"
                title="Booked Slots"
              />
              <div
                style={{
                  width: `${(centreMetrics.predictedWalkInQuantityTonnes / centreMetrics.capacityTonnes) * 100}%`
                }}
                className="bg-amber-500 h-full"
                title="Predicted Walk-In Demand"
              />
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-gov-800"></span> Booked Demand ({centreMetrics.bookedQuantityTonnes}t)
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> Predicted Walk-in (+{centreMetrics.predictedWalkInQuantityTonnes}t)
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span> Remaining Headroom ({centreMetrics.remainingCapacityTonnes.toFixed(0)}t)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STATION: ALERTS */}
      {activeStation === 'alerts' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900">Centre Operational Alerts</h3>
            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
              3 Active Notices
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/80 text-amber-950 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block">High Walk-In Surge Expected Around 12:30 PM</strong>
                <span>
                  Historical harvest velocity indicates up to 18 tonnes of unbooked tractor trolleys
                  approaching from Ondipudur village.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 flex items-start gap-2.5">
              <Clock className="h-4 w-4 text-gov-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block">Moisture Desorption Rate Normal</strong>
                <span>Average incoming moisture at 13.2%, comfortably within 14.0% specification limit.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
