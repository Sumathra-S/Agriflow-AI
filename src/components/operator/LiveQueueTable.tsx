import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { MOCK_QUEUE_ITEMS } from '../../services/dataAdapter';
import { Tractor, Truck, CheckCircle2, Clock, Scale, AlertCircle } from 'lucide-react';

export const LiveQueueTable: React.FC = () => {
  const { currentQueue } = useSimulation();

  // Highlight status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AT_WEIGHBRIDGE':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
            <Scale className="h-3 w-3" /> Weighbridge 1
          </span>
        );
      case 'MOISTURE_TESTING':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">
            <Clock className="h-3 w-3" /> Moisture Desk
          </span>
        );
      case 'WAITING_ENTRY':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
            Gate 2 Queue
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-gov overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50/60">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-slate-900">
            Gate & Weighbridge Live Queue Log
          </h2>
          <p className="text-xs text-slate-500">
            Real-time vehicle check-in, moisture readings, and intake status
          </p>
        </div>
        <span className="font-mono text-xs font-bold bg-gov-100 text-gov-900 px-2.5 py-1 rounded border border-gov-200">
          {currentQueue} Vehicles in Queue
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-4 py-2.5">Token #</th>
              <th className="px-4 py-2.5">Farmer ID & Name</th>
              <th className="px-4 py-2.5">Vehicle Type</th>
              <th className="px-4 py-2.5">Crop & Qtl</th>
              <th className="px-4 py-2.5">Moisture (%)</th>
              <th className="px-4 py-2.5">Check-in Time</th>
              <th className="px-4 py-2.5">Current Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {MOCK_QUEUE_ITEMS.map(item => (
              <tr key={item.tokenNumber} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-gov-800 whitespace-nowrap">
                  {item.tokenNumber}
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900">{item.farmerName}</div>
                  <div className="font-mono text-[10px] text-slate-400">{item.farmerId}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="flex items-center gap-1 text-slate-700">
                    {item.vehicle.includes('Tractor') ? (
                      <Tractor className="h-3.5 w-3.5 text-gov-700" />
                    ) : (
                      <Truck className="h-3.5 w-3.5 text-slate-600" />
                    )}
                    {item.vehicle}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-medium text-slate-900">{item.crop}</span>
                  <span className="text-slate-500 ml-1">({item.estimatedWeightQtl} Qtl)</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`font-mono font-semibold px-1.5 py-0.5 rounded text-[11px] ${
                      item.moisturePercentage > 16.5
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    {item.moisturePercentage}%
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap font-mono">
                  {item.arrivalTime}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {getStatusBadge(item.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Moisture permissible threshold: &le; 17.0% (FCI Guidelines)</span>
        <span>Displaying active tokens at Gate 2 entrance</span>
      </div>
    </div>
  );
};
