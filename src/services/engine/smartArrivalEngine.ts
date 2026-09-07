import { SmartArrivalGuidance } from '../../types/procurement';
import { auditTrailService } from './auditTrailService';
import { eventBus } from './eventBus';

const QUEUE_STEPS = [
  { ahead: 10, wait: 25, serviceTime: '11:05 AM', departureTime: '10:40 AM', serving: 'AF-098' },
  { ahead: 7, wait: 18, serviceTime: '10:58 AM', departureTime: '10:33 AM', serving: 'AF-101' },
  { ahead: 5, wait: 12, serviceTime: '10:52 AM', departureTime: '10:27 AM', serving: 'AF-103' },
  { ahead: 2, wait: 5, serviceTime: '10:45 AM', departureTime: 'Now (Turn Approaching)', serving: 'AF-106' },
  { ahead: 0, wait: 0, serviceTime: 'Now', departureTime: 'At Gate 2', serving: 'AF-108' }
];

class SmartArrivalEngine {
  private currentStepIndex = 0;
  private isDelayed = false;
  private listeners: Array<(guidance: SmartArrivalGuidance) => void> = [];

  private guidance: SmartArrivalGuidance = {
    tokenNumber: 'AF-108',
    centreName: 'Centre C (Singanallur APMC)',
    expectedServiceTime: '11:05 AM',
    travelDurationMinutes: 20,
    safetyBufferMinutes: 5,
    recommendedDepartureTime: '10:40 AM',
    queueWaitMinutes: 25,
    farmersAhead: 10,
    currentServingToken: 'AF-098',
    statusMessage: 'Leave around 10:40 AM to reach the centre near your expected service time.',
    conditionsChanged: false,
    lastRecalculatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  public getGuidance(): SmartArrivalGuidance {
    return { ...this.guidance };
  }

  public advanceQueue(): SmartArrivalGuidance {
    if (this.currentStepIndex < QUEUE_STEPS.length - 1) {
      this.currentStepIndex++;
    } else {
      this.currentStepIndex = 0; // wrap around for demo
    }

    const step = QUEUE_STEPS[this.currentStepIndex];
    let msg = `Leave around ${step.departureTime} to reach near your service time.`;

    if (step.ahead === 2) {
      msg = 'Your turn is approaching! Please enter Gate 2 (Tractor Entry).';
    } else if (step.ahead === 0) {
      msg = 'YOUR TURN! Proceed onto Weighbridge #1 now.';
    }

    this.guidance = {
      ...this.guidance,
      farmersAhead: step.ahead,
      countdownAhead: step.ahead,
      queueWaitMinutes: step.wait,
      expectedServiceTime: step.serviceTime,
      recommendedDepartureTime: step.departureTime,
      currentServingToken: step.serving,
      statusMessage: msg,
      conditionsChanged: false,
      lastRecalculatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    auditTrailService.logEvent(
      'VIRTUAL_QUEUE_PROGRESSION',
      'SmartArrivalEngine',
      'OPERATOR',
      {
        tokenNumber: this.guidance.tokenNumber,
        farmersAhead: step.ahead,
        servingToken: step.serving,
        expectedServiceTime: step.serviceTime
      }
    );

    eventBus.emit({
      id: `EVT-ARRIVAL-${Date.now()}`,
      type: 'QUEUE_UPDATED',
      timestamp: new Date().toISOString(),
      source: 'SmartArrivalEngine',
      payload: { ...this.guidance }
    });

    this.notify();
    return { ...this.guidance };
  }

  public triggerQueueDelay(): SmartArrivalGuidance {
    this.isDelayed = true;
    this.guidance = {
      ...this.guidance,
      queueWaitMinutes: 40,
      expectedServiceTime: '11:20 AM',
      recommendedDepartureTime: '10:55 AM',
      statusMessage: 'Queue conditions changed. Your expected service time has been updated to 11:20 AM. Leave around 10:55 AM.',
      conditionsChanged: true,
      lastRecalculatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    auditTrailService.logEvent(
      'QUEUE_DELAY_RECALCULATED',
      'SmartArrivalEngine',
      'OPERATOR',
      {
        tokenNumber: this.guidance.tokenNumber,
        newWaitMinutes: 40,
        newDepartureTime: '10:55 AM',
        reason: 'Weighbridge calibration and arrival influx'
      }
    );

    this.notify();
    return { ...this.guidance };
  }

  public simulateDelay(_minutes?: number): SmartArrivalGuidance {
    return this.triggerQueueDelay();
  }

  public resetQueue(): SmartArrivalGuidance {
    this.currentStepIndex = 0;
    this.isDelayed = false;
    const step = QUEUE_STEPS[0];

    this.guidance = {
      tokenNumber: 'AF-108',
      centreName: 'Centre C (Singanallur APMC)',
      expectedServiceTime: step.serviceTime,
      travelDurationMinutes: 20,
      safetyBufferMinutes: 5,
      recommendedDepartureTime: step.departureTime,
      queueWaitMinutes: step.wait,
      farmersAhead: step.ahead,
      countdownAhead: step.ahead,
      currentServingToken: step.serving,
      statusMessage: 'Leave around 10:40 AM to reach the centre near your expected service time.',
      conditionsChanged: false,
      lastRecalculatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.notify();
    return { ...this.guidance };
  }

  public resetGuidance(): SmartArrivalGuidance {
    return this.resetQueue();
  }

  public subscribe(listener: (guidance: SmartArrivalGuidance) => void): () => void {
    this.listeners.push(listener);
    listener(this.getGuidance());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    const copy = this.getGuidance();
    this.listeners.forEach(l => l(copy));
  }
}

export const smartArrivalEngine = new SmartArrivalEngine();
