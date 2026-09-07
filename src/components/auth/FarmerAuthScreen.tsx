import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageCode } from '../../types/procurement';
import {
  Tractor,
  Phone,
  User,
  MapPin,
  Wheat,
  Scale,
  Building2,
  Globe,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Sun,
  Moon,
  KeyRound
} from 'lucide-react';

interface FarmerAuthScreenProps {
  onBackToRoleSelect: () => void;
  onSuccess: () => void;
}

export const FarmerAuthScreen: React.FC<FarmerAuthScreenProps> = ({
  onBackToRoleSelect,
  onSuccess
}) => {
  const { loginFarmer } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const [authMode, setAuthMode] = useState<'LOGIN' | 'ENROLL'>('LOGIN');

  // Existing Login state
  const [loginPhone, setLoginPhone] = useState<string>('9876543210');
  const [loginOtp, setLoginOtp] = useState<string>('8492');
  const [otpSent, setOtpSent] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Enrollment state
  const [name, setName] = useState<string>('');
  const [enrollPhone, setEnrollPhone] = useState<string>('');
  const [enrollOtp, setEnrollOtp] = useState<string>('');
  const [enrollOtpSent, setEnrollOtpSent] = useState<boolean>(false);
  const [village, setVillage] = useState<string>('Singanallur Rural');
  const [district, setDistrict] = useState<string>('Coimbatore');
  const [crop, setCrop] = useState<string>('Paddy (PR 126)');
  const [quantity, setQuantity] = useState<string>('25'); // in Quintals
  const [preferredCentre, setPreferredCentre] = useState<string>('singanallur');
  const [preferredLang, setPreferredLang] = useState<LanguageCode>(language);

  // Handle Quick Demo Farmer Login
  const handleQuickDemoFarmer = () => {
    loginFarmer('9876543210', 'Sukhwinder Sharma');
    onSuccess();
  };

  // Handle existing farmer login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone || loginPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!loginOtp) {
      setErrorMsg('Please enter the OTP code (use demo code 8492)');
      return;
    }
    const res = loginFarmer(loginPhone);
    if (res.success) {
      onSuccess();
    } else {
      setErrorMsg(res.errorMessage || 'Login failed');
    }
  };

  // Handle enrollment submit
  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter farmer full name');
      return;
    }
    if (!enrollPhone || enrollPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    const res = loginFarmer(enrollPhone, name.trim());
    if (res.success) {
      setLanguage(preferredLang);
      onSuccess();
    } else {
      setErrorMsg(res.errorMessage || 'Enrollment failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      {/* Top Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={onBackToRoleSelect}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>← Back to Role Selection</span>
        </button>

        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-4 w-4 text-amber-400" />
              <span>☀️ Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-indigo-600" />
              <span>🌙 Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-xl mx-auto w-full px-4 py-8 sm:py-10 flex-1 flex flex-col justify-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 dark:from-emerald-950 dark:to-slate-900 text-white p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-700/60 border border-emerald-500/40 flex items-center justify-center">
                <Tractor className="h-6 w-6 text-emerald-200" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                  Inclusive Farmer Access
                </span>
                <h1 className="text-xl font-black text-white">Farmer Portal</h1>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Direct MSP procurement slot booking & live virtual token
                </p>
              </div>
            </div>

            {/* Sub-mode Switch Tabs: Existing Login vs New Enroll */}
            <div className="grid grid-cols-2 gap-2 mt-5 p-1 bg-emerald-950/60 rounded-xl border border-emerald-700/50">
              <button
                type="button"
                onClick={() => { setAuthMode('LOGIN'); setErrorMsg(''); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'LOGIN'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                Existing Farmer — Login
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('ENROLL'); setErrorMsg(''); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'ENROLL'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                New Farmer — Enroll
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {errorMsg && (
              <div className="mb-5 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300">
                {errorMsg}
              </div>
            )}

            {/* 1. EXISTING FARMER LOGIN */}
            {authMode === 'LOGIN' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Registered Mobile Number</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:border-emerald-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>One-Time Password (OTP)</span>
                    </label>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      Demo OTP: 8492
                    </span>
                  </div>
                  <input
                    type="text"
                    value={loginOtp}
                    onChange={(e) => setLoginOtp(e.target.value.slice(0, 6))}
                    placeholder="Enter 4-digit OTP"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold tracking-widest text-center focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <span>Verify & Open Farmer Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* 1-Click Fast Demo Button */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleQuickDemoFarmer}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-900 dark:text-emerald-300 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>⚡ Quick Demo: Sukhwinder Sharma (+91 98765-43210)</span>
                  </button>
                </div>
              </form>
            )}

            {/* 2. NEW FARMER ENROLLMENT */}
            {authMode === 'ENROLL' && (
              <form onSubmit={handleEnrollSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Farmer Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Chandra"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:border-emerald-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={enrollPhone}
                      onChange={(e) => setEnrollPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      placeholder="10-digit mobile"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:border-emerald-600 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        OTP Verification
                      </label>
                      <button
                        type="button"
                        onClick={() => { setEnrollOtp('8492'); setEnrollOtpSent(true); }}
                        className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold underline"
                      >
                        Auto-fill OTP
                      </button>
                    </div>
                    <input
                      type="text"
                      value={enrollOtp}
                      onChange={(e) => setEnrollOtp(e.target.value.slice(0, 6))}
                      placeholder="Code (e.g. 8492)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Village / Taluk
                    </label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Crop Variety
                    </label>
                    <select
                      value={crop}
                      onChange={(e) => setCrop(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="Paddy (PR 126)">Paddy (PR 126)</option>
                      <option value="Wheat (HD 3086)">Wheat (HD 3086)</option>
                      <option value="Maize">Maize</option>
                      <option value="Mustard">Mustard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Expected Qty (Quintals)
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g. 25"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Centre
                    </label>
                    <select
                      value={preferredCentre}
                      onChange={(e) => setPreferredCentre(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="singanallur">Singanallur Hub (Centre C)</option>
                      <option value="sulur">Sulur APMC (Centre B)</option>
                      <option value="pollachi">Pollachi Regulated Market</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Language
                    </label>
                    <select
                      value={preferredLang}
                      onChange={(e) => setPreferredLang(e.target.value as LanguageCode)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="ta">தமிழ் (Tamil)</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  <span>Complete Enrollment & Proceed to Book Slot</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 text-center text-xs text-slate-500 dark:text-slate-400">
        AgriFlow Inclusive Farmer Service • Multi-Channel: Smartphone, SMS, IVR & Assisted Desk
      </footer>
    </div>
  );
};
