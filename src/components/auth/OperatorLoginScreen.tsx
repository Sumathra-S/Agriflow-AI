import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { DEMO_OPERATOR_CREDENTIALS } from '../../services/authService';
import {
  Building2,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Sun,
  Moon,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface OperatorLoginScreenProps {
  onBackToRoleSelect: () => void;
  onSuccess: () => void;
}

export const OperatorLoginScreen: React.FC<OperatorLoginScreenProps> = ({
  onBackToRoleSelect,
  onSuccess
}) => {
  const { loginOperator } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [operatorId, setOperatorId] = useState<string>('operator.demo');
  const [password, setPassword] = useState<string>('Demo-only credential');
  const [centreId, setCentreId] = useState<string>('singanallur');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);

  const handleFillDemo = () => {
    setOperatorId(DEMO_OPERATOR_CREDENTIALS.id);
    setPassword(DEMO_OPERATOR_CREDENTIALS.password);
    setCentreId('singanallur');
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = loginOperator(operatorId, password);
    if (res.success) {
      onSuccess();
    } else {
      setErrorMessage(res.errorMessage || 'Invalid credentials. Please verify or use Demo button.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      {/* Top Utility Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={onBackToRoleSelect}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>← Back to Role Selection</span>
        </button>

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

      {/* Main Login Area */}
      <div className="max-w-md mx-auto w-full px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                  Restricted Staff Access
                </span>
                <h1 className="text-xl font-black text-white">Centre Staff Login</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Procurement Centre Operator & Weighbridge Console
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {errorMessage && (
              <div className="mb-5 p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  <span>Operator ID / Username</span>
                </label>
                <input
                  type="text"
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  placeholder="e.g. operator.demo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:border-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-slate-500" />
                    <span>Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter staff password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:border-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-500" />
                  <span>Assigned Centre</span>
                </label>
                <select
                  value={centreId}
                  onChange={(e) => setCentreId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:border-emerald-600 focus:outline-none"
                >
                  <option value="singanallur">Singanallur Procurement Centre (Centre C)</option>
                  <option value="sulur">Sulur APMC Centre (Centre B — Restricted)</option>
                  <option value="pollachi">Pollachi Regulated Market (Restricted)</option>
                </select>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Note: Operators can only access their officially assigned procurement centre.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider uppercase shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <span>Sign In to Centre Console</span>
                <ArrowRight className="h-4 w-4 text-emerald-400" />
              </button>
            </form>

            {/* SIH DEMO ACCESS BOX */}
            <div className="mt-6 rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>SIH Demo Access (Evaluators)</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                  Demo-Only
                </span>
              </div>

              <div className="space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                <div><span className="text-slate-400">Operator ID:</span> <span className="text-slate-900 dark:text-white font-bold">operator.demo</span></div>
                <div><span className="text-slate-400">Password:</span> <span className="text-slate-900 dark:text-white font-bold">Demo-only credential</span></div>
                <div><span className="text-slate-400">Assigned:</span> Singanallur Hub (Centre C)</div>
              </div>

              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full mt-3 py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>⚡ Fill Demo Operator Credentials</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-700 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-emerald-600" />
              <span>Operator Password Reset</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Per Government of India agricultural infrastructure guidelines, staff passwords cannot be reset self-service. Please contact the <strong>District DFSC Helpdesk</strong> at <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded font-bold">1800-180-1551</code> with your Station Supervisor ID.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 text-center text-xs text-slate-500 dark:text-slate-400">
        AgriFlow Security Architecture • Strict Centre RBAC Isolation Enforced
      </footer>
    </div>
  );
};
