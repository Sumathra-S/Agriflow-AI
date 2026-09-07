import React, { useState, useEffect } from 'react';
import { queueEngine } from '../../services/engine/queueEngine';
import { procurementTrackingEngine } from '../../services/engine/procurementTrackingEngine';
import { disruptionEngine } from '../../services/engine/disruptionEngine';
import { QueueState, ProcurementRecord, DisruptionEvent } from '../../types/procurement';
import { eventBus } from '../../services/engine/eventBus';
import {
  Play,
  FastForward,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sliders,
  Send
} from 'lucide-react';

export const OperationalControllerCard: React.FC = () => {
  const [queueState, setQueueState] = useState<QueueState>(queueEngine.getQueueState());
  const [procurementRecord, setProcurementRecord] = useState<ProcurementRecord>(procurementTrackingEngine.getRecord());
  const [activeDisruption, setActiveDisruption] = useState<DisruptionEvent | null>(disruptionEngine.getActiveDisruption());
  const [delayNotice, setDelayNotice] = useState<string | null>(null);

  useEffect(() => {
    const unsubQueue = eventBus.subscribe('QUEUE_UPDATED', (event) => setQueueState(event.payload));
    const unsubStatus = eventBus.subscribe('PROCUREMENT_STATUS_CHANGED', (event) => setProcurementRecord(event.payload));
    const unsubDelay = eventBus.subscribe('CENTRE_DELAY_REPORTED', (event) => setActiveDisruption(event.payload));
    const unsubResolve = eventBus.subscribe('DISRUPTION_RESOLVED', () => setActiveDisruption(null));

    return () => {
      unsubQueue();
      unsubStatus();
      unsubDelay();
      unsubResolve();
    };
  }, []);

  const handleAdvanceToken = () => {
    const updated = queueEngine.advanceToken();
    setQueueState(updated);
  };

  const handleAdvanceStatus = () => {
    const updated = procurementTrackingEngine.advanceStatus();
    setProcurementRecord(updated);
  };

  const handleReportDelay = () => {
    const event = disruptionEngine.reportDelay(25, 'Weighbridge #2 load cell calibration');
    setActiveDisruption(event);
    setDelayNotice('25 Min Delay Dispatched to 5 affected farmers');
    setTimeout(() => setDelayNotice(null), 3500);
  };

  const handleResolveDelay = () => {
    disruptionEngine.resolveDisruption();
    setActiveDisruption(null);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-gov space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-gov-800" />
          <div>
            <h3 className="text-base font-black text-slate-900">
              Live Architecture Controller (Demonstration Desk)
            </h3>
            <p className="text-xs text-slate-500">
              Directly triggers Queue, Tracking, and Disruption engines to simulate live mandi events
            </p>
          </div>
        </div>
        <span className="font-mono text-xs bg-gov-100 text-gov-800 px-2 py-0.5 rounded font-bold">
          Singanallur Live Bus
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Action 1: Advance Token Head */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase">1. Queue Engine Control</span>
          <div className="flex items-center justify-between text-xs">
            <span>Current Head:</span>
            <span className="font-mono font-black text-gov-900 text-sm">{queueState.currentToken}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>Demo Farmer Token:</span>
            <span className="font-mono font-bold text-emerald-800">{queueState.farmerToken} ({queueState.tokensAhead} Ahead)</span>
          </div>
          <button
            onClick={handleAdvanceToken}
            className="w-full py-2 rounded-xl bg-gov-800 hover:bg-gov-900 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <FastForward className="h-3.5 w-3.5" />
            <span>Advance Token Head</span>
          </button>
        </div>

        {/* Action 2: Advance Procurement Lifecycle */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase">2. Status Tracking Engine</span>
          <div className="flex items-center justify-between text-xs">
            <span>Lifecycle State:</span>
            <span className="font-bold text-slate-900 text-xs truncate max-w-[120px]">{procurementRecord.currentStatus}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>Payment Status:</span>
            <span className="font-bold text-emerald-700">{procurementRecord.paymentStatus}</span>
          </div>
          <button
            onClick={handleAdvanceStatus}
            className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Advance Status Stage</span>
          </button>
        </div>

        {/* Action 3: Trigger / Resolve Operational Delay */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase">3. Disruption Engine</span>
          <div className="flex items-center justify-between text-xs">
            <span>Operational Delay:</span>
            <span className="font-bold text-amber-700">{activeDisruption ? `${activeDisruption.delayMinutes} Mins` : 'None (On Schedule)'}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>Gate Flow:</span>
            <span className="font-medium text-slate-600">{activeDisruption ? 'Trolley backlog' : 'Normal clearance'}</span>
          </div>
          {activeDisruption ? (
            <button
              onClick={handleResolveDelay}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Resolve Delay</span>
            </button>
          ) : (
            <button
              onClick={handleReportDelay}
              className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Report 25-Min Delay</span>
            </button>
          )}
        </div>
      </div>

      {delayNotice && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{delayNotice}</span>
        </div>
      )}
    </div>
  );
};
