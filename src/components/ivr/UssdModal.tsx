import React, { useState, useEffect, useRef } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { useLanguage } from '../../context/LanguageContext';
import { telecomManager } from '../../services/telecomService';
import {
  X,
  RotateCcw,
  Smartphone,
  CheckCircle2,
  Phone,
  PhoneOff,
  Send,
  Delete,
  Hash
} from 'lucide-react';

interface UssdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UssdScreen =
  | 'DIAL_SCREEN'
  | 'MAIN_MENU'
  | 'BOOKING_STATUS'
  | 'SLOT_SELECTION'
  | 'SLOT_CONFIRMED'
  | 'WAITING_LIST_CONFIRMED'
  | 'CROWD_STATUS'
  | 'CALLBACK_CONFIRM'
  | 'CALLBACK_SUCCESS'
  | 'LANG_SELECT'
  | 'SESSION_CLOSED';

export const UssdModal: React.FC<UssdModalProps> = ({ isOpen, onClose }) => {
  const { congestionRisk, currentQueue } = useSimulation();
  const { language, setLanguage } = useLanguage();

  const [screen, setScreen] = useState<UssdScreen>('MAIN_MENU');
  const [ussdLang, setUssdLang] = useState<'ta' | 'hi' | 'en'>('ta');
  const [inputText, setInputText] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('2:00 PM');
  const [lastMessage, setLastMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setScreen('MAIN_MENU');
      setInputText('');
      setUssdLang(language as 'ta' | 'hi' | 'en');
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, language]);

  if (!isOpen) return null;

  const handleSend = () => {
    const val = inputText.trim();
    setInputText('');

    if (val === '0') {
      setScreen('MAIN_MENU');
      return;
    }

    switch (screen) {
      case 'MAIN_MENU':
        if (val === '1') setScreen('BOOKING_STATUS');
        else if (val === '2') setScreen('SLOT_SELECTION');
        else if (val === '3') setScreen('CROWD_STATUS');
        else if (val === '4') setScreen('CALLBACK_CONFIRM');
        else if (val === '5') setScreen('LANG_SELECT');
        else setLastMessage('Invalid option. Reply 1-5 or 0 to exit.');
        break;

      case 'SLOT_SELECTION':
        if (val === '1') {
          setSelectedSlot('10:00 AM');
          setScreen('SLOT_CONFIRMED');
        } else if (val === '2') {
          setSelectedSlot('12:00 PM');
          setScreen('SLOT_CONFIRMED');
        } else if (val === '3') {
          setSelectedSlot('02:00 PM');
          setScreen('SLOT_CONFIRMED');
        } else if (val === '4') {
          setScreen('WAITING_LIST_CONFIRMED');
        } else {
          setLastMessage('Invalid slot. Reply 1-4 or 0 for main menu.');
        }
        break;

      case 'CALLBACK_CONFIRM':
        if (val === '1') {
          telecomManager.requestCallback({
            farmerName: 'Sukhwinder Sharma',
            phone: '98765-43210',
            language: ussdLang,
            preferredTime: 'Within 15 mins',
            issueCategory: 'USSD Helpline Request (*384#)'
          });
          setScreen('CALLBACK_SUCCESS');
        } else {
          setScreen('MAIN_MENU');
        }
        break;

      case 'LANG_SELECT':
        if (val === '1') {
          setUssdLang('ta');
          setLanguage('ta');
          setScreen('MAIN_MENU');
        } else if (val === '2') {
          setUssdLang('hi');
          setLanguage('hi');
          setScreen('MAIN_MENU');
        } else if (val === '3') {
          setUssdLang('en');
          setLanguage('en');
          setScreen('MAIN_MENU');
        } else {
          setLastMessage('Choose 1, 2, or 3.');
        }
        break;

      default:
        setScreen('MAIN_MENU');
        break;
    }
  };

  const handleKeypadPress = (digit: string) => {
    setInputText(prev => prev + digit);
  };

  const handleClear = () => {
    setInputText(prev => prev.slice(0, -1));
  };

  const handleResetSession = () => {
    setScreen('MAIN_MENU');
    setInputText('');
    setLastMessage('');
  };

  // Content render helper based on language & screen
  const renderUssdContent = () => {
    switch (screen) {
      case 'MAIN_MENU':
        if (ussdLang === 'ta') {
          return (
            <div>
              <p className="font-bold border-b border-emerald-900 pb-1 mb-1">
                அக்ரிஃப்ளோ பொதுச் சேவை (*384#)
              </p>
              <p>1. பதிவு நிலை சரிபார்க்க</p>
              <p>2. வருகை நேரம் முன்பதிவு</p>
              <p>3. மைய கூட்ட நெரிசல் விபரம்</p>
              <p>4. உதவி அழைப்பு கோரிக்கை</p>
              <p>5. மொழி மாற்றம் (Language)</p>
              <p className="mt-1 text-[11px] text-emerald-800">பதில் எண் தட்டச்சு செய்யவும் [1-5]:</p>
            </div>
          );
        } else if (ussdLang === 'hi') {
          return (
            <div>
              <p className="font-bold border-b border-emerald-900 pb-1 mb-1">
                एग्रीफ्लो जनसेवा (*384#)
              </p>
              <p>1. बुकिंग स्थिति जांचें</p>
              <p>2. खरीद समय बुक करें</p>
              <p>3. मंडी में भीड़ की स्थिति</p>
              <p>4. हेल्पडेस्क कॉल का अनुरोध</p>
              <p>5. भाषा बदलें (Language)</p>
              <p className="mt-1 text-[11px] text-emerald-800">विकल्प दर्ज करें [1-5]:</p>
            </div>
          );
        } else {
          return (
            <div>
              <p className="font-bold border-b border-emerald-900 pb-1 mb-1">
                AgriFlow Public Service (*384#)
              </p>
              <p>1. Check Booking Status</p>
              <p>2. Book Arrival Time Slot</p>
              <p>3. Centre Crowd Level</p>
              <p>4. Request Operator Callback</p>
              <p>5. Change Language</p>
              <p className="mt-1 text-[11px] text-emerald-800">Reply with number [1-5]:</p>
            </div>
          );
        }

      case 'BOOKING_STATUS':
        return (
          <div className="space-y-1">
            <p className="font-bold text-emerald-950 border-b border-emerald-900 pb-0.5">
              [TOKEN #1024 - CONFIRMED]
            </p>
            <p>Farmer: Sukhwinder Sharma</p>
            <p>Date: Today, 06 Sep 2026</p>
            <p>Slot: 11:30 AM - 12:30 PM</p>
            <p>Gate: Gate 2 (Weighbridge)</p>
            <p className="font-bold text-rose-900">
              Crowd: {congestionRisk === 'HIGH' ? '🔴 HIGH' : '🟢 LOW'} (23 waiting)
            </p>
            <p className="text-[11px] font-semibold">
              Advice: Arrive after 2:00 PM. Token guaranteed.
            </p>
            <p className="mt-2 text-[11px] text-emerald-800 font-mono">Reply 0 to return to Menu</p>
          </div>
        );

      case 'SLOT_SELECTION':
        return (
          <div className="space-y-1">
            <p className="font-bold border-b border-emerald-900 pb-0.5">
              Select Available Time Slot:
            </p>
            <p>1. 10:00 AM (🟢 Low Crowd)</p>
            <p>2. 12:00 PM (🟡 Moderate)</p>
            <p>3. 02:00 PM (🟢 Best Time)</p>
            <p>4. ⏳ Join Waiting List</p>
            <p className="mt-2 text-[11px] text-emerald-800">Reply 1-4 or 0 to Back:</p>
          </div>
        );

      case 'SLOT_CONFIRMED':
        return (
          <div className="space-y-1">
            <p className="font-bold text-emerald-950 border-b border-emerald-900 pb-0.5">
              ✓ BOOKING CONFIRMED
            </p>
            <p>New Token: #1048</p>
            <p>Time: Today, {selectedSlot}</p>
            <p>Centre: Mandi Kalan (Gate 1)</p>
            <p className="text-[11px]">Free SMS confirmation sent to +91 98765-43210.</p>
            <p className="mt-2 text-[11px] text-emerald-800 font-mono">Reply 0 for Main Menu</p>
          </div>
        );

      case 'WAITING_LIST_CONFIRMED':
        return (
          <div className="space-y-1">
            <p className="font-bold text-amber-950 border-b border-emerald-900 pb-0.5">
              ⏳ WAITING LIST REGISTERED
            </p>
            <p>Position: #3 in queue</p>
            <p>Centre: Mandi Kalan</p>
            <p className="text-[11px] leading-tight">
              You will receive an automated SMS and voice call as soon as gate crowd drops below 10 trolleys.
            </p>
            <p className="mt-2 text-[11px] text-emerald-800 font-mono">Reply 0 for Main Menu</p>
          </div>
        );

      case 'CROWD_STATUS':
        return (
          <div className="space-y-1">
            <p className="font-bold border-b border-emerald-900 pb-0.5">
              Mandi Kalan Centre Live:
            </p>
            <p>Current Queue: {currentQueue} Trolleys</p>
            <p>Arrival Pressure: {congestionRisk === 'HIGH' ? '🔴 HIGH RUSH' : '🟢 NORMAL'}</p>
            <p>Clearance Rate: 18 Farmers/hr</p>
            <p>Avg Gate Wait: 42 minutes</p>
            <p className="font-bold text-emerald-950">
              Recommended: Visit after 2:00 PM
            </p>
            <p className="mt-2 text-[11px] text-emerald-800 font-mono">Reply 0 to Go Back</p>
          </div>
        );

      case 'CALLBACK_CONFIRM':
        return (
          <div className="space-y-1">
            <p className="font-bold border-b border-emerald-900 pb-0.5">
              Request Operator Callback:
            </p>
            <p>Farmer: Sukhwinder Sharma</p>
            <p>Phone: +91 98765-43210</p>
            <p>Response: Within 15 minutes</p>
            <p className="mt-2">1. Confirm Request</p>
            <p>0. Cancel / Go Back</p>
          </div>
        );

      case 'CALLBACK_SUCCESS':
        return (
          <div className="space-y-1">
            <p className="font-bold text-emerald-950 border-b border-emerald-900 pb-0.5">
              ✓ CALLBACK SCHEDULED
            </p>
            <p>Ticket ID: #CB-408</p>
            <p>Centre desk operator will call your mobile within 15 minutes.</p>
            <p className="mt-2 text-[11px] text-emerald-800 font-mono">Reply 0 for Main Menu</p>
          </div>
        );

      case 'LANG_SELECT':
        return (
          <div className="space-y-1">
            <p className="font-bold border-b border-emerald-900 pb-0.5">
              Select Language / மொழியைத் தேர்வு செய்க:
            </p>
            <p>1. தமிழ் (Tamil)</p>
            <p>2. हिन्दी (Hindi)</p>
            <p>3. English</p>
            <p className="mt-2 text-[11px] text-emerald-800">Reply 1, 2 or 3 (0 for menu):</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      {/* Phone Case Simulator */}
      <div className="w-full max-w-[340px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-[40px] border-4 border-slate-700 shadow-2xl p-4 flex flex-col items-center">
        {/* Phone Earpiece */}
        <div className="w-16 h-1.5 bg-slate-700 rounded-full mb-3"></div>

        {/* Simulation Banner */}
        <div className="w-full flex items-center justify-between mb-2 px-1 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-mono">*384# USSD</span>
          </div>
          <span className="bg-slate-700/80 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
            Demo Simulation
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 1. Classic Feature Phone Monochrome LCD Display */}
        <div className="w-full bg-[#9ebb96] text-[#0a290a] rounded-2xl p-3.5 border-4 border-[#7a9972] shadow-inner font-mono text-xs flex flex-col justify-between min-h-[220px]">
          {/* LCD Top Status Bar */}
          <div className="flex items-center justify-between border-b border-emerald-900/40 pb-1 mb-2 text-[10px] font-bold">
            <span>SIGNAL: ▮▮▮▮ 2G</span>
            <span>MANDI KALAN</span>
            <span>BAT: 94%</span>
          </div>

          {/* LCD Main Text Dialog */}
          <div className="flex-1 space-y-1 leading-snug">
            {renderUssdContent()}
            {lastMessage && (
              <p className="text-[10px] text-rose-900 font-bold mt-1 bg-rose-200/60 px-1 rounded">
                {lastMessage}
              </p>
            )}
          </div>

          {/* LCD Reply Box */}
          <div className="mt-2 pt-2 border-t border-emerald-900/40 flex items-center gap-1.5">
            <span className="font-bold text-[11px]">Reply:</span>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="[ ]"
              className="flex-1 bg-[#8fae86] text-[#0a290a] font-mono font-black px-2 py-1 rounded border border-[#6b8c63] text-sm focus:outline-none"
              maxLength={4}
            />
          </div>
        </div>

        {/* 2. Soft Keys (Send / Cancel) */}
        <div className="w-full grid grid-cols-2 gap-3 mt-3 px-1">
          <button
            onClick={handleSend}
            className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md border-b-2 border-emerald-800 flex items-center justify-center gap-1.5 active:translate-y-0.5"
          >
            <Send className="h-3.5 w-3.5" />
            <span>SEND</span>
          </button>
          <button
            onClick={handleResetSession}
            className="py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md border-b-2 border-rose-800 flex items-center justify-center gap-1.5 active:translate-y-0.5"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            <span>CLEAR (0)</span>
          </button>
        </div>

        {/* 3. Physical Feature Phone Keypad (Section 16-18) */}
        <div className="w-full grid grid-cols-3 gap-2 mt-3 px-1">
          {[
            { num: '1', sub: '.,-' },
            { num: '2', sub: 'ABC' },
            { num: '3', sub: 'DEF' },
            { num: '4', sub: 'GHI' },
            { num: '5', sub: 'JKL' },
            { num: '6', sub: 'MNO' },
            { num: '7', sub: 'PQRS' },
            { num: '8', sub: 'TUV' },
            { num: '9', sub: 'WXYZ' },
            { num: '*', sub: 'USSD' },
            { num: '0', sub: 'MAIN' },
            { num: '#', sub: 'SEND' }
          ].map(k => (
            <button
              key={k.num}
              onClick={() => {
                if (k.num === '#') handleSend();
                else handleKeypadPress(k.num);
              }}
              className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 shadow-sm flex flex-col items-center justify-center active:bg-slate-600 transition-colors"
            >
              <span className="text-sm font-black leading-none">{k.num}</span>
              <span className="text-[8px] text-slate-400 font-mono mt-0.5 leading-none">{k.sub}</span>
            </button>
          ))}
        </div>

        {/* Bottom Phone Speaker / Microphone */}
        <div className="mt-3 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
        </div>
      </div>
    </div>
  );
};
