import { ModelComparisonMetrics } from '../../types/procurement';

export interface HourlyForecastWithBounds {
  hourLabel: string;
  hour24: number;
  predictedArrivals: number;
  lowerConfidenceBound: number;
  upperConfidenceBound: number;
  capacityLimit: number;
  congestionProbabilityPct: number;
  isPeak: boolean;
}

export interface FeatureImportanceFactor {
  featureName: string;
  importancePct: number;
  direction: 'INCREASING' | 'DECREASING';
  explanation: string;
}

class AiForecastingEngine {
  public getForecastWithConfidence(): HourlyForecastWithBounds[] {
    return [
      {
        hourLabel: '09:00 AM',
        hour24: 9,
        predictedArrivals: 14,
        lowerConfidenceBound: 11,
        upperConfidenceBound: 17,
        capacityLimit: 18,
        congestionProbabilityPct: 18,
        isPeak: false
      },
      {
        hourLabel: '10:00 AM',
        hour24: 10,
        predictedArrivals: 26,
        lowerConfidenceBound: 22,
        upperConfidenceBound: 30,
        capacityLimit: 18,
        congestionProbabilityPct: 62,
        isPeak: false
      },
      {
        hourLabel: '11:00 AM',
        hour24: 11,
        predictedArrivals: 41,
        lowerConfidenceBound: 36,
        upperConfidenceBound: 46,
        capacityLimit: 18,
        congestionProbabilityPct: 88,
        isPeak: true
      },
      {
        hourLabel: '12:00 PM',
        hour24: 12,
        predictedArrivals: 48,
        lowerConfidenceBound: 42,
        upperConfidenceBound: 54,
        capacityLimit: 18,
        congestionProbabilityPct: 94,
        isPeak: true
      },
      {
        hourLabel: '01:00 PM',
        hour24: 13,
        predictedArrivals: 31,
        lowerConfidenceBound: 27,
        upperConfidenceBound: 35,
        capacityLimit: 18,
        congestionProbabilityPct: 71,
        isPeak: false
      },
      {
        hourLabel: '02:00 PM',
        hour24: 14,
        predictedArrivals: 15,
        lowerConfidenceBound: 12,
        upperConfidenceBound: 18,
        capacityLimit: 18,
        congestionProbabilityPct: 22,
        isPeak: false
      },
      {
        hourLabel: '03:00 PM',
        hour24: 15,
        predictedArrivals: 11,
        lowerConfidenceBound: 9,
        upperConfidenceBound: 13,
        capacityLimit: 18,
        congestionProbabilityPct: 12,
        isPeak: false
      },
      {
        hourLabel: '04:00 PM',
        hour24: 16,
        predictedArrivals: 8,
        lowerConfidenceBound: 6,
        upperConfidenceBound: 10,
        capacityLimit: 18,
        congestionProbabilityPct: 8,
        isPeak: false
      }
    ];
  }

  public getPeakForecastSummary(): {
    peakHour: string;
    expectedArrivals: number;
    uncertaintyRange: string;
    congestionProbability: number;
    capacityExceededPct: number;
  } {
    return {
      peakHour: '12:00 PM – 1:00 PM',
      expectedArrivals: 48,
      uncertaintyRange: '48 ± 6 arrivals (95% CI)',
      congestionProbability: 94,
      capacityExceededPct: 267 // 48 / 18
    };
  }

  public getExplainabilityFactors(): FeatureImportanceFactor[] {
    return [
      {
        featureName: 'Harvester Combine Velocity',
        importancePct: 32,
        direction: 'INCREASING',
        explanation: 'Sunny dry weather over the last 36 hours accelerated mechanized paddy harvesting across Sulur & Pollachi blocks.'
      },
      {
        featureName: 'Booking Slot Influx (Past 3h)',
        importancePct: 24,
        direction: 'INCREASING',
        explanation: 'Digital slot reservations rose +35% above historical weekday baseline for the 11:30 AM–1:30 PM intake window.'
      },
      {
        featureName: 'Local Mandi Open Market Price Gap',
        importancePct: 18,
        direction: 'INCREASING',
        explanation: 'Government MSP of ₹2,320/qtl is currently ₹185 higher than local private trade, motivating maximum APMC deliveries.'
      },
      {
        featureName: 'Historical Friday Rush Index',
        importancePct: 15,
        direction: 'INCREASING',
        explanation: 'Farmers systematically prefer Friday delivery for same-day DBT bank processing before weekend settlement.'
      },
      {
        featureName: 'Weighbridge Maintenance Lag',
        importancePct: 11,
        direction: 'DECREASING',
        explanation: 'Weighbridge #2 periodic tare-weight calibration reduced per-vehicle entry clearance speed by 12%.'
      }
    ];
  }

  public getModelBenchmarks(): ModelComparisonMetrics {
    return {
      baselineName: 'Classical Moving Average & SARIMA',
      modelName: 'AgriFlow Hybrid (Ensemble LightGBM + Queuing Prior)',
      baselineMae: 4.8,
      modelMae: 1.9,
      maeImprovementPct: 60.4,
      peakDetectionAccuracyPct: 94.2,
      avgWaitReductionMinutes: 38,
      trainingSamples: 48200
    };
  }
}

export const aiForecastingEngine = new AiForecastingEngine();
