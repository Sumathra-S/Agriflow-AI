import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';
import { UserRole } from '../../types/procurement';
import {
  Bell,
  Clock,
  MapPin,
  ChevronDown,
  Building2,
  Tractor,
  BarChart3,
  PhoneCall,
  Hash
} from 'lucide-react';

interface HeaderProps {
  onToggleNotifications?: () => void;
  unreadCount?: number;
  onOpenIvr?: () => void;
  onOpenUssd?: () => void;
  onNavigateLanding?: () => void;
  onOpenBasicPhone?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleNotifications,
  unreadCount = 1,
  onOpenIvr,
  onOpenUssd,
  onNavigateLanding,
  onOpenBasicPhone
}) => {
  const { role, setRole, user } = useAuth();
  const { congestionRisk } = useSimulation();
  const [currentTime, setCurrentTime] = useState<string>('11:15 AM');
  const [currentDate, setCurrentDate] = useState<string>('06 Sep 2026');
  const [roleMenuOpen, setRoleMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      setCurrentTime(`${formattedHours}:${minutes} ${ampm}`);

      const day = now.getDate().toString().padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      setCurrentDate(`${day} ${months[now.getMonth()]} 2026`);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const rolesList: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      role: 'OPERATOR',
      label: 'Centre Operator',
      icon: <Building2 className="h-4 w-4 text-emerald-700" />,
      desc: 'Mandi Kalan Centre Control & Communication'
    },
    {
      role: 'FARMER',
      label: 'Farmer Experience',
      icon: <Tractor className="h-4 w-4 text-amber-700" />,
      desc: 'Mobile flow guidance & booking'
    },
    {
      role: 'ADMIN',
      label: 'District Administrator',
      icon: <BarChart3 className="h-4 w-4 text-blue-700" />,
      desc: 'District Multi-Centre Overview'
    }
  ];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      {/* Official Government Top Bar */}
      <div className="bg-gov-900 text-gov-100 text-xs px-4 py-1 flex items-center justify-between border-b border-gov-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-semibold tracking-wide text-white">Government of India / State Agricultural Marketing Board</span>
          <span className="text-gov-200 hidden sm:inline">• Food, Civil Supplies & Consumer Affairs</span>
        </div>
        <div className="flex items-center gap-3 text-gov-200 font-mono text-[11px]">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-emerald-300" />
            <span>Shift: 08:00–19:00</span>
          </span>
          <span className="text-gov-700">|</span>
          <span>Portal Ref: AGRIFLOW-v2.0</span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Product Brand & Centre Info */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-gov-800 text-white shadow-sm border border-gov-700">
            <span className="text-2xl">🌾</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-slate-900">AgriFlow</h1>
              <span className="bg-gov-100 text-gov-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-gov-200 uppercase tracking-wider">
                Public Service
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
              <span>Know the crowd before it arrives.</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center text-slate-600 font-medium">
                <MapPin className="h-3 w-3 text-gov-700 mr-0.5" />
                Singanallur Procurement Centre
              </span>
            </p>
          </div>
        </div>

        {/* Right Section: IVR button, Time, Notifications & Role Switcher */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {/* Landing Page Switcher */}
          {onNavigateLanding && (
            <button
              onClick={onNavigateLanding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
              title="Return to Public Service Presentation Landing Page"
            >
              <span>← Landing Page</span>
            </button>
          )}

          {/* Unified Basic Phone Simulator Button */}
          {onOpenBasicPhone ? (
            <button
              onClick={onOpenBasicPhone}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors"
              title="Launch Basic Phone Access Simulator (SMS / IVR / USSD)"
            >
              <PhoneCall className="h-3.5 w-3.5 text-emerald-200" />
              <span>📞 Basic Phone (SMS/IVR/USSD)</span>
            </button>
          ) : (
            <>
              {/* USSD Simulator Button */}
              {onOpenUssd && (
                <button
                  onClick={onOpenUssd}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-mono font-bold shadow-xs transition-colors border border-emerald-700"
                  title="Launch Feature Phone *384# USSD Simulator"
                >
                  <Hash className="h-3.5 w-3.5 text-emerald-300" />
                  <span>*384# USSD</span>
                </button>
              )}

              {/* IVR Phone Simulation Trigger Button */}
              {onOpenIvr && (
                <button
                  onClick={onOpenIvr}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors"
                  title="Launch Interactive Basic Phone IVR Simulator"
                >
                  <PhoneCall className="h-3.5 w-3.5 text-emerald-200" />
                  <span>📞 IVR / Phone</span>
                </button>
              )}
            </>
          )}

          {/* Live Date / Time Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>{currentDate}</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-900">{currentTime}</span>
          </div>

          {/* Operational Notification Bell */}
          <button
            onClick={onToggleNotifications}
            className="relative p-2 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Operational Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs transition-colors"
            >
              <div className="flex items-center gap-1.5">
                {role === 'OPERATOR' && <Building2 className="h-3.5 w-3.5 text-gov-700" />}
                {role === 'FARMER' && <Tractor className="h-3.5 w-3.5 text-amber-700" />}
                {role === 'ADMIN' && <BarChart3 className="h-3.5 w-3.5 text-blue-700" />}
                <span className="capitalize">{role.toLowerCase()} View</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-72 rounded-lg border border-slate-200 bg-white py-1 shadow-lg z-50">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Switch System Role</p>
                  <p className="text-xs font-medium text-slate-900 mt-0.5">{user.name}</p>
                  <p className="text-[11px] text-slate-500">{user.badge}</p>
                </div>
                <div className="py-1">
                  {rolesList.map(item => (
                    <button
                      key={item.role}
                      onClick={() => {
                        setRole(item.role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-start gap-2.5 px-3 py-2 text-left text-xs transition-colors ${
                        role === item.role ? 'bg-gov-50 text-gov-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="mt-0.5">{item.icon}</div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span>{item.label}</span>
                          {role === item.role && (
                            <span className="text-[10px] bg-gov-200 text-gov-800 px-1 rounded font-bold">Active</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
