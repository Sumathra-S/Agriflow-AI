import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Header } from './components/common/Header';
import { DemoToolbar } from './components/common/DemoToolbar';
import { PhoneFrame } from './components/common/PhoneFrame';
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { FarmerMobileView } from './components/farmer/FarmerMobileView';
import { DistrictOverview } from './components/admin/DistrictOverview';
import { NotificationDrawer } from './components/operator/NotificationDrawer';
import { IvrPhoneModal } from './components/ivr/IvrPhoneModal';
import { UssdModal } from './components/ivr/UssdModal';
import { LandingPage } from './components/landing/LandingPage';
import { BasicPhoneSimulationModal } from './components/ivr/BasicPhoneSimulationModal';

// Dedicated Role Selection & Secure Authentication Screens
import { RoleSelectionPage } from './components/auth/RoleSelectionPage';
import { FarmerAuthScreen } from './components/auth/FarmerAuthScreen';
import { OperatorLoginScreen } from './components/auth/OperatorLoginScreen';
import { AdminLoginScreen } from './components/auth/AdminLoginScreen';

interface MainAppContentProps {
  onNavigateLanding: () => void;
  onNavigateRoleSelect: () => void;
  onOpenBasicPhone: () => void;
}

const MainAppContent: React.FC<MainAppContentProps> = ({
  onNavigateLanding,
  onNavigateRoleSelect,
  onOpenBasicPhone
}) => {
  const { role, isAuthenticated } = useAuth();
  const { alerts } = useSimulation();
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState<boolean>(false);
  const [isPhoneFrameMode, setIsPhoneFrameMode] = useState<boolean>(true);
  const [isIvrOpen, setIsIvrOpen] = useState<boolean>(false);
  const [isUssdOpen, setIsUssdOpen] = useState<boolean>(false);

  const unreadAlertCount = alerts.filter(a => !a.read).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 1. Hackathon Live Demo Toolbar (Scenario Presets & 8-Step Walkthrough) */}
      <DemoToolbar
        isPhoneFrameMode={isPhoneFrameMode}
        onTogglePhoneFrame={() => setIsPhoneFrameMode(prev => !prev)}
      />

      {/* 2. Official Government Portal Header */}
      <Header
        onToggleNotifications={() => setNotificationDrawerOpen(true)}
        unreadCount={unreadAlertCount}
        onNavigateLanding={onNavigateLanding}
        onNavigateRoleSelect={onNavigateRoleSelect}
        onOpenBasicPhone={onOpenBasicPhone}
        onOpenIvr={() => setIsIvrOpen(true)}
        onOpenUssd={() => setIsUssdOpen(true)}
      />

      {/* 3. Main Operational Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {role === 'OPERATOR' && <OperatorDashboard />}

        {role === 'FARMER' && (
          <div>
            {isPhoneFrameMode ? (
              <PhoneFrame onExitFrame={() => setIsPhoneFrameMode(false)}>
                <FarmerMobileView />
              </PhoneFrame>
            ) : (
              <div className="py-4">
                <FarmerMobileView />
              </div>
            )}
          </div>
        )}

        {role === 'ADMIN' && <DistrictOverview />}
      </main>

      {/* 4. Global Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
      />

      {/* 5. Global Interactive IVR / Basic Phone Simulator */}
      <IvrPhoneModal
        isOpen={isIvrOpen}
        onClose={() => setIsIvrOpen(false)}
      />

      {/* 6. Global Interactive USSD Simulator (*384#) */}
      <UssdModal
        isOpen={isUssdOpen}
        onClose={() => setIsUssdOpen(false)}
      />

      {/* 7. Official Public Infrastructure Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">🌾</span>
            <span className="font-extrabold text-slate-900 dark:text-white">AgriFlow</span>
            <span>— Know the crowd before it arrives.</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            <span>Multi-Channel: App • SMS • Voice • IVR • Assisted Access</span>
            <span>•</span>
            <span>Singanallur Procurement Centre</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

type AppRouteView = 'landing' | 'role_selection' | 'farmer_auth' | 'operator_login' | 'admin_login' | 'app';

const RootApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<AppRouteView>('landing');
  const [isBasicPhoneOpen, setIsBasicPhoneOpen] = useState<boolean>(false);

  // If user logs out while in 'app', return to role selection
  React.useEffect(() => {
    if (!isAuthenticated && currentView === 'app') {
      setCurrentView('role_selection');
    }
  }, [isAuthenticated, currentView]);

  const handleLaunchRole = (targetRole: 'FARMER' | 'OPERATOR' | 'ADMIN') => {
    if (targetRole === 'FARMER') {
      setCurrentView('farmer_auth');
    } else if (targetRole === 'OPERATOR') {
      setCurrentView('operator_login');
    } else if (targetRole === 'ADMIN') {
      setCurrentView('admin_login');
    }
  };

  return (
    <>
      {/* 1. Public Presentation Landing Page */}
      {currentView === 'landing' && (
        <LandingPage
          onExplorePlatform={() => setCurrentView('role_selection')}
          onLaunchRole={handleLaunchRole}
          onOpenPhoneSimulator={() => setIsBasicPhoneOpen(true)}
        />
      )}

      {/* 2. "Welcome to AgriFlow — How would you like to continue?" Role Selection */}
      {currentView === 'role_selection' && (
        <RoleSelectionPage
          onSelectRole={handleLaunchRole}
          onBackToLanding={() => setCurrentView('landing')}
        />
      )}

      {/* 3. Farmer Access (Enrollment & Mobile OTP Login) */}
      {currentView === 'farmer_auth' && (
        <FarmerAuthScreen
          onBackToRoleSelect={() => setCurrentView('role_selection')}
          onSuccess={() => setCurrentView('app')}
        />
      )}

      {/* 4. Centre Staff Login (Authorized Operators) */}
      {currentView === 'operator_login' && (
        <OperatorLoginScreen
          onBackToRoleSelect={() => setCurrentView('role_selection')}
          onSuccess={() => setCurrentView('app')}
        />
      )}

      {/* 5. Administrator Login (District DFSC) */}
      {currentView === 'admin_login' && (
        <AdminLoginScreen
          onBackToRoleSelect={() => setCurrentView('role_selection')}
          onSuccess={() => setCurrentView('app')}
        />
      )}

      {/* 6. Authenticated Operational Viewport */}
      {currentView === 'app' && (
        <MainAppContent
          onNavigateLanding={() => setCurrentView('landing')}
          onNavigateRoleSelect={() => setCurrentView('role_selection')}
          onOpenBasicPhone={() => setIsBasicPhoneOpen(true)}
        />
      )}

      {/* Global Unified Basic Phone Simulator (SMS / IVR / USSD) */}
      <BasicPhoneSimulationModal
        isOpen={isBasicPhoneOpen}
        onClose={() => setIsBasicPhoneOpen(false)}
      />
    </>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <SimulationProvider>
            <RootApp />
          </SimulationProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
