import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { telecomManager, FarmerRegistrationData } from '../../services/telecomService';
import { LanguageCode, CommunicationChannel, FarmerProfile } from '../../types/procurement';
import {
  UserPlus,
  X,
  Phone,
  User,
  MapPin,
  Wheat,
  Globe,
  Radio,
  CheckCircle2,
  Printer,
  ShieldCheck
} from 'lucide-react';

interface FarmerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered?: (farmer: FarmerProfile) => void;
}

export const FarmerRegistrationModal: React.FC<FarmerRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegistered
}) => {
  const { language } = useLanguage();

  const [formData, setFormData] = useState<FarmerRegistrationData>({
    name: '',
    phone: '',
    village: '',
    crop: 'Paddy - PR 126',
    preferredLanguage: language as LanguageCode,
    preferredChannel: 'SMS'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registeredProfile, setRegisteredProfile] = useState<FarmerProfile | null>(null);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter farmer name';
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.village.trim()) newErrors.village = 'Please enter village / block name';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newFarmer = telecomManager.registerFarmer({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      village: formData.village.trim(),
      crop: formData.crop,
      preferredLanguage: formData.preferredLanguage,
      preferredChannel: formData.preferredChannel
    });

    setRegisteredProfile(newFarmer);
    if (onRegistered) {
      onRegistered(newFarmer);
    }
  };

  const handleReset = () => {
    setRegisteredProfile(null);
    setFormData({
      name: '',
      phone: '',
      village: '',
      crop: 'Paddy - PR 126',
      preferredLanguage: language as LanguageCode,
      preferredChannel: 'SMS'
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gov-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gov-800 border border-gov-700 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Farmer Enrollment Desk</h2>
              <p className="text-xs text-gov-200">
                Government Procurement Registration • Mandi Kalan Centre
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-full text-gov-300 hover:text-white hover:bg-gov-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {registeredProfile ? (
            /* Registration Success Slip */
            <div className="space-y-5">
              <div className="rounded-2xl bg-emerald-50 border-2 border-emerald-300 p-5 text-emerald-950 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-black text-slate-900">Enrollment Successful!</h3>
                <p className="text-xs text-slate-600">
                  Farmer has been enrolled in the AgriFlow procurement network.
                </p>

                <div className="mt-4 pt-3 border-t border-emerald-200 text-left grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Farmer ID</span>
                    <p className="font-mono font-black text-base text-slate-900">{registeredProfile.farmerId}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Active Token #</span>
                    <p className="font-mono font-black text-base text-gov-800">#{registeredProfile.activeToken}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Name</span>
                    <p className="font-bold text-slate-900">{registeredProfile.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Phone</span>
                    <p className="font-mono font-bold text-slate-900">+91 {registeredProfile.phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Village</span>
                    <p className="font-bold text-slate-900">{registeredProfile.village}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Channel</span>
                    <p className="font-bold text-slate-900">{registeredProfile.preferredChannel}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  <Printer className="h-4 w-4 text-slate-600" />
                  <span>Print Paper Token Slip</span>
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-xl bg-gov-800 hover:bg-gov-900 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Done / View In App
                </button>
              </div>
            </div>
          ) : (
            /* Step-by-Step Registration Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Privacy Notice (Strictly no Aadhaar required) */}
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-950 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-700 flex-shrink-0" />
                <span>
                  <strong>Public Service Privacy:</strong> Only agricultural and contact details are required. No Aadhaar or identity document numbers are stored.
                </span>
              </div>

              {/* 1. Phone Number */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1">
                  <Phone className="h-3.5 w-3.5 text-gov-800" />
                  <span>Mobile Phone Number (10 Digits) *</span>
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-xs font-mono font-bold text-slate-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    maxLength={10}
                    className="flex-1 rounded-r-xl border border-slate-300 px-3 py-2.5 text-sm font-mono focus:border-gov-800 focus:outline-none"
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.phone}</p>}
              </div>

              {/* 2. Full Name */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1">
                  <User className="h-3.5 w-3.5 text-gov-800" />
                  <span>Farmer Full Name (உழவர் பெயர் / नाम) *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sukhwinder Sharma / முருகேசன்"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-gov-800 focus:outline-none"
                />
                {errors.name && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.name}</p>}
              </div>

              {/* 3. Village Name */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1">
                  <MapPin className="h-3.5 w-3.5 text-gov-800" />
                  <span>Village / Block (கிராமம் / गाँव) *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mandi Kalan West / Kalan Khas"
                  value={formData.village}
                  onChange={e => setFormData({ ...formData, village: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-gov-800 focus:outline-none"
                />
                {errors.village && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.village}</p>}
              </div>

              {/* 4. Crop & Variety */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1">
                  <Wheat className="h-3.5 w-3.5 text-gov-800" />
                  <span>Crop & Variety for Procurement</span>
                </label>
                <select
                  value={formData.crop}
                  onChange={e => setFormData({ ...formData, crop: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white focus:border-gov-800 focus:outline-none"
                >
                  <option value="Paddy - PR 126">Paddy - PR 126 (Short Duration)</option>
                  <option value="Paddy - Basmati 1509">Paddy - Basmati 1509</option>
                  <option value="Wheat - HD 2967">Wheat - HD 2967 (Standard MSP)</option>
                  <option value="Mustard / Sarson">Mustard / Sarson</option>
                  <option value="Cotton (Kapas)">Cotton (Kapas)</option>
                  <option value="Maize">Maize (Makka)</option>
                </select>
              </div>

              {/* 5. Preferred Language */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1">
                  <Globe className="h-3.5 w-3.5 text-gov-800" />
                  <span>Preferred Language (தகவல் தொடர்பு மொழி)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'ta', label: 'தமிழ்' },
                    { code: 'hi', label: 'हिन्दी' },
                    { code: 'en', label: 'English' }
                  ].map(l => (
                    <button
                      type="button"
                      key={l.code}
                      onClick={() => setFormData({ ...formData, preferredLanguage: l.code as LanguageCode })}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                        formData.preferredLanguage === l.code
                          ? 'bg-gov-800 text-white border-gov-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Preferred Communication Method */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1">
                  <Radio className="h-3.5 w-3.5 text-gov-800" />
                  <span>Preferred Channel for Flow Alerts & Tokens</span>
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { ch: 'SMS', label: 'SMS Text Message' },
                    { ch: 'VOICE', label: 'Automated Voice Call' },
                    { ch: 'IVR', label: 'Button Phone IVR / USSD' },
                    { ch: 'APP', label: 'Smartphone App' },
                    { ch: 'ASSISTED', label: 'Assisted CSC / Desk' }
                  ].map(c => (
                    <button
                      type="button"
                      key={c.ch}
                      onClick={() => setFormData({ ...formData, preferredChannel: c.ch as CommunicationChannel })}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        formData.preferredChannel === c.ch
                          ? 'border-gov-800 bg-gov-50 text-gov-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gov-800 hover:bg-gov-900 text-white font-extrabold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  <span>Complete Farmer Registration</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
