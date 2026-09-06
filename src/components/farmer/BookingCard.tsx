import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { voiceService } from '../../services/voiceService';
import { Ticket, Calendar, Clock, MapPin, CheckCircle2, Shield, Volume2 } from 'lucide-react';

interface BookingCardProps {
  tokenNumber?: string;
  farmerName?: string;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  tokenNumber = '1024',
  farmerName = 'Sukhwinder Sharma'
}) => {
  const { t, language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const handleSpeakBooking = () => {
    const text = `${t.myBooking}: ${t.tokenNumber}, ${farmerName}. ${t.bookingStatus}: ${t.confirmed}. ${t.assignedSlot}. ${t.gateNumber}. ${t.crop}. ${t.slotGuaranteedNote}`;
    setIsSpeaking(true);
    voiceService.speak(
      text,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-md overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gov-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-emerald-300" />
          <span className="font-extrabold text-xs tracking-wider uppercase">{t.myBooking}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeakBooking}
            className="flex items-center gap-1 bg-gov-800 hover:bg-gov-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-gov-700"
            title="Listen to token details"
          >
            <Volume2 className="h-3.5 w-3.5 text-emerald-300" />
            <span>{isSpeaking ? '...' : t.listen}</span>
          </button>
          <span className="bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            {t.confirmed}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3.5">
        {/* Token # display */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Token Number</span>
            <p className="text-3xl font-black font-mono text-gov-900">#{tokenNumber}</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">{farmerName}</p>
          </div>
          <div className="h-14 w-14 rounded-xl bg-slate-100 border border-slate-300 p-1.5 flex items-center justify-center">
            {/* Simple QR Code representation */}
            <svg className="h-11 w-11 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="6" height="6" rx="1" />
              <rect x="15" y="3" width="6" height="6" rx="1" />
              <rect x="3" y="15" width="6" height="6" rx="1" />
              <path d="M14 14h2v2h-2z" fill="currentColor" />
              <path d="M19 14h2v6h-6v-2" />
              <path d="M10 10v4h4" />
            </svg>
          </div>
        </div>

        {/* Slot details in large readable font */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
            <span className="text-slate-600 font-medium flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              Date:
            </span>
            <span className="font-bold text-slate-900">Today, 06 Sep 2026</span>
          </div>

          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
            <span className="text-slate-600 font-medium flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-400" />
              Assigned Time:
            </span>
            <span className="font-bold text-slate-900">11:30 AM – 12:30 PM</span>
          </div>

          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
            <span className="text-slate-600 font-medium flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-400" />
              Assigned Gate:
            </span>
            <span className="font-bold text-slate-900">{t.gateNumber}</span>
          </div>

          <div className="flex items-center justify-between p-1">
            <span className="text-slate-500 font-medium">Crop & Variety:</span>
            <span className="font-bold text-gov-800">{t.crop}</span>
          </div>

          <div className="flex items-center justify-between p-1">
            <span className="text-slate-500 font-medium">Allocated Quantity:</span>
            <span className="font-bold text-slate-900">45 Quintals</span>
          </div>
        </div>

        {/* Advisory Tag */}
        <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-200 text-xs text-emerald-950">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <Shield className="h-4 w-4 text-emerald-700" />
            <span>Guaranteed Token Privilege</span>
          </div>
          <p className="leading-relaxed">
            {t.slotGuaranteedNote}
          </p>
        </div>
      </div>
    </div>
  );
};
