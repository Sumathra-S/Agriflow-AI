import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSimulation } from '../../context/SimulationContext';
import { LanguageCode } from '../../types/procurement';
import { voiceService } from '../../services/voiceService';
import {
  Phone,
  PhoneOff,
  PhoneCall,
  Volume2,
  X,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Hash,
  Delete
} from 'lucide-react';

interface IvrPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMissedCall?: boolean;
}

type IvrStep =
  | 'IDLE'
  | 'RINGING'
  | 'LANG_SELECT'
  | 'ENTER_FARMER_ID'
  | 'MAIN_MENU'
  | 'BOOKING_STATUS'
  | 'BOOK_SLOT_SELECT'
  | 'CONFIRM_SLOT'
  | 'BOOKING_SUCCESS'
  | 'CROWD_STATUS'
  | 'HELP_MESSAGE';

export const IvrPhoneModal: React.FC<IvrPhoneModalProps> = ({
  isOpen,
  onClose,
  initialMissedCall = false
}) => {
  const { language: currentAppLang } = useLanguage();
  const { congestionRisk, currentQueue } = useSimulation();

  const [callState, setCallState] = useState<IvrStep>('IDLE');
  const [ivrLang, setIvrLang] = useState<LanguageCode>('ta');
  const [enteredDigits, setEnteredDigits] = useState<string>('');
  const [transcript, setTranscript] = useState<string[]>([]);
  const [selectedSlotText, setSelectedSlotText] = useState<string>('2:00 PM');
  const [callerNumber, setCallerNumber] = useState<string>('+91 98765-43210');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      if (initialMissedCall) {
        handleMissedCallSimulation();
      } else {
        startCall();
      }
    } else {
      endCall();
    }
  }, [isOpen]);

  const speakPrompt = (text: string, lang: LanguageCode) => {
    setTranscript(prev => [...prev, `[IVR Voice]: ${text}`]);
    if (!isMuted) {
      voiceService.speak(text, lang);
    }
  };

  const startCall = () => {
    voiceService.stop();
    setCallState('LANG_SELECT');
    setEnteredDigits('');
    setTranscript(['--- Call Connected to 1800-AGRIFLOW ---']);

    // Welcome prompt
    const prompt = 'Welcome to AgriFlow. தமிழுக்கு 1ஐ அழுத்தவும். हिंदी के लिए 2 दबाएं. Press 3 for English.';
    speakPrompt(prompt, 'en');
  };

  const handleMissedCallSimulation = () => {
    voiceService.stop();
    setCallState('RINGING');
    setTranscript([
      '--- Missed Call Received from +91 98765-43210 ---',
      'System: Registered farmer identified (Sukhwinder Sharma). Initiating automated callback in 2 seconds...'
    ]);

    setTimeout(() => {
      setCallState('LANG_SELECT');
      const prompt = 'வணக்கம். அக்ரிஃப்ளோவிலிருந்து தானியங்கி அழைப்பு. தமிழுக்கு 1ஐ அழுத்தவும். हिंदी के लिए 2 दबाएं. Press 3 for English.';
      speakPrompt(prompt, 'ta');
    }, 2200);
  };

  const endCall = () => {
    voiceService.stop();
    setCallState('IDLE');
    setEnteredDigits('');
  };

  const handleDtmf = (key: string) => {
    setTranscript(prev => [...prev, `[Keypad Press]: ${key}`]);

    // 1. Language Selection
    if (callState === 'LANG_SELECT') {
      if (key === '1') {
        setIvrLang('ta');
        setCallState('ENTER_FARMER_ID');
        speakPrompt('உங்கள் நான்கு இலக்க உழவர் எண்ணை உள்ளிட்டு, பிறகு ஹேஷ்டேக் குறியை அழுத்தவும். மாதிரிக்கு 1024# அழுத்தவும்.', 'ta');
      } else if (key === '2') {
        setIvrLang('hi');
        setCallState('ENTER_FARMER_ID');
        speakPrompt('कृपया अपना चार अंकों का किसान आईडी दर्ज करें और हैश दबाएं। उदाहरण के लिए 1024# दबाएं।', 'hi');
      } else {
        setIvrLang('en');
        setCallState('ENTER_FARMER_ID');
        speakPrompt('Please enter your four digit Farmer ID followed by the hash key. Example: press 1024#.', 'en');
      }
      return;
    }

    // 2. Farmer ID input (digits + #)
    if (callState === 'ENTER_FARMER_ID') {
      if (key === '#') {
        // Authenticate
        setCallState('MAIN_MENU');
        if (ivrLang === 'ta') {
          speakPrompt(
            'வணக்கம் சுகவிந்தர் சர்மா. முன்பதிவு நிலையை அறிய 1ஐ அழுத்தவும். புதிய வருகை முன்பதிவு செய்ய 2ஐ அழுத்தவும். நிலைய நெரிசல் நிலையை அறிய 3ஐ அழுத்தவும். உதவிக்கு 4ஐ அழுத்தவும்.',
            'ta'
          );
        } else if (ivrLang === 'hi') {
          speakPrompt(
            'नमस्ते सुखविंदर शर्मा। अपनी बुकिंग जांचने के लिए 1 दबाएं। नया स्लॉट बुक करने के लिए 2 दबाएं। खरीद केंद्र की भीड़ जानने के लिए 3 दबाएं। सहायता के लिए 4 दबाएं।',
            'hi'
          );
        } else {
          speakPrompt(
            'Welcome Sukhwinder Sharma. Press 1 to check booking status. Press 2 to book a visit. Press 3 for centre crowd information. Press 4 for help.',
            'en'
          );
        }
      } else {
        setEnteredDigits(prev => prev + key);
      }
      return;
    }

    // 3. Main Menu Navigation
    if (callState === 'MAIN_MENU') {
      if (key === '1') {
        // Check Booking
        setCallState('BOOKING_STATUS');
        if (ivrLang === 'ta') {
          speakPrompt(
            'உங்கள் டோக்கன் எண் 1024 உறுதி செய்யப்பட்டுள்ளது. ஒதுக்கப்பட்ட நேரம் முற்பகல் 11:30 முதல் 12:30 வரை. அதிக கூட்டம் உள்ளதால் நீங்கள் மதியம் 2:00 மணிக்கு மேல் வரலாம். உங்கள் டோக்கன் முறை பாதுகாப்பாக இருக்கும். முதன்மை மெனுவுக்கு திரும்ப 9ஐ அழுத்தவும்.',
            'ta'
          );
        } else if (ivrLang === 'hi') {
          speakPrompt(
            'आपका टोकन नंबर 1024 कन्फर्म है। आवंटित समय पूर्वाह्न 11:30 से 12:30 है। भारी भीड़ के कारण आप दोपहर 2:00 बजे के बाद आ सकते हैं। मुख्य मेनू के लिए 9 दबाएं।',
            'hi'
          );
        } else {
          speakPrompt(
            'Your Token #1024 is Confirmed for 11:30 AM. Due to crowd, recommended visit is after 2:00 PM. Your token remains fully protected. Press 9 to return to Main Menu.',
            'en'
          );
        }
      } else if (key === '2') {
        // Book a visit
        setCallState('BOOK_SLOT_SELECT');
        if (ivrLang === 'ta') {
          speakPrompt(
            'மண்டி கலான் நிலையத்திற்கான நேரங்கள்: முற்பகல் 10:00 மணிக்கு 1ஐ அழுத்தவும். நண்பகல் 12:00 மணிக்கு 2ஐ அழுத்தவும். மதியம் 2:00 மணிக்கு 3ஐ அழுத்தவும்.',
            'ta'
          );
        } else if (ivrLang === 'hi') {
          speakPrompt(
            'मंडी कलां केंद्र के लिए उपलब्ध समय: प्रातः 10:00 बजे के लिए 1 दबाएं। दोपहर 12:00 बजे के लिए 2 दबाएं। दोपहर 2:00 बजे के लिए 3 दबाएं।',
            'hi'
          );
        } else {
          speakPrompt(
            'Available slots for Mandi Kalan: Press 1 for 10:00 AM. Press 2 for 12:00 PM. Press 3 for 2:00 PM.',
            'en'
          );
        }
      } else if (key === '3') {
        // Crowd information
        setCallState('CROWD_STATUS');
        const crowdInfo =
          congestionRisk === 'HIGH'
            ? 'தற்போது கொள்முதல் நிலையத்தில் கூட்டம் அதிகமாக உள்ளது. 23 டிராக்டர்கள் காத்திருக்கின்றன. மதியம் 2:00 மணிக்கு மேல் வர பரிந்துரைக்கப்படுகிறது.'
            : 'தற்போது கொள்முதல் நிலையத்தில் கூட்டம் குறைவாக உள்ளது. நீங்கள் உடனடியாக வரலாம்.';
        speakPrompt(crowdInfo, ivrLang);
      } else if (key === '4') {
        // Help
        setCallState('HELP_MESSAGE');
        speakPrompt(
          'கொள்முதல் நிலைய உதவி எண் 1800-180-1551. தேவையான ஆவணங்கள்: ஆதார் அட்டை, பட்டா சிட்டா நகல், மற்றும் வங்கிக் கணக்குப் புத்தகம். முதன்மை மெனுவுக்கு 9ஐ அழுத்தவும்.',
          ivrLang
        );
      }
      return;
    }

    // 4. Slot Selection
    if (callState === 'BOOK_SLOT_SELECT') {
      let chosen = '2:00 PM';
      if (key === '1') chosen = '10:00 AM';
      if (key === '2') chosen = '12:00 PM';
      if (key === '3') chosen = '2:00 PM';

      setSelectedSlotText(chosen);
      setCallState('CONFIRM_SLOT');

      if (ivrLang === 'ta') {
        speakPrompt(`நீங்கள் தேர்ந்தெடுத்த நேரம்: ${chosen}. இதை உறுதி செய்ய 1ஐ அழுத்தவும். மாற்ற 2ஐ அழுத்தவும்.`, 'ta');
      } else if (ivrLang === 'hi') {
        speakPrompt(`आपने चुना है: ${chosen}। पुष्टि करने के लिए 1 दबाएं। बदलने के लिए 2 दबाएं।`, 'hi');
      } else {
        speakPrompt(`You selected ${chosen}. Press 1 to confirm. Press 2 to reselect.`, 'en');
      }
      return;
    }

    // 5. Confirm Slot
    if (callState === 'CONFIRM_SLOT') {
      if (key === '1') {
        setCallState('BOOKING_SUCCESS');
        if (ivrLang === 'ta') {
          speakPrompt(
            `உங்கள் டோக்கன் #1048, ${selectedSlotText} மணிக்கு வெற்றிகரமாக உறுதி செய்யப்பட்டுள்ளது. உறுதிப்படுத்தல் SMS உங்கள் மொபைலுக்கு அனுப்பப்பட்டுள்ளது. அக்ரிஃப்ளோவை பயன்படுத்தியதற்கு நன்றி.`,
            'ta'
          );
        } else if (ivrLang === 'hi') {
          speakPrompt(
            `आपका टोकन #1048, ${selectedSlotText} बजे के लिए सफलतापूर्वक बुक हो गया है। पुष्टि एसएमएस भेज दिया गया है। धन्यवाद।`,
            'hi'
          );
        } else {
          speakPrompt(
            `Your Token #1048 for ${selectedSlotText} is successfully confirmed. A confirmation SMS has been dispatched. Thank you for calling AgriFlow.`,
            'en'
          );
        }
      } else {
        setCallState('BOOK_SLOT_SELECT');
      }
      return;
    }

    // Global return to main menu
    if (key === '9') {
      setCallState('MAIN_MENU');
      speakPrompt('முதன்மை மெனு: நிலைக்கு 1, முன்பதிவுக்கு 2, கூட்டத்திற்கு 3, உதவிக்கு 4 அழுத்தவும்.', ivrLang);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 text-white rounded-[40px] shadow-2xl border-4 border-slate-700 overflow-hidden p-5 ring-1 ring-slate-600 flex flex-col">
        {/* Top Phone Bezel & Speaker */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
              AgriFlow IVR Simulator
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Feature Phone Screen Display */}
        <div className="my-3 rounded-2xl bg-emerald-950/90 border-2 border-emerald-800 p-3.5 shadow-inner text-emerald-200 font-mono text-xs min-h-[160px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] text-emerald-400 pb-1 border-b border-emerald-900">
              <span>{callState === 'RINGING' ? 'INCOMING CALL...' : '1800-AGRIFLOW'}</span>
              <span>{callState === 'IDLE' ? 'ENDED' : '00:48 • LIVE'}</span>
            </div>

            <div className="mt-2 text-[11px] font-bold text-white leading-relaxed">
              {callState === 'LANG_SELECT' && (
                <div>
                  <p>1: தமிழ் (Tamil)</p>
                  <p>2: हिन्दी (Hindi)</p>
                  <p>3: English</p>
                </div>
              )}

              {callState === 'ENTER_FARMER_ID' && (
                <div>
                  <p>Enter Farmer ID + #:</p>
                  <p className="text-lg text-amber-300 font-black tracking-widest mt-1">
                    {enteredDigits || '____#'}
                  </p>
                  <p className="text-[10px] text-emerald-400 mt-1">Hint: Press 1 0 2 4 #</p>
                </div>
              )}

              {callState === 'MAIN_MENU' && (
                <div className="space-y-0.5">
                  <p className="text-emerald-300 font-bold">FARMER: Sukhwinder (#1024)</p>
                  <p>1. Check Token Status</p>
                  <p>2. Book Visit Slot</p>
                  <p>3. Centre Crowd Level</p>
                  <p>4. Official Helpdesk</p>
                </div>
              )}

              {callState === 'BOOK_SLOT_SELECT' && (
                <div className="space-y-0.5">
                  <p className="text-emerald-300 font-bold">Available Slots:</p>
                  <p>1. 10:00 AM</p>
                  <p>2. 12:00 PM</p>
                  <p>3. 02:00 PM (Recommended)</p>
                </div>
              )}

              {callState === 'CONFIRM_SLOT' && (
                <div>
                  <p className="text-amber-300 font-bold">Selected: {selectedSlotText}</p>
                  <p>Press 1 to Confirm</p>
                  <p>Press 2 to Change</p>
                </div>
              )}

              {callState === 'BOOKING_SUCCESS' && (
                <div className="text-emerald-300">
                  <p className="text-sm font-black">✓ BOOKING CONFIRMED</p>
                  <p>Token: #1048</p>
                  <p>Slot: {selectedSlotText}</p>
                  <p className="text-[10px] text-white mt-1">Confirmation SMS sent</p>
                </div>
              )}

              {callState === 'BOOKING_STATUS' && (
                <div className="space-y-0.5">
                  <p className="text-emerald-300 font-bold">Token #1024 (Confirmed)</p>
                  <p>Assigned: 11:30 AM</p>
                  <p className="text-amber-300 font-bold">Best time: After 2:00 PM</p>
                  <p className="text-[10px]">Press 9 for Main Menu</p>
                </div>
              )}

              {callState === 'CROWD_STATUS' && (
                <div>
                  <p className="text-amber-300 font-bold">Mandi Kalan: HIGH CROWD</p>
                  <p>23 Trolleys Waiting</p>
                  <p>Best Time: After 2:00 PM</p>
                  <p className="text-[10px] mt-1">Press 9 for Main Menu</p>
                </div>
              )}

              {callState === 'HELP_MESSAGE' && (
                <div>
                  <p className="text-emerald-300 font-bold">Helpline: 1800-180-1551</p>
                  <p>Bring: Aadhaar, Land Record, Passbook</p>
                  <p className="text-[10px] mt-1">Press 9 for Main Menu</p>
                </div>
              )}
            </div>
          </div>

          <div className="text-[10px] text-emerald-500 pt-1 border-t border-emerald-900 flex justify-between">
            <span>DTMF Audio Feedback</span>
            <span>{ivrLang.toUpperCase()} Mode</span>
          </div>
        </div>

        {/* Missed Call Quick Button */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <button
            onClick={handleMissedCallSimulation}
            className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[11px] font-bold text-amber-300 transition-colors flex items-center justify-center gap-1.5"
            title="Simulate farmer giving a missed call to receive automated callback"
          >
            <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
            <span>Test Missed Call Callback</span>
          </button>
        </div>

        {/* 12-Key DTMF Keypad */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-850 rounded-2xl">
          {[
            { key: '1', sub: '.,' },
            { key: '2', sub: 'ABC' },
            { key: '3', sub: 'DEF' },
            { key: '4', sub: 'GHI' },
            { key: '5', sub: 'JKL' },
            { key: '6', sub: 'MNO' },
            { key: '7', sub: 'PQRS' },
            { key: '8', sub: 'TUV' },
            { key: '9', sub: 'WXYZ' },
            { key: '*', sub: ' ' },
            { key: '0', sub: '+' },
            { key: '#', sub: ' ' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => handleDtmf(item.key)}
              className="flex flex-col items-center justify-center py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-emerald-700 border border-slate-700 text-white shadow-xs transition-all"
            >
              <span className="text-lg font-black leading-none">{item.key}</span>
              <span className="text-[8px] text-slate-400 font-mono tracking-widest">{item.sub}</span>
            </button>
          ))}
        </div>

        {/* Bottom Call Controls */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={startCall}
            className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
          >
            <Phone className="h-4 w-4" />
            <span>Call 1800</span>
          </button>

          <button
            onClick={endCall}
            className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
          >
            <PhoneOff className="h-4 w-4" />
            <span>End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
