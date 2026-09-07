import React, { useState } from 'react';
import { useSimulation, DEMO_STEPS } from '../../context/SimulationContext';
import { useAuth } from '../../context/AuthContext';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  CheckCircle2,
  Sparkles,
  Info,
  Layers
} from 'lucide-react';
import { ArchitectureDemoModal } from './ArchitectureDemoModal';

interface DemoToolbarProps {
  isPhoneFrameMode?: boolean;
  onTogglePhoneFrame?: () => void;
}

export const DemoToolbar: React.FC<DemoToolbarProps> = ({
  isPhoneFrameMode = false,
  onTogglePhoneFrame
}) => {
  const {
    preset,
    setPreset,
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    isPlaying,
    toggleAutoPlay,
    resetSimulation
  } = useSimulation();

  const { role, setRole } = useAuth();
  const [isArchModalOpen, setIsArchModalOpen] = useState<boolean>(false);
  const currentStepData = DEMO_STEPS[currentStep - 1] || DEMO_STEPS[0];

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Top line: Scenario Presets & Auto-Play */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Hackathon Preset Switchers */}
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-slate-400 text-[11px] flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Hackathon Demo:
            </span>
            <div className="flex rounded-md bg-slate-800 p-0.5 border border-slate-700">
              <button
                onClick={() => setPreset('NORMAL')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  preset === 'NORMAL'
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                🟢 NORMAL (Q:8, Low)
              </button>
              <button
                onClick={() => setPreset('HIGH_CONGESTION')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  preset === 'HIGH_CONGESTION'
                    ? 'bg-rose-700 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                🔴 HIGH CONGESTION (Q:23, High)
              </button>
              <button
                onClick={() => setPreset('RECOVERY')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  preset === 'RECOVERY'
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                🟡 RECOVERY (Q:12, Med)
              </button>
            </div>
          </div>

          {/* Stepper Controls & Auto-Play */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-800 rounded-md border border-slate-700 p-0.5">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30 transition-opacity"
                title="Previous Demo Step"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="px-2 font-mono font-bold text-slate-200 text-xs">
                Step {currentStep} of 8
              </span>

              <button
                onClick={nextStep}
                disabled={currentStep === 8}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30 transition-opacity"
                title="Next Demo Step"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={toggleAutoPlay}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium border text-xs transition-colors ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold animate-pulse'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
              title={isPlaying ? 'Pause Auto-Play' : 'Start Auto Simulation Walkthrough'}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" />
                  <span>Pause Demo</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Auto Walkthrough</span>
                </>
              )}
            </button>

            {/* Architecture & Demo Flow Modal Trigger */}
            <button
              onClick={() => setIsArchModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded font-bold border border-emerald-500/80 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs transition-colors shadow-xs"
              title="Inspect Complete Modular Architecture & 8 Demo Scenes for Judges"
            >
              <Layers className="h-3.5 w-3.5 text-emerald-300" />
              <span>🏛️ Architecture & Demo</span>
            </button>

            {/* Mobile Phone Simulator Toggle */}
            {onTogglePhoneFrame && (
              <button
                onClick={onTogglePhoneFrame}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium border text-xs transition-colors ${
                  isPhoneFrameMode
                    ? 'bg-gov-700 text-white border-gov-600'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title="Toggle Smartphone Bezel Frame for Farmer Mobile View"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Phone Frame</span>
              </button>
            )}

            <button
              onClick={resetSimulation}
              className="p-1 text-slate-400 hover:text-white rounded border border-slate-700 hover:bg-slate-800 transition-colors"
              title="Reset Simulation"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom narrative line: Context for current step */}
        <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-emerald-400 flex-shrink-0">
              {currentStepData.title}:
            </span>
            <span className="text-slate-300 truncate">
              {currentStepData.description}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            <span className="text-slate-400 text-[10px]">Suggested View:</span>
            <button
              onClick={() => setRole(currentStepData.recommendedView)}
              className={`text-[11px] px-1.5 py-0.5 rounded font-bold underline ${
                role === currentStepData.recommendedView ? 'text-emerald-400' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              Switch to {currentStepData.recommendedView} →
            </button>
          </div>
        </div>
      </div>

      {/* Architecture & Demo Flow Modal Dialog */}
      <ArchitectureDemoModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />
    </div>
  );
};
