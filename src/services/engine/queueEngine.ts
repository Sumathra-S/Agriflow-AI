/**
 * AgriFlow Queue Management Engine
 * Responsibilities:
 * - Token generation and tracking
 * - Tracking current token head vs farmer token
 * - Calculating tokens ahead and triggering turn approaching alerts
 * - Updating wait estimates via WaitingEstimationService
 */

import { QueueState } from '../../types/procurement';
import { waitingEstimationService } from './waitingEstimationService';
import { eventBus } from './eventBus';

export class QueueEngine {
  private currentTokenNumber = 'TK-1015';
  private processingSpeed = 18; // 18 trolleys / hr
  private operationalDelay = 0; // minutes

  // Active queue token sequence in order
  private queueTokens = [
    'TK-1008',
    'TK-1011',
    'TK-1015', // Currently at weighbridge
    'TK-1019',
    'TK-1021',
    'TK-1024', // Demo farmer Sukhwinder Sharma
    'TK-1028',
    'TK-1032',
    'TK-1036',
    'TK-1040',
    'TK-1048'
  ];

  public getQueueState(farmerToken = 'TK-1024'): QueueState {
    const currentIndex = this.queueTokens.indexOf(this.currentTokenNumber);
    const farmerIndex = this.queueTokens.indexOf(farmerToken);

    let tokensAhead = 0;
    if (farmerIndex !== -1 && currentIndex !== -1) {
      tokensAhead = Math.max(0, farmerIndex - currentIndex);
    } else if (farmerIndex === -1) {
      tokensAhead = 8;
    }

    const estimatedWait = waitingEstimationService.calculateWaitMinutes({
      tokensAhead,
      processingSpeedPerHour: this.processingSpeed,
      averageDurationMinutes: 3.3,
      operationalDelayMinutes: this.operationalDelay
    });

    const turnApproaching = tokensAhead > 0 && tokensAhead <= 3;

    return {
      currentToken: this.currentTokenNumber,
      farmerToken,
      tokensAhead,
      estimatedWaitMinutes: estimatedWait,
      turnApproaching,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      disclaimer: 'Estimated waiting time may change based on live procurement activity.'
    };
  }

  /**
   * Advances the queue to the next token (Called by Centre Operator)
   */
  public advanceToken(): QueueState {
    const currentIndex = this.queueTokens.indexOf(this.currentTokenNumber);
    if (currentIndex < this.queueTokens.length - 1) {
      this.currentTokenNumber = this.queueTokens[currentIndex + 1];
    } else {
      // Generate next sequential token
      const nextNum = parseInt(this.currentTokenNumber.replace('TK-', ''), 10) + 3;
      this.currentTokenNumber = `TK-${nextNum}`;
      this.queueTokens.push(this.currentTokenNumber);
    }

    const state = this.getQueueState('TK-1024');

    eventBus.publish('QUEUE_UPDATED', state, 'QueueEngine');

    if (state.turnApproaching) {
      eventBus.publish('TURN_APPROACHING', state, 'QueueEngine');
    }

    return state;
  }

  /**
   * Reports an operational delay affecting all pending queue items
   */
  public setOperationalDelay(delayMinutes: number): QueueState {
    this.operationalDelay = delayMinutes;
    const state = this.getQueueState('TK-1024');
    eventBus.publish('QUEUE_UPDATED', state, 'QueueEngine');
    return state;
  }

  public setProcessingSpeed(speedPerHour: number): void {
    this.processingSpeed = speedPerHour;
    const state = this.getQueueState('TK-1024');
    eventBus.publish('QUEUE_UPDATED', state, 'QueueEngine');
  }

  public resetQueue(): void {
    this.currentTokenNumber = 'TK-1015';
    this.operationalDelay = 0;
    this.processingSpeed = 18;
  }
}

export const queueEngine = new QueueEngine();
