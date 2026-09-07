import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Header } from './components/common/Header';
import { DemoToolbar } from './components/common/DemoToolbar';
import { PhoneFrame } from './components/common/PhoneFrame';
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { FarmerMobileView } from './components/farmer/FarmerMobileView';
import { DistrictOverview } from './components/admin/DistrictOverview';
import { NotificationDrawer } from './components/operator/NotificationDrawer';
import { LoginPage } from './components/auth/LoginPage';
import { IvrPhoneModal } from './components/ivr/IvrPhoneModal';
import { UssdModal } from './components/ivr/UssdModal';
import { LandingPage } from './components/landing/LandingPage';
import { BasicPhoneSimulationModal } from './components/ivr/BasicPhoneSimulationModal';

interface MainAppContentProps {
  onNavigateLanding: () => void;
  onOpenBasicPhone: () => void;
}

const MainAppContent: React.FC<MainAppContentProps> = ({
  onNavigateLanding,
  onOpenBasicPhone
}) => {
  const { role, isAuthenticated } = useAuth();
  const { alerts } = useSimulation();
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState<boolean>(false);
  const [isPhoneFrameMode, setIsPhoneFrameMode] = useState<boolean>(true);
  const [isIvrOpen, setIsIvrOpen] = useState<boolean>(false);
  const [isUssdOpen, setIsUssdOpen] = useState<boolean>(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const unreadAlertCount = alerts.filter(a => !a.read).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
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
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">🌾</span>
            <span className="font-extrabold text-slate-900">AgriFlow</span>
            <span>— Know the crowd before it arrives.</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono">
            <span>Multi-Channel: App • SMS • Voice • IVR • Assisted Access</span>
            <span>•</span>
            <span>Singanallur Procurement Centre</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const RootApp: React.FC = () => {
  const { login } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [isBasicPhoneOpen, setIsBasicPhoneOpen] = useState<boolean>(false);

  const handleLaunchRole = (targetRole: 'FARMER' | 'OPERATOR' | 'ADMIN') => {
    login(targetRole);
    setCurrentView('app');
  };

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage
          onExplorePlatform={() => handleLaunchRole('FARMER')}
          onLaunchRole={handleLaunchRole}
          onOpenPhoneSimulator={() => setIsBasicPhoneOpen(true)}
        />
      ) : (
        <MainAppContent
          onNavigateLanding={() => setCurrentView('landing')}
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
    <AuthProvider>
      <LanguageProvider>
        <SimulationProvider>
          <RootApp />
        </SimulationProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
