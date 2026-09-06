import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageCode } from '../../types/procurement';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  ];

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Globe className="h-3.5 w-3.5 text-slate-500" />
      <div className="flex rounded-md border border-slate-300 bg-white p-0.5 shadow-sm">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
              language === lang.code
                ? 'bg-gov-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {compact ? lang.native : `${lang.native} (${lang.label})`}
          </button>
        ))}
      </div>
    </div>
  );
};
