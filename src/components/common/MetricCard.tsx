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
    default: 'border-slate-200 bg-white text-slate-900',
    danger: 'border-rose-300 bg-rose-50/50 text-slate-900',
    warning: 'border-amber-300 bg-amber-50/50 text-slate-900',
    success: 'border-emerald-300 bg-emerald-50/50 text-slate-900'
  };

  const iconBgStyles = {
    default: 'bg-slate-100 text-slate-700',
    danger: 'bg-rose-100 text-rose-700',
    warning: 'bg-amber-100 text-amber-800',
    success: 'bg-emerald-100 text-emerald-800'
  };

  return (
    <div className={`rounded-lg border p-5 shadow-gov transition-all ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">{value}</span>
            {trend && (
              <span
                className={`inline-flex items-center text-xs font-medium ${
                  trend.direction === 'up'
                    ? 'text-rose-700'
                    : trend.direction === 'down'
                    ? 'text-emerald-700'
                    : 'text-slate-500'
                }`}
              >
                {trend.direction === 'up' && '↑ '}
                {trend.direction === 'down' && '↓ '}
                {trend.label}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">{subtext}</p>
        </div>
        <div className={`rounded-md p-2.5 ${iconBgStyles[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
