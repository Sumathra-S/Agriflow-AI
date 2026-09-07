import React, { useState, useEffect } from 'react';
import { smartArrivalEngine } from '../../services/engine/smartArrivalEngine';
import { SmartArrivalGuidance } from '../../types/procurement';
import { useLanguage } from '../../context/LanguageContext';
import { voiceService } from '../../services/voiceService';
import {
  Ticket,
  Clock,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Play,
  Volume2,
  Bell,
  RefreshCw,
  MapPin,
  Truck
} from 'lucide-react';

interface MyQueueScreenProps {
  tokenNumber?: string;
  onProceedToCentre?: () => void;
}

export const MyQueueScreen: React.FC<MyQueueScreenProps> = ({
  tokenNumber = 'AF-108',
  onProceedToCentre
}) => {
  const { language } = useLanguage();
  const [guidance, setGuidance] = useState<SmartArrivalGuidance>(
    smartArrivalEngine.getGuidance()
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [justUpdated, setJustUpdated] = useState<boolean>(false);

  useEffect(() => {
    return smartArrivalEngine.subscribe(updated => {
      setGuidance(updated);
      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2000);
    });
  }, []);

  const handleAdvance = () => {
    smartArrivalEngine.advanceQueue();
  };

  const handleSimulateDelay = () => {
    smartArrivalEngine.simulateDelay(15);
  };

  const handleReset = () => {
    smartArrivalEngine.resetGuidance();
  };

  const handleSpeak = () => {
    let text = '';
    if (guidance.countdownAhead === 0) {
      text = `Attention Ravi Kumar. Token ${tokenNumber}. It is your turn now! Please proceed immediately to Weighbridge Number 1 at Singanallur Centre.`;
    } else {
      text = `Token ${tokenNumber}. There are ${guidance.countdownAhead} farmers ahead of you. Recommended departure time is ${guidance.recommendedDepartureTime}. Estimated service time is ${guidance.expectedServiceTime}.`;
    }

    setIsSpeaking(true);
    voiceService.speak(
      text,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const isYourTurn = guidance.countdownAhead === 0;

  return (
    <div className="space-y-4">
      {/* 1. Main Live Queue Card */}
      <div className={`rounded-2xl border p-5 shadow-md transition-all ${
        isYourTurn
          ? 'bg-gradient-to-br from-emerald-700 to-green-900 text-white border-emerald-500 animate-pulse'
          : 'bg-white text-slate-900 border-slate-200'
      }`}>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Ticket className={`h-5 w-5 ${isYourTurn ? 'text-white' : 'text-gov-700'}`} />
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                isYourTurn ? 'text-emerald-200' : 'text-slate-400'
              }`}>
                Live Virtual Queue
              </span>
              <h2 className="text-sm font-black">Singanallur APMC Centre (Centre C)</h2>
            </div>
          </div>
          <button
            onClick={handleSpeak}
            className={`p-2 rounded-xl border transition-colors ${
              isSpeaking
                ? 'bg-amber-400 text-slate-900 border-amber-500'
                : isYourTurn
                ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Read queue status aloud"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>

        {/* Tokens Row */}
        <div className="grid grid-cols-2 gap-4 my-4 py-2">
          {/* Now Serving */}
          <div className={`rounded-xl p-3 border ${
            isYourTurn ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${
              isYourTurn ? 'text-emerald-200' : 'text-slate-500'
            }`}>
              Now Serving
            </span>
            <span className={`text-2xl font-black font-mono tracking-tight ${
              isYourTurn ? 'text-white' : 'text-slate-800'
            }`}>
              {isYourTurn ? tokenNumber : 'AF-098'}
            </span>
            <span className={`text-[10px] block mt-0.5 ${
              isYourTurn ? 'text-emerald-200' : 'text-slate-500'
            }`}>
              Weighbridge #1
            </span>
          </div>

          {/* Your Token */}
          <div className={`rounded-xl p-3 border text-right ${
            isYourTurn ? 'bg-white/20 border-white/40' : 'bg-gov-50 border-gov-200'
          }`}>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${
              isYourTurn ? 'text-white' : 'text-gov-800'
            }`}>
              Your Token
            </span>
            <span className={`text-2xl font-black font-mono tracking-tight ${
              isYourTurn ? 'text-emerald-200' : 'text-gov-900'
            }`}>
              {tokenNumber}
            </span>
            <span className={`text-[10px] font-bold block mt-0.5 ${
              isYourTurn ? 'text-white' : 'text-gov-700'
            }`}>
              Ravi Kumar (Singanallur)
            </span>
          </div>
        </div>

        {/* Countdown Ahead Display */}
        <div className={`rounded-xl p-4 text-center my-3 border ${
          isYourTurn
            ? 'bg-white/15 border-white/30'
            : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}>
          {isYourTurn ? (
            <div className="space-y-1">
              <span className="text-2xl font-black tracking-wide block">🔔 IT IS YOUR TURN!</span>
              <p className="text-xs text-emerald-100">
                Gate 2 opened. Drive tractor trolley onto Weighbridge #1 immediately.
              </p>
            </div>
          ) : (
            <div>
              <span className="text-3xl font-black font-mono text-amber-700">
                {guidance.countdownAhead ?? guidance.farmersAhead}
              </span>
              <span className="text-xs font-black uppercase text-amber-900 block mt-0.5">
                Farmers Ahead of You in Line
              </span>
              <p className="text-[11px] text-amber-800 mt-1">
                Estimated wait time: <strong className="font-mono">~{(guidance.countdownAhead ?? guidance.farmersAhead) * 3} minutes</strong>
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Delay Alert if active */}
        {guidance.conditionsChanged && (
          <div className="bg-amber-100 border border-amber-300 rounded-xl p-3 my-3 text-xs text-amber-950 flex items-start gap-2 animate-bounce">
            <AlertTriangle className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Notice: Schedule Recalculated (+15m delay)</span>
              <span>Weighbridge slow turnaround detected. Your departure time has been automatically adjusted.</span>
            </div>
          </div>
        )}

        {/* Smart Arrival Guidance Box */}
        <div className={`rounded-xl p-4 border space-y-2.5 ${
          isYourTurn ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold">
              <Navigation className={`h-4 w-4 ${isYourTurn ? 'text-white' : 'text-gov-700'}`} />
              Recommended Departure Time
            </span>
            <span className={`text-base font-black font-mono ${
              isYourTurn ? 'text-emerald-200' : 'text-gov-900'
            }`}>
              {guidance.recommendedDepartureTime}
            </span>
          </div>

          <p className={`text-[11px] ${isYourTurn ? 'text-emerald-100' : 'text-slate-600'}`}>
            💡 Leave your farm around <strong>{guidance.recommendedDepartureTime}</strong>. Includes{' '}
            {guidance.travelDurationMinutes} min tractor travel from Singanallur + {guidance.safetyBufferMinutes} min buffer.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/40 text-[11px]">
            <div>
              <span className="text-slate-500 block">Expected Service:</span>
              <strong className="font-mono">{guidance.expectedServiceTime}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Distance:</span>
              <strong className="font-mono">8.5 km (Singanallur)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SIH Evaluator Interactive Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            SIH Grand Finale Evaluator Controls
          </span>
          <button
            onClick={handleReset}
            className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" /> Reset Queue
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Simulate real-time centre operations to evaluate queue countdown and dynamic arrival adjustments:
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleAdvance}
            className="bg-gov-800 hover:bg-gov-900 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Advance Queue (-1 Ahead)</span>
          </button>

          <button
            onClick={handleSimulateDelay}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Simulate Delay (+15m)</span>
          </button>
        </div>

        <div className="bg-slate-50 rounded-lg p-2.5 text-[11px] text-slate-500 border border-slate-200 font-mono">
          State: Token {tokenNumber} | Stage: {isYourTurn ? 'SERVING_NOW' : 'WAITING_IN_LINE'} | Mode: DYNAMIC_ETA
        </div>
      </div>
    </div>
  );
};
