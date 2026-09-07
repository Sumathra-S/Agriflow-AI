import React, { useState, useEffect } from 'react';
import { smartCentreAllocationEngine } from '../../services/engine/smartCentreAllocationEngine';
import { BetterOptionProposal } from '../../types/procurement';
import { ArrowRight, CheckCircle2, Clock, Sparkles, Navigation, XCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const BetterOptionCard: React.FC = () => {
  const { language } = useLanguage();
  const [proposal, setProposal] = useState<BetterOptionProposal | null>(
    smartCentreAllocationEngine.getActiveProposal()
  );

  useEffect(() => {
    return smartCentreAllocationEngine.subscribe(updated => {
      setProposal(updated);
    });
  }, []);

  if (!proposal) return null;

  const isTa = language === 'ta';

  const handleAccept = () => {
    smartCentreAllocationEngine.acceptProposal(proposal);
  };

  const handleDecline = () => {
    smartCentreAllocationEngine.declineProposal(proposal);
  };

  if (proposal.status === 'ACCEPTED') {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 text-emerald-950 shadow-sm animate-in fade-in">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-100 rounded-full text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-wider text-emerald-900">
              {isTa ? 'மைய மாற்றம் உறுதி செய்யப்பட்டது' : 'Centre Reallocation Confirmed'}
            </h4>
            <p className="text-xs text-emerald-800 mt-0.5">
              {isTa
                ? `உங்கள் கொள்முதல் மையம் ${proposal.recommendedCentreName} ஆக மாற்றப்பட்டது. காத்திருப்பு நேரம் ~${proposal.recommendedWaitMinutes} நிமிடம் மட்டுமே.`
                : `Your booking is now routed to ${proposal.recommendedCentreName}. Expected wait: ~${proposal.recommendedWaitMinutes} min.`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (proposal.status === 'DECLINED') {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 text-slate-900 shadow-md relative overflow-hidden">
      {/* Decorative badge */}
      <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-xs">
        <Sparkles className="h-3 w-3 fill-current" />
        <span>{proposal.matchPercentage}% Match</span>
      </div>

      <div className="flex items-center gap-2 mb-2.5">
        <span className="p-1.5 bg-amber-100 text-amber-900 rounded-lg">
          <Navigation className="h-4 w-4" />
        </span>
        <div>
          <h4 className="font-black text-xs uppercase tracking-wider text-amber-950">
            {isTa ? 'சிறந்த மாற்று மையம் கண்டறியப்பட்டது!' : 'Faster Alternative Centre Found'}
          </h4>
          <p className="text-[11px] text-amber-800 font-medium">
            {isTa
              ? `காத்திருப்பு நேரத்தை ${Math.abs(proposal.waitDeltaMinutes)} நிமிடங்கள் குறைக்கலாம்`
              : `Save ~${Math.abs(proposal.waitDeltaMinutes)} min wait with only ${proposal.distanceDeltaKm} km extra travel`}
          </p>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-2 gap-2.5 my-3">
        {/* Current Centre */}
        <div className="bg-white/80 border border-slate-200 rounded-xl p-2.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">
            {isTa ? 'தற்போதைய மையம்' : 'Current Centre'}
          </span>
          <p className="font-extrabold text-xs text-slate-900 truncate" title={proposal.currentCentreName}>
            {proposal.currentCentreName}
          </p>
          <div className="flex items-center gap-1 mt-1 text-rose-700 font-bold text-xs">
            <Clock className="h-3.5 w-3.5" />
            <span>~{proposal.currentWaitMinutes} min wait</span>
          </div>
        </div>

        {/* Recommended Centre */}
        <div className="bg-emerald-50/90 border-2 border-emerald-400 rounded-xl p-2.5 relative">
          <span className="text-[10px] font-bold text-emerald-700 uppercase block">
            {isTa ? 'பரிந்துரைக்கப்பட்ட மையம்' : 'Recommended Centre'}
          </span>
          <p className="font-extrabold text-xs text-emerald-950 truncate" title={proposal.recommendedCentreName}>
            {proposal.recommendedCentreName}
          </p>
          <div className="flex items-center gap-1 mt-1 text-emerald-800 font-black text-xs">
            <Clock className="h-3.5 w-3.5" />
            <span>~{proposal.recommendedWaitMinutes} min wait (Fast)</span>
          </div>
          <span className="text-[10px] text-emerald-700 block mt-0.5 font-medium">
            +{proposal.distanceDeltaKm} km distance
          </span>
        </div>
      </div>

      <p className="text-[11px] text-slate-600 bg-white/60 p-2 rounded-lg border border-slate-200/80 mb-3 flex items-start gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-gov-700 flex-shrink-0 mt-0.5" />
        <span>{proposal.primaryReason}</span>
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleAccept}
          className="flex-1 py-2.5 px-3 rounded-xl bg-gov-800 hover:bg-gov-900 text-white font-black text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>{isTa ? 'மாற்று மையத்தை ஏற்கவும்' : 'Accept Better Centre'}</span>
        </button>

        <button
          onClick={handleDecline}
          className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs transition-colors"
        >
          {isTa ? 'அசல் மையமே போதும்' : 'Keep Original'}
        </button>
      </div>
    </div>
  );
};
