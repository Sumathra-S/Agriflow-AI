import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { DEMO_ADMIN_CREDENTIALS } from '../../services/authService';
import {
  Shield,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Sun,
  Moon,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface AdminLoginScreenProps {
  onBackToRoleSelect: () => void;
  onSuccess: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({
  onBackToRoleSelect,
  onSuccess
}) => {
  const { loginAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [adminId, setAdminId] = useState<string>('admin.demo');
  const [password, setPassword] = useState<string>('Demo-only credential');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);

  const handleFillDemo = () => {
    setAdminId(DEMO_ADMIN_CREDENTIALS.id);
    setPassword(DEMO_ADMIN_CREDENTIALS.password);
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = loginAdmin(adminId, password);
    if (res.success) {
      onSuccess();
    } else {
      setErrorMessage(res.errorMessage || 'Invalid credentials. Please use Demo Admin button.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      {/* Top Bar */}
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

      {/* Main Login */}
      <div className="max-w-md mx-auto w-full px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 border-b border-blue-950">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-blue-800/80 border border-blue-600/50 flex items-center justify-center shadow-inner">
                <Shield className="h-6 w-6 text-blue-300" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300">
                  Government Administration
                </span>
                <h1 className="text-xl font-black text-white">Administrator Login</h1>
                <p className="text-xs text-blue-200 mt-0.5">
                  District DFSC Procurement Command & Control
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
                  <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Admin ID / Username</span>
                </label>
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="e.g. admin.demo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-blue-700 dark:text-blue-400 font-bold hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs tracking-wider uppercase shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <span>Enter District Command</span>
                <ArrowRight className="h-4 w-4 text-blue-200" />
              </button>
            </form>

            {/* SIH DEMO ADMIN BOX */}
            <div className="mt-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 p-4 border border-blue-200 dark:border-blue-800/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold text-blue-950 dark:text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>SIH Demo Admin (Evaluators)</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                  Demo-Only
                </span>
              </div>

              <div className="space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                <div><span className="text-slate-400">Admin ID:</span> <span className="text-slate-900 dark:text-white font-bold">admin.demo</span></div>
                <div><span className="text-slate-400">Password:</span> <span className="text-slate-900 dark:text-white font-bold">Demo-only credential</span></div>
                <div><span className="text-slate-400">Authority:</span> Dr. Harpreet Sandhu, IAS (DFSC)</div>
              </div>

              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full mt-3 py-2 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>⚡ Fill Demo Admin Credentials</span>
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
              <HelpCircle className="h-4 w-4 text-blue-600" />
              <span>Admin Recovery Protocol</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              District administrative credentials require multi-party hardware security module (HSM) recovery authorized by the State Department of Food and Civil Supplies.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-3 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 text-center text-xs text-slate-500 dark:text-slate-400">
        AgriFlow District Administration • Cryptographic Audit Trail Active
      </footer>
    </div>
  );
};
