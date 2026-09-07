import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSimulation } from '../../context/SimulationContext';
import { telecomManager } from '../../services/telecomService';
import { voiceService } from '../../services/voiceService';
import { LanguageCode, CommunicationChannel } from '../../types/procurement';
import {
  Send,
  Volume2,
  VolumeX,
  MessageSquare,
  PhoneCall,
  Smartphone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Check,
  RotateCw
} from 'lucide-react';

export const CommunicationCentre: React.FC = () => {
  const { language } = useLanguage();
  const { congestionRisk, farmerAdvisorySent, executeAction } = useSimulation();

  // Selection states
  const [targetGroup, setTargetGroup] = useState<'UPCOMING' | 'CROWD_AFFECTED' | 'CUSTOM'>('UPCOMING');
  const [messageType, setMessageType] = useState<'CROWD_ALERT' | 'RECOMMENDED_ARRIVAL' | 'BOOKING_CONFIRMATION' | 'CENTRE_INFO'>('CROWD_ALERT');
  const [selectedChannels, setSelectedChannels] = useState<CommunicationChannel[]>(['SMS', 'VOICE', 'APP']);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('ta');

  // Audio Preview State
  const [isPreviewSpeaking, setIsPreviewSpeaking] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  // Delivery Tracking Stats
  const [stats, setStats] = useState(telecomManager.deliveryStats);
  const recentJobs = telecomManager.recentJobs;

  const targetCount = targetGroup === 'UPCOMING' ? 48 : targetGroup === 'CROWD_AFFECTED' ? 32 : 12;

  // Templates in Tamil, Hindi, and English (strictly template-based, not ungrounded LLM)
  const templates: Record<string, Record<LanguageCode, string>> = {
    CROWD_ALERT: {
      ta: 'அக்ரிஃப்ளோ தகவல்: சிங்காநல்லூர் கொள்முதல் நிலையத்தில் தற்போது அதிக கூட்டம் உள்ளது. காத்திருப்பு நேரத்தை குறைக்க, முடிந்தால் மதியம் 2:00 மணிக்கு மேல் வரவும். உங்கள் முன்பதிவு ரத்தாகாது.',
      hi: 'एग्रीफ्लो सूचना: सिंगनल्लूर खरीद केंद्र पर वर्तमान में भारी भीड़ है। प्रतीक्षा समय कम करने के लिए, यदि संभव हो तो दोपहर 2:00 बजे के बाद आएं। आपकी बुकिंग मान्य रहेगी।',
      en: 'AGRIFLOW UPDATE: Singanallur centre is currently experiencing high arrival pressure. Recommended visit: After 2:00 PM. Your booking remains fully active and guaranteed.'
    },
    RECOMMENDED_ARRIVAL: {
      ta: 'அக்ரிஃப்ளோ வருகை வழிகாட்டி: இன்று மதியம் 2:00 மணிக்கு மேல் வருவது உங்கள் டிராக்டர் காத்திருக்கும் நேரத்தை குறைக்கும். டோக்கன் முறை பாதுகாப்பானது.',
      hi: 'एग्रीफ्लो आगमन सलाह: आज दोपहर 2:00 बजे के बाद आने पर ट्रॉली का इंतज़ार बहुत कम होगा। आपका टोकन पूरी तरह सुरक्षित है।',
      en: 'AGRIFLOW ADVISORY: Arriving after 2:00 PM will significantly reduce tractor waiting time. Your token priority is protected.'
    },
    BOOKING_CONFIRMATION: {
      ta: 'அக்ரிஃப்ளோ உறுதிப்படுத்தல்: உங்கள் நெல் கொள்முதல் முன்பதிவு உறுதி செய்யப்பட்டது. டோக்கன் #1024. நுழைவாயில் 2 (சிங்காநல்லூர்).',
      hi: 'एग्रीफ्लो पुष्टि: आपकी धान खरीद बुकिंग कन्फर्म हो गई है। टोकन #1024। गेट नंबर 2 (सिंगनल्लूर)।',
      en: 'AGRIFLOW CONFIRMATION: Your Paddy procurement booking is confirmed. Token #1024. Gate 2 (Singanallur Centre).'
    },
    CENTRE_INFO: {
      ta: 'அக்ரிஃப்ளோ பொது அறிவிப்பு: சிங்காநல்லூர் கொள்முதல் நிலையம் இன்று மாலை 7:00 மணி வரை தொடர்ந்து செயல்படும். அனுமதிக்கப்பட்ட ஈரப்பதம் 17% வரை.',
      hi: 'एग्रीफ्लो सार्वजनिक सूचना: सिंगनल्लूर केंद्र आज सायं 7:00 बजे तक खुला रहेगा। मानक नमी सीमा 17% है।',
      en: 'AGRIFLOW NOTICE: Singanallur procurement centre will remain open until 7:00 PM today. Permissible moisture threshold is 17%.'
    }
  };

  const previewText = templates[messageType][selectedLanguage];

  const handleToggleChannel = (channel: CommunicationChannel) => {
    setSelectedChannels(prev =>
      prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
    );
  };

  const handleVoicePreview = () => {
    if (isPreviewSpeaking) {
      voiceService.stop();
      setIsPreviewSpeaking(false);
    } else {
      setIsPreviewSpeaking(true);
      voiceService.speak(
        previewText,
        selectedLanguage,
        () => setIsPreviewSpeaking(true),
        () => setIsPreviewSpeaking(false)
      );
    }
  };

  const handleSendAlert = async () => {
    setIsSending(true);
    // Trigger simulation context so farmer app receives it
    executeAction('act-1');

    await telecomManager.dispatchAlert(
      targetCount,
      messageType,
      selectedChannels,
      selectedLanguage,
      previewText
    );

    setStats({ ...telecomManager.deliveryStats });
    setIsSending(false);
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-gov-800" />
            <span>Operator Communication Centre</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-channel broadcast dispatch • SMS, Voice IVR Broadcast & App Push
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold bg-gov-50 text-gov-900 px-3 py-1.5 rounded-lg border border-gov-200">
          <span>Target Pool: {targetCount} Farmers Selected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* 1. Select Farmers */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-gov">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2.5">
              1. Select Target Farmers
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetGroup('UPCOMING')}
                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                  targetGroup === 'UPCOMING'
                    ? 'border-gov-800 bg-gov-50 font-bold text-gov-950 ring-1 ring-gov-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-gov-900">48 Farmers</span>
                  <Users className="h-4 w-4 text-gov-800" />
                </div>
                <span>Upcoming Bookings (11:30–13:30)</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetGroup('CROWD_AFFECTED')}
                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                  targetGroup === 'CROWD_AFFECTED'
                    ? 'border-amber-700 bg-amber-50 font-bold text-amber-950 ring-1 ring-amber-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-amber-900">32 Farmers</span>
                  <AlertTriangle className="h-4 w-4 text-amber-700" />
                </div>
                <span>Crowd-Affected Farmers</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetGroup('CUSTOM')}
                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                  targetGroup === 'CUSTOM'
                    ? 'border-blue-700 bg-blue-50 font-bold text-blue-950 ring-1 ring-blue-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-blue-900">12 Farmers</span>
                  <CheckCircle2 className="h-4 w-4 text-blue-700" />
                </div>
                <span>Gate 2 Waiting Queue</span>
              </button>
            </div>
          </div>

          {/* 2. Select Message Type */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-gov">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2.5">
              2. Select Verified Template
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'CROWD_ALERT', label: '🔴 Crowd Alert', desc: 'Heavy arrival pressure warning' },
                { id: 'RECOMMENDED_ARRIVAL', label: '🟡 Recommended Arrival Time', desc: 'Suggest afternoon visit' },
                { id: 'BOOKING_CONFIRMATION', label: '📅 Booking Confirmation', desc: 'Token slot notification' },
                { id: 'CENTRE_INFO', label: 'ℹ Centre Update', desc: 'Operating hours & moisture rules' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setMessageType(item.id as any)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    messageType === item.id
                      ? 'border-gov-800 bg-gov-50 font-bold text-gov-950 ring-1 ring-gov-800'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold block">{item.label}</span>
                  <span className="text-[11px] text-slate-500">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Channels & Language */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-gov grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                3. Channels (Multi-Channel)
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'SMS', label: 'SMS Broadcast (Standard Cellular)', icon: <MessageSquare className="h-4 w-4 text-gov-800" /> },
                  { id: 'VOICE', label: 'Voice IVR Broadcast (Automated Call)', icon: <PhoneCall className="h-4 w-4 text-amber-700" /> },
                  { id: 'APP', label: 'Smartphone App Push', icon: <Smartphone className="h-4 w-4 text-blue-700" /> },
                ].map(ch => (
                  <label
                    key={ch.id}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-800 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedChannels.includes(ch.id as any)}
                      onChange={() => handleToggleChannel(ch.id as any)}
                      className="rounded border-slate-300 text-gov-800 focus:ring-gov-800"
                    />
                    {ch.icon}
                    <span>{ch.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Broadcast Language
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { code: 'ta', label: 'தமிழ்', sub: 'Tamil' },
                  { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
                  { code: 'en', label: 'English', sub: 'Eng' },
                ].map(l => (
                  <button
                    key={l.code}
                    onClick={() => setSelectedLanguage(l.code as any)}
                    className={`py-2 px-2 rounded-lg border text-center text-xs font-bold transition-all ${
                      selectedLanguage === l.code
                        ? 'bg-gov-800 text-white border-gov-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>{l.label}</div>
                    <div className="text-[10px] font-normal opacity-80">{l.sub}</div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                Messages are routed in each farmer's registered preferred language automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Message Preview & Delivery Stats (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Message Preview Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-gov">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Official Broadcast Preview
              </span>
              <span className="text-[11px] font-mono text-slate-400">Template Verified</span>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-900 leading-relaxed font-medium">
              <p>{previewText}</p>
            </div>

            {/* Voice Preview & Send Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={handleVoicePreview}
                className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold shadow-xs transition-colors ${
                  isPreviewSpeaking
                    ? 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isPreviewSpeaking ? (
                  <>
                    <VolumeX className="h-4 w-4 text-rose-700" />
                    <span>Stop Preview</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 text-gov-800" />
                    <span>🔊 Play Voice Preview</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSendAlert}
                disabled={isSending || selectedChannels.length === 0}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gov-800 hover:bg-gov-900 text-white text-xs font-extrabold shadow-md transition-colors disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <RotateCw className="h-4 w-4 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : sentSuccess ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-300" />
                    <span>Alert Dispatched!</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Alert ({targetCount})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Delivery Tracking Counters (Section 30) */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-gov space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Telecom Delivery Tracking
              </h3>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Gateway Active
              </span>
            </div>

            {/* SMS Stats */}
            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-slate-800">
                <MessageSquare className="h-4 w-4 text-gov-800" /> SMS Dispatch
              </span>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-emerald-700 font-bold">✓ Delivered: {stats.sms.delivered}</span>
                <span className="text-amber-700">⏳ Pending: {stats.sms.pending}</span>
                <span className="text-rose-700">✕ Failed: {stats.sms.failed}</span>
              </div>
            </div>

            {/* Voice Stats */}
            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-slate-800">
                <PhoneCall className="h-4 w-4 text-amber-700" /> Voice Outbound
              </span>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-emerald-700 font-bold">✓ Connected: {stats.voice.connected}</span>
                <span className="text-amber-700">⏳ Calling: {stats.voice.calling}</span>
                <span className="text-slate-500">✕ Busy: {stats.voice.busy}</span>
              </div>
            </div>

            {/* App Push */}
            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-slate-800">
                <Smartphone className="h-4 w-4 text-blue-700" /> App Push
              </span>
              <div className="font-mono text-[11px] text-emerald-700 font-bold">
                ✓ Delivered: {stats.app.pushed}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODULE 5: COMMUNICATION ESCALATION PIPELINE (Section 9) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-gov space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900">
                Communication Escalation Pipeline
              </h3>
              <span className="text-[10px] font-mono bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded font-bold uppercase">
                Module 5 • Simulated Telephony
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Sending a message is not the same as reaching a farmer. Automatic escalation ensures zero dropped communications.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
            Selected: 18 • Delivered: 12 • Voice: 4 • Needs Follow-up: 2
          </div>
        </div>

        {/* 5-Step Escalation Path */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1.5 text-slate-900">
            <span className="h-5 w-5 rounded-full bg-gov-800 text-white flex items-center justify-center text-[10px] font-bold">1</span>
            <span>Alert Created</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 text-slate-900">
            <span className="h-5 w-5 rounded-full bg-gov-800 text-white flex items-center justify-center text-[10px] font-bold">2</span>
            <span>SMS Dispatch</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 text-slate-900">
            <span className="h-5 w-5 rounded-full bg-gov-800 text-white flex items-center justify-center text-[10px] font-bold">3</span>
            <span>Delivery Tracking</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 text-amber-900">
            <span className="h-5 w-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">4</span>
            <span>Voice Call Backup</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 text-rose-900">
            <span className="h-5 w-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold">5</span>
            <span>Operator Call List</span>
          </div>
        </div>

        {/* Escalation Log Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono text-[10px]">
              <tr>
                <th className="px-3 py-2.5">Farmer Name</th>
                <th className="px-3 py-2.5">Mobile</th>
                <th className="px-3 py-2.5">Slot</th>
                <th className="px-3 py-2.5">SMS Status</th>
                <th className="px-3 py-2.5">Voice Backup</th>
                <th className="px-3 py-2.5">Escalation State</th>
                <th className="px-3 py-2.5 text-right">Operator Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr className="hover:bg-slate-50/80">
                <td className="px-3 py-2.5 font-bold text-slate-900">Sukhwinder Sharma</td>
                <td className="px-3 py-2.5 font-mono text-slate-600">98765-43210</td>
                <td className="px-3 py-2.5">11:30 AM</td>
                <td className="px-3 py-2.5 text-emerald-700 font-bold">✓ Delivered</td>
                <td className="px-3 py-2.5 text-slate-400">Not Needed</td>
                <td className="px-3 py-2.5"><span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Reached</span></td>
                <td className="px-3 py-2.5 text-right text-slate-400">Done</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="px-3 py-2.5 font-bold text-slate-900">Ramasamy K.</td>
                <td className="px-3 py-2.5 font-mono text-slate-600">98421-33445</td>
                <td className="px-3 py-2.5">12:00 PM</td>
                <td className="px-3 py-2.5 text-rose-700 font-semibold">✕ Failed (Timeout)</td>
                <td className="px-3 py-2.5 text-emerald-700 font-bold">✓ Connected (32s)</td>
                <td className="px-3 py-2.5"><span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Voice Reached</span></td>
                <td className="px-3 py-2.5 text-right text-slate-400">Done</td>
              </tr>
              <tr className="hover:bg-amber-50/50 bg-amber-50/30">
                <td className="px-3 py-2.5 font-bold text-slate-900">Murugesan P.</td>
                <td className="px-3 py-2.5 font-mono text-slate-600">98940-11223</td>
                <td className="px-3 py-2.5">11:00 AM</td>
                <td className="px-3 py-2.5 text-rose-700 font-semibold">✕ Undelivered</td>
                <td className="px-3 py-2.5 text-rose-700 font-semibold">✕ Busy (3 tries)</td>
                <td className="px-3 py-2.5"><span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold animate-pulse">Needs Call</span></td>
                <td className="px-3 py-2.5 text-right">
                  <a
                    href="tel:9894011223"
                    className="inline-flex items-center gap-1 bg-gov-800 hover:bg-gov-900 text-white text-[11px] font-bold px-2 py-1 rounded shadow-xs"
                  >
                    <PhoneCall className="h-3 w-3" />
                    <span>Call Now</span>
                  </a>
                </td>
              </tr>
              <tr className="hover:bg-amber-50/50 bg-amber-50/30">
                <td className="px-3 py-2.5 font-bold text-slate-900">Baldev Raj</td>
                <td className="px-3 py-2.5 font-mono text-slate-600">98150-77889</td>
                <td className="px-3 py-2.5">12:30 PM</td>
                <td className="px-3 py-2.5 text-amber-700 font-semibold">⏳ Network Queue</td>
                <td className="px-3 py-2.5 text-slate-400">Pending</td>
                <td className="px-3 py-2.5"><span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">In Escalation</span></td>
                <td className="px-3 py-2.5 text-right">
                  <button
                    onClick={() => alert('Simulated outbound retry triggered for Baldev Raj')}
                    className="inline-flex items-center gap-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-[11px] font-bold px-2 py-1 rounded"
                  >
                    <RotateCw className="h-3 w-3" />
                    <span>Retry</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
