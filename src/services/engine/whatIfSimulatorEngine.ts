import {
  AiInterventionProposal,
  WhatIfLevers,
  WhatIfSimulationResult
} from '../../types/procurement';
import { auditTrailService } from './auditTrailService';
import { eventBus } from './eventBus';

class WhatIfSimulatorEngine {
  private levers: WhatIfLevers = {
    extraArrivals: 0,
    surgePercentage: 35,
    capacityModifierPct: 0,
    weighbridgesOffline: 0,
    temporaryCounterAdded: true,
    advisoryShiftAcceptancePct: 65
  };

  private proposals: AiInterventionProposal[] = [
    {
      id: 'PROP-01',
      centreId: 'CENTRE-01',
      centreName: 'Singanallur Central APMC',
      title: 'Dispatch Smart Arrival Advisory to 11:30–13:00 Slot Farmers',
      actionType: 'DISPATCH_SMART_ARRIVAL',
      impactEstimate: 'Reduces peak inflow by 16 farmers (-33% peak queue). Saves ~38 min avg wait.',
      confidencePct: 94,
      state: 'PENDING_REVIEW'
    },
    {
      id: 'PROP-02',
      centreId: 'CENTRE-01',
      centreName: 'Singanallur Central APMC',
      title: 'Divert 14 Flexible Bookings to Ramanathapuram Yard (4.2 km)',
      actionType: 'REDIRECT_FLEXIBLE_BOOKINGS',
      impactEstimate: 'Rebalances regional load; Ramanathapuram has 34 spare slots with 19m wait.',
      confidencePct: 91,
      state: 'PENDING_REVIEW'
    },
    {
      id: 'PROP-03',
      centreId: 'CENTRE-01',
      centreName: 'Singanallur Central APMC',
      title: 'Open Auxiliary Weighbridge Gate #3 with Reserve Staff',
      actionType: 'OPEN_AUXILIARY_GATE',
      impactEstimate: 'Expands processing throughput from 18 to 26 farmers/hr (+44% capacity).',
      confidencePct: 88,
      state: 'PENDING_REVIEW'
    },
    {
      id: 'PROP-04',
      centreId: 'CENTRE-01',
      centreName: 'Singanallur Central APMC',
      title: 'Deploy Mobile Moisture Van to Pre-Screen Approaching Trolleys',
      actionType: 'DEPLOY_MOBILE_MOISTURE_VAN',
      impactEstimate: 'Pre-screens moisture in queue, shaving 7 minutes off weighbridge dwell time.',
      confidencePct: 86,
      state: 'PENDING_REVIEW'
    }
  ];

  private listeners: Array<(result: WhatIfSimulationResult) => void> = [];
  private proposalListeners: Array<(proposals: AiInterventionProposal[]) => void> = [];

  public getLevers(): WhatIfLevers {
    return { ...this.levers };
  }

  public updateLevers(newLevers: Partial<WhatIfLevers>): WhatIfSimulationResult {
    this.levers = { ...this.levers, ...newLevers };
    const result = this.calculateSimulation();
    this.notify();
    return result;
  }

  public calculateSimulation(): WhatIfSimulationResult {
    const {
      extraArrivals,
      surgePercentage,
      capacityModifierPct,
      weighbridgesOffline,
      temporaryCounterAdded,
      advisoryShiftAcceptancePct
    } = this.levers;

    // Singanallur APMC base parameters
    const baseArrivals = 48;
    const baseWeighbridges = 2;
    const initialQueue = 23;

    // --- 1. WITHOUT INTERVENTION (Status Quo / Unmitigated) ---
    const activeWeighbridges = Math.max(0, baseWeighbridges - weighbridgesOffline);
    const nominalCapacity = activeWeighbridges * 9; // 9 farmers/hr per weighbridge
    const effectiveCapWithout = Math.max(4, Math.round(nominalCapacity * (1 + capacityModifierPct / 100)));

    const arrivalRateWithout = Math.round((baseArrivals + extraArrivals) * (1 + surgePercentage / 100));
    const excessArrivals = Math.max(0, arrivalRateWithout - effectiveCapWithout);

    const peakWaitWithout = Math.min(
      120,
      Math.max(15, Math.round(((initialQueue + excessArrivals) / effectiveCapWithout) * 60 + 25))
    );
    const queueLengthWithout = Math.max(8, initialQueue + excessArrivals);
    const overCapacityHoursWithout = arrivalRateWithout > effectiveCapWithout ? 3.5 : 0.5;
    const riskWithout = peakWaitWithout >= 50 ? 'HIGH' : peakWaitWithout >= 25 ? 'MEDIUM' : 'LOW';

    // --- 2. WITH INTERVENTION (AI Advisory + Load Balancing + Auxiliary Counter) ---
    const shiftedFarmers = Math.round(arrivalRateWithout * (advisoryShiftAcceptancePct / 100) * 0.42);
    const tempCounterThroughput = temporaryCounterAdded ? 8 : 0;
    const effectiveCapWith = effectiveCapWithout + tempCounterThroughput;

    const arrivalRateWith = Math.max(12, arrivalRateWithout - shiftedFarmers);
    const excessArrivalsWith = Math.max(0, arrivalRateWith - effectiveCapWith);

    const peakWaitWith = Math.max(
      8,
      Math.min(
        peakWaitWithout - 10,
        Math.round(((initialQueue * 0.45 + excessArrivalsWith) / effectiveCapWith) * 35 + 10)
      )
    );
    const queueLengthWith = Math.max(4, Math.round(queueLengthWithout * 0.48));
    const waitReductionMinutes = Math.max(12, peakWaitWithout - peakWaitWith);
    const riskWith = peakWaitWith >= 45 ? 'HIGH' : peakWaitWith >= 22 ? 'MEDIUM' : 'LOW';
    const centreUtilizationWith = Math.min(100, Math.round((arrivalRateWith / effectiveCapWith) * 75));

    return {
      withoutIntervention: {
        peakWaitMinutes: peakWaitWithout,
        queueLength: queueLengthWithout,
        overCapacityHours: overCapacityHoursWithout,
        riskLevel: riskWithout
      },
      withIntervention: {
        peakWaitMinutes: peakWaitWith,
        queueLength: queueLengthWith,
        waitReductionMinutes,
        riskLevel: riskWith,
        farmersShifted: shiftedFarmers,
        centreUtilizationPct: centreUtilizationWith
      },
      calculatedAt: new Date().toISOString()
    };
  }

  public getProposals(): AiInterventionProposal[] {
    return [...this.proposals];
  }

  public approveProposal(id: string, operatorNotes?: string): void {
    this.proposals = this.proposals.map(p =>
      p.id === id
        ? {
            ...p,
            state: 'APPROVED',
            reviewedBy: 'Procurement Officer (OPERATOR)',
            reviewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            operatorNotes: operatorNotes || 'Approved with immediate priority.'
          }
        : p
    );

    const prop = this.proposals.find(p => p.id === id);
    if (prop) {
      auditTrailService.logEvent(
        'AI_INTERVENTION_APPROVED',
        'Officer K. Murugesan (Singanallur APMC)',
        'OPERATOR',
        {
          proposalId: prop.id,
          title: prop.title,
          impact: prop.impactEstimate,
          confidence: `${prop.confidencePct}%`,
          notes: prop.operatorNotes
        }
      );

      eventBus.emit({
        id: `EVT-INTERV-${Date.now()}`,
        type: 'ACTION_EXECUTED',
        timestamp: new Date().toISOString(),
        source: 'whatIfSimulatorEngine',
        payload: { ...prop }
      });
    }

    this.notifyProposals();
  }

  public rejectProposal(id: string, reason: string): void {
    this.proposals = this.proposals.map(p =>
      p.id === id
        ? {
            ...p,
            state: 'REJECTED',
            reviewedBy: 'Procurement Officer (OPERATOR)',
            reviewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            operatorNotes: reason
          }
        : p
    );

    const prop = this.proposals.find(p => p.id === id);
    if (prop) {
      auditTrailService.logEvent(
        'AI_INTERVENTION_REJECTED',
        'Officer K. Murugesan (Singanallur APMC)',
        'OPERATOR',
        {
          proposalId: prop.id,
          title: prop.title,
          rejectionReason: reason
        }
      );
    }

    this.notifyProposals();
  }

  public modifyProposal(id: string, modifications: string, operatorNotes: string): void {
    this.proposals = this.proposals.map(p =>
      p.id === id
        ? {
            ...p,
            state: 'MODIFIED',
            impactEstimate: `${p.impactEstimate} [Operator adjusted: ${modifications}]`,
            reviewedBy: 'Procurement Officer (OPERATOR)',
            reviewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            operatorNotes
          }
        : p
    );

    const prop = this.proposals.find(p => p.id === id);
    if (prop) {
      auditTrailService.logEvent(
        'AI_INTERVENTION_MODIFIED',
        'Officer K. Murugesan (Singanallur APMC)',
        'OPERATOR',
        {
          proposalId: prop.id,
          modifications,
          notes: operatorNotes
        }
      );
    }

    this.notifyProposals();
  }

  public subscribe(listener: (result: WhatIfSimulationResult) => void): () => void {
    this.listeners.push(listener);
    listener(this.calculateSimulation());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public subscribeProposals(listener: (proposals: AiInterventionProposal[]) => void): () => void {
    this.proposalListeners.push(listener);
    listener(this.getProposals());
    return () => {
      this.proposalListeners = this.proposalListeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    const result = this.calculateSimulation();
    this.listeners.forEach(l => l(result));
  }

  private notifyProposals(): void {
    const copy = this.getProposals();
    this.proposalListeners.forEach(l => l(copy));
  }
}

export const whatIfSimulatorEngine = new WhatIfSimulatorEngine();
