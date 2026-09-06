import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X, Clock, Calendar, CheckCircle2, Building2 } from 'lucide-react';

interface FarmerSlotBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (slot: string) => void;
}

export const FarmerSlotBookingModal: React.FC<FarmerSlotBookingModalProps> = ({
  isOpen,
  onClose,
  onBookingSuccess
}) => {
  const { t } = useLanguage();
  const [selectedSlot, setSelectedSlot] = useState<string>('2:00 PM');
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      onBookingSuccess(selectedSlot);
      onClose();
      setIsConfirmed(false);
    }, 1200);
  };

  const slots = [
    { time: '10:00 AM', status: '🟢 Good Time', desc: 'Low crowd expected', dot: 'bg-emerald-500' },
    { time: '12:00 PM', status: '🟡 Moderate Crowd', desc: 'Waiting may take longer', dot: 'bg-amber-500' },
    { time: '2:00 PM', status: '🟢 Best Time', desc: 'Recommended — Minimal wait', dot: 'bg-emerald-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gov-800" />
            <div>
              <h3 className="text-base font-black text-slate-900">Book a Visit</h3>
              <p className="text-[11px] text-slate-500">Mandi Kalan Procurement Centre</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Slot Options (Section 34) */}
        <div className="space-y-2.5 mb-5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Choose a Time (நேரத்தைத் தேர்வு செய்யவும்)
          </label>

          {slots.map(s => (
            <div
              key={s.time}
              onClick={() => setSelectedSlot(s.time)}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                selectedSlot === s.time
                  ? 'border-gov-800 bg-gov-50/80 shadow-xs ring-1 ring-gov-800'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${s.dot}`}></span>
                <div>
                  <span className="text-base font-black text-slate-900 block leading-tight">{s.time}</span>
                  <span className="text-xs font-medium text-slate-500">{s.desc}</span>
                </div>
              </div>

              <span className="text-xs font-bold text-slate-700">{s.status}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          disabled={isConfirmed}
          className="w-full py-3.5 rounded-2xl bg-gov-800 hover:bg-gov-900 text-white font-extrabold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
        >
          {isConfirmed ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              <span>Token Confirmed!</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              <span>Confirm Booking ({selectedSlot})</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-400 mt-3">
          Your token priority is guaranteed throughout the day
        </p>
      </div>
    </div>
  );
};
