import React, { useState, useEffect } from 'react';
import { disruptionEngine } from '../../services/engine/disruptionEngine';
import { reschedulingEngine } from '../../services/engine/reschedulingEngine';
import { DisruptionEvent, ReschedulingProposal } from '../../types/procurement';
import { eventBus } from '../../services/engine/eventBus';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export const ReschedulingBanner: React.FC = () => {
  const [disruption, setDisruption] = useState<DisruptionEvent | null>(disruptionEngine.getActiveDisruption());
  const [proposal, setProposal] = useState<ReschedulingProposal | null>(reschedulingEngine.getActiveProposal());
  const [isAccepted, setIsAccepted] = useState<boolean>(false);

  useEffect(() => {
    const unsub1 = eventBus.subscribe('CENTRE_DELAY_REPORTED', (event) => {
      setDisruption(event.payload);
      const newProp = reschedulingEngine.proposeReschedule();
      setProposal(newProp);
    });

    const unsub2 = eventBus.subscribe('DISRUPTION_RESOLVED', () => {
      setDisruption(null);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  if (!disruption && !proposal) return null;

  const handleAccept = () => {
    reschedulingEngine.acceptProposal();
    setIsAccepted(true);
  };

  return (
    <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 shadow-md space-y-3 animate-in fade-in">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-black text-amber-950">
            Operational Delay Advisory: {disruption?.delayMinutes || 25} Mins
          </h4>
          <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
            {disruption?.reason || 'Weighbridge calibration in progress at Singanallur centre.'} You do not need to wait in traffic.
          </p>
        </div>
      </div>

      {proposal && !isAccepted && (
        <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-900">
            <span>Recommended Updated Window:</span>
            <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {proposal.proposedSlot}
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            Arriving at 02:00 PM will avoid the entire 45-minute gate queue. Your token #1024 remains 100% valid.
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleAccept}
              className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
            >
              ✓ Accept Updated Schedule
            </button>
          </div>
        </div>
      )}

      {isAccepted && (
        <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-700" />
          <span>Updated slot accepted (02:00 PM – 03:00 PM). SMS reminder will be sent!</span>
        </div>
      )}
    </div>
  );
};
