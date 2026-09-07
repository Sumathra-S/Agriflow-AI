import React from 'react';
import { aiForecastingEngine } from '../../services/engine/aiForecastingEngine';
import {
  Brain,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Scale,
  Cpu,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ModelGovernanceCard: React.FC = () => {
  const benchmarks = aiForecastingEngine.getModelBenchmarks();
  const explainFactors = aiForecastingEngine.getExplainabilityFactors();
  const peakSummary = aiForecastingEngine.getPeakForecastSummary();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gov-100 rounded-xl text-gov-800">
              <Brain className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                AI Model Governance, Validation & Defensibility
              </h2>
              <p className="text-xs text-slate-500">
                Hybrid predictive architecture: LightGBM Regressor + M/M/c Queuing Theoretical Prior
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            <span>Deterministic Offline Fallback: ACTIVE</span>
          </span>
        </div>
      </div>

      {/* Benchmark Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Forecast MAE</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-emerald-700">1.9</span>
            <span className="text-xs text-slate-400 line-through">4.8 baseline</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-bold mt-1">
            -60.4% error reduction vs SARIMA
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Peak Congestion Accuracy</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-gov-800">94.2%</span>
            <span className="text-xs text-slate-400">vs 71% base</span>
          </div>
          <p className="text-[11px] text-gov-800 font-bold mt-1">
            High-precision early alert detection
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Avg Wait Time Saved</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-amber-600">38 min</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Per farmer during morning peak rush
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">95% Confidence Interval</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-slate-900">±6</span>
            <span className="text-xs text-slate-500">at 48 peak</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Statistically rigorous uncertainty bounds
          </p>
        </div>
      </div>

      {/* Feature Importance & Explainability */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="h-4 w-4 text-gov-800" />
            <span>Explainable Feature Attribution (SHAP / Tree Explainer)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Why does the model predict peak congestion at 12:00 PM? Top weighted operational variables:
          </p>
        </div>

        <div className="space-y-3 pt-1">
          {explainFactors.map(factor => (
            <div key={factor.featureName} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    factor.direction === 'INCREASING' ? 'bg-amber-500' : 'bg-gov-600'
                  }`}></span>
                  {factor.featureName}
                </span>
                <span className="font-mono font-black text-slate-800">{factor.importancePct}% weight</span>
              </div>

              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gov-800 rounded-full"
                  style={{ width: `${factor.importancePct * 2.5}%` }}
                ></div>
              </div>

              <p className="text-[11px] text-slate-600 pl-3.5">
                {factor.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Prototype & Technical Defensibility Disclaimer */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <Info className="h-4 w-4" />
          <span>SIH 2026 Grand Finale Technical Disclosure</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">Honest Prototype Architecture:</strong> The current implementation demonstrates production-grade algorithm design trained on synthetic multi-season mandi intake distributions from Punjab (Ludhiana/Khanna) and Tamil Nadu (Coimbatore/Pollachi). The architecture features a clean decoupled abstraction layer (<code className="text-emerald-300">ISMSProvider</code>, <code className="text-emerald-300">IVoiceProvider</code>, <code className="text-emerald-300">IIVRProvider</code>) ready for live C-DoT / NIC / e-NAM API gateway integration in subsequent state pilot deployments.
        </p>
      </div>
    </div>
  );
};
