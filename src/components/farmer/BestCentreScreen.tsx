import React, { useState } from 'react';
import { quantityDemandEngine } from '../../services/engine/quantityDemandEngine';
import {
  Building2,
  MapPin,
  Clock,
  Scale,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Info,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface BestCentreScreenProps {
  onSelectCentre: (centreId: string) => void;
}

export const BestCentreScreen: React.FC<BestCentreScreenProps> = ({ onSelectCentre }) => {
  const [selectedVillage, setSelectedVillage] = useState<string>('Singanallur');
  const [quantityKg, setQuantityKg] = useState<number>(2000);

  const recommendation = quantityDemandEngine.recommendBestCentre(
    selectedVillage,
    quantityKg,
    'FEWEST_FARMERS'
  );

  const centreC = quantityDemandEngine.getCentreMetrics('centre-c');
  const centreB = quantityDemandEngine.getCentreMetrics('centre-b');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Explainable AI Recommendation
            </span>
            <h2 className="text-base font-black text-slate-900 mt-1">Best Procurement Centre</h2>
            <p className="text-xs text-slate-500">Based on travel distance, live queue, and tonnes capacity</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-1 rounded font-bold">
              AI MODEL v2.6
            </span>
          </div>
        </div>

        {/* Input selectors */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div>
            <label className="font-bold text-slate-600 block mb-1">Your Village</label>
            <select
              value={selectedVillage}
              onChange={e => setSelectedVillage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800"
            >
              <option value="Singanallur">Singanallur</option>
              <option value="Sulur">Sulur</option>
              <option value="Ondipudur">Ondipudur</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">Crop Load (kg)</label>
            <select
              value={quantityKg}
              onChange={e => setQuantityKg(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800"
            >
              <option value="1000">1,000 kg (1 Tonne)</option>
              <option value="2000">2,000 kg (2 Tonnes)</option>
              <option value="5000">5,000 kg (5 Tonnes)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommended Choice Highlight */}
      <div className="bg-gradient-to-br from-emerald-800 to-gov-900 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Top Pick for You
          </span>
          <span className="text-xs font-mono text-emerald-200 font-semibold">
            Save ~25 mins waiting
          </span>
        </div>

        <h3 className="text-xl font-black">{recommendation.recommendedCentre.centreName}</h3>
        <p className="text-xs text-emerald-100/80 flex items-center gap-1 mt-0.5">
          <MapPin className="h-3.5 w-3.5" />
          {recommendation.recommendedCentre.location} • 8.5 km distance
        </p>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
          <div className="bg-white/10 rounded-xl p-2 backdrop-blur-sm">
            <span className="text-[10px] text-emerald-200 block font-semibold">Queue Count</span>
            <span className="text-base font-black font-mono">
              {recommendation.recommendedCentre.farmerCount} Farmers
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-2 backdrop-blur-sm">
            <span className="text-[10px] text-emerald-200 block font-semibold">Free Capacity</span>
            <span className="text-base font-black font-mono">
              {recommendation.recommendedCentre.remainingCapacityTonnes.toFixed(0)}t Left
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-2 backdrop-blur-sm">
            <span className="text-[10px] text-emerald-200 block font-semibold">Est. Wait</span>
            <span className="text-base font-black font-mono">~18 mins</span>
          </div>
        </div>

        {/* Plain Language Reason */}
        <div className="mt-4 bg-emerald-950/50 border border-emerald-400/20 rounded-xl p-3 text-xs text-emerald-100">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-emerald-300 flex-shrink-0 mt-0.5" />
            <p>{recommendation.explanation}</p>
          </div>
        </div>

        <button
          onClick={() => onSelectCentre(recommendation.recommendedCentre.centreId)}
          className="w-full mt-4 bg-emerald-400 hover:bg-emerald-300 text-gov-950 font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          Book Slot at {recommendation.recommendedCentre.centreName} <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Centres in Your Cluster Comparison
        </h4>

        {/* Centre C Card */}
        {centreC && (
          <div className="border border-slate-200 rounded-xl p-3 hover:border-slate-300 transition-all bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-900">{centreC.centreName}</h5>
                <p className="text-[11px] text-slate-500">Primary Hub • 8.5 km from Singanallur</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                centreC.congestionState === 'NEAR_CAPACITY'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {centreC.congestionState.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">Queue</span>
                <span className="font-bold text-slate-800">{centreC.farmerCount} trolleys</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Capacity</span>
                <span className="font-bold text-slate-800">{centreC.capacityTonnes}t ({centreC.quantityUtilizationPct}%)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Predicted Walk-in</span>
                <span className="font-bold text-slate-800 font-mono">+{centreC.predictedWalkInQuantityTonnes}t</span>
              </div>
            </div>
          </div>
        )}

        {/* Centre B Card */}
        {centreB && (
          <div className="border border-slate-200 rounded-xl p-3 hover:border-slate-300 transition-all bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-900">{centreB.centreName}</h5>
                <p className="text-[11px] text-slate-500">Alternative Hub • 14.2 km (Low Traffic Bypass)</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                LOW CONGESTION
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">Queue</span>
                <span className="font-bold text-slate-800">{centreB.farmerCount} trolleys</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Capacity</span>
                <span className="font-bold text-slate-800">{centreB.capacityTonnes}t ({centreB.remainingCapacityTonnes.toFixed(0)}t free)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Predicted Walk-in</span>
                <span className="font-bold text-slate-800 font-mono">+{centreB.predictedWalkInQuantityTonnes}t</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data Source Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500 flex items-center justify-between font-mono">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          PREDICTED DATA: 25% Historical Walk-In Model
        </span>
        <span>FCI / APMC Guidelines</span>
      </div>
    </div>
  );
};
