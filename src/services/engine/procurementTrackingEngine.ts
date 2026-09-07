/**
 * AgriFlow Procurement Status Tracking Engine
 * Single source of truth for the 8-state procurement lifecycle:
 * REGISTERED -> SLOT_ASSIGNED -> FARMER_ARRIVED -> WEIGHING -> QUALITY_CHECK -> ACCEPTED -> PAYMENT_PROCESSING -> COMPLETED
 */

import { ProcurementRecord, ProcurementLifecycleStatus } from '../../types/procurement';
import { eventBus } from './eventBus';

export const LIFECYCLE_STAGES: Array<{ status: ProcurementLifecycleStatus; label: string; desc: string }> = [
  { status: 'REGISTERED', label: 'Registered', desc: 'Farmer profile and crop enrollment verified' },
  { status: 'SLOT_ASSIGNED', label: 'Slot Assigned', desc: 'Token #1024 generated for 11:30 AM' },
  { status: 'FARMER_ARRIVED', label: 'Arrived at Gate', desc: 'Vehicle checked in at Gate 2 entrance' },
  { status: 'WEIGHING', label: 'Gross Weighing', desc: 'Tractor weighed on electronic weighbridge' },
  { status: 'QUALITY_CHECK', label: 'Quality & Moisture', desc: 'Moisture tested (15.2% - Standard: <= 17%)' },
  { status: 'ACCEPTED', label: 'Lot Accepted', desc: '45 Quintals accepted for procurement' },
  { status: 'PAYMENT_PROCESSING', label: 'Payment Processing', desc: 'DBT voucher generated at MSP ₹2,320/qtl' },
  { status: 'COMPLETED', label: 'Procurement Complete', desc: '₹1,04,400 credited to bank account' }
];

export class ProcurementTrackingEngine {
  private currentRecord: ProcurementRecord = {
    id: 'PR-2026-1024',
    tokenNumber: 'TK-1024',
    farmerId: 'FMR-PB-2048',
    farmerName: 'Sukhwinder Sharma',
    mobile: '98765-43210',
    centreId: 'singanallur-centre',
    centreName: 'Singanallur Procurement Centre',
    crop: 'Paddy (PR-126)',
    allocatedWeightQtl: 45,
    actualWeightQtl: 45.2,
    moisturePercentage: 15.2,
    foreignMatterPercentage: 0.8,
    mspPerQuintal: 2320,
    grossAmount: 104864, // 45.2 * 2320
    dbtAccountRef: 'A/C **9014 (State Bank of India - DBT Active)',
    paymentStatus: 'IN_PROGRESS',
    currentStatus: 'SLOT_ASSIGNED',
    statusHistory: [
      { status: 'REGISTERED', label: 'Registered', timestamp: '08:00 AM', operatorNote: 'Online self-booking' },
      { status: 'SLOT_ASSIGNED', label: 'Slot Assigned', timestamp: '08:05 AM', operatorNote: 'Allocated Token #1024' }
    ]
  };

  public getRecord(): ProcurementRecord {
    return { ...this.currentRecord };
  }

  /**
   * Transitions procurement to the next status (Called by Centre Operator)
   */
  public advanceStatus(nextStatus?: ProcurementLifecycleStatus): ProcurementRecord {
    const currentIndex = LIFECYCLE_STAGES.findIndex(s => s.status === this.currentRecord.currentStatus);
    const targetStatus = nextStatus || (currentIndex < LIFECYCLE_STAGES.length - 1 ? LIFECYCLE_STAGES[currentIndex + 1].status : this.currentRecord.currentStatus);

    const stageInfo = LIFECYCLE_STAGES.find(s => s.status === targetStatus)!;

    this.currentRecord.currentStatus = targetStatus;
    this.currentRecord.statusHistory.push({
      status: targetStatus,
      label: stageInfo.label,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      operatorNote: stageInfo.desc
    });

    if (targetStatus === 'COMPLETED') {
      this.currentRecord.paymentStatus = 'CREDITED';
    }

    eventBus.publish('PROCUREMENT_STATUS_CHANGED', this.currentRecord, 'ProcurementTrackingEngine');

    return { ...this.currentRecord };
  }

  public resetRecord(): void {
    this.currentRecord.currentStatus = 'SLOT_ASSIGNED';
    this.currentRecord.paymentStatus = 'IN_PROGRESS';
    this.currentRecord.statusHistory = [
      { status: 'REGISTERED', label: 'Registered', timestamp: '08:00 AM', operatorNote: 'Online self-booking' },
      { status: 'SLOT_ASSIGNED', label: 'Slot Assigned', timestamp: '08:05 AM', operatorNote: 'Allocated Token #1024' }
    ];
  }
}

export const procurementTrackingEngine = new ProcurementTrackingEngine();
