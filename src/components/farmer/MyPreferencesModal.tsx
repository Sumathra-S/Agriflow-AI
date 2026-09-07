import React, { useState, useEffect } from 'react';
import { farmerPreferenceEngine } from '../../services/engine/farmerPreferenceEngine';
import { FarmerPreferences, PriorityCategory } from '../../types/procurement';
import { X, Sliders, CheckCircle2, ShieldCheck, MapPin, Truck, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface MyPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmerId?: string;
}

export const MyPreferencesModal: React.FC<MyPreferencesModalProps> = ({
  isOpen,
  onClose,
  farmerId = 'FARMER-1048'
}) => {
  const { language } = useLanguage();
  const [prefs, setPrefs] = useState<FarmerPreferences>(farmerPreferenceEngine.getPreferences(farmerId));
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    return farmerPreferenceEngine.subscribe(updated => {
      setPrefs(updated);
    }, farmerId);
  }, [farmerId]);

  if (!isOpen) return null;

  const handleSave = () => {
    farmerPreferenceEngine.updatePreferences(farmerId, prefs);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  const isTa = language === 'ta';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-gov-800 to-gov-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 border border-white/20">
              <Sliders className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                {isTa ? 'எனது முன்னுரிமை அமைப்புகள்' : 'My Procurement Preferences'}
              </h2>
              <p className="text-xs text-emerald-200">
                {isTa ? 'விவசாயி அடையாள எண்: FARMER-1048 (முத்துசாமி)' : 'Farmer ID: FARMER-1048 (Muthusamy K)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-5 text-sm text-slate-700">
          {/* 1. Travel Distance Tolerance */}
          <div className="space-y-2">
            <label className="font-bold flex items-center gap-1.5 text-slate-900 text-xs uppercase tracking-wider">
              <MapPin className="h-4 w-4 text-gov-700" />
              {isTa ? 'பயண தூர சகிப்புத்தன்மை (அதிகபட்சம்)' : 'Maximum Travel Tolerance'}
            </label>
            <p className="text-xs text-slate-500">
              {isTa
                ? 'கூடுதல் தூரம் பயணிக்க தயாரா, விரைவாக கொள்முதல் செய்ய?'
                : 'How far are you willing to travel if another centre has zero waiting line?'}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 25].map(km => (
                <button
                  key={km}
                  type="button"
                  onClick={() => setPrefs({ ...prefs, travelToleranceKm: km })}
                  className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all text-center ${
                    prefs.travelToleranceKm === km
                      ? 'bg-gov-800 text-white border-gov-800 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-gov-400'
                  }`}
                >
                  {km} km
                </button>
              ))}
            </div>
          </div>

          {/* 2. Auto-Reallocation Opt-In Toggle */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-black text-emerald-950 text-xs uppercase tracking-wide block">
                  {isTa ? 'விரைவான கொள்முதல் தானியங்கு பரிந்துரை' : 'Smart Centre Reallocation Recommendation'}
                </span>
                <p className="text-xs text-emerald-800 mt-0.5">
                  {isTa
                    ? 'உங்கள் தற்போதைய மையத்தில் வரிசை அதிகமாக இருந்தால், குறைந்த காத்திருப்பு நேரம் கொண்ட அருகிலுள்ள மாற்று மையத்தை AgriFlow பரிந்துரைக்கலாம்.'
                    : 'Allow AgriFlow to notify you of nearby centres saving >25 min wait time within your travel radius.'}
                </p>
              </div>
              <input
                type="checkbox"
                checked={prefs.optInAutoReallocation}
                onChange={e => setPrefs({ ...prefs, optInAutoReallocation: e.target.checked })}
                className="h-5 w-5 accent-emerald-700 rounded mt-1 cursor-pointer"
              />
            </div>
            <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5 pt-1 border-t border-emerald-200/60">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>{isTa ? 'மனித முடிவே இறுதியானது — நீங்கள் ஏற்காமல் மையம் மாறாது.' : 'Human-in-the-loop: Never reallocates without your explicit tap.'}</span>
            </div>
          </div>

          {/* 3. Priority Category */}
          <div className="space-y-2">
            <label className="font-bold flex items-center gap-1.5 text-slate-900 text-xs uppercase tracking-wider">
              {isTa ? 'விவசாயி முன்னுரிமை பிரிவு' : 'Farmer Priority Category'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'STANDARD', label: 'Standard Farmer', desc: 'General intake' },
                { key: 'SMALL_HOLDER', label: 'Smallholder (<2 ha)', desc: 'Prioritized check-in' },
                { key: 'PERISHABLE_PRODUCE', label: 'Perishable Crop', desc: 'Moisture sensitivity' },
                { key: 'SENIOR_CITIZEN', label: 'Senior Citizen', desc: 'Express assisted lane' }
              ].map(cat => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setPrefs({ ...prefs, priorityCategory: cat.key as PriorityCategory })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    prefs.priorityCategory === cat.key
                      ? 'bg-gov-50 border-gov-700 ring-2 ring-gov-700/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-xs text-slate-900">{cat.label}</p>
                  <p className="text-[10px] text-slate-500">{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Vehicle Type */}
          <div className="space-y-2">
            <label className="font-bold flex items-center gap-1.5 text-slate-900 text-xs uppercase tracking-wider">
              <Truck className="h-4 w-4 text-gov-700" />
              {isTa ? 'வாகன வகை' : 'Transport Vehicle Type'}
            </label>
            <select
              value={prefs.vehicleType}
              onChange={e => setPrefs({ ...prefs, vehicleType: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-gov-600"
            >
              <option value="Tractor Trolley">Tractor Trolley (High Volume / Dedicated Gate 2)</option>
              <option value="Mini Truck (Pick-up)">Mini Truck / Pick-up (Medium / Gate 1)</option>
              <option value="Bullock Cart">Bullock Cart (Local / Gate 3 Slow Lane)</option>
              <option value="Trailer">Commercial Trailer (Heavy Load / Bulk)</option>
            </select>
          </div>

          {/* 5. Max Acceptable Wait */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-gov-700" />
                {isTa ? 'அதிகபட்ச சகிப்புத்தன்மை காத்திருப்பு நேரம்' : 'Max Tolerable Wait Time'}
              </label>
              <span className="font-mono font-bold text-gov-800 bg-gov-100 px-2 py-0.5 rounded">
                {prefs.maxAcceptableWaitMinutes} {isTa ? 'நிமிடம்' : 'min'}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="5"
              value={prefs.maxAcceptableWaitMinutes}
              onChange={e => setPrefs({ ...prefs, maxAcceptableWaitMinutes: parseInt(e.target.value) })}
              className="w-full accent-gov-800"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            {isTa ? 'மூடு' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 text-white transition-all shadow-md ${
              isSaved
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-gov-800 hover:bg-gov-900'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>{isTa ? 'சேமிக்கப்பட்டது!' : 'Saved to Audit Trail!'}</span>
              </>
            ) : (
              <span>{isTa ? 'முன்னுரிமைகளை சேமி' : 'Save Preferences'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
