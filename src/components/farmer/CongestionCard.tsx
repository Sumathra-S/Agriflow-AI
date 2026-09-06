import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSimulation } from '../../context/SimulationContext';
import { voiceService } from '../../services/voiceService';
import {
  Volume2,
  VolumeX,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  MessageSquare,
  PhoneCall,
  Calendar
} from 'lucide-react';

interface CongestionCardProps {
  onOpenSmsModal?: () => void;
  onOpenBookingModal?: () => void;
  onOpenIvrModal?: () => void;
}

export const CongestionCard: React.FC<CongestionCardProps> = ({
  onOpenSmsModal,
  onOpenBookingModal,
  onOpenIvrModal
}) => {
  const { t, language } = useLanguage();
  const { congestionRisk, currentQueue, expectedArrivals } = useSimulation();
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Status text matching Section 6 & 8
  const statusTitle =
    congestionRisk === 'LOW'
      ? t.goodTimeToVisit
      : congestionRisk === 'MEDIUM'
      ? t.moderateCrowd
      : t.highCrowd;

  const statusExplanation =
    congestionRisk === 'LOW'
      ? t.goodTimeExplanation
      : congestionRisk === 'MEDIUM'
      ? t.moderateCrowdExplanation
      : t.highCrowdExplanation;

  const recommendedTimeText =
    congestionRisk === 'LOW' ? 'Visit Now' : t.recommendedTimeValue;

  const handleToggleVoice = () => {
    if (isSpeaking) {
      voiceService.stop();
      setIsSpeaking(false);
    } else {
      const speechScript = `${t.centreStatus}: ${statusTitle}. ${statusExplanation}. ${t.recommendedTimeTitle}: ${recommendedTimeText}. ${t.slotGuaranteedNote}`;
      setIsSpeaking(true);
      voiceService.speak(
        speechScript,
        language,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  // Color schemes for 3 simplified crowd states (High contrast, large font)
  const stateTheme = {
    LOW: {
      border: 'border-emerald-600',
      bg: 'bg-emerald-50',
      headerBg: 'bg-emerald-700 text-white',
      badge: 'bg-emerald-800 text-white',
      icon: <ShieldCheck className="h-7 w-7 text-white" />
    },
    MEDIUM: {
      border: 'border-amber-600',
      bg: 'bg-amber-50',
      headerBg: 'bg-amber-600 text-white',
      badge: 'bg-amber-800 text-white',
      icon: <AlertCircle className="h-7 w-7 text-white" />
    },
    HIGH: {
      border: 'border-rose-600',
      bg: 'bg-rose-50',
      headerBg: 'bg-rose-700 text-white',
      badge: 'bg-rose-900 text-white',
      icon: <AlertCircle className="h-7 w-7 text-white" />
    }
  };

  const currentTheme = stateTheme[congestionRisk];

  return (
    <div className="space-y-4">
      {/* 1. MASTER CENTRE CARD (Section 6) */}
      <div className={`rounded-2xl border-3 ${currentTheme.border} ${currentTheme.bg} overflow-hidden shadow-md`}>
        {/* Header with Visual Status & Audio Button */}
        <div className={`p-4 ${currentTheme.headerBg} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-lg bg-black/20">{currentTheme.icon}</div>
            <div>
              <span className="text-[11px] uppercase tracking-widest font-extrabold opacity-90 block">
                {t.centreStatus}
              </span>
              <h2 className="text-xl font-black tracking-tight leading-none mt-0.5">
                {statusTitle}
              </h2>
            </div>
          </div>

          {/* VISIBLE LISTEN BUTTON (Section 6) */}
          <button
            onClick={handleToggleVoice}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-md transition-all ${
              isSpeaking
                ? 'bg-white text-rose-800 ring-2 ring-rose-300 animate-pulse'
                : 'bg-white text-slate-900 hover:bg-slate-100'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="h-4 w-4 text-rose-700" />
                <span>{t.stopVoice}</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 text-gov-800" />
                <span>{t.listen}</span>
              </>
            )}
          </button>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3.5">
          <div className="bg-white/90 rounded-xl p-3 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
              {t.whatIsHappening}
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {statusExplanation}
            </p>
          </div>

          {/* BEST TIME TO VISIT CARD (Section 6) */}
          <div className="bg-white rounded-xl p-4 border-2 border-gov-700 shadow-sm text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {t.recommendedTimeTitle}
            </span>
            <div className="text-3xl font-black text-gov-900 tracking-tight">
              {recommendedTimeText}
            </div>
            <p className="mt-1.5 text-xs text-gov-800 font-medium leading-relaxed">
              {t.recommendedTimeAdvice}
            </p>
          </div>

          {/* Guarantee Note */}
          <div className="flex items-center justify-between text-xs text-slate-700 pt-1 px-1">
            <span className="flex items-center gap-1.5 font-bold text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 flex-shrink-0" />
              <span>{t.slotGuaranteedNote}</span>
            </span>
          </div>
        </div>

        {/* Bottom Bar: SMS & IVR Quick Access */}
        <div className="bg-white/95 px-4 py-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
          {onOpenSmsModal && (
            <button
              onClick={onOpenSmsModal}
              className="flex items-center gap-1 font-bold text-gov-800 hover:text-gov-950 underline"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{t.viewAsSms}</span>
            </button>
          )}

          {onOpenIvrModal && (
            <button
              onClick={onOpenIvrModal}
              className="flex items-center gap-1 font-bold text-amber-900 hover:text-amber-950 underline"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>{t.ivrButton}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. SIMPLE NUMBERS (Trolleys & Bookings) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <Users className="h-4 w-4 text-gov-800" />
            <span className="text-xs font-bold">{t.currentCrowdLabel}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">{currentQueue}</span>
            <span className="text-xs text-slate-500 font-medium">{t.farmersWaiting}</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <Clock className="h-4 w-4 text-gov-800" />
            <span className="text-xs font-bold">{t.expectedSoonLabel}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-black ${expectedArrivals > 30 ? 'text-rose-700' : 'text-slate-900'}`}>
              ~{expectedArrivals}
            </span>
            <span className="text-xs text-slate-500 font-medium">Tractors</span>
          </div>
        </div>
      </div>

      {/* Quick Action to Book a Visit */}
      {onOpenBookingModal && (
        <button
          onClick={onOpenBookingModal}
          className="w-full py-3 px-4 rounded-2xl bg-gov-800 hover:bg-gov-900 text-white font-extrabold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <Calendar className="h-4 w-4 text-emerald-300" />
          <span>{t.bookVisitBtn} (10 AM / 12 PM / 2 PM)</span>
        </button>
      )}
    </div>
  );
};
