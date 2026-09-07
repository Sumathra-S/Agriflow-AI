import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types/procurement';
import {
  authService,
  AuthSession,
  DEMO_OPERATOR_CREDENTIALS,
  DEMO_ADMIN_CREDENTIALS,
  DEMO_FARMER_PROFILE
} from '../services/authService';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  centreId: string;
  centreName: string;
  phone: string;
  badge: string;
}

const DEFAULT_PROFILES: Record<UserRole, UserProfile> = {
  OPERATOR: {
    id: DEMO_OPERATOR_CREDENTIALS.altId,
    name: DEMO_OPERATOR_CREDENTIALS.name,
    role: 'OPERATOR',
    centreId: DEMO_OPERATOR_CREDENTIALS.centreId,
    centreName: DEMO_OPERATOR_CREDENTIALS.centreName,
    phone: DEMO_OPERATOR_CREDENTIALS.phone,
    badge: DEMO_OPERATOR_CREDENTIALS.badge
  },
  FARMER: {
    id: DEMO_FARMER_PROFILE.id,
    name: DEMO_FARMER_PROFILE.name,
    role: 'FARMER',
    centreId: DEMO_FARMER_PROFILE.centreId,
    centreName: DEMO_FARMER_PROFILE.centreName,
    phone: DEMO_FARMER_PROFILE.phone,
    badge: DEMO_FARMER_PROFILE.badge
  },
  ADMIN: {
    id: DEMO_ADMIN_CREDENTIALS.altId,
    name: DEMO_ADMIN_CREDENTIALS.name,
    role: 'ADMIN',
    centreId: DEMO_ADMIN_CREDENTIALS.centreId,
    centreName: DEMO_ADMIN_CREDENTIALS.centreName,
    phone: DEMO_ADMIN_CREDENTIALS.phone,
    badge: DEMO_ADMIN_CREDENTIALS.badge
  }
};

interface AuthContextType {
  role: UserRole;
  user: UserProfile;
  session: AuthSession | null;
  isAuthenticated: boolean;
  unauthorizedAlert: string | null;
  clearUnauthorizedAlert: () => void;
  triggerUnauthorizedAlert: (customMessage?: string) => void;
  setRole: (role: UserRole) => void;
  login: (role: UserRole) => void;
  loginOperator: (id: string, pass: string) => { success: boolean; errorMessage?: string };
  loginAdmin: (id: string, pass: string) => { success: boolean; errorMessage?: string };
  loginFarmer: (phone: string, name?: string) => { success: boolean; errorMessage?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    const activeSession = authService.getSession();
    return activeSession ? activeSession.role : 'OPERATOR';
  });

  const [session, setSession] = useState<AuthSession | null>(() => authService.getSession());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!authService.getSession());
  const [unauthorizedAlert, setUnauthorizedAlert] = useState<string | null>(null);

  useEffect(() => {
    // If there is an existing session, restore role
    const current = authService.getSession();
    if (current) {
      setSession(current);
      setRoleState(current.role);
      setIsAuthenticated(true);
    }
  }, []);

  const clearUnauthorizedAlert = () => {
    setUnauthorizedAlert(null);
  };

  const triggerUnauthorizedAlert = (customMessage?: string) => {
    setUnauthorizedAlert(customMessage || "You don't have permission to access this area.");
    // Auto clear alert after 6 seconds
    setTimeout(() => {
      setUnauthorizedAlert(null);
    }, 6000);
  };

  const setRole = (newRole: UserRole) => {
    // Check if switching violates RBAC
    if (session && session.role !== 'ADMIN' && session.role !== newRole) {
      triggerUnauthorizedAlert("You don't have permission to switch roles without re-authenticating.");
      return;
    }
    setRoleState(newRole);
  };

  const login = (newRole: UserRole) => {
    if (newRole === 'OPERATOR') {
      const res = authService.authenticateOperator(DEMO_OPERATOR_CREDENTIALS.id, DEMO_OPERATOR_CREDENTIALS.password);
      if (res.session) setSession(res.session);
    } else if (newRole === 'ADMIN') {
      const res = authService.authenticateAdmin(DEMO_ADMIN_CREDENTIALS.id, DEMO_ADMIN_CREDENTIALS.password);
      if (res.session) setSession(res.session);
    } else {
      const res = authService.authenticateFarmer('9876543210', DEMO_FARMER_PROFILE.name);
      if (res.session) setSession(res.session);
    }
    setRoleState(newRole);
    setIsAuthenticated(true);
    setUnauthorizedAlert(null);
  };

  const loginOperator = (id: string, pass: string) => {
    const res = authService.authenticateOperator(id, pass);
    if (res.success && res.session) {
      setSession(res.session);
      setRoleState('OPERATOR');
      setIsAuthenticated(true);
      setUnauthorizedAlert(null);
      return { success: true };
    }
    return { success: false, errorMessage: res.errorMessage };
  };

  const loginAdmin = (id: string, pass: string) => {
    const res = authService.authenticateAdmin(id, pass);
    if (res.success && res.session) {
      setSession(res.session);
      setRoleState('ADMIN');
      setIsAuthenticated(true);
      setUnauthorizedAlert(null);
      return { success: true };
    }
    return { success: false, errorMessage: res.errorMessage };
  };

  const loginFarmer = (phone: string, name?: string) => {
    const res = authService.authenticateFarmer(phone, name);
    if (res.success && res.session) {
      setSession(res.session);
      setRoleState('FARMER');
      setIsAuthenticated(true);
      setUnauthorizedAlert(null);
      return { success: true };
    }
    return { success: false, errorMessage: res.errorMessage };
  };

  const logout = () => {
    authService.logout();
    setSession(null);
    setIsAuthenticated(false);
    setUnauthorizedAlert(null);
  };

  // Build active user profile from session or fallback
  const user: UserProfile = session
    ? {
        id: session.userId,
        name: session.userName,
        role: session.role,
        centreId: session.centreId,
        centreName: session.centreName,
        phone: session.phone || '+91 98000-00000',
        badge: session.badge
      }
    : DEFAULT_PROFILES[role];

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        session,
        isAuthenticated,
        unauthorizedAlert,
        clearUnauthorizedAlert,
        triggerUnauthorizedAlert,
        setRole,
        login,
        loginOperator,
        loginAdmin,
        loginFarmer,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
