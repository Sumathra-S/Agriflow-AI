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

export interface ReachabilityProfile {
  farmerId: string;
  name: string;
  phone: string;
  preferredLanguage: LanguageCode;
  preferredChannel: CommunicationChannel;
  deviceType: 'SMARTPHONE' | 'BASIC_FEATURE_PHONE';
  connectivityLevel: 'HIGH_4G' | 'LOW_2G' | 'OFFLINE';
  literacyAssistance: boolean;
  recommendedChannel: CommunicationChannel;
  backupChannel: CommunicationChannel;
}

export interface CrowdShiftSimulation {
  shiftedCount: number;
  before10am: { arrivals: number; risk: CongestionRisk };
  before2pm: { arrivals: number; risk: CongestionRisk };
  after10am: { arrivals: number; risk: CongestionRisk };
  after2pm: { arrivals: number; risk: CongestionRisk };
  status: 'IMPROVED' | 'NEUTRAL';
}

export interface EscalationItem {
  id: string;
  farmerName: string;
  phone: string;
  slotTime: string;
  smsStatus: 'DELIVERED' | 'FAILED' | 'PENDING';
  voiceStatus?: 'CONNECTED' | 'FAILED' | 'NOT_ATTEMPTED';
  needsFollowUp: boolean;
  followUpReason?: string;
}

// --- COMPLETE AGRIFLOW ARCHITECTURE TYPES ---

export type ProcurementLifecycleStatus =
  | 'REGISTERED'
  | 'SLOT_ASSIGNED'
  | 'FARMER_ARRIVED'
  | 'WEIGHING'
  | 'QUALITY_CHECK'
  | 'ACCEPTED'
  | 'PAYMENT_PROCESSING'
  | 'COMPLETED';

export interface ProcurementRecord {
  id: string;
  tokenNumber: string;
  farmerId: string;
  farmerName: string;
  mobile: string;
  centreId: string;
  centreName: string;
  crop: string;
  allocatedWeightQtl: number;
  actualWeightQtl?: number;
  moisturePercentage?: number;
  foreignMatterPercentage?: number;
  mspPerQuintal: number;
  grossAmount?: number;
  dbtAccountRef?: string;
  paymentStatus: 'PENDING' | 'IN_PROGRESS' | 'CREDITED' | 'FAILED';
  currentStatus: ProcurementLifecycleStatus;
  statusHistory: Array<{
    status: ProcurementLifecycleStatus;
    label: string;
    timestamp: string;
    operatorNote?: string;
  }>;
}

export interface SlotSuitabilityFactors {
  capacityAvailability: number; // 0-100
  queueLoadFactor: number;      // 0-100 (higher = lighter queue)
  processingSpeedFactor: number;// 0-100
  cropHandlingFactor: number;   // 0-100
  existingBookingsFactor: number; // 0-100
  operationalConditionsFactor: number; // 0-100
  overallSuitabilityScore: number;     // Weighted 0-100
}

export interface SlotCandidate {
  id: string;
  timeWindow: string;
  date: string;
  centreId: string;
  centreName: string;
  gateNumber: string;
  maxCapacity: number;
  currentBookings: number;
  factors: SlotSuitabilityFactors;
}

export interface SlotExplanation {
  title: string;
  points: string[];
  simplifiedFarmerAdvice: string;
}

export interface SlotAllocationResult {
  assignedSlot: SlotCandidate;
  explanation: SlotExplanation;
  methodology: 'Explainable Intelligent Optimization';
}

export interface QueueState {
  currentToken: string;
  farmerToken: string;
  tokensAhead: number;
  estimatedWaitMinutes: number;
  turnApproaching: boolean; // true if tokensAhead <= 3
  lastUpdated: string;
  disclaimer: string;
}

export interface DisruptionEvent {
  id: string;
  centreId: string;
  centreName: string;
  title: string;
  delayMinutes: number;
  reason: string;
  affectedTokens: string[];
  timestamp: string;
  resolved: boolean;
}

export interface ReschedulingProposal {
  id: string;
  farmerId: string;
  tokenNumber: string;
  currentSlot: string;
  proposedSlot: string;
  reason: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  timestamp: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  role: UserRole;
  action: string;
  affectedResource: string;
  timestamp: string;
  details?: string;
}

export interface SystemPolicy {
  maxHourlyCapacity: number;
  maxQueueBuffer: number;
  defaultChannel: CommunicationChannel;
  enableAutoRescheduleAdvisory: boolean;
  targetMspRate: number; // e.g. 2320
}

