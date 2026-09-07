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
