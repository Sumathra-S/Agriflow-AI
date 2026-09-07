import React, { useState, useEffect } from 'react';
import { virtualQueueEngine } from '../../services/engine/virtualQueueEngine';
import { VirtualQueueStage, VirtualToken } from '../../types/procurement';
import {
  Ticket,
  Clock,
  Navigation,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Truck,
  Scale,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface VirtualQueueCardProps {
  onOpenArrivalModal?: () => void;
}

const STAGE_LABELS: Record<VirtualQueueStage, { en: string; ta: string }> = {
  BOOKED: { en: 'Slot Booked', ta: 'முன்பதிவு முடிந்தது' },
  SLOT_ACTIVE: { en: 'Slot Window Active', ta: 'நேர சாளரம் ஆரம்பம்' },
  IN_TRANSIT: { en: 'In Transit to APMC', ta: 'பயணத்தில் உள்ளார்' },
  ARRIVED: { en: 'Arrived at Gate 2', ta: 'வாயில் 2-ல் வருகை' },
  SECURITY_CHECKED: { en: 'Security & Moisture Check', ta: 'பாதுகாப்பு & ஈரப்பதம் சரிபார்ப்பு' },
  WEIGHING: { en: 'On Weighbridge #1', ta: 'எடைமேடை #1-ல் உள்ளது' },
  UNLOADING: { en: 'Unloading at Bay 3', ta: 'பிரிவு 3-ல் இறக்குதல்' },
  COMPLETED: { en: 'DBT Payout Initiated', ta: 'வங்கி கணக்கில் வரவு' }
};

export const VirtualQueueCard: React.FC<VirtualQueueCardProps> = ({
  onOpenArrivalModal
}) => {
  const { language } = useLanguage();
  const [token, setToken] = useState<VirtualToken>(virtualQueueEngine.getToken());

  useEffect(() => {
    return virtualQueueEngine.subscribe(updated => {
      setToken(updated);
    });
  }, []);

  const isTa = language === 'ta';

  const handleAdvanceStage = () => {
    virtualQueueEngine.advanceStage();
  };

  const currentStageLabel = STAGE_LABELS[token.stage] || { en: token.stage, ta: token.stage };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden text-slate-900">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gov-800 to-gov-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-300">
            <Ticket className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold block">
              {isTa ? 'AI மெய்நிகர் வரிசை டோக்கன்' : 'AI Virtual Queue Token'}
            </span>
            <span className="text-xl font-black tracking-tight font-mono">
              {token.tokenNumber}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-300 uppercase block font-bold">
            {isTa ? 'கணிக்கப்பட்ட வருகை' : 'Dynamic ETA'}
          </span>
          <span className="text-sm font-black font-mono text-emerald-300">
            {token.dynamicEstimatedArrivalTime}
          </span>
        </div>
      </div>

      {/* Turn Approaching Alert Banner */}
      {token.turnApproachingAlert && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 flex items-center gap-2 font-black text-xs animate-pulse border-y border-amber-600">
          <AlertCircle className="h-4 w-4 fill-slate-950 text-amber-500 flex-shrink-0" />
          <span>
            {isTa
              ? `உங்கள் முறை நெருங்குகிறது! ${token.tokensAhead} விவசாயிகள் மட்டுமே முன்னே உள்ளனர். வாயில் 2-க்கு செல்லவும்.`
              : `YOUR TURN IS APPROACHING! Only ${token.tokensAhead} vehicles ahead. Proceed to ${token.gateNumber}.`}
          </span>
        </div>
      )}

      {/* Body Stats */}
      <div className="p-4 space-y-3.5">
        {/* Current Stage Indicator */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              {isTa ? 'தற்போதைய நிலை (8 நிலைகளில்)' : 'Procurement State (8-Stage Machine)'}
            </span>
            <span className="text-xs font-black text-gov-800 mt-0.5 block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
              {isTa ? currentStageLabel.ta : currentStageLabel.en}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              {isTa ? 'ஒதுக்கப்பட்ட இடம்' : 'Assigned Location'}
            </span>
            <span className="text-xs font-bold text-slate-800">
              {token.bayNumber} ({token.gateNumber.split(' ')[0]})
            </span>
          </div>
        </div>

        {/* 3 Metric Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              {isTa ? 'வரிசை எண்' : 'Queue Pos'}
            </span>
            <span className="text-lg font-black font-mono text-slate-900 mt-0.5 block">
              #{token.queuePosition}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              {isTa ? 'முன்னே உள்ளவை' : 'Ahead'}
            </span>
            <span className="text-lg font-black font-mono text-gov-800 mt-0.5 block">
              {token.tokensAhead}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              {isTa ? 'காத்திருப்பு' : 'Est. Wait'}
            </span>
            <span className="text-lg font-black font-mono text-rose-700 mt-0.5 block">
              ~{token.estimatedWaitMinutes}m
            </span>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-2 pt-1">
          {onOpenArrivalModal && (
            <button
              onClick={onOpenArrivalModal}
              className="flex-1 py-2 px-3 bg-gov-50 hover:bg-gov-100 text-gov-900 border border-gov-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Clock className="h-3.5 w-3.5 text-gov-800" />
              <span>{isTa ? 'வருகை நேர ஆலோசனை' : 'When Should I Arrive?'}</span>
            </button>
          )}

          {/* Advance Stage for SIH Jury Demo */}
          <button
            onClick={handleAdvanceStage}
            disabled={token.stage === 'COMPLETED'}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            title="Advance to next procurement lifecycle step for jury demonstration"
          >
            <span>{isTa ? 'அடுத்த நிலை' : 'Next Stage'}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
