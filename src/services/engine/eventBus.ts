/**
 * AgriFlow Centralized Event Bus
 * Provides decoupled event publication and subscription across all engines.
 */

export type AgriFlowEventType =
  | 'SLOT_ASSIGNED'
  | 'TOKEN_GENERATED'
  | 'QUEUE_UPDATED'
  | 'TURN_APPROACHING'
  | 'PROCUREMENT_STATUS_CHANGED'
  | 'CENTRE_DELAY_REPORTED'
  | 'DISRUPTION_RESOLVED'
  | 'RESCHEDULE_PROPOSED'
  | 'RESCHEDULE_ACCEPTED'
  | 'NOTIFICATION_DISPATCHED'
  | 'AUDIT_LOGGED'
  | 'REALLOCATION_OFFERED'
  | 'ACTION_EXECUTED'
  | 'AUTH_LOGIN'
  | 'AUTH_LOGOUT';

export interface AgriFlowEvent<T = any> {
  id?: string;
  type: AgriFlowEventType;
  payload: T;
  timestamp: string;
  source: string;
}

type EventListener<T = any> = (event: AgriFlowEvent<T>) => void;

class AgriFlowEventBus {
  private listeners: Map<AgriFlowEventType, Set<EventListener>> = new Map();

  public subscribe<T = any>(type: AgriFlowEventType, listener: EventListener<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);

    return () => {
      const set = this.listeners.get(type);
      if (set) {
        set.delete(listener);
        if (set.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  public publish<T = any>(type: AgriFlowEventType, payload: T, source = 'AgriFlowSystem'): void {
    const event: AgriFlowEvent<T> = {
      type,
      payload,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source
    };

    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (err) {
          console.error(`[EventBus] Error in listener for ${type}:`, err);
        }
      });
    }
  }

  public emit<T = any>(eventObj: { type: AgriFlowEventType; payload: T; source?: string; id?: string; timestamp?: string }): void {
    this.publish(eventObj.type, eventObj.payload, eventObj.source || 'AgriFlowSystem');
  }
}

export const eventBus = new AgriFlowEventBus();
