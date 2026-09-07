/**
 * AgriFlow Disruption Detection & Response Engine
 * Responsibilities:
 * - Detects operational delays, equipment issues, and capacity reductions
 * - Analyzes impacted farmers (token range)
 * - Updates queue calculations via QueueEngine
 * - Triggers automated broadcast notifications
 */

import { DisruptionEvent } from '../../types/procurement';
import { queueEngine } from './queueEngine';
import { eventBus } from './eventBus';

export class DisruptionEngine {
  private activeDisruption: DisruptionEvent | null = null;

  public reportDelay(delayMinutes = 25, reason = 'Weighbridge #2 electronic load cell calibration'): DisruptionEvent {
    const disruption: DisruptionEvent = {
      id: `disrupt-${Date.now()}`,
      centreId: 'singanallur-centre',
      centreName: 'Singanallur Procurement Centre',
      title: `${delayMinutes} Min Operational Delay Reported`,
      delayMinutes,
      reason,
      affectedTokens: ['TK-1019', 'TK-1021', 'TK-1024', 'TK-1028', 'TK-1032'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      resolved: false
    };

    this.activeDisruption = disruption;

    // Recalculate queue wait times
    queueEngine.setOperationalDelay(delayMinutes);

    // Publish event
    eventBus.publish('CENTRE_DELAY_REPORTED', disruption, 'DisruptionEngine');

    return disruption;
  }

  public resolveDisruption(): void {
    if (this.activeDisruption) {
      this.activeDisruption.resolved = true;
      queueEngine.setOperationalDelay(0);
      eventBus.publish('DISRUPTION_RESOLVED', this.activeDisruption, 'DisruptionEngine');
      this.activeDisruption = null;
    }
  }

  public getActiveDisruption(): DisruptionEvent | null {
    return this.activeDisruption;
  }
}

export const disruptionEngine = new DisruptionEngine();
