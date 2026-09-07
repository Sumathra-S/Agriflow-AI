/**
 * AgriFlow Authentication & Authorization Service
 * Enforces Role-Based Access Control (RBAC) rules and logs administrative actions.
 */

import { UserRole, AuditLogEntry } from '../types/procurement';
import { eventBus } from './engine/eventBus';

export interface AuthSession {
  userId: string;
  userName: string;
  role: UserRole;
  centreId: string;
  token: string;
  expiresAt: string;
}

export class AuthService {
  private auditLogs: AuditLogEntry[] = [
    {
      id: 'log-01',
      actor: 'Balwinder Dhillon',
      role: 'OPERATOR',
      action: 'SHIFT_START',
      affectedResource: 'Singanallur Procurement Centre',
      timestamp: '08:00 AM',
      details: 'Started morning operations shift with Weighbridge #1 active.'
    },
    {
      id: 'log-02',
      actor: 'Dr. Harpreet Sandhu, IAS',
      role: 'ADMIN',
      action: 'POLICY_UPDATE',
      affectedResource: 'District Procurement Policy',
      timestamp: '09:30 AM',
      details: 'Updated maximum allowable moisture threshold to 17.0% per FCI guidelines.'
    }
  ];

  /**
   * Enforces role-based resource authorization
   */
  public canAccessResource(role: UserRole, resourceType: 'OWN_PROFILE' | 'CENTRE_OPERATIONS' | 'DISTRICT_ANALYTICS' | 'POLICY_EDIT'): boolean {
    if (role === 'ADMIN') return true;
    if (role === 'OPERATOR') {
      return resourceType === 'OWN_PROFILE' || resourceType === 'CENTRE_OPERATIONS';
    }
    if (role === 'FARMER') {
      return resourceType === 'OWN_PROFILE';
    }
    return false;
  }

  /**
   * Strict Centre Isolation check for Centre Operators.
   * Operator assigned to Centre C can NEVER view or mutate Centre B/A data.
   */
  public canAccessCentre(role: UserRole, userCentreId: string | undefined, targetCentreId: string): boolean {
    if (role === 'ADMIN') return true;
    if (role === 'OPERATOR') {
      return !!userCentreId && userCentreId === targetCentreId;
    }
    return false;
  }

  /**
   * Farmer Privacy check.
   * Farmer A can only view Farmer A's booking, token and payout records.
   */
  public canAccessFarmerData(role: UserRole, loggedInFarmerId: string | undefined, targetFarmerId: string): boolean {
    if (role === 'ADMIN' || role === 'OPERATOR') return true;
    if (role === 'FARMER') {
      return !!loggedInFarmerId && loggedInFarmerId === targetFarmerId;
    }
    return false;
  }

  /**
   * Simple in-memory rate limiter for SMS, OTP and booking requests.
   */
  private rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

  public checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): { allowed: boolean; remaining: number; resetTimeMs: number } {
    const now = Date.now();
    const entry = this.rateLimitMap.get(key);

    if (!entry || entry.expiresAt <= now) {
      this.rateLimitMap.set(key, { count: 1, expiresAt: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1, resetTimeMs: now + windowMs };
    }

    if (entry.count >= maxRequests) {
      return { allowed: false, remaining: 0, resetTimeMs: entry.expiresAt };
    }

    entry.count += 1;
    return { allowed: true, remaining: maxRequests - entry.count, resetTimeMs: entry.expiresAt };
  }

  public logAction(actor: string, role: UserRole, action: string, affectedResource: string, details?: string): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      actor,
      role,
      action,
      affectedResource,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details
    };

    this.auditLogs.unshift(entry);
    eventBus.publish('AUDIT_LOGGED', entry, 'AuthService');
    return entry;
  }

  public getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }
}

export const authService = new AuthService();

