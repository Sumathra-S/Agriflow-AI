import React, { useState } from 'react';
import {
  IndianRupee,
  CheckCircle2,
  Download,
  Share2,
  FileText,
  Building,
  ShieldCheck,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface PaymentVoucherScreenProps {
  farmerName?: string;
  tokenNumber?: string;
  cropName?: string;
  quantityKg?: number;
}

export const PaymentVoucherScreen: React.FC<PaymentVoucherScreenProps> = ({
  farmerName = 'Ravi Kumar',
  tokenNumber = 'AF-108',
  cropName = 'Paddy (Grade A)',
  quantityKg = 1000
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  const mspRatePerKg = 23.0; // ₹23/kg
  const grossAmount = quantityKg * mspRatePerKg;
  const deductions = 0;
  const netAmount = grossAmount - deductions;

  const handleCopyUTR = () => {
    navigator.clipboard?.writeText('PFMS-2026-8831920-IND');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Official J-Form / MSP Payment Voucher downloaded (PFMS-2026-8831920.pdf)');
    }, 800);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Direct Benefit Transfer (DBT)
          </span>
          <h2 className="text-base font-black text-slate-900 mt-1">MSP Settlement Voucher</h2>
          <p className="text-xs text-slate-500">PFMS Integrated Agricultural Payout</p>
        </div>
        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>PAID</span>
        </div>
      </div>

      {/* 2. Official Payout Voucher Document */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md overflow-hidden">
        {/* Document Header */}
        <div className="bg-slate-900 text-white p-4">
          <div className="flex items-center justify-between text-[11px] text-slate-300 pb-2 border-b border-slate-800">
            <span>GOVERNMENT OF INDIA • APMC</span>
            <span className="font-mono">FORM J (MSP)</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Total Net Amount Credited</span>
              <span className="text-3xl font-black font-mono text-emerald-400 tracking-tight">
                ₹{netAmount.toLocaleString('en-IN')}.00
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Rate Applied</span>
              <span className="text-xs font-mono font-bold text-white">₹{mspRatePerKg.toFixed(2)} / kg</span>
            </div>
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="p-4 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Farmer Name</span>
              <span className="font-bold text-slate-900">{farmerName}</span>
              <span className="text-[10px] text-slate-500 block font-mono">ID: MH-2024-8841</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Token Ref</span>
              <span className="font-bold font-mono text-slate-900">#{tokenNumber}</span>
              <span className="text-[10px] text-slate-500 block">Singanallur Hub</span>
            </div>
          </div>

          <div className="space-y-2 py-1">
            <div className="flex justify-between">
              <span className="text-slate-600">Crop Procured:</span>
              <span className="font-bold text-slate-900">{cropName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Net Weight:</span>
              <span className="font-bold font-mono text-slate-900">{quantityKg.toLocaleString()} kg (1.00t)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Gross Procurement Value:</span>
              <span className="font-bold font-mono text-slate-900">₹{grossAmount.toLocaleString('en-IN')}.00</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span className="text-emerald-700">Quality Deductions (Moisture 13.2%):</span>
              <span className="font-bold font-mono">₹0.00 (Zero Penalty)</span>
            </div>
          </div>

          {/* Bank Transfer Details */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-gov-800" />
                State Bank of India (Aadhaar Seeded)
              </span>
              <span className="font-mono">•••• 4129</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>PFMS UTR Ref:</span>
              <div className="flex items-center gap-1">
                <span className="font-mono font-bold text-slate-700">PFMS-2026-8831920</span>
                <button
                  onClick={handleCopyUTR}
                  className="text-[10px] text-gov-800 underline hover:text-gov-900 font-semibold"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Settlement Date & Time:</span>
              <span className="font-mono">Today, 12:45 PM</span>
            </div>
          </div>
        </div>

        {/* Action Footnotes */}
        <div className="bg-slate-50 p-3 border-t border-slate-200 flex gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 bg-gov-800 hover:bg-gov-900 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{downloading ? 'Downloading...' : 'Download J-Form'}</span>
          </button>
          <button
            onClick={() => alert('SMS Payment Confirmation resent to +91 98765 43210')}
            className="bg-white border border-slate-300 text-slate-700 text-xs font-bold py-2 px-3 rounded-xl hover:bg-slate-100 flex items-center gap-1 transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>SMS Copy</span>
          </button>
        </div>
      </div>

      {/* 3. Demo Data Transparency Badge */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 flex items-center justify-between font-mono">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          DEMO DATA: Simulated PFMS DBT Record
        </span>
        <span>SIH 2026 Test Suite</span>
      </div>
    </div>
  );
};
