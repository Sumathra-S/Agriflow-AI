import React, { createContext, useContext, useState, useEffect, useTransition } from 'react';
import { CongestionRisk, OperatorActionItem, SystemAlert } from '../types/procurement';

export type DemoPreset = 'NORMAL' | 'HIGH_CONGESTION' | 'RECOVERY';

export interface DemoStepInfo {
  step: number;
  title: string;
  description: string;
  recommendedView: 'OPERATOR' | 'FARMER' | 'ADMIN';
  preset: DemoPreset;
  queue: number;
  expectedArrivals: number;
  capacity: number;
  risk: CongestionRisk;
}

export const DEMO_STEPS: DemoStepInfo[] = [
  {
    step: 1,
    title: 'Step 1: Normal Morning Inflow',
    description: 'Operator opens dashboard at 09:00 AM. Queue is 8 farmers, arrivals are within hourly capacity of 18/hr. Flow is smooth.',
    recommendedView: 'OPERATOR',
    preset: 'NORMAL',
    queue: 8,
    expectedArrivals: 15,
    capacity: 18,
    risk: 'LOW'
  },
  {
    step: 2,
    title: 'Step 2: Rapid Harvest & Booking Surge',
    description: '10:00 AM: Sunny weather accelerates combine harvesting. New bookings and early unannounced arrivals flood in.',
    recommendedView: 'OPERATOR',
    preset: 'HIGH_CONGESTION',
    queue: 16,
    expectedArrivals: 32,
    capacity: 18,
    risk: 'MEDIUM'
  },
  {
    step: 3,
    title: 'Step 3: Forecast Detects Severe Congestion Ahead',
    description: '10:45 AM: Predictive ML model projects 48 arrivals between 12:00 PM – 1:00 PM, exceeding capacity by 267%.',
    recommendedView: 'OPERATOR',
    preset: 'HIGH_CONGESTION',
    queue: 21,
    expectedArrivals: 48,
    capacity: 18,
    risk: 'HIGH'
  },
  {
    step: 4,
    title: 'Step 4: Operational Alert Triggered',
    description: 'High Congestion Alert flashes on Operator Dashboard. System flags impending gridlock at weighbridge gate.',
    recommendedView: 'OPERATOR',
    preset: 'HIGH_CONGESTION',
    queue: 23,
    expectedArrivals: 48,
    capacity: 18,
    risk: 'HIGH'
  },
  {
    step: 5,
    title: 'Step 5: Operator Inspects Explainability Factors',
    description: 'Operator reviews "Why is congestion high?": +35% booking surge, +28% morning velocity, and Weighbridge #2 calibration.',
    recommendedView: 'OPERATOR',
    preset: 'HIGH_CONGESTION',
    queue: 23,
    expectedArrivals: 48,
    capacity: 18,
    risk: 'HIGH'
  },
  {
    step: 6,
    title: 'Step 6: Operator Executes Flow Interventions',
    description: 'Operator dispatches advisory to upcoming 11:30–13:00 slot farmers and activates backup weighbridge staff.',
    recommendedView: 'OPERATOR',
    preset: 'HIGH_CONGESTION',
    queue: 23,
    expectedArrivals: 48,
    capacity: 22,
    risk: 'HIGH'
  },
  {
    step: 7,
    title: 'Step 7: Farmer Receives Real-Time Flow Guidance',
    description: 'Farmer mobile app displays dynamic advisory: "Arrive after 1:30 PM — your booking remains guaranteed and wait time is halved".',
    recommendedView: 'FARMER',
    preset: 'HIGH_CONGESTION',
    queue: 23,
    expectedArrivals: 48,
    capacity: 22,
    risk: 'HIGH'
  },
  {
    step: 8,
    title: 'Step 8: Arrival Pressure Stabilizes into Recovery',
    description: 'Arrivals spread out evenly into afternoon. Gate queue drops to 12. Centre transitions to Recovery / Normal status!',
    recommendedView: 'OPERATOR',
    preset: 'RECOVERY',
    queue: 12,
    expectedArrivals: 18,
    capacity: 22,
    risk: 'MEDIUM'
  }
];

interface SimulationContextType {
  preset: DemoPreset;
  setPreset: (preset: DemoPreset) => void;
  currentStep: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  isPlaying: boolean;
  toggleAutoPlay: () => void;
  // Live simulation metrics
  currentQueue: number;
  expectedArrivals: number;
  capacityPerHour: number;
  congestionRisk: CongestionRisk;
  peakWindow: string;
  // Operator Actions
  operatorActions: OperatorActionItem[];
  executeAction: (actionId: string) => void;
  resetSimulation: () => void;
  // Farmer advisory state
  farmerAdvisorySent: boolean;
  backupStaffActive: boolean;
  alerts: SystemAlert[];
  dismissAlert: (alertId: string) => void;
}

const INITIAL_ACTIONS: OperatorActionItem[] = [
  {
    id: 'act-1',
    label: 'Notify farmers with upcoming bookings',
    description: 'Broadcast SMS and in-app advisory suggesting arrival after 1:30 PM to avoid peak wait times.',
    executed: false,
    actionType: 'NOTIFY_FARMERS'
  },
  {
    id: 'act-2',
    label: 'Prepare additional processing staff',
    description: 'Bring auxiliary weighbridge and second moisture testing desk online to boost throughput to 22/hr.',
    executed: false,
    actionType: 'PREPARE_STAFF'
  },
  {
    id: 'act-3',
    label: 'Monitor arrival pressure at Gate 2',
    description: 'Keep tractor queuing on outer bypass road to avoid blocking main GT Road corridor.',
    executed: false,
    actionType: 'MONITOR'
  },
  {
    id: 'act-4',
    label: 'Review queue status after 30 minutes',
    description: 'Scheduled re-evaluation of arrival velocity and weighbridge clearance rate.',
    executed: false,
    actionType: 'REVIEW_QUEUE'
  }
];

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preset, setPresetState] = useState<DemoPreset>('HIGH_CONGESTION');
  const [currentStep, setCurrentStep] = useState<number>(4); // Default to Step 4 (Alert triggered) for high-impact first impression
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [operatorActions, setOperatorActions] = useState<OperatorActionItem[]>(INITIAL_ACTIONS);
  const [farmerAdvisorySent, setFarmerAdvisorySent] = useState<boolean>(false);
  const [backupStaffActive, setBackupStaffActive] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: 'alt-101',
      centreId: 'mandi-kalan',
      type: 'HIGH_CONGESTION',
      severity: 'HIGH',
      title: 'High Arrival Pressure Expected at 12 PM',
      message: 'Peak arrival pressure expected within the next 45–60 minutes. Predicted demand (48) significantly exceeds hourly processing capacity (18).',
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
      message: 'Waiting line increased to 23 trolleys at Gate 2 approach. Average wait currently 42 minutes.',
      recommendedAction: 'Verify moisture prescreening queue to speed up entry.',
      timestamp: '10:45 AM',
      read: true,
      audience: 'OPERATOR'
    }
  ]);

  // Derive metrics based on preset / step
  const stepData = DEMO_STEPS[currentStep - 1] || DEMO_STEPS[3];

  let currentQueue = stepData.queue;
  let expectedArrivals = stepData.expectedArrivals;
  let capacityPerHour = backupStaffActive ? 22 : stepData.capacity;
  let congestionRisk = stepData.risk;
  let peakWindow = '12:00 PM – 1:00 PM';

  if (preset === 'NORMAL') {
    currentQueue = 8;
    expectedArrivals = 15;
    capacityPerHour = 18;
    congestionRisk = 'LOW';
    peakWindow = 'Normal steady flow';
  } else if (preset === 'RECOVERY') {
    currentQueue = 12;
    expectedArrivals = 18;
    capacityPerHour = 22;
    congestionRisk = 'MEDIUM';
    peakWindow = 'Arrival pressure subsiding';
  } else if (preset === 'HIGH_CONGESTION') {
    currentQueue = backupStaffActive ? 19 : 23;
    expectedArrivals = farmerAdvisorySent ? 29 : 48;
    capacityPerHour = backupStaffActive ? 22 : 18;
    congestionRisk = farmerAdvisorySent && backupStaffActive ? 'MEDIUM' : 'HIGH';
    peakWindow = '12:00 PM – 1:00 PM';
  }

  const setPreset = (newPreset: DemoPreset) => {
    setPresetState(newPreset);
    if (newPreset === 'NORMAL') {
      setCurrentStep(1);
      setFarmerAdvisorySent(false);
      setBackupStaffActive(false);
    } else if (newPreset === 'HIGH_CONGESTION') {
      setCurrentStep(4);
    } else if (newPreset === 'RECOVERY') {
      setCurrentStep(8);
      setFarmerAdvisorySent(true);
      setBackupStaffActive(true);
    }
  };

  const goToStep = (stepNumber: number) => {
    const clamped = Math.max(1, Math.min(8, stepNumber));
    setCurrentStep(clamped);
    const targetStep = DEMO_STEPS[clamped - 1];
    setPresetState(targetStep.preset);

    if (clamped >= 6) {
      setFarmerAdvisorySent(true);
      setBackupStaffActive(true);
      setOperatorActions(prev =>
        prev.map(a =>
          a.id === 'act-1' || a.id === 'act-2' ? { ...a, executed: true } : a
        )
      );
    } else {
      setFarmerAdvisorySent(false);
      setBackupStaffActive(false);
      setOperatorActions(prev => prev.map(a => ({ ...a, executed: false })));
    }
  };

  const nextStep = () => {
    if (currentStep < 8) {
      goToStep(currentStep + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const toggleAutoPlay = () => {
    setIsPlaying(prev => !prev);
  };

  // Auto-play timer for demo walkthrough
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      startTransition(() => {
        setCurrentStep(curr => {
          if (curr >= 8) {
            setIsPlaying(false);
            return curr;
          }
          const next = curr + 1;
          const targetStep = DEMO_STEPS[next - 1];
          setPresetState(targetStep.preset);
          if (next >= 6) {
            setFarmerAdvisorySent(true);
            setBackupStaffActive(true);
          }
          return next;
        });
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const executeAction = (actionId: string) => {
    setOperatorActions(prev =>
      prev.map(action => {
        if (action.id === actionId) {
          const newStatus = !action.executed;
          if (action.actionType === 'NOTIFY_FARMERS') {
            setFarmerAdvisorySent(newStatus);
            if (newStatus) {
              // Add a real-time notification to the feed
              setAlerts(curr => [
                {
                  id: `alt-${Date.now()}`,
                  centreId: 'mandi-kalan',
                  type: 'OPERATIONAL_UPDATE',
                  severity: 'INFO',
                  title: 'Advisory Dispatched to Farmers',
                  message: 'Automated SMS sent to 42 farmers booked for 11:30–13:00 slots: "Recommended arrival after 1:30 PM".',
                  recommendedAction: 'Monitor gate arrival volume.',
                  timestamp: 'Just now',
                  read: false,
                  audience: 'ALL'
                },
                ...curr
              ]);
            }
          }
          if (action.actionType === 'PREPARE_STAFF') {
            setBackupStaffActive(newStatus);
          }
          return { ...action, executed: newStatus };
        }
        return action;
      })
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => (a.id === alertId ? { ...a, read: true } : a)));
  };

  const resetSimulation = () => {
    setPresetState('HIGH_CONGESTION');
    setCurrentStep(4);
    setIsPlaying(false);
    setFarmerAdvisorySent(false);
    setBackupStaffActive(false);
    setOperatorActions(INITIAL_ACTIONS);
  };

  return (
    <SimulationContext.Provider
      value={{
        preset,
        setPreset,
        currentStep,
        goToStep,
        nextStep,
        prevStep,
        isPlaying,
        toggleAutoPlay,
        currentQueue,
        expectedArrivals,
        capacityPerHour,
        congestionRisk,
        peakWindow,
        operatorActions,
        executeAction,
        resetSimulation,
        farmerAdvisorySent,
        backupStaffActive,
        alerts,
        dismissAlert
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within a SimulationProvider');
  return context;
};
