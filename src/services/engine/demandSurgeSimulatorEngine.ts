import { auditTrailService } from './auditTrailService';
import { eventBus } from './eventBus';

export interface DemandSurgeState {
  centreId: string;
  centreName: string;
  capacityTonnes: number;
  baseBookedTonnes: number;
  baseWalkInTonnes: number;
  addedSurgeTonnes: number;
  totalExpectedDemandTonnes: number;
  utilizationPct: number;
  status: 'LOW' | 'MODERATE' | 'NEAR_CAPACITY' | 'OVER_CAPACITY';
  isOverCapacity: boolean;
  systemAdvisory: string;
  recommendedAlternativeCentreId?: string;
  recommendedAlternativeCentreName?: string;
  recommendedAlternativeWaitMinutes?: number;
}

class DemandSurgeSimulatorEngine {
  private baseState: DemandSurgeState = {
    centreId: 'CENTRE-C',
    centreName: 'Centre C (Singanallur APMC)',
    capacityTonnes: 100,
    baseBookedTonnes: 65,
    baseWalkInTonnes: 15,
    addedSurgeTonnes: 0,
    totalExpectedDemandTonnes: 80,
    utilizationPct: 80,
    status: 'MODERATE',
    isOverCapacity: false,
    systemAdvisory: 'Centre C demand is operating within normal parameters. Capacity buffer available.'
  };

  private currentState: DemandSurgeState = { ...this.baseState };
  private listeners: Array<(state: DemandSurgeState) => void> = [];

  public getState(): DemandSurgeState {
    return { ...this.currentState };
  }

  public applySurge(tonnesToAdd: number): DemandSurgeState {
    const totalBooked = this.baseState.baseBookedTonnes + tonnesToAdd;
    const walkIn = this.baseState.baseWalkInTonnes;
    const totalExpected = totalBooked + walkIn;
    const util = Math.round((totalExpected / this.baseState.capacityTonnes) * 100);

    let status: DemandSurgeState['status'] = 'MODERATE';
    let isOver = false;
    let advisory = 'Centre C is operating normally.';
    let altId: string | undefined = undefined;
    let altName: string | undefined = undefined;
    let altWait: number | undefined = undefined;

    if (util > 100) {
      status = 'OVER_CAPACITY';
      isOver = true;
      advisory = `⚠️ Centre C is predicted to exceed capacity (${totalExpected}/100 tonnes, ${util}% load). New farmer demand is automatically being redirected to Centre B.`;
      altId = 'CENTRE-B';
      altName = 'Centre B (Ramanathapuram Yard)';
      altWait = 15;
    } else if (util >= 90) {
      status = 'NEAR_CAPACITY';
      advisory = `Centre C is approaching capacity limit (${totalExpected}/100 tonnes, ${util}% load). Diversion advisories recommended.`;
    }

    this.currentState = {
      ...this.currentState,
      addedSurgeTonnes: tonnesToAdd,
      totalExpectedDemandTonnes: totalExpected,
      utilizationPct: util,
      status,
      isOverCapacity: isOver,
      systemAdvisory: advisory,
      recommendedAlternativeCentreId: altId,
      recommendedAlternativeCentreName: altName,
      recommendedAlternativeWaitMinutes: altWait
    };

    auditTrailService.logEvent(
      'DEMAND_SURGE_SIMULATED',
      'System Administrator (ADMIN)',
      'ADMIN',
      {
        addedSurgeTonnes: tonnesToAdd,
        totalExpectedTonnes: totalExpected,
        capacityTonnes: 100,
        utilization: `${util}%`,
        status,
        redirectedTo: altName
      }
    );

    eventBus.emit({
      id: `EVT-SURGE-${Date.now()}`,
      type: 'CENTRE_DELAY_REPORTED',
      timestamp: new Date().toISOString(),
      source: 'DemandSurgeSimulatorEngine',
      payload: { ...this.currentState }
    });

    this.notify();
    return { ...this.currentState };
  }

  public resetSimulation(): DemandSurgeState {
    this.currentState = { ...this.baseState };

    auditTrailService.logEvent(
      'DEMAND_SURGE_RESET',
      'System Administrator (ADMIN)',
      'ADMIN',
      { action: 'Restored baseline 80/100 tonnes (80% utilization)' }
    );

    this.notify();
    return { ...this.currentState };
  }

  public subscribe(listener: (state: DemandSurgeState) => void): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    const copy = this.getState();
    this.listeners.forEach(l => l(copy));
  }
}

export const demandSurgeSimulatorEngine = new DemandSurgeSimulatorEngine();
