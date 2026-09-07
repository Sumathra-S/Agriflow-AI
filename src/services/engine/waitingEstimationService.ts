/**
 * AgriFlow Waiting Time Estimation Service
 * Calculates explainable operational waiting times based on queue depth,
 * processing speed, and active operational delays.
 * Designed so future ML regression prediction models plug in seamlessly.
 */

export interface WaitingEstimateFactors {
  tokensAhead: number;
  processingSpeedPerHour: number;
  averageDurationMinutes: number;
  operationalDelayMinutes: number;
}

export class WaitingEstimationService {
  /**
   * Calculates estimated wait time in minutes.
   */
  public calculateWaitMinutes(factors: WaitingEstimateFactors): number {
    if (factors.tokensAhead <= 0) return 5; // Minimum buffer for check-in

    // Standard throughput estimate: (tokensAhead / capacityPerHour) * 60 minutes
    const effectiveCapacity = Math.max(8, factors.processingSpeedPerHour);
    const rawMinutes = Math.round((factors.tokensAhead / effectiveCapacity) * 60);

    // Incorporate any active operational delay
    const totalMinutes = rawMinutes + (factors.operationalDelayMinutes || 0);

    return Math.max(5, totalMinutes);
  }

  /**
   * Formats wait time into human-friendly bilingual text.
   */
  public formatWaitDescription(waitMinutes: number): string {
    if (waitMinutes <= 15) {
      return `Approximately ${waitMinutes} minutes (Short wait)`;
    }
    if (waitMinutes <= 45) {
      return `Approximately ${waitMinutes} minutes (Moderate queue)`;
    }
    return `Approximately ${waitMinutes} minutes (Extended wait due to peak inflow)`;
  }
}

export const waitingEstimationService = new WaitingEstimationService();
