import React, { useState, useEffect } from 'react';
import { LivingAgriculturalLandscape } from './LivingAgriculturalLandscape';
import { VisualFarmerJourney } from './VisualFarmerJourney';
import { InteractiveCentreVisual } from './InteractiveCentreVisual';
import { QueueComparisonVisual } from './QueueComparisonVisual';
import { IntelligenceDataFlowVisual } from './IntelligenceDataFlowVisual';
import { CrowdShiftSimulator } from '../operator/CrowdShiftSimulator';
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  ShieldCheck,
  Send,
  Smartphone,
  PhoneCall,
  Volume2,
  Building2,
  MessageSquare,
  Sparkles,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Sliders,
  Award,
  ChevronRight,
  Radio,
  FileCheck,
  UserCheck,
  Sun,
  Moon,
  Lock,
  Compass,
  Ticket,
  Scale
} from 'lucide-react';

interface LandingPageProps {
  onExplorePlatform: () => void;
  onLaunchRole?: (role: 'FARMER' | 'OPERATOR' | 'ADMIN') => void;
  onOpenPhoneSimulator?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExplorePlatform,
  onLaunchRole,
  onOpenPhoneSimulator
}) => {
  // Dark mode state: remembers user preference, respects system preference
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('agriflow_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('agriflow_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFarmerClick = () => {
    if (onLaunchRole) {
      onLaunchRole('FARMER');
    } else {
      onExplorePlatform();
    }
  };

  const handleOperatorClick = () => {
    if (onLaunchRole) {
      onLaunchRole('OPERATOR');
    } else {
      onExplorePlatform();
    }
  };

  const handleAdminClick = () => {
    if (onLaunchRole) {
      onLaunchRole('ADMIN');
    } else {
      onExplorePlatform();
    }
  };

  return (
    <div
      className={`min-h-screen font-sans selection:bg-emerald-200 selection:text-emerald-950 transition-colors duration-500 ${
        isDark ? 'bg-[#030712] text-slate-100' : 'bg-[#fcfbf9] text-slate-900'
      }`}
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP PUBLIC INFRASTRUCTURE BRAND HEADER */}
      {/* ───────────────────────────────────────────────────────────── */}
      <nav
        className={`border-b sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${
          isDark
            ? 'bg-[#030712]/90 border-slate-800'
            : 'bg-white/95 border-slate-200 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-gradient-to-br from-gov-800 to-gov-900 dark:from-emerald-700 dark:to-gov-900 text-white shadow-sm border border-emerald-400/30">
              <span className="text-xl">🌾</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  AgriFlow
                </span>
                <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 uppercase">
                  SIH 2026 Grand Finale
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Predict. Coordinate. Reach Every Farmer.
              </p>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="hidden lg:flex items-center gap-5 text-xs font-bold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => scrollToSection('section-journey')}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
            >
              8-Step Flow
            </button>
            <button
              onClick={() => scrollToSection('section-centre-visual')}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
            >
              Mandi Architecture
            </button>
            <button
              onClick={() => scrollToSection('section-comparison')}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
            >
              Queue Demo
            </button>
            <button
              onClick={() => scrollToSection('section-pipeline')}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
            >
              Data Pipeline
            </button>
            <button
              onClick={() => scrollToSection('section-trust')}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
            >
              Farmer Trust
            </button>
          </div>

          {/* Action Tools & Role Fast Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-colors ${
                isDark
                  ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Basic Phone Simulator Modal Trigger */}
            {onOpenPhoneSimulator && (
              <button
                onClick={onOpenPhoneSimulator}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl transition-colors"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                <span>📞 Basic Phone</span>
              </button>
            )}

            {/* Primary Farmer Navigation Button */}
            <button
              onClick={handleFarmerClick}
              className="py-2 px-3.5 sm:px-4 rounded-xl bg-gov-800 hover:bg-gov-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>👨‍🌾 I'm a Farmer</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. HERO SECTION — LIVING AGRICULTURAL LANDSCAPE WITH PARALLAX */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        {/* Animated Landscape Canvas as Hero Background */}
        <div className="absolute inset-0">
          <LivingAgriculturalLandscape isDark={isDark} />
        </div>

        {/* Soft Contrast Scrim to Ensure Flawless Text Readability */}
        <div
          className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
            isDark
              ? 'bg-gradient-to-r from-[#030712]/95 via-[#030712]/75 to-transparent'
              : 'bg-gradient-to-r from-white/95 via-white/80 to-transparent'
          }`}
        />

        {/* Hero Content Grid */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT COLUMN: HERO HEADLINES & FARMER-FIRST CALL TO ACTION */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-900 dark:text-emerald-200 backdrop-blur-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping" />
                <span>Agricultural Procurement Coordination Intelligence</span>
              </div>

              {/* Exact Hero Headline (Prompt Section 6) */}
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                  Smarter Scheduling. <br />
                  Shorter Queues. <br />
                  <span className="text-gov-800 dark:text-emerald-400 underline decoration-amber-400 decoration-wavy decoration-2">
                    Happier Farmers.
                  </span>
                </h1>
              </div>

              {/* Exact Supporting Text (Prompt Section 6) */}
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl font-medium">
                AgriFlow helps farmers find the right procurement centre, book smarter slots and know
                when to arrive — without spending hours waiting in line.
              </p>

              {/* ───────────────────────────────────────────────────────── */}
              {/* FARMER-FIRST VISUAL HIERARCHY (Prompt Section 7)          */}
              {/* ───────────────────────────────────────────────────────── */}
              <div className="pt-2 space-y-4">
                {/* 1. Primary Action: I AM A FARMER (Commanding Public Button) */}
                <div>
                  <button
                    onClick={handleFarmerClick}
                    className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-700 via-gov-800 to-gov-900 hover:from-emerald-800 hover:to-gov-950 text-white font-black text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 border border-emerald-400/30 group"
                  >
                    <span className="text-xl">👨‍🌾</span>
                    <span className="tracking-wide">I AM A FARMER</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 ml-1 font-medium">
                    Free for all Indian farmers • No password required • Smartphone, SMS or Voice
                  </p>
                </div>

                {/* 2. Secondary Staff & Admin Actions (Clearly Distinct Authorized Personnel Access) */}
                <div
                  className={`p-3.5 rounded-2xl border max-w-lg backdrop-blur-sm space-y-2 ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-800'
                      : 'bg-white/85 border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Lock className="h-3 w-3 text-slate-400" /> Authorized Personnel Access
                    </span>
                    <span>Role-Based Auth (RBAC)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={handleOperatorClick}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'
                      }`}
                    >
                      <Building2 className="h-4 w-4 text-gov-700 dark:text-emerald-400" />
                      <span>CENTRE STAFF LOGIN</span>
                    </button>

                    <button
                      onClick={handleAdminClick}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4 text-amber-600" />
                      <span>ADMIN LOGIN</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: LIVE DATA VISUALIZATION PANEL (Prompt Section 5) */}
            <div className="lg:col-span-5">
              <div
                className={`rounded-3xl border-2 p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-4 transition-all ${
                  isDark
                    ? 'bg-slate-900/90 border-emerald-500/40 text-white'
                    : 'bg-white/95 border-emerald-300 text-slate-900'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-black uppercase tracking-wider font-mono">
                      AGRIFLOW LIVE INTEL
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    Coimbatore Cluster
                  </span>
                </div>

                {/* Live Centre Status Ticker (Section 5 Requirement) */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="font-bold">Centre A (Avinashi Hub)</span>
                    <span className="px-2 py-0.5 rounded font-mono font-black text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950">
                      🔴 HIGH (65m wait)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="font-bold">Centre B (Sulur Yard)</span>
                    <span className="px-2 py-0.5 rounded font-mono font-black text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950">
                      🟡 MODERATE (18m wait)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800">
                    <span className="font-black text-emerald-950 dark:text-emerald-200">
                      Centre C (Singanallur APMC)
                    </span>
                    <span className="px-2 py-0.5 rounded font-mono font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900">
                      🟢 LOW (12m wait)
                    </span>
                  </div>
                </div>

                {/* Recommendation Highlight & "Why?" Explanation */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-gov-800 text-white space-y-2 shadow-md">
                  <div className="flex items-center justify-between text-[11px] uppercase font-bold text-emerald-200">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> Optimal Recommendation
                    </span>
                    <span className="font-mono">Save ~40 Mins</span>
                  </div>

                  <h4 className="text-base font-black">Recommended: Centre C (Singanallur)</h4>

                  <div className="pt-2 border-t border-emerald-400/30 text-xs text-emerald-100 space-y-1 leading-relaxed">
                    <strong>Why?</strong>
                    <p className="text-[11px]">
                      Lowest predicted waiting time + 28 tonnes available daily capacity. Weighbridge
                      #1 is operating with zero bottleneck.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleFarmerClick}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Book Slot at Centre C Now</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. VISUAL STORY: FARM → PROCUREMENT (Prompt Section 3)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="section-journey"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800"
      >
        <VisualFarmerJourney isDark={isDark} />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. INTERACTIVE PROCUREMENT CENTRE VISUAL (Prompt Section 4)  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="section-centre-visual"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800"
      >
        <InteractiveCentreVisual isDark={isDark} />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. ANIMATED QUEUE DEMONSTRATION (Prompt Section 8)           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="section-comparison"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800"
      >
        <QueueComparisonVisual isDark={isDark} />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. AI & DATA FLOW PIPELINE VISUAL (Prompt Section 9)         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="section-pipeline"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800"
      >
        <IntelligenceDataFlowVisual isDark={isDark} />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. CROWD SHIFT SIMULATOR INTERACTIVE LAB                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="section-sim"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800"
      >
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gov-800 dark:text-emerald-400 bg-gov-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-gov-200 dark:border-emerald-800">
              Interactive Decision Support
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Crowd Shift Simulator
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Test arrival redistribution before communicating advisories with farmers.
            </p>
          </div>

          <div
            className={`rounded-3xl border-2 p-6 sm:p-8 shadow-lg ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <CrowdShiftSimulator onApplyPlan={handleOperatorClick} />
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 8. TRUST SECTION: "BUILT AROUND THE FARMER" (Prompt Section 15) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="section-trust"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
            Public Service Commitment
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Built Around the Farmer
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Five non-negotiable principles engineered for Indian rural realities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Benefit 1: Farmer First */}
          <div
            className={`p-5 rounded-2xl border-2 space-y-3 ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xl">
              🌾
            </div>
            <h4 className="text-sm font-black">Farmer First</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Zero AI jargon. Vernacular speech synthesis in Tamil, Hindi, Punjabi and English. 2G Low Data mode.
            </p>
          </div>

          {/* Benefit 2: Smart Centre Selection */}
          <div
            className={`p-5 rounded-2xl border-2 space-y-3 ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="h-10 w-10 rounded-xl bg-gov-100 dark:bg-gov-950 text-gov-800 dark:text-emerald-300 flex items-center justify-center text-xl">
              📍
            </div>
            <h4 className="text-sm font-black">Smart Centre Selection</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dual-metric allocation in metric tonnes and road distance. Always provides plain-language reasons.
            </p>
          </div>

          {/* Benefit 3: Virtual Queue */}
          <div
            className={`p-5 rounded-2xl border-2 space-y-3 ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xl">
              🎟️
            </div>
            <h4 className="text-sm font-black">Virtual Queue</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Real-time token countdown (10 → 7 → 5 → 0). No waiting on hot tarmac. Booking remains 100% active.
            </p>
          </div>

          {/* Benefit 4: Arrive When Your Turn Is Near */}
          <div
            className={`p-5 rounded-2xl border-2 space-y-3 ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center justify-center text-xl">
              ⏱️
            </div>
            <h4 className="text-sm font-black">Arrive When Near</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dynamic departure advisories auto-adjust if earlier weighbridge delays occur (+15 min shift).
            </p>
          </div>

          {/* Benefit 5: Secure & Role-Based */}
          <div
            className={`p-5 rounded-2xl border-2 space-y-3 ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 flex items-center justify-center text-xl">
              🔐
            </div>
            <h4 className="text-sm font-black">Secure & Role-Based</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Strict centre isolation, tamper-evident SHA-256 audit trails, and certified PFMS DBT settlement.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 9. FINAL CALL TO ACTION                                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        className={`py-20 border-t ${
          isDark
            ? 'bg-gradient-to-b from-[#030712] to-[#081220] border-slate-800'
            : 'bg-gradient-to-b from-white to-slate-100 border-slate-200'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Better Coordination Starts Before Farmers Arrive.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Experience the complete platform directly. Explore the Farmer experience, manage the
            Singanallur Hub, or simulate district surges as an administrator.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleFarmerClick}
              className="py-3.5 px-8 rounded-2xl bg-gov-800 hover:bg-gov-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black text-sm shadow-xl transition-all flex items-center gap-2"
            >
              <span>Launch Farmer App</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={handleOperatorClick}
              className={`py-3.5 px-6 rounded-2xl border-2 font-bold text-sm transition-colors ${
                isDark
                  ? 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              Centre Staff Console
            </button>

            <button
              onClick={handleAdminClick}
              className={`py-3.5 px-6 rounded-2xl border-2 font-bold text-sm transition-colors ${
                isDark
                  ? 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              Admin Demand Surge Lab
            </button>
          </div>

          <p className="text-xs text-slate-400 font-mono pt-6">
            Smart India Hackathon 2026 • Grand Finale Operational Deployment Prototype
          </p>
        </div>
      </section>
    </div>
  );
};
