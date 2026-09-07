import React, { useState } from 'react';
import { AiInterventionProposal } from '../../types/procurement';
import { whatIfSimulatorEngine } from '../../services/engine/whatIfSimulatorEngine';
import { X, CheckCircle2, XCircle, Edit3, ShieldCheck, Sparkles } from 'lucide-react';

interface AiInterventionModalProps {
  isOpen: boolean;
  proposal: AiInterventionProposal;
  onClose: () => void;
}

export const AiInterventionModal: React.FC<AiInterventionModalProps> = ({
  isOpen,
  proposal,
  onClose
}) => {
  const [notes, setNotes] = useState<string>('');
  const [modifications, setModifications] = useState<string>('');
  const [isModifying, setIsModifying] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleApprove = () => {
    whatIfSimulatorEngine.approveProposal(proposal.id, notes || undefined);
    onClose();
  };

  const handleReject = () => {
    whatIfSimulatorEngine.rejectProposal(proposal.id, notes || 'Rejected by operator discretion.');
    onClose();
  };

  const handleSaveModification = () => {
    whatIfSimulatorEngine.modifyProposal(proposal.id, modifications, notes || 'Modified by operator.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider block">
                Human-in-the-Loop Review • {proposal.id}
              </span>
              <h3 className="text-base font-black tracking-tight text-white">
                Review AI Intervention Proposal
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs text-slate-700">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-500 uppercase text-[10px]">Action Proposal</span>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                {proposal.confidencePct}% Model Confidence
              </span>
            </div>
            <h4 className="text-sm font-black text-slate-900">
              {proposal.title}
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {proposal.impactEstimate}
            </p>
          </div>

          {/* Review Status if already reviewed */}
          {proposal.state !== 'PENDING_REVIEW' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                <span>Decision Recorded: {proposal.state}</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Reviewed by: {proposal.reviewedBy} at {proposal.reviewedAt}
              </p>
              {proposal.operatorNotes && (
                <p className="text-[11px] text-slate-600 italic">
                  Note: "{proposal.operatorNotes}"
                </p>
              )}
            </div>
          )}

          {/* Modification Form */}
          {isModifying ? (
            <div className="space-y-2 pt-1">
              <label className="font-bold text-slate-900 block">
                Adjust Intervention Parameters:
              </label>
              <textarea
                rows={2}
                value={modifications}
                onChange={e => setModifications(e.target.value)}
                placeholder="e.g. Limit smart advisory to first 10 farmers only..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-gov-600"
              />
            </div>
          ) : null}

          {/* Operator Decision Notes */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-900 block">
              Operator Justification / Notes (Saved to Audit Log):
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Approved in accordance with harvest surge advisory protocol..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-gov-600"
            />
          </div>

          <div className="bg-slate-100 rounded-xl p-3 text-[11px] text-slate-600 flex items-center gap-2 border border-slate-200">
            <ShieldCheck className="h-4 w-4 text-gov-700 flex-shrink-0" />
            <span>
              All operator approvals and overrides are digitally signed and immutably anchored in the tamper-evident audit trail.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => setIsModifying(!isModifying)}
            className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 flex items-center gap-1.5"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{isModifying ? 'Cancel Edit' : 'Modify Parameters'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReject}
              className="px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-300 transition-colors flex items-center gap-1"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Reject</span>
            </button>

            {isModifying ? (
              <button
                onClick={handleSaveModification}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
              >
                Save & Approve Modified
              </button>
            ) : (
              <button
                onClick={handleApprove}
                className="px-5 py-2 rounded-xl text-xs font-black bg-gov-800 hover:bg-gov-900 text-white shadow-md transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                <span>Approve & Execute</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
