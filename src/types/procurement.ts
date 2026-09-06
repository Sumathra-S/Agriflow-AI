export type CongestionRisk = 'LOW' | 'MEDIUM' | 'HIGH';

export type UserRole = 'OPERATOR' | 'FARMER' | 'ADMIN';

export type LanguageCode = 'ta' | 'hi' | 'en';

export type CommunicationChannel = 'APP' | 'SMS' | 'VOICE' | 'IVR' | 'ASSISTED';

export interface ProcurementCentre {
  id: string;
  name: string;
  location: string;
  district: string;
  state: string;
  capacityPerHour: number;
  status: 'OPERATIONAL' | 'CONGESTED' | 'DELAYED' | 'CLOSED';
  totalWeighbridges: number;
  activeWeighbridges: number;
  moistureMetersActive: number;
  operatingHours: string;
  helpline: string;
}

export interface QueueItem {
  tokenNumber: string;
  farmerId: string;
  farmerName: string;
  vehicle: 'Tractor Trolley' | 'Mini Truck (Pick-up)' | 'Bullock Cart' | 'Trailer';
  crop: string;
  arrivalTime: string;
  estimatedWeightQtl: number;
  moisturePercentage: number;
  status: 'WAITING_ENTRY' | 'MOISTURE_TESTING' | 'AT_WEIGHBRIDGE' | 'UNLOADING' | 'COMPLETED';
}

export interface Booking {
  id: string;
  tokenNumber: string;
  farmerId: string;
  farmerName: string;
  mobile: string;
  centreId: string;
  date: string;
  timeSlot: string;
  crop: string;
  allocatedWeightQtl: number;
  status: 'CONFIRMED' | 'RESCHEDULED' | 'CHECKED_IN' | 'COMPLETED';
  gateNumber: string;
  preferredChannel?: CommunicationChannel;
  preferredLanguage?: LanguageCode;
  recommendedArrival?: string;
  notes?: string;
}

export interface FarmerProfile {
  farmerId: string;
  name: string;
  phone: string;
  preferredLanguage: LanguageCode;
  preferredChannel: CommunicationChannel;
  backupChannel: CommunicationChannel;
  village: string;
  activeToken?: string;
}

export interface RiskFactor {
  id: string;
  title: string;
  explanation: string;
  direction: 'INCREASING_RISK' | 'REDUCING_CAPACITY';
  stat: string;
  impactLevel: 'HIGH' | 'MODERATE' | 'LOW';
}

export interface ForecastHour {
  hourLabel: string;
  hour24: number;
  expectedArrivals: number;
  historicalBaseline: number;
  actualArrivals?: number;
  capacityLimit: number;
  isPeak: boolean;
  crowdLevel?: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface SystemAlert {
  id: string;
  centreId: string;
  type: 'HIGH_CONGESTION' | 'QUEUE_SURGE' | 'RISK_REDUCED' | 'OPERATIONAL_UPDATE';
  severity: CongestionRisk | 'INFO';
  title: string;
  message: string;
  recommendedAction: string;
  timestamp: string;
  read: boolean;
  audience: 'OPERATOR' | 'FARMER' | 'ALL';
}

export interface OperatorActionItem {
  id: string;
  label: string;
  description: string;
  executed: boolean;
  actionType: 'NOTIFY_FARMERS' | 'PREPARE_STAFF' | 'MONITOR' | 'REVIEW_QUEUE';
}

export interface ModelComparisonMetrics {
  baselineName: string;
  modelName: string;
  baselineMae: number;
  modelMae: number;
  maeImprovementPct: number;
  peakDetectionAccuracyPct: number;
  avgWaitReductionMinutes: number;
  trainingSamples: number;
}

// Communication & Telecom Abstractions (Section 13-18)
export interface CommunicationJob {
  id: string;
  timestamp: string;
  targetCount: number;
  messageType: 'CROWD_ALERT' | 'RECOMMENDED_ARRIVAL' | 'BOOKING_CONFIRMATION' | 'CENTRE_INFO';
  channels: CommunicationChannel[];
  language: LanguageCode;
  messageText: string;
  deliveredCount: number;
  pendingCount: number;
  failedCount: number;
  status: 'PENDING' | 'SENDING' | 'COMPLETED';
}

export interface DeliveryStats {
  sms: { delivered: number; pending: number; failed: number };
  voice: { connected: number; calling: number; busy: number };
  app: { pushed: number };
}

// Telecom Provider Interfaces
export interface ISMSProvider {
  sendSMS(toPhone: string, message: string): Promise<{ success: boolean; messageId: string }>;
  sendBatchSMS(phoneList: string[], templateId: string, params: Record<string, string>): Promise<{ delivered: number; failed: number }>;
}

export interface IVoiceProvider {
  triggerOutboundCall(toPhone: string, audioUrlOrText: string, lang: LanguageCode): Promise<{ callId: string; status: 'CONNECTED' | 'FAILED' }>;
  generateVoiceAudio(text: string, lang: LanguageCode): Promise<string>;
}

export interface IIVRProvider {
  startSession(callerPhone: string): { sessionId: string; currentStep: string };
  processDTMF(sessionId: string, digit: string): { nextStep: string; promptText: string; audioAction?: string };
}
