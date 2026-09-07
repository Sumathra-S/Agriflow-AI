import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { queueEngine } from '../../services/engine/queueEngine';
import { QueueState } from '../../types/procurement';
import { eventBus } from '../../services/engine/eventBus';
import {
  Users,
  Clock,
  BellRing,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface QueueTrackingCardProps {
  farmerToken?: string;
}

export const QueueTrackingCard: React.FC<QueueTrackingCardProps> = ({
  farmerToken = 'TK-1024'
}) => {
  const { t } = useLanguage();
  const [queueState, setQueueState] = useState<QueueState>(queueEngine.getQueueState(farmerToken));
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = eventBus.subscribe('QUEUE_UPDATED', () => {
      setQueueState(queueEngine.getQueueState(farmerToken));
    });
    return () => unsubscribe();
  }, [farmerToken]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setQueueState(queueEngine.getQueueState(farmerToken));
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-md overflow-hidden space-y-0">
      {/* Turn Approaching Alert Banner */}
      {queueState.turnApproaching && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 font-bold text-xs flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <BellRing className="h-4 w-4 text-slate-950" />
            <span>🚨 YOUR TURN IS APPROACHING — Proceed to Gate 2 entrance</span>
          </div>
          <span className="font-mono text-[10px] bg-slate-950 text-white px-2 py-0.5 rounded">
            Only {queueState.tokensAhead} Ahead
          </span>
        </div>
      )}

      {/* Main Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gov-800" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
            Live Queue Tracking
          </span>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900"
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{queueState.lastUpdated}</span>
        </button>
      </div>

      {/* 4-Metric Grid */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white">
        <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Current Token</span>
          <p className="text-xl font-black font-mono text-gov-900 mt-0.5">
            {queueState.currentToken}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold">At Weighbridge</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
          <span className="text-[10px] font-bold text-emerald-800 uppercase">Your Token</span>
          <p className="text-xl font-black font-mono text-emerald-950 mt-0.5">
            {queueState.farmerToken}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold">Confirmed</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Trolleys Ahead</span>
          <p className="text-xl font-black font-mono text-slate-900 mt-0.5">
            {queueState.tokensAhead}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">In waiting bay</span>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-center">
          <span className="text-[10px] font-bold text-amber-800 uppercase">Estimated Wait</span>
          <p className="text-xl font-black font-mono text-amber-950 mt-0.5">
            {queueState.estimatedWaitMinutes} <span className="text-xs font-normal">min</span>
          </p>
          <span className="text-[10px] text-amber-700 font-semibold">Dynamic estimate</span>
        </div>
      </div>

      {/* Public Disclaimer */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
        <Clock className="h-3 w-3 text-slate-400 flex-shrink-0" />
        <span>{queueState.disclaimer}</span>
      </div>
    </div>
  );
};
