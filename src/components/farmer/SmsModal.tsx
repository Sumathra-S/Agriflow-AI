import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSimulation } from '../../context/SimulationContext';
import { X, Copy, Check, MessageSquare, Volume2 } from 'lucide-react';
import { voiceService } from '../../services/voiceService';

interface SmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenNumber?: string;
}

export const SmsModal: React.FC<SmsModalProps> = ({ isOpen, onClose, tokenNumber = '1024' }) => {
  const { t, language } = useLanguage();
  const { congestionRisk } = useSimulation();
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const crowdText = congestionRisk === 'HIGH' ? 'HIGH' : congestionRisk === 'MEDIUM' ? 'MODERATE' : 'LOW';
  const visitText = congestionRisk === 'LOW' ? 'Anytime' : 'After 2:00 PM';

  const smsBody = `AGRI FLOW UPDATE
Centre: Mandi Kalan
Crowd: ${crowdText}
Recommended visit:
${visitText}
Booking:
ACTIVE (#${tokenNumber})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(smsBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSpeakSms = () => {
    voiceService.speak(smsBody, language);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gov-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-300" />
            <div>
              <h3 className="text-sm font-bold">{t.viewAsSms}</h3>
              <p className="text-[10px] text-gov-200">{t.smsFormat}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-gov-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Feature Phone Display Simulation */}
        <div className="p-4 bg-slate-100">
          <div className="bg-emerald-950 text-emerald-300 rounded-xl p-4 font-mono text-xs shadow-inner border-2 border-emerald-900 space-y-1">
            <div className="text-[10px] text-emerald-500 uppercase tracking-widest border-b border-emerald-800 pb-1 flex justify-between">
              <span>SMS • 11:15 AM</span>
              <span>160 Chars</span>
            </div>
            <pre className="whitespace-pre-wrap font-mono pt-2 text-emerald-200 leading-relaxed font-semibold">
              {smsBody}
            </pre>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gov-800 text-white text-xs font-bold shadow-xs hover:bg-gov-900 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-300" />
                <span>{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>{t.copySms}</span>
              </>
            )}
          </button>

          <button
            onClick={handleSpeakSms}
            className="py-2.5 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1"
            title="Listen to SMS"
          >
            <Volume2 className="h-4 w-4 text-gov-800" />
            <span>{t.listen}</span>
          </button>
        </div>

        <div className="px-4 pb-3 text-center text-[10px] text-slate-400">
          Sent automatically to registered farmer mobile numbers
        </div>
      </div>
    </div>
  );
};
