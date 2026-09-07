import { HourlyArrivalWaitEstimate, VirtualQueueStage, VirtualToken } from '../../types/procurement';
import { auditTrailService } from './auditTrailService';
import { eventBus } from './eventBus';

const STAGE_ORDER: VirtualQueueStage[] = [
  'BOOKED',
  'SLOT_ACTIVE',
  'IN_TRANSIT',
  'ARRIVED',
  'SECURITY_CHECKED',
  'WEIGHING',
  'UNLOADING',
  'COMPLETED'
];

class VirtualQueueEngine {
  private currentToken: VirtualToken = {
    tokenNumber: 'AG-1048',
    farmerId: 'FARMER-1048',
    farmerName: 'Muthusamy K',
    centreId: 'CENTRE-01',
    centreName: 'Singanallur Central APMC',
    stage: 'IN_TRANSIT',
    queuePosition: 17,
    tokensAhead: 16,
    dynamicEstimatedArrivalTime: '11:42 AM',
    estimatedWaitMinutes: 48,
    turnApproachingAlert: false,
    gateNumber: 'Gate 2 (Tractor Entry)',
    bayNumber: 'Bay 3',
    issuedAt: new Date(Date.now() - 3600 * 1000 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    lastStageUpdate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  private listeners: Array<(token: VirtualToken) => void> = [];

  public getToken(): VirtualToken {
    return { ...this.currentToken };
  }

  public setStage(stage: VirtualQueueStage): VirtualToken {
    const prevStage = this.currentToken.stage;
    let tokensAhead = this.currentToken.tokensAhead;
    let queuePosition = this.currentToken.queuePosition;
    let waitMinutes = this.currentToken.estimatedWaitMinutes;

    switch (stage) {
      case 'BOOKED':
        tokensAhead = 25;
        queuePosition = 26;
        waitMinutes = 65;
        break;
      case 'SLOT_ACTIVE':
        tokensAhead = 20;
        queuePosition = 21;
        waitMinutes = 55;
        break;
      case 'IN_TRANSIT':
        tokensAhead = 16;
        queuePosition = 17;
        waitMinutes = 48;
        break;
      case 'ARRIVED':
        tokensAhead = 8;
        queuePosition = 9;
        waitMinutes = 25;
        break;
      case 'SECURITY_CHECKED':
        tokensAhead = 3;
        queuePosition = 4;
        waitMinutes = 10;
        break;
      case 'WEIGHING':
        tokensAhead = 1;
        queuePosition = 2;
        waitMinutes = 5;
        break;
      case 'UNLOADING':
        tokensAhead = 0;
        queuePosition = 1;
        waitMinutes = 2;
        break;
      case 'COMPLETED':
        tokensAhead = 0;
        queuePosition = 0;
        waitMinutes = 0;
        break;
    }

    const turnApproaching = tokensAhead <= 3 && stage !== 'COMPLETED';

    this.currentToken = {
      ...this.currentToken,
      stage,
      tokensAhead,
      queuePosition,
      estimatedWaitMinutes: waitMinutes,
      turnApproachingAlert: turnApproaching,
      lastStageUpdate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    auditTrailService.logEvent(
      'VIRTUAL_QUEUE_STAGE_UPDATED',
      'VirtualQueueEngine',
      'OPERATOR',
      {
        tokenNumber: this.currentToken.tokenNumber,
        previousStage: prevStage,
        newStage: stage,
        tokensAhead,
        turnApproaching
      }
    );

    eventBus.emit({
      id: `EVT-QUEUE-${Date.now()}`,
      type: 'QUEUE_UPDATED',
      timestamp: new Date().toISOString(),
      source: 'virtualQueueEngine',
      payload: { ...this.currentToken }
    });

    this.notify();
    return { ...this.currentToken };
  }

  public advanceStage(): VirtualToken {
    const currentIndex = STAGE_ORDER.indexOf(this.currentToken.stage);
    if (currentIndex < STAGE_ORDER.length - 1) {
      return this.setStage(STAGE_ORDER[currentIndex + 1]);
    }
    return { ...this.currentToken };
  }

  public resetQueue(): VirtualToken {
    return this.setStage('IN_TRANSIT');
  }

  public getHourlyArrivalCurve(): HourlyArrivalWaitEstimate[] {
    return [
      {
        hourLabel: '10:00 AM',
        hour24: 10,
        expectedArrivals: 18,
        estimatedWaitMinutes: 35,
        congestionLevel: 'MODERATE',
        isRecommended: false,
        recommendationReason: 'Morning inflow actively building up.'
      },
      {
        hourLabel: '11:00 AM',
        hour24: 11,
        expectedArrivals: 34,
        estimatedWaitMinutes: 58,
        congestionLevel: 'HIGH',
        isRecommended: false,
        recommendationReason: 'Heavy arrival cluster; extended weighbridge wait.'
      },
      {
        hourLabel: '12:00 PM',
        hour24: 12,
        expectedArrivals: 48,
        estimatedWaitMinutes: 72,
        congestionLevel: 'HIGH',
        isRecommended: false,
        recommendationReason: 'Severe peak congestion: arrivals exceed capacity by 267%.'
      },
      {
        hourLabel: '01:00 PM',
        hour24: 13,
        expectedArrivals: 26,
        estimatedWaitMinutes: 40,
        congestionLevel: 'MODERATE',
        isRecommended: false,
        recommendationReason: 'Midday transition; queue beginning to clear.'
      },
      {
        hourLabel: '02:00 PM',
        hour24: 14,
        expectedArrivals: 12,
        estimatedWaitMinutes: 16,
        congestionLevel: 'LOW',
        isRecommended: true,
        recommendationReason: '🟢 Optimal Window: Minimum waiting time (<20 min) and full gate staffing.'
      },
      {
        hourLabel: '03:00 PM',
        hour24: 15,
        expectedArrivals: 10,
        estimatedWaitMinutes: 14,
        congestionLevel: 'LOW',
        isRecommended: false,
        recommendationReason: 'Smooth low crowd before evening closure.'
      }
    ];
  }

  public subscribe(listener: (token: VirtualToken) => void): () => void {
    this.listeners.push(listener);
    listener({ ...this.currentToken });
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    const copy = { ...this.currentToken };
    this.listeners.forEach(l => l(copy));
  }
}

export const virtualQueueEngine = new VirtualQueueEngine();
