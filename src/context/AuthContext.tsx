import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '../types/procurement';

interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  centreId: string;
  centreName: string;
  phone: string;
  badge: string;
}

const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  OPERATOR: {
    id: 'OP-8492',
    name: 'Balwinder Dhillon',
    role: 'OPERATOR',
    centreId: 'mandi-kalan',
    centreName: 'Mandi Kalan Procurement Centre',
    phone: '+91 98140-54321',
    badge: 'Station Supervisor, Grade I'
  },
  FARMER: {
    id: 'FMR-PB-2048',
    name: 'Sukhwinder Sharma',
    role: 'FARMER',
    centreId: 'mandi-kalan',
    centreName: 'Mandi Kalan Procurement Centre',
    phone: '+91 98765-43210',
    badge: 'Registered Farmer (Token #1024)'
  },
  ADMIN: {
    id: 'ADM-LDH-01',
    name: 'Dr. Harpreet Sandhu, IAS',
    role: 'ADMIN',
    centreId: 'all',
    centreName: 'District Administration — Ludhiana',
    phone: '+91 98722-11000',
    badge: 'District Procurement Controller (DFSC)'
  }
};

interface AuthContextType {
  role: UserRole;
  user: UserProfile;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('OPERATOR');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const login = (newRole: UserRole) => {
    setRoleState(newRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user: DEMO_PROFILES[role],
        setRole,
        isAuthenticated,
        login,
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
