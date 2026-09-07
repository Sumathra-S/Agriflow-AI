import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  User,
  Phone,
  MapPin,
  Truck,
  Building,
  CheckCircle2,
  Globe,
  Bell,
  Zap,
  Sliders,
  ShieldCheck,
  Edit2
} from 'lucide-react';

interface FarmerProfileScreenProps {
  isLowDataMode?: boolean;
  onToggleLowDataMode?: () => void;
}

export const FarmerProfileScreen: React.FC<FarmerProfileScreenProps> = ({
  isLowDataMode = false,
  onToggleLowDataMode
}) => {
  const { language, setLanguage } = useLanguage();
  const [smsAlerts, setSmsAlerts] = useState<boolean>(true);
  const [voiceCalls, setVoiceCalls] = useState<boolean>(true);
  const [travelToleranceKm, setTravelToleranceKm] = useState<number>(15);

  return (
    <div className="space-y-4">
      {/* 1. Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gov-700 to-gov-900 text-white flex items-center justify-center text-xl font-bold font-mono">
          RK
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-900">Ravi Kumar</h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> PM-KISAN Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono">Farmer ID: MH-2024-8841</p>
          <p className="text-[11px] text-slate-600 mt-0.5">Village Singanallur • 3.5 Acres Landholding</p>
        </div>
      </div>

      {/* 2. Registered Farm & Vehicle Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
          Procurement & Transport Info
        </h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-gov-800" />
              <div>
                <span className="font-bold text-slate-800 block">Registered Vehicle</span>
                <span className="text-[11px] text-slate-500">Tractor Trolley • Reg: PB-10-CZ-4412</span>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-slate-200 px-2 py-0.5 rounded text-slate-700">5t Max</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gov-800" />
              <div>
                <span className="font-bold text-slate-800 block">Travel Distance Limit</span>
                <span className="text-[11px] text-slate-500">Will consider centres within this radius</span>
              </div>
            </div>
            <select
              value={travelToleranceKm}
              onChange={e => setTravelToleranceKm(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded-lg px-2 py-1 font-bold text-xs"
            >
              <option value="10">10 km</option>
              <option value="15">15 km</option>
              <option value="25">25 km</option>
              <option value="40">40 km</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gov-800" />
              <div>
                <span className="font-bold text-slate-800 block">DBT Linked Account</span>
                <span className="text-[11px] text-slate-500 font-mono">State Bank of India •••• 4129</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Aadhaar Seeded
            </span>
          </div>
        </div>
      </div>

      {/* 3. Communication & Rural Accessibility */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
          Language & Accessibility Settings
        </h3>

        {/* Language selector */}
        <div>
          <label className="font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-gov-800" />
            Preferred Language
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { code: 'en', label: 'English' },
              { code: 'ta', label: 'தமிழ்' },
              { code: 'hi', label: 'हिंदी' },
              { code: 'pa', label: 'ਪੰਜਾਬੀ' }
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={`py-2 text-center rounded-lg border text-xs font-bold transition-all ${
                  language === lang.code
                    ? 'bg-gov-800 text-white border-gov-800'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Channel Toggles */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
            <span className="font-semibold text-slate-700">SMS Gate & Departure Alerts</span>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={e => setSmsAlerts(e.target.checked)}
              className="rounded text-gov-800 focus:ring-gov-700 h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
            <span className="font-semibold text-slate-700">Automated Kisan Voice Calls (IVR)</span>
            <input
              type="checkbox"
              checked={voiceCalls}
              onChange={e => setVoiceCalls(e.target.checked)}
              className="rounded text-gov-800 focus:ring-gov-700 h-4 w-4"
            />
          </label>

          {onToggleLowDataMode && (
            <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                Low Data Mode (2G / EDGE Optimized)
              </span>
              <input
                type="checkbox"
                checked={isLowDataMode}
                onChange={onToggleLowDataMode}
                className="rounded text-gov-800 focus:ring-gov-700 h-4 w-4"
              />
            </label>
          )}
        </div>
      </div>

      {/* 4. Official PM-KISAN badge */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500 flex items-center justify-between font-mono">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          FARMER PROFILE ID: MH-2024-8841
        </span>
        <span>e-KYC Verified</span>
      </div>
    </div>
  );
};
