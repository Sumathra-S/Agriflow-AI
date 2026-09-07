import React, { useState, useEffect } from 'react';
import {
  Wheat,
  Scale,
  Brain,
  Compass,
  Ticket,
  Truck,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Sparkles,
  Clock,
  Play,
  RotateCcw
} from 'lucide-react';

interface VisualFarmerJourneyProps {
  isDark?: boolean;
}

export const VisualFarmerJourney: React.FC<VisualFarmerJourneyProps> = ({ isDark = false }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const steps = [
    {
      id: 'farm',
      num: '01',
      title: 'Farm Produce Preparation',
      short: 'FARM',
      icon: <Wheat className="h-5 w-5" />,
      tagline: 'Farmer prepares harvest',
      desc: 'Farmer Ravi Kumar harvests Grade-A Paddy and performs initial threshing and drying on the threshing floor.',
      stat: 'Crop: Paddy (Grade A)',
      badge: 'Step 1 of 8',
      preview: {
        title: 'Farm Origin: Singanallur Village',
        details: ['3.5 Acres Landholding', 'Moisture target: ≤ 14.0%', 'Ready for APMC intake']
      }
    },
    {
      id: 'harvest',
      num: '02',
      title: 'Harvest Quantity Entry',
      short: 'HARVEST',
      icon: <Scale className="h-5 w-5" />,
      tagline: 'Accurate weight entered in tonnes',
      desc: 'Farmer enters exact produce weight (1,000 kg / 1.0 Metric Tonne) to prevent weighbridge bottleneck surprises.',
      stat: '1,000 kg (1.00 Tonne)',
      badge: 'Quantity-Aware',
      preview: {
        title: 'Load Specification',
        details: ['Vehicle: Tractor Trolley', 'Gross Estimate: 1.0t', 'MSP Value: ₹23,000']
      }
    },
    {
      id: 'intelligence',
      num: '03',
      title: 'AgriFlow Engine Analysis',
      short: 'ENGINE',
      icon: <Brain className="h-5 w-5" />,
      tagline: 'Multi-factor capacity evaluation',
      desc: 'AgriFlow evaluates 12 mandis simultaneously, factoring booked volume, current queues, and +25% predicted unbooked walk-ins.',
      stat: '90t Expected @ Centre C',
      badge: 'Predictive Intelligence',
      preview: {
        title: 'Real-Time Inputs',
        details: ['72t Booked Volume', '+18t Predicted Walk-In', 'Weighbridge: 18t/hr intake']
      }
    },
    {
      id: 'centre',
      num: '04',
      title: 'Optimal Centre Match',
      short: 'SMART CENTRE',
      icon: <Compass className="h-5 w-5" />,
      tagline: 'Explainable recommendation',
      desc: 'Recommends Singanallur Hub (Centre C) with 10t free headroom and ~18 min wait, saving 40 minutes over congested yards.',
      stat: 'Centre C: 8.5 km away',
      badge: 'Explainable Match',
      preview: {
        title: 'Why Centre C?',
        details: ['Save ~25 mins wait', 'Direct bypass from Singanallur', 'Dedicated 60t scale']
      }
    },
    {
      id: 'token',
      num: '05',
      title: 'Virtual Queue Token Issued',
      short: 'VIRTUAL QUEUE',
      icon: <Ticket className="h-5 w-5" />,
      tagline: 'Guaranteed slot reservation',
      desc: 'Farmer receives Token AF-108 with zero standing in line. Delivered via Smartphone, SMS, or automated voice IVR call.',
      stat: 'Token #AF-108',
      badge: 'Multimodal Delivery',
      preview: {
        title: 'Token Reservation',
        details: ['Time Slot: 11:30 AM–12:30 PM', 'Queue Position: 8 ahead', 'SMS confirmation sent']
      }
    },
    {
      id: 'arrival',
      num: '06',
      title: 'Dynamic Smart Arrival',
      short: 'SMART ARRIVAL',
      icon: <Truck className="h-5 w-5" />,
      tagline: 'Personalized departure alert',
      desc: '"Leave your farm at 10:40 AM." Departure time is automatically recalculated if an earlier tractor trolley takes longer to unload.',
      stat: 'Departure: 10:40 AM',
      badge: 'Dynamic ETA',
      preview: {
        title: 'Travel Guidance',
        details: ['35 min tractor journey', '15 min safety buffer', 'Gate 2 Priority Access']
      }
    },
    {
      id: 'procurement',
      num: '07',
      title: 'Intake & Certified Weighing',
      short: 'PROCUREMENT',
      icon: <CheckCircle2 className="h-5 w-5" />,
      tagline: 'Fast 15-minute turnaround',
      desc: 'Vehicle drives onto Weighbridge #1. Certified tare & gross weights recorded. Moisture meter validates 13.2% (Grade-A passed).',
      stat: 'Net Weight: 1,000 kg',
      badge: 'FCI Specifications',
      preview: {
        title: 'Weighment Slip',
        details: ['Gross: 7,800 kg', 'Tare: 3,800 kg', 'Moisture: 13.2% Passed']
      }
    },
    {
      id: 'payment',
      num: '08',
      title: 'PFMS Direct Benefit Transfer',
      short: 'PAYMENT',
      icon: <CreditCard className="h-5 w-5" />,
      tagline: 'Guaranteed MSP payout',
      desc: 'Form J generated and ₹23,000 net proceeds dispatched directly to the farmer\'s Aadhaar-linked State Bank of India account.',
      stat: '₹23,000.00 Credited',
      badge: 'Aadhaar Seeded',
      preview: {
        title: 'PFMS Payout Voucher',
        details: ['Rate: ₹23.00 / kg', 'Zero Deductions', 'UTR: PFMS-2026-8831920']
      }
    }
  ];

  // Auto-advance every 3.5 seconds if isPlaying
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const current = steps[activeStep];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          The End-to-End AgriFlow Journey
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Farm → Farmer → Procurement Centre → Smart Queue → Payment
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          How AgriFlow transforms stressful hours waiting on dusty highway shoulders into a predictable, dignified procurement process.
        </p>
      </div>

      {/* Horizontal Step Flow Bar */}
      <div className="overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center justify-between min-w-[760px] gap-2 px-2">
          {steps.map((s, idx) => (
            <React.Fragment key={s.id}>
              <button
                onClick={() => {
                  setActiveStep(idx);
                  setIsPlaying(false);
                }}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  activeStep === idx
                    ? 'scale-105 ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200'
                    : 'opacity-70 hover:opacity-100 text-slate-500 dark:text-slate-400'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs transition-colors ${
                    activeStep === idx
                      ? 'bg-gov-800 text-white dark:bg-emerald-600'
                      : idx < activeStep
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {s.icon}
                </div>
                <span className="text-[10px] font-mono font-bold">{s.num}</span>
                <span className="text-[10px] font-black uppercase whitespace-nowrap">{s.short}</span>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 transition-all ${
                    idx < activeStep
                      ? 'bg-emerald-500'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Dynamic Interactive Stage Spotlight Card */}
      <div
        className={`rounded-3xl border-2 p-6 sm:p-8 transition-all shadow-xl ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Stage Explanation */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-gov-100 text-gov-800 dark:bg-emerald-950 dark:text-emerald-300 border border-gov-200 dark:border-emerald-800">
                {current.badge}
              </span>
              <span className="text-xs font-mono text-slate-400">Step {current.num} of 08</span>
            </div>

            <h3 className="text-2xl font-black tracking-tight">{current.title}</h3>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {current.tagline}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {current.desc}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div
                className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
                  Key Metric
                </span>
                <span className="text-base font-black font-mono text-gov-800 dark:text-emerald-300">
                  {current.stat}
                </span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`text-xs font-bold px-3 py-2 rounded-xl border flex items-center gap-1.5 transition-colors ${
                    isPlaying
                      ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <Play className={`h-3.5 w-3.5 ${isPlaying ? 'fill-current' : ''}`} />
                  <span>{isPlaying ? 'Pause' : 'Auto-Play'}</span>
                </button>
                <button
                  onClick={() => setActiveStep((activeStep + 1) % steps.length)}
                  className="bg-gov-800 hover:bg-gov-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <span>Next Step</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Visual Artifact Preview */}
          <div className="lg:col-span-5">
            <div
              className={`rounded-2xl border p-5 space-y-3 shadow-md ${
                isDark
                  ? 'bg-slate-950/80 border-emerald-900/50'
                  : 'bg-gradient-to-br from-emerald-50 to-gov-50 border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between border-b border-emerald-200/50 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-black">{current.preview.title}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                  VERIFIED RECORD
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {current.preview.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-lg border ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{detail}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono text-center">
                ● Connected to AgriFlow Core State Machine
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
