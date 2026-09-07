/**
 * AgriFlow Dynamic Rescheduling Engine
 * Evaluates alternative slots when disruptions occur and proposes
 * convenient updated appointments without forcing manual re-entry.
 */

import { ReschedulingProposal } from '../../types/procurement';
import { eventBus } from './eventBus';

export class ReschedulingEngine {
  private activeProposal: ReschedulingProposal | null = null;

  public proposeReschedule(
    tokenNumber = 'TK-1024',
    currentSlot = '11:30 AM – 12:30 PM',
    proposedSlot = '02:00 PM – 03:00 PM',
    reason = 'Avoid 45-minute gate queue caused by morning weighbridge calibration'
  ): ReschedulingProposal {
    const proposal: ReschedulingProposal = {
      id: `prop-${Date.now()}`,
      farmerId: 'FMR-PB-2048',
      tokenNumber,
      currentSlot,
      proposedSlot,
      reason,
      status: 'PENDING',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.activeProposal = proposal;
    eventBus.publish('RESCHEDULE_PROPOSED', proposal, 'ReschedulingEngine');
    return proposal;
  }

  public acceptProposal(): ReschedulingProposal | null {
    if (!this.activeProposal) return null;
    this.activeProposal.status = 'ACCEPTED';
    eventBus.publish('RESCHEDULE_ACCEPTED', this.activeProposal, 'ReschedulingEngine');
    return this.activeProposal;
  }

  public getActiveProposal(): ReschedulingProposal | null {
    return this.activeProposal;
  }
}

export const reschedulingEngine = new ReschedulingEngine();
