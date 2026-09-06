import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSimulation } from '../../context/SimulationContext';
import { voiceService } from '../../services/voiceService';
import { Bell, Volume2, ShieldCheck, Clock, MessageSquare, Copy, Check } from 'lucide-react';

export const FarmerNotifications: React.FC = () => {
  const { t, language } = useLanguage();
  const { congestionRisk, farmerAdvisorySent } = useSimulation();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSpeak = (id: string, text: string) => {
    if (playingId === id) {
      voiceService.stop();
      setPlayingId(null);
    } else {
      setPlayingId(id);
      voiceService.speak(
        text,
        language,
        () => setPlayingId(id),
        () => setPlayingId(null)
      );
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const highAlertText = `${t.highCrowd}. ${t.highCrowdExplanation}. ${t.recommendedTimeTitle}: ${t.recommendedTimeValue}.`;

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Bell className="h-5 w-5 text-gov-800" />
          <span>{t.notifications}</span>
        </h3>
        <span className="text-xs text-slate-500 font-mono">Verified Broadcasts</span>
      </div>

      {/* Dynamic Alert 1: Arrival Advisory */}
      {(congestionRisk === 'HIGH' || farmerAdvisorySent) && (
        <div className="rounded-2xl border-2 border-rose-300 bg-rose-50 p-4 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-rose-950">
                Official Flow Advisory
              </span>
            </div>
            <span className="text-[11px] font-mono text-rose-800 font-semibold">Just now</span>
          </div>

          <p className="text-sm font-bold text-rose-950 leading-snug">
            {t.highCrowdExplanation}
          </p>

          <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between gap-2">
            <button
              onClick={() => handleSpeak('adv-1', highAlertText)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-900 text-xs font-bold hover:bg-rose-100 shadow-xs"
            >
              <Volume2 className="h-4 w-4" />
              <span>{playingId === 'adv-1' ? t.stopVoice : t.listen}</span>
            </button>

            <button
              onClick={() => handleCopy('adv-1', highAlertText)}
              className="flex items-center gap-1 text-xs text-rose-800 font-semibold hover:underline"
            >
              {copiedId === 'adv-1' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedId === 'adv-1' ? t.copied : t.copySms}</span>
            </button>
          </div>
        </div>
      )}

      {/* Alert 2: Booking Protection */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900">Token Status</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">10:00 AM</span>
        </div>

        <p className="text-xs font-medium text-slate-700 leading-relaxed">
          {t.bookingStillValidNotice}
        </p>

        <div className="pt-1 flex items-center justify-between">
          <button
            onClick={() => handleSpeak('tk-1', t.bookingStillValidNotice)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span>{playingId === 'tk-1' ? t.stopVoice : t.listen}</span>
          </button>
        </div>
      </div>

      {/* Alert 3: Centre Operating Hours */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-900">Operational Hours</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">08:00 AM</span>
        </div>

        <p className="text-xs font-medium text-slate-700 leading-relaxed">
          {t.centreHoursNotice}
        </p>

        <div className="pt-1 flex items-center justify-between">
          <button
            onClick={() => handleSpeak('hrs-1', t.centreHoursNotice)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span>{playingId === 'hrs-1' ? t.stopVoice : t.listen}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
