import React, { useState } from 'react';
import { REGISTERED_FARMERS, telecomManager } from '../../services/telecomService';
import { FarmerProfile, CommunicationChannel } from '../../types/procurement';
import {
  Search,
  UserCheck,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  Phone,
  MessageSquare,
  Shield,
  Smartphone,
  Printer
} from 'lucide-react';

export const AssistedBookingScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfile>(REGISTERED_FARMERS[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>('02:00 PM');
  const [selectedChannels, setSelectedChannels] = useState<CommunicationChannel[]>(['SMS', 'VOICE']);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [assignedToken, setAssignedToken] = useState<string>('TK-1052');

  const filteredFarmers = REGISTERED_FARMERS.filter(
    f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.farmerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.phone.includes(searchQuery)
  );

  const handleConfirmBooking = () => {
    const newToken = `TK-${Math.floor(1050 + Math.random() * 50)}`;
    setAssignedToken(newToken);
    setBookingConfirmed(true);

    // Dispatch confirmation via telecomManager
    telecomManager.dispatchAlert(
      1,
      'BOOKING_CONFIRMATION',
      selectedChannels,
      selectedFarmer.preferredLanguage,
      `AgriFlow Booking Confirmation: Token ${newToken} confirmed for ${selectedSlot} at Mandi Kalan Centre.`
    );
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-gov-800" />
            <span>Operator-Assisted Booking Desk</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manual booking & slot coordination for farmers without digital access or requiring human assistance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Mandi Kalan Centre • Gate 1 Desk</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Farmer Lookup (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-gov">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
              Find Farmer (Search by ID, Phone, or Name)
            </label>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. 1024 or Gurpreet or 98765..."
                className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs focus:border-gov-800 focus:outline-none"
              />
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto">
              {filteredFarmers.map(farmer => (
                <div
                  key={farmer.farmerId}
                  onClick={() => {
                    setSelectedFarmer(farmer);
                    setBookingConfirmed(false);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedFarmer.farmerId === farmer.farmerId
                      ? 'border-gov-800 bg-gov-50/80 shadow-xs ring-1 ring-gov-800'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">{farmer.name}</span>
                    <span className="font-mono text-xs font-bold text-gov-800">{farmer.farmerId}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <span>{farmer.phone}</span>
                    <span>{farmer.village}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[10px]">
                    <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded uppercase font-semibold">
                      Lang: {farmer.preferredLanguage.toUpperCase()}
                    </span>
                    <span className="bg-gov-100 text-gov-800 px-1.5 py-0.5 rounded font-semibold">
                      Channel: {farmer.preferredChannel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Slot Selection & Confirmation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-gov space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Selected Beneficiary
                </span>
                <h3 className="text-lg font-black text-slate-900">{selectedFarmer.name}</h3>
                <p className="text-xs text-slate-500">
                  {selectedFarmer.phone} • {selectedFarmer.village}
                </p>
              </div>

              <div className="text-right text-xs">
                <span className="text-slate-500">Registered Preferred Channel:</span>
                <p className="font-bold text-gov-800 text-sm">{selectedFarmer.preferredChannel}</p>
              </div>
            </div>

            {/* Available Slot Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Available Arrival Windows (Today, 06 Sep 2026)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { time: '10:00 AM', status: '🟢 Moderate', avail: '12 slots open' },
                  { time: '12:00 PM', status: '🔴 Peak Window', avail: 'High arrival pressure' },
                  { time: '02:00 PM', status: '🟢 Best Time', avail: 'Low crowd recommended' },
                ].map(slot => (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => {
                      setSelectedSlot(slot.time);
                      setBookingConfirmed(false);
                    }}
                    className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                      selectedSlot === slot.time
                        ? 'border-gov-800 bg-gov-50 font-bold text-gov-950 ring-2 ring-gov-800 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-black text-base text-slate-900 block">{slot.time}</span>
                    <span className="text-[11px] font-semibold block mt-0.5">{slot.status}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">{slot.avail}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dispatch Confirmation Channel Toggles */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Send Booking Confirmation Via
              </label>
              <div className="flex items-center gap-3">
                {[
                  { id: 'SMS', label: 'Cellular SMS' },
                  { id: 'VOICE', label: 'Automated Voice Call' },
                  { id: 'APP', label: 'Farmer App' },
                ].map(ch => (
                  <label key={ch.id} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedChannels.includes(ch.id as any)}
                      onChange={() => {
                        setSelectedChannels(prev =>
                          prev.includes(ch.id as any)
                            ? prev.filter(c => c !== (ch.id as any))
                            : [...prev, ch.id as any]
                        );
                      }}
                      className="rounded text-gov-800"
                    />
                    <span>{ch.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="py-3 px-6 rounded-xl bg-gov-800 hover:bg-gov-900 text-white font-extrabold text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Confirm & Create Assisted Booking</span>
              </button>

              {bookingConfirmed && (
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="h-4 w-4 text-gov-800" />
                  <span>Print Token Slip</span>
                </button>
              )}
            </div>

            {/* Success Card */}
            {bookingConfirmed && (
              <div className="rounded-xl bg-emerald-50 border-2 border-emerald-300 p-4 text-xs text-emerald-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm flex items-center gap-1.5 text-emerald-900">
                    <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                    Assisted Booking Confirmed!
                  </span>
                  <span className="font-mono text-sm font-black text-gov-900">{assignedToken}</span>
                </div>
                <p className="leading-relaxed">
                  Farmer <strong>{selectedFarmer.name}</strong> is registered for <strong>{selectedSlot}</strong> at Mandi Kalan Procurement Centre Gate 2. Confirmation dispatched via {selectedChannels.join(' & ')}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
