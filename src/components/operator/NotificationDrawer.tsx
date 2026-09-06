import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { X, Bell } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { alerts, dismissAlert } = useSimulation();

  if (!isOpen) return null;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping"></span>;
      case 'MEDIUM':
        return <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>;
      case 'LOW':
        return <span className="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>;
      default:
        return <span className="h-2.5 w-2.5 rounded-full bg-blue-600"></span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-gov-900 text-white">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-emerald-300" />
            <h2 className="text-sm font-bold tracking-wide">Procurement Flow Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-gov-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.map(alert => (
            <div
              key={alert.id}
              onClick={() => dismissAlert(alert.id)}
              className={`rounded-lg border p-4 transition-all cursor-pointer ${
                alert.read
                  ? 'bg-slate-50 border-slate-200 opacity-80'
                  : alert.severity === 'HIGH'
                  ? 'bg-rose-50/70 border-rose-300 shadow-xs'
                  : alert.severity === 'MEDIUM'
                  ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(alert.severity)}
                  <h3 className="text-xs font-bold text-slate-900">{alert.title}</h3>
                </div>
                <span className="font-mono text-[10px] text-slate-400 whitespace-nowrap">
                  {alert.timestamp}
                </span>
              </div>

              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                {alert.message}
              </p>

              {alert.recommendedAction && (
                <div className="mt-2.5 rounded bg-white/80 p-2 text-[11px] border border-slate-200/80 text-slate-700">
                  <span className="font-bold text-slate-900">Action: </span>
                  {alert.recommendedAction}
                </div>
              )}

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>{alert.read ? 'Acknowledged' : 'Mark as read'}</span>
                <span className="uppercase font-semibold tracking-wider">
                  Target: {alert.audience}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 text-center">
          Operational log synchronized with Mandi Kalan telemetry
        </div>
      </div>
    </div>
  );
};
