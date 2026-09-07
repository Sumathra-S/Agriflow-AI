import React from 'react';
import { virtualQueueEngine } from '../../services/engine/virtualQueueEngine';
import { Clock, AlertTriangle, X, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface WhenShouldIArriveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhenShouldIArriveModal: React.FC<WhenShouldIArriveModalProps> = ({
  isOpen,
  onClose
}) => {
  const { language } = useLanguage();
  const arrivalCurve = virtualQueueEngine.getHourlyArrivalCurve();

  if (!isOpen) return null;

  const isTa = language === 'ta';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-gov-800 to-gov-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 border border-white/20">
              <Clock className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                {isTa ? 'நான் எப்போது வர வேண்டும்?' : 'When Should I Arrive?'}
              </h2>
              <p className="text-xs text-emerald-200">
                {isTa ? 'நேரடி காத்திருப்பு நேர கணிப்பு (சிங்கநல்லூர் APMC)' : 'Live Wait Curve & Guidance (Singanallur APMC)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          {/* Best Time Recommendation Card */}
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 text-emerald-950 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800 flex-shrink-0 mt-0.5">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <span className="bg-emerald-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {isTa ? 'மிகச் சிறந்த நேரம்' : 'Optimal Arrival Window'}
                </span>
                <h3 className="text-base font-black text-emerald-950 mt-1">
                  {isTa ? 'பிற்பகல் 2:00 PM – 3:30 PM' : 'After 2:00 PM – 3:30 PM'}
                </h3>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  {isTa
                    ? 'காத்திருப்பு நேரம் 16 நிமிடங்கள் மட்டுமே! உங்கள் காலை முன்பதிவு டோக்கன் ரத்து செய்யப்படாது, செல்லுபடியாகும்.'
                    : 'Estimated wait is under 18 minutes! Your booking slot remains 100% active and guaranteed.'}
                </p>
              </div>
            </div>
          </div>

          {/* Peak Warning Note */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-900">
            <AlertTriangle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">
                {isTa ? '11:00 AM – 1:00 PM கூட்ட நெரிசல் உச்சம்' : 'Avoid Peak Hour: 11:00 AM – 1:00 PM'}
              </span>
              <span>
                {isTa
                  ? '48 டிராக்டர்கள் ஒரே நேரத்தில் எதிர்பார்க்கப்படுவதால் எடைமேடையில் 70+ நிமிடங்கள் வரை காத்திருக்க நேரிடலாம்.'
                  : 'Over 48 tractors expected at the weighbridge. Delays exceed 70 minutes.'}
              </span>
            </div>
          </div>

          {/* Hourly Timeline */}
          <div className="space-y-2 pt-1">
            <h4 className="font-black text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-gov-700" />
              {isTa ? 'மணிநேர காத்திருப்பு விவரம்' : 'Hourly Wait Curve'}
            </h4>

            <div className="space-y-2">
              {arrivalCurve.map(item => (
                <div
                  key={item.hourLabel}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    item.isRecommended
                      ? 'bg-emerald-50/90 border-2 border-emerald-500 shadow-xs'
                      : item.congestionLevel === 'HIGH'
                      ? 'bg-rose-50/60 border-rose-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs text-slate-800 min-w-[70px]">
                      {item.hourLabel}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        item.congestionLevel === 'HIGH'
                          ? 'bg-rose-600 text-white'
                          : item.congestionLevel === 'MODERATE'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {item.congestionLevel}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-black text-xs text-slate-900 block">
                      ~{item.estimatedWaitMinutes} min
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {item.expectedArrivals} arrivals
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-100 rounded-xl p-3 text-[11px] text-slate-600 flex items-center gap-2 border border-slate-200">
            <ShieldAlert className="h-4 w-4 text-slate-500 flex-shrink-0" />
            <span>
              {isTa
                ? 'அறிவியல் பூர்வமான AI கணிப்பு அடிப்படையிலானது (மாதிரி உருவகப்படுத்துதல்).'
                : 'Prototype Simulation: Calculations based on arrival Poisson distribution & weighbridge throughput.'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gov-800 hover:bg-gov-900 text-white font-bold text-xs transition-colors shadow-sm"
          >
            {isTa ? 'புரிந்தது' : 'Understood, Thanks!'}
          </button>
        </div>
      </div>
    </div>
  );
};
