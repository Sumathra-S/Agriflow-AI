import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon,
  variant = 'default',
  trend
}) => {
  const variantStyles = {
    default: 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white',
    danger: 'border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/40 text-slate-900 dark:text-white',
    warning: 'border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/40 text-slate-900 dark:text-white',
    success: 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40 text-slate-900 dark:text-white'
  };

  const iconBgStyles = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    danger: 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300',
    warning: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300',
    success: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
  };

  return (
    <div className={`rounded-xl border p-5 shadow-gov transition-all ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{value}</span>
            {trend && (
              <span
                className={`inline-flex items-center text-xs font-medium ${
                  trend.direction === 'up'
                    ? 'text-rose-700 dark:text-rose-400'
                    : trend.direction === 'down'
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {trend.direction === 'up' && '↑ '}
                {trend.direction === 'down' && '↓ '}
                {trend.label}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtext}</p>
        </div>
        <div className={`rounded-lg p-2.5 ${iconBgStyles[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
