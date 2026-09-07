import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { voiceService } from '../../services/voiceService';
import {
  HelpCircle,
  X,
  Building2,
  TrendingDown,
  Clock,
  Scale,
  ShieldCheck,
  Volume2
} from 'lucide-react';

interface WhyThisSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenNumber?: string;
  assignedSlot?: string;
}

export const WhyThisSlotModal: React.FC<WhyThisSlotModalProps> = ({
  isOpen,
  onClose,
  tokenNumber = '1024',
  assignedSlot = '11:30 AM – 12:30 PM'
}) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const factors = [
    {
      icon: <Building2 className="h-5 w-5 text-emerald-700" />,
      title: '1. Suitable Centre Capacity',
      desc: 'Singanallur centre is specifically configured with certified weighbridges and moisture testing equipment for your crop type.'
    },
    {
      icon: <TrendingDown className="h-5 w-5 text-emerald-700" />,
      title: '2. Lower Expected Queue',
      desc: 'Afternoon window has 55% fewer tractor trolleys than peak morning hours, significantly reducing your gate waiting time.'
    },
    {
      icon: <Clock className="h-5 w-5 text-emerald-700" />,
      title: '3. Available Procurement Window',
      desc: 'Dedicated intake gate and unloading bays are staffed and operational during your assigned window.'
    },
    {
      icon: <Scale className="h-5 w-5 text-emerald-700" />,
      title: '4. Balanced Processing Load',
      desc: 'Spreading farmer arrivals prevents traffic gridlock on Kamarajar Road and ensures accurate, unhurried weighing.'
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-emerald-700" />,
      title: '5. Reduced Expected Waiting',
      desc: 'Your token remains 100% active and guaranteed even if you visit after 2:00 PM today.'
    }
  ];

  const handleSpeak = () => {
    let speechText = '';
    if (language === 'ta') {
      speechText = 'ஏன் இந்த நேரம் ஒதுக்கப்பட்டது? சிங்காநல்லூர் கொள்முதல் நிலையத்தில் கூட்டம் குறைவாக உள்ள நேரம் உங்களுக்கு ஒதுக்கப்பட்டுள்ளது. மதியம் 2:00 மணிக்கு மேல் வந்தால் காத்திருக்கும் நேரம் மிகக் குறைவாக இருக்கும்.';
    } else if (language === 'hi') {
      speechText = 'यह स्लॉट क्यों दिया गया? सिंघानाल्लूर खरीद केंद्र पर कम भीड़ वाला समय आपको दिया गया है। दोपहर 2:00 बजे के बाद आने पर इंतज़ार बहुत कम होगा।';
    } else {
      speechText = 'Why was this slot assigned? Singanallur centre has balanced capacity and lower expected queues during this window. Your token remains guaranteed.';
    }
    voiceService.speak(speechText, language);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gov-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-700/80 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-black">Why was this slot assigned?</h3>
              <p className="text-[11px] text-gov-200">
                Explainable Intelligent Optimization • Token #{tokenNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeak}
              className="p-2 rounded-xl bg-gov-800 hover:bg-gov-700 text-emerald-300 transition-colors"
              title="Listen to explanation"
            >
              <Volume2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gov-800 hover:bg-gov-700 text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 font-medium leading-relaxed">
            AgriFlow evaluates centre capacity, live queue velocity, crop handling readiness, and road safety to recommend the most convenient window for every farmer.
          </div>

          <div className="space-y-3">
            {factors.map((f, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-start gap-3 hover:border-emerald-300 transition-colors"
              >
                <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">{f.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-900 text-white rounded-2xl text-xs space-y-1">
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
              Summary Advice
            </span>
            <p className="leading-relaxed">
              Your assigned time is <strong>{assignedSlot}</strong>. Arriving after 2:00 PM is recommended if you prefer minimal waiting time.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gov-800 hover:bg-gov-900 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Understood (சரி)
          </button>
        </div>
      </div>
    </div>
  );
};
