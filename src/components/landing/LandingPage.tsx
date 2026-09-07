import React, { useState } from 'react';
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
  UserCheck
} from 'lucide-react';

interface LandingPageProps {
  onExplorePlatform: () => void;
  onOpenPhoneSimulator?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExplorePlatform,
  onOpenPhoneSimulator
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#fcfbf9] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Public Infrastructure Brand Header */}
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gov-800 text-white shadow-xs">
              <span className="text-xl">🌾</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900">AgriFlow</span>
                <span className="bg-gov-100 text-gov-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-gov-200 uppercase">
                  SIH Public Service
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Operational Intelligence & Inclusive Communication
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection('section-sim')}
              className="hidden md:inline-flex text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5"
            >
              Crowd Shift Simulator
            </button>
            <button
              onClick={() => scrollToSection('section-channels')}
              className="hidden md:inline-flex text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5"
            >
              Inclusive Reach
            </button>
            {onOpenPhoneSimulator && (
              <button
                onClick={onOpenPhoneSimulator}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors"
              >
                <span>📞 Basic Phone</span>
              </button>
            )}
            <button
              onClick={onExplorePlatform}
              className="py-2 px-4 rounded-xl bg-gov-800 hover:bg-gov-900 text-white font-extrabold text-xs shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Explore Platform</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ============================================================ */}
      {/* SECTION 1 — HERO                                             */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT SIDE */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Procurement Coordination Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Farmers book slots. <br />
              <span className="text-gov-800 underline decoration-amber-400 decoration-wavy decoration-2">
                But arrivals are still unpredictable.
              </span>
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              AgriFlow helps agricultural procurement centres predict near-term arrival pressure, understand possible congestion root causes, and coordinate farmers before queues become severe.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExplorePlatform}
                className="py-3.5 px-6 rounded-2xl bg-gov-800 hover:bg-gov-900 text-white font-black text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Explore Platform</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => scrollToSection('section-workflow')}
                className="py-3.5 px-5 rounded-2xl border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-xs transition-colors"
              >
                See How It Works
              </button>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 border-t border-slate-200">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Non-invasive to official slot portals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Decision support for operators</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Realistic Product Dashboard Preview */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-2xl space-y-4">
              {/* Centre Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-gov-800 text-white flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      Singanallur Procurement Centre
                    </h3>
                    <p className="text-[11px] text-slate-500">Coimbatore District, Tamil Nadu</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  ● Shift: 08:00–19:00
                </span>
              </div>

              {/* Status Banner */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Current Queue</span>
                  <p className="text-2xl font-black font-mono text-slate-900 mt-0.5">18 Farmers</p>
                  <span className="text-[10px] text-slate-500">At weighbridge & gate approach</span>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="text-[10px] font-bold text-rose-800 uppercase">Next 2 Hours</span>
                  <p className="text-xs font-black text-rose-900 mt-1 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping"></span>
                    <span>HIGH ARRIVAL PRESSURE</span>
                  </p>
                  <span className="text-[10px] text-rose-700">Projected: 38 arrivals vs 20/hr cap</span>
                </div>
              </div>

              {/* Main Reasons (Deterministic Explainability) */}
              <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Why is congestion predicted?
                </span>
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><strong>More bookings before noon:</strong> 38 farmers booked between 10 AM – 12 PM.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><strong>Queue increasing:</strong> Inflow velocity is +24% higher than morning baseline.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><strong>Processing slower:</strong> Single weighbridge operation throughput at 18/hr.</span>
                </div>
              </div>

              {/* Suggested Action Bar */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-800">Suggested Action</span>
                  <p className="text-xs font-bold text-emerald-950">Test arrival redistribution (Shift 8 to 2 PM)</p>
                </div>
                <button
                  onClick={() => scrollToSection('section-sim')}
                  className="py-1.5 px-3 bg-gov-800 hover:bg-gov-900 text-white text-xs font-black rounded-lg shadow-xs transition-colors"
                >
                  Simulate Action →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 — REAL PROBLEM                                      */}
      {/* ============================================================ */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div>
            <span className="text-xs font-mono font-bold text-gov-800 uppercase tracking-wider">
              The Operational Reality
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              The gap begins after booking.
            </h2>
          </div>

          {/* Visual: Booked -> Expected -> Actual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">1. Booked</span>
              <p className="text-2xl font-black font-mono text-slate-900">40 Farmers</p>
              <p className="text-xs text-slate-500">Slots registered across official booking portal for today</p>
            </div>

            <div className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/70 space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase">2. Expected Arrival</span>
              <p className="text-2xl font-black font-mono text-amber-950">35–45 Farmers</p>
              <p className="text-xs text-amber-800">Model estimates accounting for travel distance and weather</p>
            </div>

            <div className="p-5 rounded-2xl border-2 border-rose-300 bg-rose-50/70 space-y-2">
              <span className="text-xs font-bold text-rose-800 uppercase">3. Actual Arrival</span>
              <p className="text-2xl font-black font-mono text-rose-950">Unpredictable</p>
              <p className="text-xs text-rose-800">Farmers arrive simultaneously at 10 AM, creating long queues</p>
            </div>
          </div>

          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A booking system records planned visits. It does not necessarily show how many farmers will actually arrive together. AgriFlow fills this critical operational gap without disrupting existing registration records.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3 — WORKFLOW COMPARISON                               */}
      {/* ============================================================ */}
      <section id="section-workflow" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-mono font-bold text-gov-800 uppercase tracking-wider">
            Process Evolution
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            From Reactive Waiting to Proactive Coordination
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* EXISTING WORKFLOW */}
          <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">Existing Workflow</h3>
              <span className="text-xs text-slate-400 font-mono">Traditional Model</span>
            </div>
            <div className="space-y-3">
              {[
                { step: 'Register', desc: 'Farmer registers on state portal' },
                { step: 'Book', desc: 'Farmer picks date & broad time slot' },
                { step: 'Visit', desc: 'Farmer drives tractor to procurement centre' },
                { step: 'Wait', desc: 'Long congestion queues at gate approach' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="h-6 w-6 rounded-full bg-slate-200 text-slate-700 font-mono font-bold flex items-center justify-center text-[11px]">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">{item.step}</span>
                    <span className="text-slate-500 text-[11px]">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AGRIFLOW WORKFLOW */}
          <div className="rounded-3xl border-2 border-emerald-300 bg-emerald-50/50 p-6 shadow-md space-y-4">
            <div className="border-b border-emerald-200 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                <span>AgriFlow Workflow</span>
                <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  Continuous Flow
                </span>
              </h3>
              <span className="text-xs text-emerald-700 font-mono font-bold">Proactive</span>
            </div>
            <div className="space-y-2">
              {[
                { step: 'Register & Book', tag: 'Existing Portals', desc: 'Farmer books slot in state system' },
                { step: 'Predict & Explain', tag: 'AgriFlow Layer', desc: 'Near-term arrival velocity & 3 root causes' },
                { step: 'Simulate', tag: 'Innovation', desc: 'Operator tests arrival shift before acting' },
                { step: 'Coordinate & Reach', tag: 'Multi-Channel', desc: 'Targeted advisories via App, SMS, Voice, IVR' },
                { step: 'Arrive Smoothly', tag: 'Result', desc: 'Balanced gate inflow with minimal wait times' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-emerald-200 shadow-xs text-xs">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-[11px]">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block">{item.step}</span>
                      <span className="text-slate-500 text-[11px]">{item.desc}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4 — PREDICT ARRIVAL PRESSURE                          */}
      {/* ============================================================ */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-gov-800 uppercase tracking-wider">
              Predictive Timeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              See pressure before queues peak.
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              Categorical risk estimates based on booking counts, processing throughput, and gate clearance rates.
            </p>
          </div>

          {/* Timeline Chart Display */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { time: '09:00 AM', status: 'LOW', color: 'border-emerald-300 bg-emerald-50 text-emerald-800', arrivals: 12, rate: '18/hr', conf: 'High' },
              { time: '10:00 AM', status: 'MODERATE', color: 'border-amber-300 bg-amber-50 text-amber-800', arrivals: 22, rate: '18/hr', conf: 'High' },
              { time: '11:00 AM', status: 'HIGH', color: 'border-rose-400 bg-rose-50 text-rose-800', arrivals: 38, rate: '18/hr', conf: 'High' },
              { time: '12:00 PM', status: 'HIGH', color: 'border-rose-400 bg-rose-50 text-rose-800', arrivals: 42, rate: '18/hr', conf: 'Medium' },
              { time: '02:00 PM', status: 'LOW', color: 'border-emerald-300 bg-emerald-50 text-emerald-800', arrivals: 9, rate: '20/hr', conf: 'High' }
            ].map((slot, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border-2 ${slot.color} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-700">{slot.time}</span>
                  <span className="text-[10px] font-bold uppercase">{slot.status}</span>
                </div>
                <p className="text-2xl font-black font-mono text-slate-900">{slot.arrivals}</p>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 space-y-0.5">
                  <p>Processing: <strong>{slot.rate}</strong></p>
                  <p>Confidence: <strong>{slot.conf}</strong></p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-center text-slate-400 font-medium">
            * Predictions are categorized into risk tiers (Low / Moderate / High). AgriFlow does not claim 100% precision.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 — EXPLAIN THE PREDICTION                            */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-mono font-bold text-gov-800 uppercase tracking-wider">
            Deterministic Explainability
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Know why before you act.
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Operators see the main factors behind the risk before deciding what action to take.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-3">
            <span className="text-xs font-black font-mono text-gov-800 uppercase tracking-wider">
              Factor 1
            </span>
            <h3 className="text-base font-black text-slate-900">MORE MORNING BOOKINGS</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Booking concentration is significantly higher before noon. Over 38 farmers are scheduled across overlapping 10 AM – 12 PM intervals.
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
              Metric: +35% booking density
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-3">
            <span className="text-xs font-black font-mono text-gov-800 uppercase tracking-wider">
              Factor 2
            </span>
            <h3 className="text-base font-black text-slate-900">QUEUE INCREASING</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Current arrivals at the gate approach are increasing faster than processing capacity (+24% velocity over morning baseline).
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
              Metric: 18 tractors queued
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-3">
            <span className="text-xs font-black font-mono text-gov-800 uppercase tracking-wider">
              Factor 3
            </span>
            <h3 className="text-base font-black text-slate-900">PROCESSING SLOWER</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The current processing rate is below the recent average due to auxiliary moisture meter calibration and single weighbridge lane operation.
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
              Metric: 18/hr vs 22/hr target
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6 — CROWD SHIFT SIMULATOR (KEY INNOVATION)            */}
      {/* ============================================================ */}
      <section id="section-sim" className="bg-slate-100 border-y border-slate-200 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Core Innovation
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Test the action before changing the plan.
            </h2>
            <p className="text-xs text-slate-600 max-w-xl mx-auto">
              Operators can simulate arrival redistribution before communicating with farmers. Decision support without automatic record alterations.
            </p>
          </div>

          {/* Embedded Interactive Simulator Widget */}
          <CrowdShiftSimulator onApplyPlan={() => onExplorePlatform()} />
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 7 — HUMAN CONTROL                                     */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-mono font-bold text-gov-800 uppercase tracking-wider">
            Governance & Ethics
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            The system suggests. People decide.
          </h2>
          <p className="text-xs text-slate-600 max-w-xl mx-auto">
            AgriFlow does not automatically change farmer bookings or official schedules. Every coordination action passes through operator review.
          </p>
        </div>

        {/* 6-Step Workflow */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
          {[
            { step: '1', title: 'System Detects', sub: 'Calculates arrival velocity' },
            { step: '2', title: 'System Explains', sub: 'Presents 3 root causes' },
            { step: '3', title: 'System Simulates', sub: 'Models redistribution' },
            { step: '4', title: 'Operator Reviews', sub: 'Inspects proposal' },
            { step: '5', title: 'Operator Approves', sub: 'Human signs off' },
            { step: '6', title: 'Farmers Contacted', sub: 'Inclusive delivery' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
              <span className="h-7 w-7 rounded-full bg-gov-800 text-white font-mono font-black text-xs inline-flex items-center justify-center">
                {item.step}
              </span>
              <h4 className="text-xs font-black text-slate-900 pt-1">{item.title}</h4>
              <p className="text-[11px] text-slate-500 leading-tight">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 8 — REACH EVERY FARMER                                */}
      {/* ============================================================ */}
      <section id="section-channels" className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-gov-800 uppercase tracking-wider">
              Rural Accessibility Matrix
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Technology should adapt to farmers.
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              Not every farmer has a 5G smartphone. AgriFlow communicates across all device types and literacy levels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-gov-800 text-white flex items-center justify-center">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">SMARTPHONE</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                App alerts, dynamic arrival guidance, token passes, and low-data mode for slow connections.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-700 text-white flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">BASIC PHONE</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simple cellular SMS text updates and interactive USSD (*384#) menu that works on any 2G phone.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-blue-700 text-white flex items-center justify-center">
                <Volume2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">LOW LITERACY</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Local-language voice messages in Tamil, Hindi, and English with one-tap audio readouts.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center">
                <PhoneCall className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">NO INTERNET</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interactive Voice Response (IVR), missed-call automated callbacks, and Common Service Centre (CSC) desk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 9 — COMMUNICATION ESCALATION                          */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-bold text-gov-800 uppercase tracking-wider">
              Guaranteed Delivery
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              Sending a message is not the same as reaching a farmer.
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an SMS delivery fails or remains pending, the system automatically escalates to automated voice calls and places unreached farmers on the operator's callback list.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Alert Created → SMS Gateway</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Delivery Status Monitored</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-amber-600" />
                <span>If needed → Outbound Voice Broadcast</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <span>If follow-up required → Operator Call Desk</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-gov space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-black text-slate-900">Communication Escalation Desk</span>
                <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Simulated Telecom Stats
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Selected</span>
                  <p className="text-xl font-black font-mono text-slate-900">18</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold">SMS Delivered</span>
                  <p className="text-xl font-black font-mono text-emerald-950">12</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="text-[10px] text-blue-800 uppercase font-bold">Voice Sent</span>
                  <p className="text-xl font-black font-mono text-blue-950">4</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-[10px] text-amber-800 uppercase font-bold">Needs Follow-up</span>
                  <p className="text-xl font-black font-mono text-amber-950">2</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center pt-1">
                * Simulated delivery statistics for demonstration. Real integrations connect to state CDAC/NIC gateways.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 10 — HOW AGRIFLOW WORKS (HORIZONTAL CYCLE)            */}
      {/* ============================================================ */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-gov-800 uppercase tracking-wider">
              Technical Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              End-to-End Operational Intelligence Cycle
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              A closed-loop system connecting historical patterns, real-time gate telemetry, and farmer coordination.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5 text-center">
            {[
              { num: '1', title: 'Booking Data', desc: 'Ingests planned visits' },
              { num: '2', title: 'Validate Data', desc: 'Checks gate telemetry' },
              { num: '3', title: 'Predict Pressure', desc: 'Hourly inflow velocity' },
              { num: '4', title: 'Explain Risk', desc: '3 deterministic factors' },
              { num: '5', title: 'Simulate Shift', desc: 'Operator tests options' },
              { num: '6', title: 'Operator Sign-off', desc: 'Human approval' },
              { num: '7', title: 'Farmer Reach', desc: 'Multi-tier messaging' },
              { num: '8', title: 'Arrival Feedback', desc: 'Feeds back to model' }
            ].map((step, idx) => (
              <div key={idx} className="p-3 rounded-2xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="h-6 w-6 rounded-full bg-gov-800 text-white font-mono font-bold text-[11px] inline-flex items-center justify-center">
                  {step.num}
                </span>
                <h4 className="text-[11px] font-black text-slate-900 pt-1 leading-tight">{step.title}</h4>
                <p className="text-[10px] text-slate-500 leading-tight">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl max-w-lg mx-auto">
            ⟲ Feedback Loop: Actual arrival counts feed back continuously to refine future hourly forecasts.
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 11 & 12 — PRODUCT INTERFACE PREVIEWS                   */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-gov-800 uppercase tracking-wider">
            User Interface Design
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Tailored Experiences for Operators and Farmers
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* SECTION 11: OPERATOR DASHBOARD PREVIEW */}
          <div className="lg:col-span-7 rounded-3xl border-2 border-slate-300 bg-white p-5 shadow-gov space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Operator Dashboard</span>
                <h3 className="text-sm font-black text-slate-900">Singanallur Centre Operations</h3>
              </div>
              <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded text-slate-700">
                11:15 AM • Balwinder (Supervisor)
              </span>
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500">Queue:</span>
                <p className="text-base font-black font-mono text-slate-900">18 Vehicles</p>
              </div>
              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-[10px] text-rose-800">Expected:</span>
                <p className="text-base font-black font-mono text-rose-950">38 Arrivals</p>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] text-emerald-800">Processed:</span>
                <p className="text-base font-black font-mono text-emerald-950">42 Today</p>
              </div>
            </div>

            {/* Timeline Strip */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block mb-1.5">Arrival Pressure Timeline</span>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span>9 AM: 🟢 Low</span>
                <span>10 AM: 🟡 Moderate</span>
                <span className="font-bold text-rose-700">11 AM: 🔴 High</span>
                <span>2 PM: 🟢 Low</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={onExplorePlatform}
                className="flex-1 py-2 rounded-xl bg-gov-800 hover:bg-gov-900 text-white text-xs font-bold transition-colors text-center"
              >
                Launch Operator View →
              </button>
            </div>
          </div>

          {/* SECTION 12: FARMER MOBILE EXPERIENCE PREVIEW */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-[36px] border-4 border-slate-800 bg-white shadow-2xl p-4 space-y-3.5">
              {/* Phone Speaker Notch */}
              <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto"></div>

              {/* Mobile Screen Header */}
              <div className="bg-gov-900 text-white p-3 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black">வணக்கம் 👋</span>
                  <span className="text-[10px] bg-emerald-700 px-1.5 py-0.2 rounded font-bold">2G Online</span>
                </div>
                <p className="text-xs text-gov-200 font-semibold">Singanallur Procurement Centre</p>
              </div>

              {/* Mobile Crowd Card */}
              <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-3.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-black text-amber-950">
                  <span>🟡 MODERATE CROWD</span>
                  <button className="flex items-center gap-1 bg-amber-200 text-amber-950 px-2 py-0.5 rounded text-[10px] font-bold">
                    <Volume2 className="h-3 w-3" />
                    <span>Listen</span>
                  </button>
                </div>
                <p className="text-slate-600 leading-snug">
                  Waiting may take longer before noon.
                </p>
                <div className="pt-1.5 border-t border-amber-200 font-bold text-amber-950">
                  🕒 BEST TIME TO VISIT: After 2 PM
                </div>
              </div>

              {/* Mobile Booking Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">My Booking</span>
                <p className="font-mono font-black text-base text-slate-900">Token #1024</p>
                <p className="text-slate-600 text-[11px]">Tomorrow • 02:00 PM • Gate 2</p>
              </div>

              {/* Strict 4-Tab Bottom Navigation Bar */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-around text-[10px] font-bold text-slate-500">
                <span className="text-gov-800 font-black">Home</span>
                <span>Booking</span>
                <span>Alerts</span>
                <span>Help</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 13 — IMPACT (PROPOSED PILOT KPIS)                      */}
      {/* ============================================================ */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-gov-800 uppercase tracking-wider">
              Pilot Evaluation Metrics
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Measure coordination, not promises.
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              5 standardized impact categories designed for Mandi pilot evaluations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'EARLIER ALERTS', metric: '45–60 Mins', desc: 'Advance warning lead time provided to operators' },
              { label: 'FASTER ACTION', metric: '< 4 Mins', desc: 'Average warning-to-intervention dispatch time' },
              { label: 'ACCURACY', metric: 'Risk Tiers', desc: 'Peak detection compared against gate check-in logs' },
              { label: 'FARMER REACH', metric: '94% Reach', desc: 'Cross-channel delivery across App, SMS, Voice & Desk' },
              { label: 'QUEUE REDUCTION', metric: '-38 Mins', desc: 'Peak wait time slashed through balanced arrivals' }
            ].map((kpi, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-center">
                <span className="text-[10px] font-mono text-gov-800 bg-gov-100 px-2 py-0.5 rounded font-bold">
                  Proposed Pilot KPI
                </span>
                <p className="text-xl font-black font-mono text-slate-900">{kpi.metric}</p>
                <h4 className="text-xs font-black text-slate-800">{kpi.label}</h4>
                <p className="text-[11px] text-slate-500 leading-tight">{kpi.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 14 — FINAL CTA                                        */}
      {/* ============================================================ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Better coordination starts before farmers arrive.
        </h2>
        <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          AgriFlow helps agricultural procurement centres move from reactive queue management to proactive arrival coordination.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onExplorePlatform}
            className="py-3.5 px-8 rounded-2xl bg-gov-800 hover:bg-gov-900 text-white font-black text-sm shadow-md transition-all flex items-center gap-2"
          >
            <span>Explore AgriFlow</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={onExplorePlatform}
            className="py-3.5 px-6 rounded-2xl border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-xs transition-colors"
          >
            View Live Demo
          </button>
        </div>

        <p className="text-xs text-slate-400 font-mono pt-4">
          Smart India Hackathon 2026 • Government-Ready Procurement Flow Intelligence
        </p>
      </section>
    </div>
  );
};
