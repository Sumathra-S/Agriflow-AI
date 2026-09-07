import { FarmerPreferences, PriorityCategory, CommunicationChannel } from '../../types/procurement';
import { auditTrailService } from './auditTrailService';

class FarmerPreferenceEngine {
  private preferences: Record<string, FarmerPreferences> = {
    'FARMER-1048': {
      farmerId: 'FARMER-1048',
      travelToleranceKm: 15,
      priorityCategory: 'STANDARD',
      optInAutoReallocation: true,
      vehicleType: 'Tractor Trolley',
      preferredDays: ['Monday', 'Wednesday', 'Friday'],
      disruptionNotificationChannel: 'SMS',
      maxAcceptableWaitMinutes: 45
    }
  };

  private listeners: Array<(prefs: FarmerPreferences) => void> = [];

  public getPreferences(farmerId: string = 'FARMER-1048'): FarmerPreferences {
    if (!this.preferences[farmerId]) {
      this.preferences[farmerId] = {
        farmerId,
        travelToleranceKm: 15,
        priorityCategory: 'STANDARD',
        optInAutoReallocation: true,
        vehicleType: 'Tractor Trolley',
        preferredDays: ['Monday', 'Wednesday', 'Friday'],
        disruptionNotificationChannel: 'SMS',
        maxAcceptableWaitMinutes: 45
      };
    }
    return { ...this.preferences[farmerId] };
  }

  public updatePreferences(
    farmerId: string,
    updates: Partial<FarmerPreferences>
  ): FarmerPreferences {
    const current = this.getPreferences(farmerId);
    const updated: FarmerPreferences = {
      ...current,
      ...updates
    };

    this.preferences[farmerId] = updated;

    // Log to tamper-evident audit trail
    auditTrailService.logEvent(
      'FARMER_PREFERENCES_UPDATED',
      `Farmer ${farmerId}`,
      'FARMER',
      {
        travelToleranceKm: updated.travelToleranceKm,
        priorityCategory: updated.priorityCategory,
        optInAutoReallocation: updated.optInAutoReallocation,
        maxAcceptableWaitMinutes: updated.maxAcceptableWaitMinutes
      }
    );

    this.notify(updated);
    return updated;
  }

  public setOptIn(farmerId: string, optIn: boolean): FarmerPreferences {
    return this.updatePreferences(farmerId, { optInAutoReallocation: optIn });
  }

  public setTravelTolerance(farmerId: string, km: number): FarmerPreferences {
    return this.updatePreferences(farmerId, { travelToleranceKm: km });
  }

  public setPriorityCategory(farmerId: string, category: PriorityCategory): FarmerPreferences {
    return this.updatePreferences(farmerId, { priorityCategory: category });
  }

  public subscribe(listener: (prefs: FarmerPreferences) => void, farmerId: string = 'FARMER-1048'): () => void {
    this.listeners.push(listener);
    listener(this.getPreferences(farmerId));
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(prefs: FarmerPreferences): void {
    this.listeners.forEach(l => l(prefs));
  }
}

export const farmerPreferenceEngine = new FarmerPreferenceEngine();
