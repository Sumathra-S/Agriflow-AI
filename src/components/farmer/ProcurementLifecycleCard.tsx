import React, { useState, useEffect } from 'react';
import { procurementTrackingEngine, LIFECYCLE_STAGES } from '../../services/engine/procurementTrackingEngine';
import { ProcurementRecord } from '../../types/procurement';
import { eventBus } from '../../services/engine/eventBus';
import {
  FileText,
  CheckCircle2,
  Clock,
  IndianRupee,
  ShieldCheck,
  Building2,
  Scale
} from 'lucide-react';

export const ProcurementLifecycleCard: React.FC = () => {
  const [record, setRecord] = useState<ProcurementRecord>(procurementTrackingEngine.getRecord());

  useEffect(() => {
    const unsubscribe = eventBus.subscribe('PROCUREMENT_STATUS_CHANGED', (event) => {
      setRecord(event.payload);
    });
    return () => unsubscribe();
  }, []);

  const currentStageIndex = LIFECYCLE_STAGES.findIndex(s => s.status === record.currentStatus);

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-md overflow-hidden space-y-4 p-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gov-800" />
          <div>
            <h3 className="text-sm font-black text-slate-900">Procurement & Payment Tracking</h3>
            <p className="text-[11px] text-slate-500">
              Record #{record.id} • Singanallur Procurement Centre
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
          MSP ₹{record.mspPerQuintal}/Qtl
        </span>
      </div>

      {/* 8-Stage Progress Stepper */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Lifecycle Progression
        </span>
        <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {LIFECYCLE_STAGES.map((stage, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={stage.status} className="relative flex items-start gap-2.5 text-xs">
                <div
                  className={`absolute -left-6 top-0.5 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCompleted
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold ${
                        isCurrent
                          ? 'text-gov-900 text-sm'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {stage.label}
                    </span>
                    {isCurrent && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Active Stage
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payout & Direct Benefit Transfer Receipt */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase">Estimated MSP Payout</span>
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
            DBT Linked
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-500">Allocated Quantity</span>
            <p className="font-bold text-slate-900">{record.allocatedWeightQtl} Quintals</p>
          </div>
          <div>
            <span className="text-slate-500">Gross Amount</span>
            <p className="font-black text-slate-900 text-base flex items-center">
              <IndianRupee className="h-4 w-4" />
              <span>{record.grossAmount?.toLocaleString('en-IN') || '1,04,400'}</span>
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />
          <span>{record.dbtAccountRef}</span>
        </div>
      </div>
    </div>
  );
};
