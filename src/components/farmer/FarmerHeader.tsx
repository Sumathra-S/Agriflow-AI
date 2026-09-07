import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageCode } from '../../types/procurement';
import {
  Building2,
  MapPin,
  RefreshCw,
  Wifi,
  WifiOff,
  Globe,
  PhoneCall,
  Hash,
  UserPlus,
  Zap,
  Sliders
} from 'lucide-react';

interface FarmerHeaderProps {
  isLowConnectivity?: boolean;
  onToggleLowConnectivity?: () => void;
  isLowDataMode?: boolean;
  onToggleLowDataMode?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onOpenIvr?: () => void;
  onOpenUssd?: () => void;
  onOpenRegister?: () => void;
  onOpenPreferences?: () => void;
}

export const FarmerHeader: React.FC<FarmerHeaderProps> = ({
  isLowConnectivity = false,
  onToggleLowConnectivity,
  isLowDataMode = false,
  onToggleLowDataMode,
  onRefresh,
  isRefreshing = false,
  onOpenIvr,
  onOpenUssd,
  onOpenRegister,
  onOpenPreferences
}) => {
  const { t, language, setLanguage } = useLanguage();

  // Explicit priority order: தமிழ் first, हिन्दी second, English third
  const languages: { code: LanguageCode; native: string; sub: string }[] = [
    { code: 'ta', native: 'தமிழ்', sub: 'Tamil' },
    { code: 'hi', native: 'हिन्दी', sub: 'Hindi' },
    { code: 'en', native: 'English', sub: 'Eng' },
  ];

  return (
    <div className={`p-4 border-b transition-colors ${
      isLowDataMode
        ? 'bg-slate-900 text-white border-slate-700'
        : 'bg-gov-900 text-white border-gov-800'
    }`}>
      {/* 1. App Title & Greeting Banner */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gov-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌾</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-white">{t.appTitle}</h1>
              <span className="text-xs font-bold text-amber-300">{t.greeting}</span>
            </div>
            <p className="text-[10px] text-gov-200">{t.tagline}</p>
          </div>
        </div>

        {/* Quick Simulator & Registration Launchers */}
        <div className="flex items-center gap-1.5">
          {onOpenPreferences && (
            <button
              onClick={onOpenPreferences}
              className="flex items-center gap-1 bg-gov-700 hover:bg-gov-600 text-emerald-200 border border-emerald-400/30 px-2 py-1 rounded-lg text-[11px] font-bold shadow-xs transition-colors"
              title="Set Travel Distance & Centre Allocation Preferences"
            >
              <Sliders className="h-3 w-3 text-emerald-300" />
              <span>Prefs</span>
            </button>
          )}

          {onOpenRegister && (
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white px-2 py-1 rounded-lg text-[11px] font-bold shadow-xs transition-colors"
              title="Register New Farmer (No Aadhaar)"
            >
              <UserPlus className="h-3 w-3" />
              <span>Enroll</span>
            </button>
          )}

          {onOpenUssd && (
            <button
              onClick={onOpenUssd}
              className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-700 text-white px-2 py-1 rounded-lg text-[11px] font-mono font-bold shadow-xs transition-colors"
              title="Open Feature Phone *384# USSD Simulator"
            >
              <Hash className="h-3 w-3 text-emerald-300" />
              <span>*384#</span>
            </button>
          )}

          {onOpenIvr && (
            <button
              onClick={onOpenIvr}
              className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 text-white px-2 py-1 rounded-lg text-[11px] font-bold shadow-xs transition-colors"
              title="Open Basic Phone / IVR Simulator"
            >
              <PhoneCall className="h-3 w-3 text-emerald-200" />
              <span>IVR</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Row: PROMINENT LARGE LANGUAGE BUTTONS & Low Data Mode Toggle */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" />
            <span>Language / மொழி / भाषा</span>
          </span>

          <div className="flex items-center gap-1.5">
            {/* Low Data Mode Toggle (Section 48) */}
            {onToggleLowDataMode && (
              <button
                onClick={onToggleLowDataMode}
                className={`text-[10px] px-2 py-0.5 rounded-lg border font-bold flex items-center gap-1 transition-all ${
                  isLowDataMode
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                    : 'bg-gov-800/80 text-gov-200 border-gov-700 hover:text-white'
                }`}
                title="Toggle Low Bandwidth Mode for 2G Networks"
              >
                <Zap className="h-3 w-3 text-amber-900" />
                <span>Low Data: {isLowDataMode ? 'ON' : 'OFF'}</span>
              </button>
            )}

            {onToggleLowConnectivity && (
              <button
                onClick={onToggleLowConnectivity}
                className={`text-[10px] px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                  isLowConnectivity
                    ? 'bg-amber-950 text-amber-300 border-amber-500 font-bold'
                    : 'text-gov-300 border-gov-700 hover:text-white'
                }`}
                title="Simulate Low Connectivity Mode"
              >
                {isLowConnectivity ? <WifiOff className="h-3 w-3 text-amber-400" /> : <Wifi className="h-3 w-3" />}
                <span>{isLowConnectivity ? 'Offline' : 'Online'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Large, High-Contrast Tap Targets */}
        <div className="grid grid-cols-3 gap-2">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`py-2 px-2 rounded-xl text-center font-bold transition-all shadow-xs border-2 ${
                language === lang.code
                  ? 'bg-emerald-600 text-white border-white ring-2 ring-emerald-300'
                  : 'bg-gov-800/80 text-gov-100 border-gov-700 hover:bg-gov-700'
              }`}
            >
              <span className="block text-sm leading-none">{lang.native}</span>
              <span className="block text-[10px] font-normal opacity-80 mt-0.5">{lang.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Centre Details Card */}
      <div className={`rounded-xl p-3.5 border ${
        isLowDataMode
          ? 'bg-slate-800 border-slate-600'
          : 'bg-gov-800/90 border-gov-700'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-300">
            Your Procurement Centre
          </span>
          <span className="text-[10px] bg-emerald-700 text-white font-semibold px-2 py-0.5 rounded">
            Open (08:00 – 19:00)
          </span>
        </div>

        <h2 className="text-base font-extrabold text-white mt-1 flex items-center gap-1.5">
          <Building2 className="h-4 w-4 text-emerald-300 flex-shrink-0" />
          {t.centreName}
        </h2>
        <p className="text-xs text-gov-100 flex items-center gap-1 mt-1">
          <MapPin className="h-3.5 w-3.5 text-emerald-300 flex-shrink-0" />
          Kamarajar Road, Singanallur, Coimbatore
        </p>

        {/* Low-Connectivity / Last Updated Status Strip */}
        <div className="mt-3 pt-2 border-t border-gov-700 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${isLowConnectivity ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
            <span className="text-gov-200 text-[11px] font-medium">
              {isLowConnectivity ? 'Last updated: 10:30 AM' : t.lastUpdated}
            </span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1 text-[11px] font-bold bg-gov-700 hover:bg-gov-600 px-2 py-1 rounded text-white transition-colors"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{t.refresh}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
