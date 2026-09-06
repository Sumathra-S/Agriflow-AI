import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Users, Search, Printer, CheckCircle2, ArrowRight } from 'lucide-react';

interface AssistedAccessBarProps {
  currentFarmerToken: string;
  onSelectToken: (token: string, name: string) => void;
}

const VILLAGE_FARMERS = [
  { token: '1024', name: 'Sukhwinder Sharma', crop: 'Paddy (PR-126)', mobile: '98765-43210' },
  { token: '1008', name: 'Gurpreet Singh', crop: 'Paddy (PR-126)', mobile: '98140-11223' },
  { token: '1011', name: 'Harwinder Kaur', crop: 'Paddy (PR-126)', mobile: '98722-44556' },
  { token: '1015', name: 'Baldev Raj', crop: 'Paddy (Basmati)', mobile: '98150-77889' },
];

export const AssistedAccessBar: React.FC<AssistedAccessBarProps> = ({
  currentFarmerToken,
  onSelectToken
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputToken, setInputToken] = useState<string>('');
  const [searchedFarmer, setSearchedFarmer] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputToken.trim().replace('#', '').replace('TK-', '');
    const found = VILLAGE_FARMERS.find(f => f.token === clean);
    if (found) {
      setSearchedFarmer(found);
      onSelectToken(found.token, found.name);
    } else {
      // Create ad-hoc token lookup for village farmer
      const adHoc = {
        token: clean,
        name: `Village Farmer (#${clean})`,
        crop: 'Paddy (PR-126)',
        mobile: 'Registered'
      };
      setSearchedFarmer(adHoc);
      onSelectToken(clean, adHoc.name);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 p-2.5 text-xs text-amber-950">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 font-bold hover:text-amber-800"
        >
          <Users className="h-4 w-4 text-amber-800" />
          <span>{t.assistedMode}</span>
          <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded ml-1">
            CSC / Village Sarpanch
          </span>
        </button>

        <button
          onClick={handlePrintSlip}
          className="flex items-center gap-1 bg-white border border-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold text-amber-900 hover:bg-amber-100 transition-colors shadow-xs"
          title="Print Token Slip for Farmer"
        >
          <Printer className="h-3 w-3" />
          <span>{t.printPass}</span>
        </button>
      </div>

      {isOpen && (
        <div className="mt-2.5 pt-2 border-t border-amber-200/80 space-y-2">
          <p className="text-[11px] text-amber-900 font-medium">
            {t.assistedModeDesc}
          </p>

          <form onSubmit={handleSearch} className="flex gap-1.5">
            <input
              type="text"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder={t.enterTokenNumber}
              className="flex-1 rounded border border-amber-300 px-2 py-1 text-xs bg-white text-slate-900 focus:outline-none focus:border-amber-600"
            />
            <button
              type="submit"
              className="bg-amber-800 text-white px-3 py-1 rounded text-xs font-bold hover:bg-amber-900 shadow-xs"
            >
              {t.search}
            </button>
          </form>

          {/* Quick tokens */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] font-bold text-amber-800">Quick Tokens:</span>
            {VILLAGE_FARMERS.map(f => (
              <button
                key={f.token}
                onClick={() => onSelectToken(f.token, f.name)}
                className={`px-2 py-0.5 rounded text-[11px] border font-medium transition-colors ${
                  currentFarmerToken === f.token
                    ? 'bg-amber-800 text-white border-amber-900 font-bold'
                    : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-100'
                }`}
              >
                #{f.token} ({f.name.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
