import {
  ProcurementCentre,
  QueueItem,
  Booking,
  RiskFactor,
  ForecastHour,
  SystemAlert,
  CongestionRisk,
  ModelComparisonMetrics
} from '../types/procurement';

export interface IProcurementDataAdapter {
  getCentres(): Promise<ProcurementCentre[]>;
  getCentreById(id: string): Promise<ProcurementCentre | undefined>;
  getQueue(centreId: string): Promise<QueueItem[]>;
  getForecast(centreId: string, statePreset?: 'NORMAL' | 'HIGH_CONGESTION' | 'RECOVERY'): Promise<ForecastHour[]>;
  getRiskFactors(centreId: string, risk: CongestionRisk): Promise<RiskFactor[]>;
  getAlerts(centreId: string): Promise<SystemAlert[]>;
  getFarmerBooking(tokenNumber: string): Promise<Booking | undefined>;
  getModelComparison(): Promise<ModelComparisonMetrics>;
  sendFarmerAdvisory(centreId: string, recommendedTime: string): Promise<{ success: boolean; deliveredCount: number }>;
  addProcessingCapacity(centreId: string, additionalCapacity: number): Promise<{ success: boolean; newCapacity: number }>;
}

export const MOCK_CENTRES: ProcurementCentre[] = [
  {
    id: 'mandi-kalan',
    name: 'Mandi Kalan Procurement Centre',
    location: 'GT Road, Near Grain Yard, Mandi Kalan',
    district: 'Ludhiana',
    state: 'Punjab',
    capacityPerHour: 18,
    status: 'OPERATIONAL',
    totalWeighbridges: 2,
    activeWeighbridges: 1, // 1 in calibration explains capacity drop
    moistureMetersActive: 2,
    operatingHours: '08:00 AM - 07:00 PM',
    helpline: '1800-180-1551'
  },
  {
    id: 'khanna-grain',
    name: 'Khanna Grain Market Centre (Asia Yard)',
    location: 'National Highway 44, Khanna',
    district: 'Ludhiana',
    state: 'Punjab',
    capacityPerHour: 28,
    status: 'CONGESTED',
    totalWeighbridges: 3,
    activeWeighbridges: 2,
    moistureMetersActive: 3,
    operatingHours: '07:30 AM - 08:00 PM',
    helpline: '1800-180-1552'
  },
  {
    id: 'jagraon-apmc',
    name: 'Jagraon APMC Procurement Centre',
    location: 'Tehsil Road, Jagraon',
    district: 'Ludhiana',
    state: 'Punjab',
    capacityPerHour: 22,
    status: 'CONGESTED',
    totalWeighbridges: 2,
    activeWeighbridges: 2,
    moistureMetersActive: 2,
    operatingHours: '08:00 AM - 07:00 PM',
    helpline: '1800-180-1553'
  },
  {
    id: 'raikot-sub',
    name: 'Raikot Sub-Centre Yard',
    location: 'Barnala Road, Raikot',
    district: 'Ludhiana',
    state: 'Punjab',
    capacityPerHour: 14,
    status: 'OPERATIONAL',
    totalWeighbridges: 1,
    activeWeighbridges: 1,
    moistureMetersActive: 1,
    operatingHours: '08:00 AM - 06:00 PM',
    helpline: '1800-180-1554'
  },
  {
    id: 'samrala-yard',
    name: 'Samrala Procurement Yard',
    location: 'Chandigarh Road, Samrala',
    district: 'Ludhiana',
    state: 'Punjab',
    capacityPerHour: 16,
    status: 'OPERATIONAL',
    totalWeighbridges: 2,
    activeWeighbridges: 2,
    moistureMetersActive: 2,
    operatingHours: '08:00 AM - 07:00 PM',
    helpline: '1800-180-1555'
  },
  {
    id: 'doraha-depot',
    name: 'Doraha Grain Depot',
    location: 'Canal Bank, Doraha',
    district: 'Ludhiana',
    state: 'Punjab',
    capacityPerHour: 15,
    status: 'OPERATIONAL',
    totalWeighbridges: 1,
    activeWeighbridges: 1,
    moistureMetersActive: 1,
    operatingHours: '08:30 AM - 06:30 PM',
    helpline: '1800-180-1556'
  },
  {
    id: 'sahnewal-centre',
    name: 'Sahnewal Mandi Yard',
    location: 'Airport Link Road, Sahnewal',
    district: 'Ludhiana',
    state: 'Punjab',
    capacityPerHour: 18,
    status: 'OPERATIONAL',
    totalWeighbridges: 2,
    activeWeighbridges: 2,
    moistureMetersActive: 2,
    operatingHours: '08:00 AM - 07:00 PM',
    helpline: '1800-180-1557'
  },
  {
    id: 'mullanpur-mandi',
    name: 'Mullanpur Dakha Procurement Yard',
    location: 'Ferozepur Road, Mullanpur',
    district: 'Ludhiana',
    state: 'Punjab',
    capacityPerHour: 17,
    status: 'OPERATIONAL',
    totalWeighbridges: 2,
    activeWeighbridges: 1,
    moistureMetersActive: 2,
    operatingHours: '08:00 AM - 06:30 PM',
    helpline: '1800-180-1558'
  },
  {
    id: 'machhiwara-apmc',
    name: 'Machhiwara APMC Main Complex',
    location: 'Ropar Highway, Machhiwara',
    district: 'Ludhiana',
    state: 'Punjab',
    capacityPerHour: 20,
    status: 'OPERATIONAL',
    totalWeighbridges: 2,
    activeWeighbridges: 2,
    moistureMetersActive: 2,
    operatingHours: '08:00 AM - 07:00 PM',
    helpline: '1800-180-1559'
  },
  {
    id: 'payal-sub',
    name: 'Payal Sub-Centre Grain Post',
    location: 'Dhamot Road, Payal',
    district: 'Ludhiana',
    state: 'Punjab',
    capacityPerHour: 12,
    status: 'OPERATIONAL',
    totalWeighbridges: 1,
    activeWeighbridges: 1,
    moistureMetersActive: 1,
    operatingHours: '08:30 AM - 06:00 PM',
    helpline: '1800-180-1560'
  },
  {
    id: 'dehlon-yard',
    name: 'Dehlon Agricultural Yard',
    location: 'Malerkotla Road, Dehlon',
    district: 'Ludhiana',
    state: 'Punjab',
    capacityPerHour: 15,
    status: 'OPERATIONAL',
    totalWeighbridges: 1,
    activeWeighbridges: 1,
    moistureMetersActive: 2,
    operatingHours: '08:00 AM - 06:30 PM',
    helpline: '1800-180-1561'
  },
  {
    id: 'sidhwan-bet',
    name: 'Sidhwan Bet Procurement Point',
    location: 'River Road, Sidhwan Bet',
    district: 'Ludhiana',
    state: 'Punjab',
    capacityPerHour: 12,
    status: 'OPERATIONAL',
    totalWeighbridges: 1,
    activeWeighbridges: 1,
    moistureMetersActive: 1,
    operatingHours: '08:30 AM - 06:00 PM',
    helpline: '1800-180-1562'
  }
];

export const MOCK_QUEUE_ITEMS: QueueItem[] = [
  {
    tokenNumber: 'TK-1008',
    farmerId: 'FMR-PB-9941',
    farmerName: 'Gurpreet Singh',
    vehicle: 'Tractor Trolley',
    crop: 'Paddy (PR-126)',
    arrivalTime: '10:15 AM',
    estimatedWeightQtl: 52,
    moisturePercentage: 15.4,
    status: 'AT_WEIGHBRIDGE'
  },
  {
    tokenNumber: 'TK-1011',
    farmerId: 'FMR-PB-8820',
    farmerName: 'Harwinder Kaur',
    vehicle: 'Tractor Trolley',
    crop: 'Paddy (PR-126)',
    arrivalTime: '10:28 AM',
    estimatedWeightQtl: 44,
    moisturePercentage: 16.1,
    status: 'MOISTURE_TESTING'
  },
  {
    tokenNumber: 'TK-1015',
    farmerId: 'FMR-PB-4102',
    farmerName: 'Baldev Raj',
    vehicle: 'Mini Truck (Pick-up)',
    crop: 'Paddy (Basmati 1509)',
    arrivalTime: '10:40 AM',
    estimatedWeightQtl: 38,
    moisturePercentage: 14.8,
    status: 'WAITING_ENTRY'
  },
  {
    tokenNumber: 'TK-1019',
    farmerId: 'FMR-PB-7756',
    farmerName: 'Jaswinder Singh',
    vehicle: 'Tractor Trolley',
    crop: 'Paddy (PR-126)',
    arrivalTime: '10:48 AM',
    estimatedWeightQtl: 60,
    moisturePercentage: 16.8,
    status: 'WAITING_ENTRY'
  },
  {
    tokenNumber: 'TK-1021',
    farmerId: 'FMR-PB-3291',
    farmerName: 'Kuldeep Singh',
    vehicle: 'Tractor Trolley',
    crop: 'Paddy (PR-126)',
    arrivalTime: '10:55 AM',
    estimatedWeightQtl: 48,
    moisturePercentage: 15.9,
    status: 'WAITING_ENTRY'
  },
  {
    tokenNumber: 'TK-1024', // Demo farmer token!
    farmerId: 'FMR-PB-2048',
    farmerName: 'Sukhwinder Sharma',
    vehicle: 'Tractor Trolley',
    crop: 'Paddy (PR-126)',
    arrivalTime: 'Expected Slot 11:30 AM',
    estimatedWeightQtl: 45,
    moisturePercentage: 15.2,
    status: 'WAITING_ENTRY'
  }
];

export class MockDataAdapter implements IProcurementDataAdapter {
  async getCentres(): Promise<ProcurementCentre[]> {
    return [...MOCK_CENTRES];
  }

  async getCentreById(id: string): Promise<ProcurementCentre | undefined> {
    return MOCK_CENTRES.find(c => c.id === id);
  }

  async getQueue(centreId: string): Promise<QueueItem[]> {
    return [...MOCK_QUEUE_ITEMS];
  }

  async getForecast(centreId: string, statePreset: 'NORMAL' | 'HIGH_CONGESTION' | 'RECOVERY' = 'HIGH_CONGESTION'): Promise<ForecastHour[]> {
    if (statePreset === 'NORMAL') {
      return [
        { hourLabel: '9 AM', hour24: 9, expectedArrivals: 8, historicalBaseline: 9, actualArrivals: 8, capacityLimit: 18, isPeak: false },
        { hourLabel: '10 AM', hour24: 10, expectedArrivals: 11, historicalBaseline: 12, actualArrivals: 10, capacityLimit: 18, isPeak: false },
        { hourLabel: '11 AM', hour24: 11, expectedArrivals: 14, historicalBaseline: 15, actualArrivals: 13, capacityLimit: 18, isPeak: false },
        { hourLabel: '12 PM', hour24: 12, expectedArrivals: 15, historicalBaseline: 16, actualArrivals: undefined, capacityLimit: 18, isPeak: false },
        { hourLabel: '1 PM', hour24: 13, expectedArrivals: 13, historicalBaseline: 14, actualArrivals: undefined, capacityLimit: 18, isPeak: false },
        { hourLabel: '2 PM', hour24: 14, expectedArrivals: 10, historicalBaseline: 11, actualArrivals: undefined, capacityLimit: 18, isPeak: false },
      ];
    } else if (statePreset === 'RECOVERY') {
      return [
        { hourLabel: '9 AM', hour24: 9, expectedArrivals: 14, historicalBaseline: 9, actualArrivals: 14, capacityLimit: 22, isPeak: false },
        { hourLabel: '10 AM', hour24: 10, expectedArrivals: 24, historicalBaseline: 12, actualArrivals: 22, capacityLimit: 22, isPeak: false },
        { hourLabel: '11 AM', hour24: 11, expectedArrivals: 38, historicalBaseline: 15, actualArrivals: 36, capacityLimit: 22, isPeak: true },
        { hourLabel: '12 PM', hour24: 12, expectedArrivals: 26, historicalBaseline: 16, actualArrivals: 24, capacityLimit: 22, isPeak: false },
        { hourLabel: '1 PM', hour24: 13, expectedArrivals: 18, historicalBaseline: 14, actualArrivals: undefined, capacityLimit: 22, isPeak: false },
        { hourLabel: '2 PM', hour24: 14, expectedArrivals: 12, historicalBaseline: 11, actualArrivals: undefined, capacityLimit: 22, isPeak: false },
      ];
    }

    // Default: HIGH_CONGESTION state
    return [
      { hourLabel: '9 AM', hour24: 9, expectedArrivals: 12, historicalBaseline: 9, actualArrivals: 12, capacityLimit: 18, isPeak: false },
      { hourLabel: '10 AM', hour24: 10, expectedArrivals: 22, historicalBaseline: 12, actualArrivals: 20, capacityLimit: 18, isPeak: false },
      { hourLabel: '11 AM', hour24: 11, expectedArrivals: 36, historicalBaseline: 15, actualArrivals: 32, capacityLimit: 18, isPeak: false },
      { hourLabel: '12 PM', hour24: 12, expectedArrivals: 48, historicalBaseline: 16, actualArrivals: undefined, capacityLimit: 18, isPeak: true }, // Peak!
      { hourLabel: '1 PM', hour24: 13, expectedArrivals: 41, historicalBaseline: 14, actualArrivals: undefined, capacityLimit: 18, isPeak: true },
      { hourLabel: '2 PM', hour24: 14, expectedArrivals: 22, historicalBaseline: 11, actualArrivals: undefined, capacityLimit: 18, isPeak: false },
    ];
  }

  async getRiskFactors(centreId: string, risk: CongestionRisk): Promise<RiskFactor[]> {
    if (risk === 'LOW') {
      return [
        {
          id: 'rf-1',
          title: 'Scheduled Bookings Normal',
          explanation: 'Today\'s bookings are consistent with 30-day average seasonal volumes.',
          direction: 'INCREASING_RISK',
          stat: '-4% vs usual',
          impactLevel: 'LOW'
        },
        {
          id: 'rf-2',
          title: 'Arrival Pace On-Schedule',
          explanation: 'Farmers are arriving close to assigned slot windows.',
          direction: 'INCREASING_RISK',
          stat: '94% slot punctuality',
          impactLevel: 'LOW'
        },
        {
          id: 'rf-3',
          title: 'Processing Operating at Full Capacity',
          explanation: 'All active weighbridges and moisture testing stations operating normally.',
          direction: 'REDUCING_CAPACITY',
          stat: '18 farmers / hour',
          impactLevel: 'LOW'
        }
      ];
    } else if (risk === 'MEDIUM') {
      return [
        {
          id: 'rf-1',
          title: 'Bookings Approaching Peak Capacity',
          explanation: 'Midday slots are 85% filled with limited buffer for unannounced arrivals.',
          direction: 'INCREASING_RISK',
          stat: '+16% vs usual',
          impactLevel: 'MODERATE'
        },
        {
          id: 'rf-2',
          title: 'Slight Arrival Acceleration',
          explanation: 'Farmers from surrounding villages arriving 20-30 minutes earlier than booked.',
          direction: 'INCREASING_RISK',
          stat: '+14% arrival velocity',
          impactLevel: 'MODERATE'
        },
        {
          id: 'rf-3',
          title: 'Moisture Testing Queue Building',
          explanation: 'Average moisture inspection time currently 4.5 minutes per trolley.',
          direction: 'REDUCING_CAPACITY',
          stat: '18 farmers / hour',
          impactLevel: 'LOW'
        }
      ];
    }

    // Default HIGH risk explainability factors (Section 7 of Prompt)
    return [
      {
        id: 'rf-1',
        title: 'High bookings today',
        explanation: '+35% compared to usual seasonal demand due to sunny harvest weather.',
        direction: 'INCREASING_RISK',
        stat: '+35% surge',
        impactLevel: 'HIGH'
      },
      {
        id: 'rf-2',
        title: 'Faster than usual arrivals',
        explanation: 'Farmers arriving ahead of scheduled time slots since 08:30 AM.',
        direction: 'INCREASING_RISK',
        stat: '+28% since morning',
        impactLevel: 'HIGH'
      },
      {
        id: 'rf-3',
        title: 'Processing capacity is lower',
        explanation: 'Weighbridge #2 undergoing routine calibration; effective throughput constrained.',
        direction: 'REDUCING_CAPACITY',
        stat: '18 farmers / hour',
        impactLevel: 'HIGH'
      }
    ];
  }

  async getAlerts(centreId: string): Promise<SystemAlert[]> {
    return [
      {
        id: 'alt-101',
        centreId: 'mandi-kalan',
        type: 'HIGH_CONGESTION',
        severity: 'HIGH',
        title: 'High Arrival Pressure Expected at 12 PM',
        message: 'Predicted demand (48 farmers) exceeds effective hourly capacity (18 farmers). Gate queue likely to double within 45 minutes.',
        recommendedAction: 'Notify upcoming farmers and prepare available processing capacity.',
        timestamp: '11:15 AM',
        read: false,
        audience: 'ALL'
      },
      {
        id: 'alt-102',
        centreId: 'mandi-kalan',
        type: 'QUEUE_SURGE',
        severity: 'MEDIUM',
        title: 'Queue increased by 20%',
        message: 'Current waiting queue increased from 18 to 23 trolleys at Gate 2 weighbridge approach.',
        recommendedAction: 'Open auxiliary inspection lane for moisture pre-screening.',
        timestamp: '10:45 AM',
        read: true,
        audience: 'OPERATOR'
      },
      {
        id: 'alt-103',
        centreId: 'mandi-kalan',
        type: 'OPERATIONAL_UPDATE',
        severity: 'INFO',
        title: 'Procurement centre update',
        message: 'Moisture threshold fixed at 17.0% as per Food Corporation of India (FCI) specification.',
        recommendedAction: 'Ensure display board at Gate 1 shows updated procurement guidelines.',
        timestamp: '08:00 AM',
        read: true,
        audience: 'ALL'
      }
    ];
  }

  async getFarmerBooking(tokenNumber: string): Promise<Booking | undefined> {
    return {
      id: 'bk-2026-1024',
      tokenNumber: '1024',
      farmerId: 'FMR-PB-2048',
      farmerName: 'Sukhwinder Sharma',
      mobile: '98765-43210',
      centreId: 'mandi-kalan',
      date: 'Today, 06 Sep 2026',
      timeSlot: '11:30 AM – 12:30 PM',
      crop: 'Paddy (PR-126)',
      allocatedWeightQtl: 45,
      status: 'CONFIRMED',
      gateNumber: 'Gate 2 (Weighbridge West)',
      recommendedArrival: 'Arrive after 1:30 PM',
      notes: 'Waiting time is lower in the afternoon. Your booking remains active and guaranteed.'
    };
  }

  async getModelComparison(): Promise<ModelComparisonMetrics> {
    return {
      baselineName: 'Historical Seasonal Average',
      modelName: 'AgriFlow Gradient Boosting Flow Regressor',
      baselineMae: 5.72,
      modelMae: 5.25,
      maeImprovementPct: 8.2,
      peakDetectionAccuracyPct: 83.3,
      avgWaitReductionMinutes: 56,
      trainingSamples: 1320
    };
  }

  async sendFarmerAdvisory(centreId: string, recommendedTime: string): Promise<{ success: boolean; deliveredCount: number }> {
    // Simulates broadcasting SMS & mobile app advisory to booked farmers for 11 AM - 1 PM slots
    return { success: true, deliveredCount: 42 };
  }

  async addProcessingCapacity(centreId: string, additionalCapacity: number): Promise<{ success: boolean; newCapacity: number }> {
    return { success: true, newCapacity: 18 + additionalCapacity };
  }
}

/**
 * AuthorizedGovernmentDataAdapter (Stub for production deployment)
 * Clean architecture stub demonstrating how AgriFlow AI plugs into
 * official state agricultural marketing boards (e.g., e-NAM, Punjab Mandi Board, FCI).
 */
export class AuthorizedGovernmentDataAdapter implements IProcurementDataAdapter {
  private apiBaseUrl: string;

  constructor(apiBaseUrl = 'https://api.enam.gov.in/v2/procurement') {
    this.apiBaseUrl = apiBaseUrl;
  }

  async getCentres(): Promise<ProcurementCentre[]> {
    throw new Error('Connects to authorized government endpoint: ' + this.apiBaseUrl + '/centres');
  }
  async getCentreById(id: string): Promise<ProcurementCentre | undefined> {
    throw new Error('Connects to authorized government endpoint: ' + this.apiBaseUrl + '/centres/' + id);
  }
  async getQueue(centreId: string): Promise<QueueItem[]> {
    throw new Error('Connects to authorized weighbridge telemetry: ' + this.apiBaseUrl + '/centres/' + centreId + '/queue');
  }
  async getForecast(centreId: string): Promise<ForecastHour[]> {
    throw new Error('Connects to internal AgriFlow AI prediction service endpoint');
  }
  async getRiskFactors(centreId: string, risk: CongestionRisk): Promise<RiskFactor[]> {
    throw new Error('Connects to explainability service');
  }
  async getAlerts(centreId: string): Promise<SystemAlert[]> {
    throw new Error('Connects to authorized government SMS/Push dispatch service');
  }
  async getFarmerBooking(tokenNumber: string): Promise<Booking | undefined> {
    throw new Error('Connects to authorized farmer registry slot service');
  }
  async getModelComparison(): Promise<ModelComparisonMetrics> {
    throw new Error('Connects to model telemetry metrics');
  }
  async sendFarmerAdvisory(centreId: string, recommendedTime: string): Promise<{ success: boolean; deliveredCount: number }> {
    throw new Error('Connects to State SMS Gateway (C-DAC / NIC)');
  }
  async addProcessingCapacity(centreId: string, additionalCapacity: number): Promise<{ success: boolean; newCapacity: number }> {
    throw new Error('Connects to centre staff management register');
  }
}

// Active singleton instance
export const procurementAdapter: IProcurementDataAdapter = new MockDataAdapter();
