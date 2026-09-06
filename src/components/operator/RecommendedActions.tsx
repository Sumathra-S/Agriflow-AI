import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CheckSquare, Square, Bell, Users, Eye, Clock, CheckCircle2 } from 'lucide-react';

export const RecommendedActions: React.FC = () => {
  const { operatorActions, executeAction, farmerAdvisorySent, backupStaffActive } = useSimulation();

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'NOTIFY_FARMERS':
        return <Bell className="h-4 w-4 text-rose-700" />;
      case 'PREPARE_STAFF':
        return <Users className="h-4 w-4 text-gov-800" />;
      case 'MONITOR':
        return <Eye className="h-4 w-4 text-slate-700" />;
      case 'REVIEW_QUEUE':
        return <Clock className="h-4 w-4 text-amber-800" />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-gov">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            Recommended Actions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational recommendations — Operator retains complete manual decision authority
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {operatorActions.filter(a => a.executed).length} of {operatorActions.length} Completed
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {operatorActions.map(action => (
          <div
            key={action.id}
            onClick={() => executeAction(action.id)}
            className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-all ${
              action.executed
                ? 'bg-emerald-50/70 border-emerald-300 text-slate-800'
                : 'bg-white border-slate-200 hover:border-gov-600 hover:bg-slate-50 text-slate-900'
            }`}
          >
            <div className="mt-0.5 text-gov-800 flex-shrink-0">
              {action.executed ? (
                <CheckSquare className="h-5 w-5 text-emerald-700 fill-emerald-100" />
              ) : (
                <Square className="h-5 w-5 text-slate-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">{getActionIcon(action.actionType)}</div>
                <h3 className={`text-xs font-bold ${action.executed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                  {action.label}
                </h3>
                {action.executed && (
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                    Executed
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500 leading-normal">
                {action.description}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                executeAction(action.id);
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                action.executed
                  ? 'bg-emerald-200 text-emerald-900 hover:bg-emerald-300'
                  : 'bg-gov-800 text-white hover:bg-gov-900 shadow-xs'
              }`}
            >
              {action.executed ? 'Undo' : 'Execute'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Note: Advisory dispatches via State C-DAC SMS Gateway & Farmer App</span>
        <span className="font-mono">Manual Override: Enabled</span>
      </div>
    </div>
  );
};
