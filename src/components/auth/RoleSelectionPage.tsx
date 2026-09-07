import React from 'react';
import { Tractor, Building2, Shield, ArrowRight, ArrowLeft, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface RoleSelectionPageProps {
  onSelectRole: (roleOption: 'FARMER' | 'OPERATOR' | 'ADMIN') => void;
  onBackToLanding: () => void;
}

export const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({
  onSelectRole,
  onBackToLanding
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      {/* Top Utility Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>← Back to Landing Page</span>
        </button>

        {/* Explicit Light/Dark Mode Switcher */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-4 w-4 text-amber-400" />
              <span>☀️ Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-indigo-600" />
              <span>🌙 Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        {/* Emblem & Portal Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-700 dark:bg-emerald-600 text-white shadow-lg mb-4 ring-4 ring-emerald-100 dark:ring-emerald-950">
            <span className="text-3xl">🌾</span>
          </div>

          <span className="block text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-400 mb-1">
            Department of Food, Civil Supplies & Consumer Affairs
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome to AgriFlow
          </h1>
          <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-300 mt-2">
            How would you like to continue?
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. FARMER */}
          <div
            onClick={() => onSelectRole('FARMER')}
            className="group relative cursor-pointer rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-500/60 dark:border-emerald-500/40 hover:border-emerald-600 dark:hover:border-emerald-400 p-6 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div className="absolute -top-3 left-4 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              Farmer Access
            </div>

            <div>
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Tractor className="h-6 w-6" />
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                👨‍🌾 I'M A FARMER
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Book procurement slots and track your queue without waiting in line.
              </p>

              <div className="mt-4 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>New Farmer Enrollment</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Existing Farmer OTP Login</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Live Token & Virtual Queue</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <span>Continue as Farmer</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. CENTRE OPERATOR */}
          <div
            onClick={() => onSelectRole('OPERATOR')}
            className="group relative cursor-pointer rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 p-6 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div className="absolute -top-3 left-4 bg-slate-700 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              Authorized Staff Only
            </div>

            <div>
              <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Building2 className="h-6 w-6" />
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors">
                🏢 CENTRE STAFF LOGIN
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                For authorized procurement-centre operators and weighbridge supervisors.
              </p>

              <div className="mt-4 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                  <span>Singanallur Hub Operations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                  <span>Electronic Weighbridge Console</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                  <span>SIH Demo Account Included</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Secure Staff Portal</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. ADMINISTRATOR */}
          <div
            onClick={() => onSelectRole('ADMIN')}
            className="group relative cursor-pointer rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500/60 dark:hover:border-blue-500/40 p-6 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div className="absolute -top-3 left-4 bg-blue-700 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              DFSC Controller
            </div>

            <div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Shield className="h-6 w-6" />
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                🛡️ ADMIN LOGIN
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                For authorized AgriFlow administrators and district procurement controllers.
              </p>

              <div className="mt-4 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  <span>12 Mandis District Oversight</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  <span>Demand Surge Simulator</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  <span>Cryptographic Audit Ledger</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-400">
              <span>Secure Admin Portal</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Official Governance Compliance Notice */}
        <div className="mt-10 rounded-xl bg-slate-100 dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Security Notice: </span>
            Centre Staff and Administrator portals are restricted access points. Unauthorized access attempts are monitored and recorded on the public infrastructure audit log.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        AgriFlow Public Service Platform • Smart India Hackathon Grand Finale
      </footer>
    </div>
  );
};
