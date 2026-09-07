import {
  BetterOptionProposal,
  CentreAllocationScore,
  CentreAllocationWeights,
  CentreNetworkNode,
  FarmerPreferences
} from '../../types/procurement';
import { auditTrailService } from './auditTrailService';
import { eventBus } from './eventBus';

export const COIMBATORE_CENTRE_NETWORK: CentreNetworkNode[] = [
  {
    centreId: 'CENTRE-01',
    name: 'Singanallur Central APMC',
    location: 'Trichy Road, Singanallur, Coimbatore',
    distanceFromCentralKm: 0,
    healthStatus: 'HIGH_LOAD',
    currentQueue: 23,
    utilizationPct: 91,
    averageWaitMinutes: 58,
    activeWeighbridges: 2,
    totalWeighbridges: 2,
    spareCapacitySlots: 0
  },
  {
    centreId: 'CENTRE-02',
    name: 'Ramanathapuram Yard',
    location: 'Puliakulam Road, Ramanathapuram, Coimbatore',
    distanceFromCentralKm: 4.2,
    healthStatus: 'STABLE',
    currentQueue: 7,
    utilizationPct: 61,
    averageWaitMinutes: 19,
    activeWeighbridges: 2,
    totalWeighbridges: 2,
    spareCapacitySlots: 34
  },
  {
    centreId: 'CENTRE-03',
    name: 'Sulur Grain Post',
    location: 'RVS Nagar, Sulur, Coimbatore',
    distanceFromCentralKm: 8.4,
    healthStatus: 'STABLE',
    currentQueue: 4,
    utilizationPct: 45,
    averageWaitMinutes: 14,
    activeWeighbridges: 1,
    totalWeighbridges: 1,
    spareCapacitySlots: 52
  },
  {
    centreId: 'CENTRE-04',
    name: 'Pollachi Main Mandi',
    location: 'Palakkad Road, Pollachi, Coimbatore',
    distanceFromCentralKm: 16.5,
    healthStatus: 'WATCH',
    currentQueue: 9,
    utilizationPct: 55,
    averageWaitMinutes: 24,
    activeWeighbridges: 2,
    totalWeighbridges: 2,
    spareCapacitySlots: 40
  }
];

class SmartCentreAllocationEngine {
  private network: CentreNetworkNode[] = [...COIMBATORE_CENTRE_NETWORK];
  private weights: CentreAllocationWeights = {
    waitWeight: 0.30,
    distanceWeight: 0.25,
    preferenceWeight: 0.20,
    capacityWeight: 0.15,
    slotWeight: 0.10
  };

  private activeProposal: BetterOptionProposal | null = null;
  private listeners: Array<(proposal: BetterOptionProposal | null) => void> = [];

  constructor() {
    // Initialize default active proposal for Muthusamy K
    this.activeProposal = {
      currentCentreId: 'CENTRE-01',
      currentCentreName: 'Singanallur Central APMC',
      currentWaitMinutes: 58,
      recommendedCentreId: 'CENTRE-02',
      recommendedCentreName: 'Ramanathapuram Yard',
      recommendedWaitMinutes: 19,
      waitDeltaMinutes: -39,
      distanceDeltaKm: 4.2,
      matchPercentage: 94,
      primaryReason: 'Saves 39 minutes wait time with only 4.2 km extra travel. 34 open slots ready.',
      status: 'OFFERED',
      auditTimestamp: new Date().toISOString()
    };
  }

  public getNetwork(): CentreNetworkNode[] {
    return [...this.network];
  }

  public updateCentreNode(centreId: string, updates: Partial<CentreNetworkNode>): void {
    this.network = this.network.map(node =>
      node.centreId === centreId ? { ...node, ...updates } : node
    );
  }

  public getWeights(): CentreAllocationWeights {
    return { ...this.weights };
  }

  public updateWeights(newWeights: Partial<CentreAllocationWeights>): CentreAllocationWeights {
    this.weights = { ...this.weights, ...newWeights };
    return { ...this.weights };
  }

  public evaluateCentres(prefs: FarmerPreferences): CentreAllocationScore[] {
    const tolerance = prefs.travelToleranceKm || 15;

    const scores = this.network.map(centre => {
      // 1. Wait Score (0-100, higher is better)
      const waitScore = Math.max(0, Math.min(100, Math.round(100 - centre.averageWaitMinutes * 1.2)));

      // 2. Distance Score (0-100, based on tolerance)
      let distScore = 100;
      if (centre.distanceFromCentralKm > tolerance) {
        distScore = Math.max(10, Math.round(100 - (centre.distanceFromCentralKm - tolerance) * 15));
      } else {
        distScore = Math.round(100 - (centre.distanceFromCentralKm / tolerance) * 40);
      }

      // 3. Preference Score (priority handling & opt-in)
      let prefScore = 80;
      if (prefs.priorityCategory === 'SMALL_HOLDER' || prefs.priorityCategory === 'SENIOR_CITIZEN') {
        prefScore = 95;
      }
      if (centre.distanceFromCentralKm <= 5) {
        prefScore += 5;
      }

      // 4. Capacity Score (lower utilization is better)
      const capScore = Math.max(0, Math.min(100, 100 - centre.utilizationPct));

      // 5. Available Slot Score
      const slotScore = Math.min(100, Math.round((centre.spareCapacitySlots / 50) * 100));

      // Composite calculation
      const composite = Math.round(
        waitScore * this.weights.waitWeight +
        distScore * this.weights.distanceWeight +
        prefScore * this.weights.preferenceWeight +
        capScore * this.weights.capacityWeight +
        slotScore * this.weights.slotWeight
      );

      let matchReason = 'Standard match based on capacity and distance.';
      if (centre.averageWaitMinutes <= 20 && centre.spareCapacitySlots > 20) {
        matchReason = 'Fast processing and abundant slot availability.';
      } else if (centre.healthStatus === 'HIGH_LOAD') {
        matchReason = 'Congestion warning: heavy intake in progress.';
      }

      return {
        centreId: centre.centreId,
        centreName: centre.name,
        distanceKm: centre.distanceFromCentralKm,
        estimatedWaitMinutes: centre.averageWaitMinutes,
        currentUtilizationPct: centre.utilizationPct,
        availableSlots: centre.spareCapacitySlots,
        waitScore,
        distScore,
        prefScore,
        capScore,
        slotScore,
        compositeScore: composite,
        isRecommended: false,
        matchReason
      };
    });

    // Mark the top scoring centre as recommended
    const sorted = [...scores].sort((a, b) => b.compositeScore - a.compositeScore);
    if (sorted.length > 0) {
      const topId = sorted[0].centreId;
      scores.forEach(s => {
        if (s.centreId === topId) {
          s.isRecommended = true;
        }
      });
    }

    return scores;
  }

  public getActiveProposal(): BetterOptionProposal | null {
    return this.activeProposal;
  }

  public acceptProposal(proposal: BetterOptionProposal, farmerId: string = 'FARMER-1048'): void {
    proposal.status = 'ACCEPTED';
    this.activeProposal = { ...proposal };

    // Log to tamper-evident audit trail
    auditTrailService.logEvent(
      'CENTRE_REALLOCATION_ACCEPTED',
      `Farmer ${farmerId}`,
      'FARMER',
      {
        fromCentre: proposal.currentCentreName,
        toCentre: proposal.recommendedCentreName,
        savedMinutes: Math.abs(proposal.waitDeltaMinutes),
        extraKm: proposal.distanceDeltaKm,
        matchPercentage: proposal.matchPercentage
      }
    );

    // Emit event bus notification
    eventBus.emit({
      id: `EVT-ALLOC-${Date.now()}`,
      type: 'REALLOCATION_OFFERED',
      timestamp: new Date().toISOString(),
      source: 'smartCentreAllocationEngine',
      payload: { ...proposal }
    });

    this.notify();
  }

  public declineProposal(proposal: BetterOptionProposal, farmerId: string = 'FARMER-1048'): void {
    proposal.status = 'DECLINED';
    this.activeProposal = { ...proposal };

    auditTrailService.logEvent(
      'CENTRE_REALLOCATION_DECLINED',
      `Farmer ${farmerId}`,
      'FARMER',
      {
        retainedCentre: proposal.currentCentreName,
        offeredCentre: proposal.recommendedCentreName,
        reason: 'Farmer preferred original centre booking'
      }
    );

    this.notify();
  }

  public resetProposal(): void {
    this.activeProposal = {
      currentCentreId: 'CENTRE-01',
      currentCentreName: 'Singanallur Central APMC',
      currentWaitMinutes: 58,
      recommendedCentreId: 'CENTRE-02',
      recommendedCentreName: 'Ramanathapuram Yard',
      recommendedWaitMinutes: 19,
      waitDeltaMinutes: -39,
      distanceDeltaKm: 4.2,
      matchPercentage: 94,
      primaryReason: 'Saves 39 minutes wait time with only 4.2 km extra travel. 34 open slots ready.',
      status: 'OFFERED',
      auditTimestamp: new Date().toISOString()
    };
    this.notify();
  }

  public subscribe(listener: (proposal: BetterOptionProposal | null) => void): () => void {
    this.listeners.push(listener);
    listener(this.activeProposal);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => l(this.activeProposal));
  }
}

export const smartCentreAllocationEngine = new SmartCentreAllocationEngine();
