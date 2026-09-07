import {
  LanguageCode,
  CommunicationChannel,
  CommunicationJob,
  DeliveryStats,
  ISMSProvider,
  IVoiceProvider,
  IIVRProvider,
  FarmerProfile
} from '../types/procurement';
import { voiceService } from './voiceService';

export interface FarmerRegistrationData {
  name: string;
  phone: string;
  village: string;
  crop: string;
  preferredLanguage: LanguageCode;
  preferredChannel: CommunicationChannel;
}

export interface CallbackRequest {
  id: string;
  farmerName: string;
  phone: string;
  language: LanguageCode;
  preferredTime: string;
  issueCategory: string;
  status: 'PENDING' | 'CALLED' | 'RESOLVED';
  timestamp: string;
}

// Initial Registered Demo Farmer Profiles with Communication Preferences (Section 13)
export const INITIAL_REGISTERED_FARMERS: FarmerProfile[] = [
  {
    farmerId: 'F1024',
    name: 'Sukhwinder Sharma',
    phone: '98765-43210',
    preferredLanguage: 'ta',
    preferredChannel: 'VOICE',
    backupChannel: 'SMS',
    village: 'Mandi Kalan West',
    activeToken: '1024'
  },
  {
    farmerId: 'F1008',
    name: 'Gurpreet Singh',
    phone: '98140-11223',
    preferredLanguage: 'hi',
    preferredChannel: 'SMS',
    backupChannel: 'VOICE',
    village: 'Kalan Khas',
    activeToken: '1008'
  },
  {
    farmerId: 'F1011',
    name: 'Harwinder Kaur',
    phone: '98722-44556',
    preferredLanguage: 'ta',
    preferredChannel: 'IVR',
    backupChannel: 'SMS',
    village: 'Rampur Link',
    activeToken: '1011'
  },
  {
    farmerId: 'F1015',
    name: 'Baldev Raj',
    phone: '98150-77889',
    preferredLanguage: 'en',
    preferredChannel: 'APP',
    backupChannel: 'SMS',
    village: 'Grain Sub-Post',
    activeToken: '1015'
  }
];

// Backwards-compatible export
export const REGISTERED_FARMERS: FarmerProfile[] = [...INITIAL_REGISTERED_FARMERS];

export class MockSMSProvider implements ISMSProvider {
  async sendSMS(toPhone: string, message: string): Promise<{ success: boolean; messageId: string }> {
    console.log(`[Mock SMS Provider] To: ${toPhone} | Message: ${message}`);
    return { success: true, messageId: `SMS-${Date.now()}-${Math.floor(Math.random() * 1000)}` };
  }

  async sendBatchSMS(phoneList: string[], templateId: string, params: Record<string, string>): Promise<{ delivered: number; failed: number }> {
    const total = phoneList.length;
    const delivered = Math.max(1, total - 1);
    return { delivered, failed: 1 };
  }
}

export class MockVoiceProvider implements IVoiceProvider {
  async triggerOutboundCall(toPhone: string, audioUrlOrText: string, lang: LanguageCode): Promise<{ callId: string; status: 'CONNECTED' | 'FAILED' }> {
    console.log(`[Mock Voice Provider] Outbound Call to: ${toPhone} [${lang}]`);
    return { callId: `CALL-${Date.now()}`, status: 'CONNECTED' };
  }

  async generateVoiceAudio(text: string, lang: LanguageCode): Promise<string> {
    // Uses browser SpeechSynthesis for real preview
    voiceService.speak(text, lang);
    return `audio_preview_${lang}_success`;
  }
}

export interface IVRStepState {
  step: 'WELCOME_LANG' | 'ENTER_FARMER_ID' | 'MAIN_MENU' | 'SELECT_SLOT' | 'CONFIRM_SLOT' | 'COMPLETED' | 'CROWD_STATUS' | 'HELP_INFO';
  prompt: string;
  transcript: string[];
  lang: LanguageCode;
  farmerId: string;
  selectedSlot: string;
  isCallActive: boolean;
}

export class MockIVRProvider implements IIVRProvider {
  startSession(callerPhone: string): { sessionId: string; currentStep: string } {
    return {
      sessionId: `IVR-SESSION-${Date.now()}`,
      currentStep: 'WELCOME_LANG'
    };
  }

  processDTMF(sessionId: string, digit: string): { nextStep: string; promptText: string } {
    return {
      nextStep: 'MAIN_MENU',
      promptText: 'DTMF Processed'
    };
  }
}

class TelecomManager {
  private smsProvider: ISMSProvider = new MockSMSProvider();
  private voiceProvider: IVoiceProvider = new MockVoiceProvider();
  private ivrProvider: IIVRProvider = new MockIVRProvider();

  public farmers: FarmerProfile[] = [...INITIAL_REGISTERED_FARMERS];

  public deliveryStats: DeliveryStats = {
    sms: { delivered: 42, pending: 3, failed: 1 },
    voice: { connected: 39, calling: 5, busy: 2 },
    app: { pushed: 48 }
  };

  public recentJobs: CommunicationJob[] = [
    {
      id: 'job-01',
      timestamp: '11:15 AM',
      targetCount: 48,
      messageType: 'CROWD_ALERT',
      channels: ['SMS', 'VOICE', 'APP'],
      language: 'ta',
      messageText: 'AGRIFLOW UPDATE: Mandi Kalan centre crowd is currently high. Recommended arrival: After 2:00 PM. Your booking remains guaranteed.',
      deliveredCount: 42,
      pendingCount: 3,
      failedCount: 1,
      status: 'COMPLETED'
    }
  ];

  public callbacks: CallbackRequest[] = [
    {
      id: 'CB-401',
      farmerName: 'Baldev Raj',
      phone: '98150-77889',
      language: 'en',
      preferredTime: 'Within 15 mins',
      issueCategory: 'Tractor trailer breakdown on approach road',
      status: 'PENDING',
      timestamp: '11:10 AM'
    },
    {
      id: 'CB-402',
      farmerName: 'Harwinder Kaur',
      phone: '98722-44556',
      language: 'ta',
      preferredTime: 'After 2:00 PM',
      issueCategory: 'Moisture pre-check certificate query',
      status: 'PENDING',
      timestamp: '10:45 AM'
    }
  ];

  public async dispatchAlert(
    farmerCount: number,
    messageType: 'CROWD_ALERT' | 'RECOMMENDED_ARRIVAL' | 'BOOKING_CONFIRMATION' | 'CENTRE_INFO',
    channels: CommunicationChannel[],
    language: LanguageCode,
    messageText: string
  ): Promise<CommunicationJob> {
    const deliveredCount = Math.floor(farmerCount * 0.88);
    const pendingCount = Math.floor(farmerCount * 0.08);
    const failedCount = farmerCount - deliveredCount - pendingCount;

    const newJob: CommunicationJob = {
      id: `job-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      targetCount: farmerCount,
      messageType,
      channels,
      language,
      messageText,
      deliveredCount,
      pendingCount,
      failedCount,
      status: 'COMPLETED'
    };

    this.recentJobs = [newJob, ...this.recentJobs];
    this.deliveryStats.sms.delivered += deliveredCount;
    this.deliveryStats.voice.connected += Math.floor(deliveredCount * 0.9);
    this.deliveryStats.app.pushed += farmerCount;

    return newJob;
  }

  public registerFarmer(data: FarmerRegistrationData): FarmerProfile {
    const newTokenNum = Math.floor(1030 + Math.random() * 900).toString();
    const newFarmer: FarmerProfile = {
      farmerId: `F${newTokenNum}`,
      name: data.name,
      phone: data.phone,
      preferredLanguage: data.preferredLanguage,
      preferredChannel: data.preferredChannel,
      backupChannel: data.preferredChannel === 'SMS' ? 'VOICE' : 'SMS',
      village: data.village,
      activeToken: newTokenNum
    };

    this.farmers = [newFarmer, ...this.farmers];
    REGISTERED_FARMERS.unshift(newFarmer);
    return newFarmer;
  }

  public getFarmers(): FarmerProfile[] {
    return this.farmers;
  }

  public requestCallback(req: Omit<CallbackRequest, 'id' | 'status' | 'timestamp'>): CallbackRequest {
    const newCb: CallbackRequest = {
      ...req,
      id: `CB-${Math.floor(100 + Math.random() * 900)}`,
      status: 'PENDING',
      timestamp: 'Just now'
    };
    this.callbacks = [newCb, ...this.callbacks];
    return newCb;
  }

  public getCallbacks(): CallbackRequest[] {
    return this.callbacks;
  }

  public resolveCallback(id: string): void {
    this.callbacks = this.callbacks.map(cb =>
      cb.id === id ? { ...cb, status: 'RESOLVED' } : cb
    );
  }

  public async triggerCallbackCall(id: string): Promise<boolean> {
    const cb = this.callbacks.find(c => c.id === id);
    if (!cb) return false;

    this.callbacks = this.callbacks.map(c =>
      c.id === id ? { ...c, status: 'CALLED' } : c
    );

    await this.voiceProvider.triggerOutboundCall(
      cb.phone,
      `Hello ${cb.farmerName}, this is Mandi Kalan procurement centre operator returning your callback request.`,
      cb.language
    );
    return true;
  }
}

export const telecomManager = new TelecomManager();
