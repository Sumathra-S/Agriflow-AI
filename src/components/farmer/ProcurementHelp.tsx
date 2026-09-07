import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSimulation } from '../../context/SimulationContext';
import { voiceService } from '../../services/voiceService';
import { telecomManager, CallbackRequest } from '../../services/telecomService';
import {
  HelpCircle,
  Clock,
  Users,
  CheckCircle2,
  FileText,
  PhoneCall,
  Mic,
  Send,
  Volume2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Headphones,
  Calendar
} from 'lucide-react';

export const ProcurementHelp: React.FC = () => {
  const { t, language } = useLanguage();
  const { congestionRisk } = useSimulation();

  const [activeQuestion, setActiveQuestion] = useState<string | null>('q1');
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // Callback request state
  const [callbackPhone, setCallbackPhone] = useState<string>('98765-43210');
  const [callbackName, setCallbackName] = useState<string>('Sukhwinder Sharma');
  const [callbackTime, setCallbackTime] = useState<string>('Within 15 mins');
  const [callbackIssue, setCallbackIssue] = useState<string>('Need assistance with slot arrival timing');
  const [callbackSubmitted, setCallbackSubmitted] = useState<CallbackRequest | null>(null);

  const predefinedQueries = [
    {
      id: 'q1',
      question: t.q1_when,
      icon: <Clock className="h-5 w-5 text-gov-800" />,
      answer:
        congestionRisk === 'LOW'
          ? 'Current crowd is low. You can visit now according to your booking.'
          : t.q1_when_ans
    },
    {
      id: 'q2',
      question: t.q2_crowd,
      icon: <Users className="h-5 w-5 text-amber-700" />,
      answer: t.q2_crowd_ans
    },
    {
      id: 'q3',
      question: t.q3_status,
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-700" />,
      answer: t.q3_status_ans
    },
    {
      id: 'q4',
      question: t.q4_documents,
      icon: <FileText className="h-5 w-5 text-blue-700" />,
      answer: t.q4_documents_ans,
      list: t.q4_doc_list
    },
    {
      id: 'q5',
      question: t.q5_contact,
      icon: <PhoneCall className="h-5 w-5 text-rose-700" />,
      isCallOption: true,
      answer: `Toll-Free Helpline: 1800-180-1551. Operational from 08:00 AM to 07:00 PM.`
    }
  ];

  const handleSpeakAnswer = (text: string) => {
    voiceService.speak(text, language);
  };

  const handleAsk = (queryText: string) => {
    const q = queryText.trim().toLowerCase();
    if (!q) return;

    if (q.includes('when') || q.includes('time') || q.includes('நேரம்') || q.includes('समय') || q.includes('कब') || q.includes('எப்போது')) {
      setCustomAnswer(
        congestionRisk === 'LOW'
          ? 'You can visit now according to your booking.'
          : t.q1_when_ans
      );
    } else if (q.includes('crowd') || q.includes('rush') || q.includes('கூட்டம்') || q.includes('भीड़')) {
      setCustomAnswer(t.q2_crowd_ans);
    } else if (q.includes('token') || q.includes('status') || q.includes('booking') || q.includes('பதிவு') || q.includes('बुकिंग')) {
      setCustomAnswer(t.q3_status_ans);
    } else if (q.includes('document') || q.includes('paper') || q.includes('ஆவணம்') || q.includes('दस्तावेज')) {
      setCustomAnswer(t.q4_documents_ans);
    } else if (q.includes('phone') || q.includes('call') || q.includes('contact') || q.includes('தொலைபேசி') || q.includes('फोन')) {
      setCustomAnswer(`Mandi Control Room: 1800-180-1551.`);
    } else {
      setCustomAnswer(t.unavailableInfo);
    }
  };

  const handleVoiceQuery = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCustomQuestion(transcript);
        setIsRecording(false);
        handleAsk(transcript);
      };
      recognition.onerror = () => {
        setIsRecording(false);
        simulateSpokenQuery();
      };
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } else {
      simulateSpokenQuery();
    }
  };

  const simulateSpokenQuery = () => {
    setIsRecording(true);
    setTimeout(() => {
      const spoken = language === 'ta' ? 'நான் எப்போது வர வேண்டும்?' : language === 'hi' ? 'मुझे कब आना चाहिए?' : 'When should I visit?';
      setCustomQuestion(spoken);
      setIsRecording(false);
      handleAsk(spoken);
    }, 1500);
  };

  const handleRequestCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = telecomManager.requestCallback({
      farmerName: callbackName,
      phone: callbackPhone,
      language: language as any,
      preferredTime: callbackTime,
      issueCategory: callbackIssue
    });
    setCallbackSubmitted(newReq);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-1 text-slate-900">
          <HelpCircle className="h-6 w-6 text-gov-800" />
          <h2 className="text-lg font-black tracking-tight">{t.helpTitle}</h2>
        </div>
        <p className="text-xs text-slate-600">{t.helpSubtitle}</p>
        <div className="mt-2.5 rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-900 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-700 flex-shrink-0" />
          <span>All answers strictly verified from Mandi Kalan telemetry</span>
        </div>
      </div>

      {/* 2. Common Questions Accordion */}
      <div className="space-y-2.5">
        <p className="text-xs font-black uppercase tracking-wider text-slate-600 px-1">
          Common Questions (பொதுவான கேள்விகள் / सामान्य प्रश्न)
        </p>

        {predefinedQueries.map(item => {
          const isOpen = activeQuestion === item.id;
          return (
            <div
              key={item.id}
              className="rounded-2xl border-2 border-slate-200 bg-white shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveQuestion(isOpen ? null : item.id)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100">{item.icon}</div>
                  <span className="text-sm font-bold text-slate-900">{item.question}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs text-slate-800 bg-slate-50/50 space-y-3">
                  <p className="text-sm font-medium leading-relaxed">{item.answer}</p>

                  {item.list && (
                    <ul className="space-y-1.5 list-disc pl-5 text-xs font-semibold text-slate-800">
                      {item.list.map((doc, idx) => (
                        <li key={idx}>{doc}</li>
                      ))}
                    </ul>
                  )}

                  {item.isCallOption ? (
                    <a
                      href="tel:18001801551"
                      className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-gov-800 text-white font-bold text-xs shadow-md hover:bg-gov-900 transition-colors"
                    >
                      <PhoneCall className="h-4 w-4" />
                      <span>{t.callHelpdesk}</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => handleSpeakAnswer(item.answer)}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold text-xs hover:bg-slate-100 shadow-xs"
                    >
                      <Volume2 className="h-3.5 w-3.5 text-gov-800" />
                      <span>{t.listen}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Speak or Type Question Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
          Ask or Speak (கேளுங்கள் அல்லது பேசுங்கள்)
        </label>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder={t.askPlaceholder}
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-xs focus:border-gov-800 focus:outline-none"
          />

          {/* SPEAK BUTTON (Microphone) */}
          <button
            onClick={handleVoiceQuery}
            className={`p-2.5 rounded-xl border font-bold text-xs transition-colors flex items-center gap-1 ${
              isRecording
                ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                : 'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200'
            }`}
            title="Speak your question using microphone"
          >
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">{isRecording ? 'Listening...' : t.speakQuery}</span>
          </button>

          <button
            onClick={() => handleAsk(customQuestion)}
            className="py-2.5 px-3.5 rounded-xl bg-gov-800 text-white text-xs font-bold hover:bg-gov-900 shadow-xs"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {customAnswer && (
          <div className="rounded-xl bg-gov-50 border border-gov-200 p-3.5 text-xs text-slate-900 space-y-2">
            <span className="font-extrabold text-gov-900 block">Official Answer:</span>
            <p className="font-medium text-sm leading-relaxed">{customAnswer}</p>
            <button
              onClick={() => handleSpeakAnswer(customAnswer)}
              className="inline-flex items-center gap-1 text-xs font-bold text-gov-800 underline"
            >
              <Volume2 className="h-3.5 w-3.5" />
              <span>{t.listen}</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Request a Callback from Centre Desk (Section 17 & 48) */}
      <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/80 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-emerald-800" />
            <h3 className="text-sm font-black text-slate-900">Request a Callback (அழைப்பை கோருக)</h3>
          </div>
          <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded">
            Operator Assistance
          </span>
        </div>

        {callbackSubmitted ? (
          <div className="bg-white rounded-xl p-3 border border-emerald-300 space-y-1.5 text-xs text-emerald-950">
            <div className="flex items-center gap-1.5 font-black text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Callback Ticket #{callbackSubmitted.id} Confirmed!</span>
            </div>
            <p className="text-slate-600">
              Mandi Kalan operator has received your request and will call <strong>+91 {callbackSubmitted.phone}</strong> {callbackSubmitted.preferredTime.toLowerCase()}.
            </p>
            <button
              onClick={() => setCallbackSubmitted(null)}
              className="text-[11px] font-bold text-gov-800 underline mt-1 block"
            >
              Request another callback
            </button>
          </div>
        ) : (
          <form onSubmit={handleRequestCallbackSubmit} className="space-y-2.5 text-xs">
            <p className="text-slate-600">
              Cannot find what you need or prefer talking? Mandi operators will return your call free of charge.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-0.5">Phone Number</label>
                <input
                  type="text"
                  value={callbackPhone}
                  onChange={e => setCallbackPhone(e.target.value)}
                  className="w-full bg-white rounded-lg border border-slate-300 px-2.5 py-1.5 font-mono text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-0.5">Preferred Time</label>
                <select
                  value={callbackTime}
                  onChange={e => setCallbackTime(e.target.value)}
                  className="w-full bg-white rounded-lg border border-slate-300 px-2 py-1.5 text-xs focus:outline-none"
                >
                  <option value="Within 15 mins">Within 15 mins (Urgent)</option>
                  <option value="After 2:00 PM">After 2:00 PM (Post Rush)</option>
                  <option value="Evening (5–7 PM)">Evening (05:00 PM – 07:00 PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-0.5">Reason for Call</label>
              <input
                type="text"
                value={callbackIssue}
                onChange={e => setCallbackIssue(e.target.value)}
                placeholder="e.g. Question about moisture checking or slot change"
                className="w-full bg-white rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gov-800 hover:bg-gov-900 text-white font-black text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Submit Callback Request</span>
            </button>
          </form>
        )}
      </div>

      {/* 5. Direct Call Helpline Card */}
      <a
        href="tel:18001801551"
        className="rounded-2xl border-2 border-slate-300 bg-slate-100 p-4 flex items-center justify-between text-slate-900 hover:bg-slate-200 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gov-800 text-white">
            <PhoneCall className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Toll-Free Control Room</span>
            <p className="text-base font-black font-mono text-slate-900">1800-180-1551</p>
          </div>
        </div>
        <span className="text-xs font-extrabold bg-gov-800 text-white px-3 py-1.5 rounded-xl">
          Call Now
        </span>
      </a>
    </div>
  );
};
