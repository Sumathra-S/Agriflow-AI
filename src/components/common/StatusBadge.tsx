import React from 'react';
import { CongestionRisk } from '../../types/procurement';

interface StatusBadgeProps {
  risk: CongestionRisk;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ risk, size = 'md', showIcon = true }) => {
  const config = {
    LOW: {
      label: 'LOW RISK',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-600',
      description: 'Optimal throughput & minimal wait'
    },
    MEDIUM: {
      label: 'MEDIUM RISK',
      bg: 'bg-amber-50 text-amber-800 border-amber-300',
      dot: 'bg-amber-600',
      description: 'Approaching capacity limits'
    },
    HIGH: {
      label: 'HIGH RISK',
      bg: 'bg-rose-50 text-rose-800 border-rose-300',
      dot: 'bg-rose-600 animate-pulse',
      description: 'Severe congestion predicted'
    }
  };

  const current = config[risk];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-bold px-3.5 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium tracking-wide ${current.bg} ${sizeClasses[size]}`}
      title={current.description}
    >
      {showIcon && <span className={`inline-block h-2 w-2 rounded-full ${current.dot}`} />}
      <span>{current.label}</span>
    </span>
  );
};
