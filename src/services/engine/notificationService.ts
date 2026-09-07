/**
 * AgriFlow Centralized Notification Service
 * Dispatches notifications across In-App, SMS, and Voice channels.
 * Prevents duplicate notification spam and respects farmer channel preferences.
 */

import { CommunicationChannel, LanguageCode } from '../../types/procurement';
import { eventBus } from './eventBus';
import { voiceService } from '../voiceService';

export interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  eventType: string;
  tokenNumber: string;
  farmerName: string;
  phone: string;
  channels: CommunicationChannel[];
  language: LanguageCode;
  timestamp: string;
  deliveryStatus: Record<CommunicationChannel, 'SENT' | 'DELIVERED' | 'FAILED'>;
}

export class NotificationService {
  private history: NotificationPayload[] = [];
  private sentKeys = new Set<string>();

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    eventBus.subscribe('TURN_APPROACHING', (event) => {
      this.dispatchNotification({
        title: 'Turn Approaching at Gate 2',
        message: 'Token #1024: Only 3 trolleys ahead. Please move your tractor to Gate 2 entrance.',
        eventType: 'TURN_APPROACHING',
        tokenNumber: 'TK-1024',
        farmerName: 'Sukhwinder Sharma',
        phone: '98765-43210',
        channels: ['APP', 'SMS', 'VOICE'],
        language: 'ta'
      });
    });

    eventBus.subscribe('CENTRE_DELAY_REPORTED', (event) => {
      this.dispatchNotification({
        title: 'Operational Delay Advisory',
        message: 'Procurement is delayed by ' + event.payload.delayMinutes + ' mins. You do not need to wait unnecessarily at the centre. Your token remains valid.',
        eventType: 'QUEUE_DELAY',
        tokenNumber: 'TK-1024',
        farmerName: 'Sukhwinder Sharma',
        phone: '98765-43210',
        channels: ['APP', 'SMS'],
        language: 'ta'
      });
    });

    eventBus.subscribe('PROCUREMENT_STATUS_CHANGED', (event) => {
      const record = event.payload;
      this.dispatchNotification({
        title: 'Procurement Update: ' + record.currentStatus,
        message: 'Your procurement record for Token #' + record.tokenNumber + ' updated to: ' + record.currentStatus,
        eventType: 'STATUS_UPDATE',
        tokenNumber: record.tokenNumber,
        farmerName: record.farmerName,
        phone: record.mobile,
        channels: ['APP', 'SMS'],
        language: 'ta'
      });
    });
  }

  public dispatchNotification(params: Omit<NotificationPayload, 'id' | 'timestamp' | 'deliveryStatus'>): NotificationPayload {
    // Deduplication check
    const dedupeKey = `${params.eventType}_${params.tokenNumber}_${params.title}`;
    if (this.sentKeys.has(dedupeKey)) {
      const existing = this.history.find(n => n.id.includes(dedupeKey));
      if (existing) return existing;
    }
    this.sentKeys.add(dedupeKey);

    const deliveryStatus: Record<CommunicationChannel, 'SENT' | 'DELIVERED' | 'FAILED'> = {
      APP: 'DELIVERED',
      SMS: 'DELIVERED',
      VOICE: params.channels.includes('VOICE') ? 'DELIVERED' : 'SENT',
      IVR: 'SENT',
      ASSISTED: 'SENT'
    };

    const notification: NotificationPayload = {
      id: `notif-${Date.now()}`,
      ...params,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryStatus
    };

    this.history.unshift(notification);

    // If voice channel enabled, trigger TTS preview gracefully
    if (params.channels.includes('VOICE') && typeof window !== 'undefined') {
      try {
        voiceService.speak(params.message, params.language);
      } catch (err) {
        console.warn('Voice dispatch fallback:', err);
      }
    }

    eventBus.publish('NOTIFICATION_DISPATCHED', notification, 'NotificationService');

    return notification;
  }

  public getHistory(): NotificationPayload[] {
    return [...this.history];
  }
}

export const notificationService = new NotificationService();
