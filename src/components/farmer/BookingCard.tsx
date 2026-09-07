import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { voiceService } from '../../services/voiceService';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Shield,
  Volume2,
  AlertTriangle,
  RotateCcw,
  Hourglass,
  XCircle,
  X,
  HelpCircle
} from 'lucide-react';
import { WhyThisSlotModal } from './WhyThisSlotModal';

interface BookingCardProps {
  tokenNumber?: string;
  farmerName?: string;
  slotTime?: string;
  status?: 'CONFIRMED' | 'WAITING_LIST' | 'CANCELLED';
  onChangeSlot?: () => void;
  onStatusChange?: (newStatus: 'CONFIRMED' | 'WAITING_LIST' | 'CANCELLED') => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  tokenNumber = '1024',
  farmerName = 'Sukhwinder Sharma',
  slotTime = '11:30 AM – 12:30 PM',
  status = 'CONFIRMED',
  onChangeSlot,
  onStatusChange
}) => {
  const { t, language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [showWhySlotModal, setShowWhySlotModal] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<'CONFIRMED' | 'WAITING_LIST' | 'CANCELLED'>(status);

  const handleSpeakBooking = () => {
    let text = '';
    if (currentStatus === 'CONFIRMED') {
      text = `${t.myBooking}: ${t.tokenNumber}, ${farmerName}. ${t.bookingStatus}: ${t.confirmed}. ${slotTime}. ${t.gateNumber}. ${t.crop}. ${t.slotGuaranteedNote}`;
    } else if (currentStatus === 'WAITING_LIST') {
      text = `AgriFlow Waiting List. Token number ${tokenNumber} for ${farmerName}. Position number 3. You will receive an SMS and call when a slot opens.`;
    } else {
      text = `Booking cancelled for token number ${tokenNumber}. You can book a new slot anytime.`;
    }

    setIsSpeaking(true);
    voiceService.speak(
      text,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleConfirmCancel = () => {
    setCurrentStatus('CANCELLED');
    setShowCancelModal(false);
    if (onStatusChange) onStatusChange('CANCELLED');
  };

  const handleReactivateBooking = () => {
    setCurrentStatus('CONFIRMED');
    if (onStatusChange) onStatusChange('CONFIRMED');
  };

  const handleJoinWaitingList = () => {
    setCurrentStatus('WAITING_LIST');
    if (onStatusChange) onStatusChange('WAITING_LIST');
  };

  // Render Waiting List Card
  if (currentStatus === 'WAITING_LIST') {
    return (
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/90 shadow-md overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-amber-200 pb-3">
          <div className="flex items-center gap-2 text-amber-950 font-black">
            <Hourglass className="h-6 w-6 text-amber-600 animate-spin" />
            <div>
              <h3 className="text-base font-black">⏳ WAITING LIST ACTIVE</h3>
              <p className="text-xs font-medium text-amber-800">Token #{tokenNumber} • {farmerName}</p>
            </div>
          </div>
          <span className="bg-amber-600 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-full">
            Position #3
          </span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-amber-200 text-xs text-slate-700 space-y-2">
          <p className="font-semibold text-slate-900">
            You will receive an automated SMS & Voice Call as soon as a slot becomes available or gate crowd subsides below 10 trolleys.
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Centre: Mandi Kalan</span>
            <span>Priority: Guaranteed</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onChangeSlot}
            className="flex-1 py-2.5 rounded-xl bg-gov-800 text-white text-xs font-bold hover:bg-gov-900 shadow-xs"
          >
            Pick Direct Slot
          </button>
          <button
            onClick={() => setShowCancelModal(true)}
            className="py-2.5 px-3 rounded-xl border border-rose-300 text-rose-700 bg-white hover:bg-rose-50 text-xs font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Render Cancelled State Card
  if (currentStatus === 'CANCELLED') {
    return (
      <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-md p-5 text-center space-y-3">
        <XCircle className="h-10 w-10 text-slate-400 mx-auto" />
        <div>
          <h3 className="text-base font-black text-slate-900">Booking Cancelled</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Token #{tokenNumber} has been successfully cancelled and released.
          </p>
        </div>
        <button
          onClick={handleReactivateBooking}
          className="py-2.5 px-5 rounded-xl bg-gov-800 text-white text-xs font-bold hover:bg-gov-900 shadow-sm"
        >
          Re-book a Slot Now
        </button>
      </div>
    );
  }

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
        <div className="space-y-2 text-xs">
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
            <span className="font-bold text-slate-900">{slotTime}</span>
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

        {/* Explainability Button: WHY THIS SLOT? */}
        <button
          onClick={() => setShowWhySlotModal(true)}
          className="w-full py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <HelpCircle className="h-4 w-4 text-emerald-700" />
          <span>WHY THIS SLOT? (ஏன் இந்த நேரம்?)</span>
        </button>

        {/* Action Controls: Change Time, Cancel Booking, Join Waiting List */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
          {onChangeSlot && (
            <button
              onClick={onChangeSlot}
              className="flex-1 py-2 rounded-xl bg-gov-100 hover:bg-gov-200 text-gov-900 text-xs font-bold transition-colors"
            >
              Change Time
            </button>
          )}

          <button
            onClick={handleJoinWaitingList}
            className="py-2 px-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors"
            title="Join waiting list to receive alert when rush subsides"
          >
            ⏳ Join Waiting List
          </button>

          <button
            onClick={() => setShowCancelModal(true)}
            className="py-2 px-3 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Why This Slot Explainability Modal */}
      <WhyThisSlotModal
        isOpen={showWhySlotModal}
        onClose={() => setShowWhySlotModal(false)}
        tokenNumber={tokenNumber}
        assignedSlot={slotTime}
      />

      {/* Interactive Cancel Confirmation Modal Dialog */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-rose-700">
                <AlertTriangle className="h-5 w-5" />
                <h4 className="font-black text-sm text-slate-900">Cancel Booking?</h4>
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel Token <strong>#{tokenNumber}</strong> for <strong>{slotTime}</strong>? Your slot will be made available to waiting farmers.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                NO, KEEP IT
              </button>
              <button
                onClick={handleConfirmCancel}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                YES, CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
