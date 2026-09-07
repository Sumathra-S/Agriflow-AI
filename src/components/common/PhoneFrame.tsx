import React from 'react';
import { Smartphone, Maximize2 } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  onExitFrame?: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, onExitFrame }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-900/5 dark:bg-slate-950/60 min-h-[calc(100vh-140px)] transition-colors">
      <div className="mb-3 flex items-center justify-between w-full max-w-[400px] text-xs text-slate-600 dark:text-slate-400 font-medium">
        <span className="flex items-center gap-1">
          <Smartphone className="h-4 w-4 text-gov-700 dark:text-emerald-400" />
          Farmer Smartphone Viewport (390 × 844 px)
        </span>
        {onExitFrame && (
          <button
            onClick={onExitFrame}
            className="flex items-center gap-1 hover:text-gov-800 dark:hover:text-emerald-400 text-slate-700 dark:text-slate-300 underline"
          >
            <Maximize2 className="h-3 w-3" />
            Full Width View
          </button>
        )}
      </div>

      {/* Realistic smartphone bezel */}
      <div className="w-full max-w-[400px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50">
        {/* Dynamic Island / Speaker Notch */}
        <div className="relative mx-auto mb-2 h-4 w-28 rounded-full bg-black flex items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-slate-900 mr-2"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-slate-900 border border-slate-800"></span>
        </div>

        {/* Screen container */}
        <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-inner max-h-[760px] overflow-y-auto">
          {children}
        </div>

        {/* Bottom home indicator bar */}
        <div className="mx-auto mt-2 h-1 w-28 rounded-full bg-slate-600"></div>
      </div>
    </div>
  );
};
