import {
  CongestionState,
  QuantityDemandMetrics,
  SmartBookingInput
} from '../../types/procurement';
import { auditTrailService } from './auditTrailService';
import { eventBus } from './eventBus';

export const INITIAL_CENTRE_CAPACITIES: QuantityDemandMetrics[] = [
  {
    centreId: 'CENTRE-C',
    centreName: 'Centre C (Singanallur APMC)',
    location: 'Trichy Road, Singanallur, Coimbatore',
    capacityTonnes: 100,
    bookedQuantityTonnes: 72,
    predictedWalkInQuantityTonnes: 18,
    expectedTotalDemandTonnes: 90,
    remainingCapacityTonnes: 10,
    quantityUtilizationPct: 90,
    congestionState: 'NEAR_CAPACITY',
    farmerCount: 40,
    activeCounters: 3,
    averageWaitMinutes: 25,
    averageProcessingMinutesPerTonne: 4.5,
    distanceKm: 0,
    travelMinutes: 0
  },
  {
    centreId: 'CENTRE-B',
    centreName: 'Centre B (Ramanathapuram Yard)',
    location: 'Puliakulam Road, Ramanathapuram, Coimbatore',
    capacityTonnes: 120,
    bookedQuantityTonnes: 50,
    predictedWalkInQuantityTonnes: 12,
    expectedTotalDemandTonnes: 62,
    remainingCapacityTonnes: 58,
    quantityUtilizationPct: 52,
    congestionState: 'LOW',
    farmerCount: 22,
    activeCounters: 3,
    averageWaitMinutes: 15,
    averageProcessingMinutesPerTonne: 4.0,
    distanceKm: 4.2,
    travelMinutes: 12
  },
  {
    centreId: 'CENTRE-A',
    centreName: 'Centre A (Avinashi Central Hub)',
    location: 'Avinashi Main Road, Coimbatore',
    capacityTonnes: 80,
    bookedQuantityTonnes: 75,
    predictedWalkInQuantityTonnes: 15,
    expectedTotalDemandTonnes: 90,
    remainingCapacityTonnes: 0,
    quantityUtilizationPct: 112,
    congestionState: 'OVER_CAPACITY',
    farmerCount: 48,
    activeCounters: 2,
    averageWaitMinutes: 65,
    averageProcessingMinutesPerTonne: 5.5,
    distanceKm: 9.8,
    travelMinutes: 25
  },
  {
    centreId: 'CENTRE-D',
    centreName: 'Centre D (Sulur Grain Post)',
    location: 'RVS Nagar, Sulur, Coimbatore',
    capacityTonnes: 70,
    bookedQuantityTonnes: 30,
    predictedWalkInQuantityTonnes: 8,
    expectedTotalDemandTonnes: 38,
    remainingCapacityTonnes: 32,
    quantityUtilizationPct: 54,
    congestionState: 'LOW',
    farmerCount: 16,
    activeCounters: 2,
    averageWaitMinutes: 12,
    averageProcessingMinutesPerTonne: 4.2,
    distanceKm: 8.4,
    travelMinutes: 18
  }
];

class QuantityDemandEngine {
  private centres: QuantityDemandMetrics[] = [...INITIAL_CENTRE_CAPACITIES];
  private listeners: Array<(centres: QuantityDemandMetrics[]) => void> = [];

  public getCentres(): QuantityDemandMetrics[] {
    return [...this.centres];
  }

  public getCentre(centreId: string): QuantityDemandMetrics | undefined {
    return this.centres.find(c => c.centreId === centreId);
  }

  public evaluateCongestion(expectedDemandTonnes: number, capacityTonnes: number): CongestionState {
    const util = (expectedDemandTonnes / capacityTonnes) * 100;
    if (util < 60) return 'LOW';
    if (util <= 75) return 'MODERATE';
    if (util <= 90) return 'HIGH';
    if (util <= 100) return 'NEAR_CAPACITY';
    return 'OVER_CAPACITY';
  }

  public calculateWalkInDemand(bookedTonnes: number, harvestFactor: number = 1.0): number {
    // 25% default historical walk-in ratio
    return Math.round(bookedTonnes * 0.25 * harvestFactor);
  }

  public updateCentreDemand(centreId: string, additionalBookedTonnes: number): QuantityDemandMetrics {
    this.centres = this.centres.map(c => {
      if (c.centreId !== centreId) return c;
      const newBooked = c.bookedQuantityTonnes + additionalBookedTonnes;
      const newWalkIn = this.calculateWalkInDemand(newBooked);
      const newExpected = newBooked + newWalkIn;
      const remaining = Math.max(0, c.capacityTonnes - newExpected);
      const util = Math.round((newExpected / c.capacityTonnes) * 100);
      const state = this.evaluateCongestion(newExpected, c.capacityTonnes);

      return {
        ...c,
        bookedQuantityTonnes: newBooked,
        predictedWalkInQuantityTonnes: newWalkIn,
        expectedTotalDemandTonnes: newExpected,
        remainingCapacityTonnes: remaining,
        quantityUtilizationPct: util,
        congestionState: state,
        farmerCount: c.farmerCount + Math.ceil(additionalBookedTonnes / 1.5)
      };
    });

    this.notify();
    const updated = this.getCentre(centreId)!;

    auditTrailService.logEvent(
      'CENTRE_DEMAND_UPDATED',
      'QuantityDemandEngine',
      'ADMIN',
      {
        centreId,
        bookedTonnes: updated.bookedQuantityTonnes,
        walkInTonnes: updated.predictedWalkInQuantityTonnes,
        totalExpectedDemand: updated.expectedTotalDemandTonnes,
        congestionState: updated.congestionState
      }
    );

    return updated;
  }

  public resetCentres(): void {
    this.centres = [...INITIAL_CENTRE_CAPACITIES];
    this.notify();
  }

  public recommendCentre(input: SmartBookingInput): {
    recommendedCentre: QuantityDemandMetrics;
    preferredCentre?: QuantityDemandMetrics;
    isAlternativeRecommended: boolean;
    reasons: string[];
    comparisonNote: string;
  } {
    const preferredId = input.preferredCentreId || 'CENTRE-C';
    const preferred = this.getCentre(preferredId) || this.centres[0];
    const requestedTonnes = input.quantityKg / 1000;

    // Check if preferred centre is overloaded or near capacity
    const willExceed = (preferred.expectedTotalDemandTonnes + requestedTonnes) > (preferred.capacityTonnes * 0.9);

    if (willExceed && preferred.congestionState !== 'LOW') {
      // Find optimal alternative: lowest utilization with remaining capacity
      const eligibleAlternatives = this.centres
        .filter(c => c.centreId !== preferred.centreId && c.remainingCapacityTonnes >= requestedTonnes)
        .sort((a, b) => a.quantityUtilizationPct - b.quantityUtilizationPct);

      const bestAlt = eligibleAlternatives[0] || preferred;

      const reasons = [
        `Lower predicted waiting time (${bestAlt.averageWaitMinutes} min vs ${preferred.averageWaitMinutes} min)`,
        `Sufficient quantity capacity (${bestAlt.remainingCapacityTonnes} tonnes remaining)`,
        `${bestAlt.activeCounters} active weighbridges & counters online`,
        `Low congestion risk (${bestAlt.quantityUtilizationPct}% utilization)`,
        `Acceptable travel distance (${bestAlt.distanceKm || 4.2} km from baseline)`
      ];

      const comparisonNote = `${preferred.centreName} is your preferred centre, but demand is currently high (${preferred.quantityUtilizationPct}% capacity). We recommend ${bestAlt.centreName} to save ~${Math.abs(preferred.averageWaitMinutes - bestAlt.averageWaitMinutes)} min wait.`;

      return {
        recommendedCentre: bestAlt,
        preferredCentre: preferred,
        isAlternativeRecommended: true,
        reasons,
        comparisonNote
      };
    }

    // Preferred centre has plenty of room
    return {
      recommendedCentre: preferred,
      preferredCentre: preferred,
      isAlternativeRecommended: false,
      reasons: [
        `Your preferred centre ${preferred.centreName} has available capacity`,
        `Comfortable processing load (${preferred.quantityUtilizationPct}% utilization)`,
        `Estimated wait time under ${preferred.averageWaitMinutes} minutes`,
        `${preferred.activeCounters} active counters operating smoothly`
      ],
      comparisonNote: `${preferred.centreName} is ready for your ${input.quantityKg} kg ${input.crop} delivery.`
    };
  }

  public getAllCentres(): QuantityDemandMetrics[] {
    return this.getCentres();
  }

  public getCentreMetrics(centreId: string): QuantityDemandMetrics {
    const norm = centreId.toLowerCase();
    const match = this.centres.find(c =>
      c.centreId.toLowerCase() === norm ||
      (norm.includes('c') && c.centreId === 'CENTRE-C') ||
      (norm.includes('b') && c.centreId === 'CENTRE-B') ||
      (norm.includes('a') && c.centreId === 'CENTRE-A') ||
      (norm.includes('d') && c.centreId === 'CENTRE-D')
    );
    return match || this.centres[0];
  }

  public recommendBestCentre(
    village: string,
    quantityKg: number,
    _preference?: string
  ): {
    recommendedCentre: QuantityDemandMetrics;
    preferredCentre?: QuantityDemandMetrics;
    isAlternativeRecommended: boolean;
    reasons: string[];
    comparisonNote: string;
    explanation: string;
  } {
    const res = this.recommendCentre({
      crop: 'Paddy',
      quantityKg,
      date: new Date().toISOString(),
      village,
      priorityPreference: 'SHORTEST_WAIT',
      preferredCentreId: 'CENTRE-C',
      preferenceStrength: 'PREFERRED'
    });

    return {
      ...res,
      explanation: res.reasons.join('. ') + '. ' + res.comparisonNote
    };
  }

  public subscribe(listener: (centres: QuantityDemandMetrics[]) => void): () => void {
    this.listeners.push(listener);
    listener(this.getCentres());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    const snapshot = this.getCentres();
    this.listeners.forEach(l => l(snapshot));
  }
}

export const quantityDemandEngine = new QuantityDemandEngine();
