import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { TrendingUp, Clock, Info, AlertCircle } from 'lucide-react';

export const ForecastChart: React.FC = () => {
  const { preset, capacityPerHour, farmerAdvisorySent } = useSimulation();

  // Dynamic forecast data reflecting presets and interventions
  const data = React.useMemo(() => {
    if (preset === 'NORMAL') {
      return [
        { time: '9 AM', expected: 8, actual: 8, isPeak: false, past: true },
        { time: '10 AM', expected: 11, actual: 10, isPeak: false, past: true },
        { time: '11 AM', expected: 14, actual: 13, isPeak: false, past: true },
        { time: '12 PM', expected: 15, actual: null, isPeak: false, past: false },
        { time: '1 PM', expected: 13, actual: null, isPeak: false, past: false },
        { time: '2 PM', expected: 10, actual: null, isPeak: false, past: false }
      ];
    }
    if (preset === 'RECOVERY') {
      return [
        { time: '9 AM', expected: 14, actual: 14, isPeak: false, past: true },
        { time: '10 AM', expected: 24, actual: 22, isPeak: false, past: true },
        { time: '11 AM', expected: 38, actual: 36, isPeak: true, past: true },
        { time: '12 PM', expected: 26, actual: 24, isPeak: false, past: true },
        { time: '1 PM', expected: 18, actual: null, isPeak: false, past: false },
        { time: '2 PM', expected: 12, actual: null, isPeak: false, past: false }
      ];
    }

    // HIGH_CONGESTION state
    const peakDemand = farmerAdvisorySent ? 34 : 48; // advisory reduces peak by shifting arrivals
    const nextDemand = farmerAdvisorySent ? 32 : 41;

    return [
      { time: '9 AM', expected: 12, actual: 12, isPeak: false, past: true },
      { time: '10 AM', expected: 22, actual: 20, isPeak: false, past: true },
      { time: '11 AM', expected: 36, actual: 34, isPeak: false, past: true },
      { time: '12 PM', expected: peakDemand, actual: null, isPeak: true, past: false }, // Predicted Peak!
      { time: '1 PM', expected: nextDemand, actual: null, isPeak: true, past: false },
      { time: '2 PM', expected: 22, actual: null, isPeak: false, past: false }
    ];
  }, [preset, farmerAdvisorySent]);

  const maxScale = 55;
  const capacity = capacityPerHour;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-gov">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            Expected Arrival Pattern
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hourly farmer arrival forecast vs effective processing threshold
          </p>
        </div>

        {/* Predicted Peak Badge */}
        {preset !== 'NORMAL' && (
          <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-rose-100 border border-rose-300 px-3 py-1 text-xs font-bold text-rose-800">
            <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping"></span>
            <span>Predicted Peak: 12:00 PM – 1:00 PM</span>
          </div>
        )}
      </div>

      {/* Legend & Capacity Threshold Indicator */}
      <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-xs bg-gov-800"></span>
            <span>Actual Arrivals (Recorded)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-xs bg-gov-600/70 border border-dashed border-gov-800"></span>
            <span>Expected Arrivals (Forecast)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-rose-600 border-t-2 border-dashed border-rose-600"></span>
            <span>Capacity Limit ({capacity}/hr)</span>
          </span>
        </div>

        <span className="text-[11px] text-slate-500 font-mono">
          Last updated: 11:15 AM
        </span>
      </div>

      {/* Visual Bar Chart */}
      <div className="mt-6">
        <div className="relative h-56 w-full pt-6 pb-2 border-b border-slate-300">
          {/* Capacity Horizontal Guideline */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-rose-500 z-10 flex items-center justify-between pointer-events-none"
            style={{ bottom: `${(capacity / maxScale) * 100}%` }}
          >
            <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-rose-200">
              Capacity: {capacity}/hr
            </span>
            <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-rose-200">
              Overload Threshold
            </span>
          </div>

          {/* Bars Column Grid */}
          <div className="grid grid-cols-6 h-full items-end gap-2 sm:gap-6 px-2">
            {data.map((item, idx) => {
              const heightPercent = (item.expected / maxScale) * 100;
              const isOverCapacity = item.expected > capacity;

              return (
                <div key={item.time} className="h-full flex flex-col justify-end items-center group relative">
                  {/* Top Peak Tag for 12 PM */}
                  {item.isPeak && (
                    <div className="absolute -top-7 transform -translate-y-1 bg-rose-700 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap z-20">
                      ★ Peak
                    </div>
                  )}

                  {/* Value callout above bar */}
                  <span className={`text-[11px] font-bold mb-1 ${
                    isOverCapacity ? 'text-rose-700' : 'text-slate-700'
                  }`}>
                    {item.expected}
                  </span>

                  {/* Bar container */}
                  <div className="w-full max-w-[48px] rounded-t-sm flex flex-col justify-end overflow-hidden transition-all duration-300">
                    {/* If actual is available, show actual vs expected */}
                    {item.actual !== null ? (
                      <div
                        className="w-full bg-gov-800 rounded-t-sm hover:opacity-90 transition-all"
                        style={{ height: `${heightPercent * 2}px` }}
                        title={`${item.time}: Actual ${item.actual} arrivals`}
                      />
                    ) : (
                      <div
                        className={`w-full rounded-t-sm border border-b-0 transition-all ${
                          item.isPeak
                            ? 'bg-rose-600/90 border-rose-700 hover:bg-rose-700'
                            : isOverCapacity
                            ? 'bg-amber-600/80 border-amber-700 hover:bg-amber-700'
                            : 'bg-gov-600/80 border-gov-700 hover:bg-gov-700'
                        }`}
                        style={{ height: `${heightPercent * 2}px` }}
                        title={`${item.time}: Forecast ${item.expected} farmers`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="grid grid-cols-6 text-center text-xs font-semibold text-slate-600 pt-2 px-2">
          {data.map(item => (
            <div key={item.time} className="flex flex-col items-center">
              <span className={item.isPeak ? 'text-rose-700 font-bold' : ''}>{item.time}</span>
              <span className="text-[10px] text-slate-500 font-normal">
                {item.past ? 'Recorded' : 'Forecast'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Explanatory footer note */}
      <div className="mt-4 rounded-md bg-slate-50 p-2.5 text-xs text-slate-600 flex items-start gap-2 border border-slate-200">
        <Info className="h-4 w-4 text-gov-700 flex-shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold text-slate-800">Forecast Insight:</span> The predicted peak at 12:00 PM represents a convergence of morning harvesters and scheduled mid-day tokens.
          {farmerAdvisorySent && ' Dispatched farmer advisory is successfully shifting ~14 farmers to the 1:30 PM post-peak window.'}
        </p>
      </div>
    </div>
  );
};
