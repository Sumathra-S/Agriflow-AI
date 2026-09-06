import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/procurement';
import { Building2, Tractor, BarChart3, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('OPERATOR');
  const [userId, setUserId] = useState<string>('OP-8492');
  const [password, setPassword] = useState<string>('••••••••');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'OPERATOR') {
      setUserId('OP-8492');
    } else if (role === 'FARMER') {
      setUserId('98765-43210');
    } else {
      setUserId('ADM-LDH-01');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Government / Portal Emblem */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gov-800 text-white shadow-md border border-gov-700">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 22 16 8" />
            <path d="M3.5 12.5 8 17" />
            <path d="M9.5 6.5 14 11" />
            <path d="M15.5.5 20 5" />
            <path d="M14 2c1.5 2 2 4 2 6 0 3-2 5-5 5-2 0-4-.5-6-2" />
          </svg>
        </div>

        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
          AgriFlow AI
        </h2>
        <p className="mt-1 text-center text-xs font-semibold text-gov-800 uppercase tracking-wider">
          Procurement Flow Intelligence Platform
        </p>
        <p className="mt-0.5 text-center text-xs text-slate-500">
          Department of Food, Civil Supplies & Consumer Affairs
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-gov-md rounded-xl sm:px-10 border border-slate-200">
          {/* Role Selection Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select User Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect('OPERATOR')}
                className={`flex flex-col items-center p-3 rounded-lg border text-xs font-medium transition-all ${
                  selectedRole === 'OPERATOR'
                    ? 'border-gov-800 bg-gov-50 text-gov-900 font-bold ring-1 ring-gov-800'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building2 className="h-5 w-5 mb-1 text-gov-800" />
                <span>Operator</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('FARMER')}
                className={`flex flex-col items-center p-3 rounded-lg border text-xs font-medium transition-all ${
                  selectedRole === 'FARMER'
                    ? 'border-amber-700 bg-amber-50 text-amber-900 font-bold ring-1 ring-amber-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Tractor className="h-5 w-5 mb-1 text-amber-700" />
                <span>Farmer</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('ADMIN')}
                className={`flex flex-col items-center p-3 rounded-lg border text-xs font-medium transition-all ${
                  selectedRole === 'ADMIN'
                    ? 'border-blue-700 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BarChart3 className="h-5 w-5 mb-1 text-blue-700" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                {selectedRole === 'FARMER' ? 'Registered Mobile Number' : 'Official User ID'}
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-xs shadow-xs focus:border-gov-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Access Password / OTP
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-xs shadow-xs focus:border-gov-800 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-md bg-gov-800 py-2.5 px-4 text-xs font-bold text-white shadow-xs hover:bg-gov-900 transition-colors"
              >
                <span>Enter AgriFlow AI Platform</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Demo note */}
          <div className="mt-6 rounded-md bg-slate-50 p-3 border border-slate-200 text-[11px] text-slate-600">
            <span className="font-bold text-slate-800 block mb-0.5">SIH Hackathon Demo:</span>
            <p>
              Pre-filled with certified demo credentials. Click "Enter" to access live telemetry for Mandi Kalan procurement centre.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
