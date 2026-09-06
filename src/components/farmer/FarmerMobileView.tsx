import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSimulation } from '../../context/SimulationContext';
import { FarmerHeader } from './FarmerHeader';
import { CongestionCard } from './CongestionCard';
import { BookingCard } from './BookingCard';
import { FarmerNotifications } from './FarmerNotifications';
import { ProcurementHelp } from './ProcurementHelp';
import { SmsModal } from './SmsModal';
import { AssistedAccessBar } from './AssistedAccessBar';
import { FarmerSlotBookingModal } from './FarmerSlotBookingModal';
import { IvrPhoneModal } from '../ivr/IvrPhoneModal';
import { Home, Ticket, Bell, HelpCircle, WifiOff } from 'lucide-react';

export const FarmerMobileView: React.FC = () => {
  const { t } = useLanguage();
  const { congestionRisk } = useSimulation();

  // ONLY 4 tabs (Section 6 & 48): Home, My Booking, Alerts, Help
  const [activeTab, setActiveTab] = useState<'home' | 'booking' | 'alerts' | 'help'>('home');
  const [isSmsModalOpen, setIsSmsModalOpen] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isIvrModalOpen, setIsIvrModalOpen] = useState<boolean>(false);
  const [isLowConnectivity, setIsLowConnectivity] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Assisted mode state
  const [assistedToken, setAssistedToken] = useState<string>('1024');
  const [assistedFarmerName, setAssistedFarmerName] = useState<string>('Sukhwinder Sharma');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleSelectAssistedFarmer = (token: string, name: string) => {
    setAssistedToken(token);
    setAssistedFarmerName(name);
  };

  const handleBookingSuccess = (slot: string) => {
    setAssistedToken('1048');
    setActiveTab('booking');
  };

  return (
    <div className="flex flex-col min-h-[660px] bg-slate-100 max-w-md mx-auto shadow-md border-x border-slate-200">
      {/* 1. Mobile Top Header with Greeting, Prioritized Languages & IVR Launcher */}
      <FarmerHeader
        isLowConnectivity={isLowConnectivity}
        onToggleLowConnectivity={() => setIsLowConnectivity(!isLowConnectivity)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onOpenIvr={() => setIsIvrModalOpen(true)}
      />

      {/* 2. Assisted Access / Common Service Centre (CSC) Bar */}
      <AssistedAccessBar
        currentFarmerToken={assistedToken}
        onSelectToken={handleSelectAssistedFarmer}
      />

      {/* 3. Offline / Low Connectivity Warning Strip */}
      {isLowConnectivity && (
        <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-xs text-amber-950 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium">
            <WifiOff className="h-3.5 w-3.5 text-amber-700" />
            <span>{t.workingOffline}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="font-bold underline text-amber-900 hover:text-amber-950"
          >
            {t.retry}
          </button>
        </div>
      )}

      {/* 4. Main Tab Viewport */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {activeTab === 'home' && (
          <div className="space-y-4">
            <CongestionCard
              onOpenSmsModal={() => setIsSmsModalOpen(true)}
              onOpenBookingModal={() => setIsBookingModalOpen(true)}
              onOpenIvrModal={() => setIsIvrModalOpen(true)}
            />
            <BookingCard tokenNumber={assistedToken} farmerName={assistedFarmerName} />
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Procurement Booking</h3>
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="text-xs font-bold text-gov-800 bg-gov-100 hover:bg-gov-200 px-2.5 py-1 rounded-lg transition-colors"
              >
                + Change Slot
              </button>
            </div>
            <BookingCard tokenNumber={assistedToken} farmerName={assistedFarmerName} />
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <FarmerNotifications />
          </div>
        )}

        {activeTab === 'help' && (
          <div className="space-y-4">
            <ProcurementHelp />
          </div>
        )}
      </main>

      {/* 5. Modals (SMS, Booking, IVR) */}
      <SmsModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        tokenNumber={assistedToken}
      />

      <FarmerSlotBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />

      <IvrPhoneModal
        isOpen={isIvrModalOpen}
        onClose={() => setIsIvrModalOpen(false)}
      />

      {/* 6. Strict 4-Tab Bottom Navigation Bar (Section 6 & 48) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-300 px-2 py-2 flex items-center justify-around z-20 shadow-xl">
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[70px] transition-all ${
            activeTab === 'home'
              ? 'text-gov-900 font-extrabold bg-gov-50'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <Home className={`h-6 w-6 ${activeTab === 'home' ? 'stroke-[2.5px] text-gov-800' : ''}`} />
          <span className="text-xs mt-0.5">{t.navHome}</span>
        </button>

        {/* Tab 2: My Booking */}
        <button
          onClick={() => setActiveTab('booking')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[70px] transition-all ${
            activeTab === 'booking'
              ? 'text-gov-900 font-extrabold bg-gov-50'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <Ticket className={`h-6 w-6 ${activeTab === 'booking' ? 'stroke-[2.5px] text-gov-800' : ''}`} />
          <span className="text-xs mt-0.5">{t.navBooking}</span>
        </button>

        {/* Tab 3: Alerts */}
        <button
          onClick={() => setActiveTab('alerts')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[70px] transition-all ${
            activeTab === 'alerts'
              ? 'text-gov-900 font-extrabold bg-gov-50'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <Bell className={`h-6 w-6 ${activeTab === 'alerts' ? 'stroke-[2.5px] text-gov-800' : ''}`} />
          <span className="text-xs mt-0.5">{t.navAlerts}</span>
          {congestionRisk === 'HIGH' && (
            <span className="absolute top-1 right-5 h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping"></span>
          )}
        </button>

        {/* Tab 4: Help */}
        <button
          onClick={() => setActiveTab('help')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[70px] transition-all ${
            activeTab === 'help'
              ? 'text-gov-900 font-extrabold bg-gov-50'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <HelpCircle className={`h-6 w-6 ${activeTab === 'help' ? 'stroke-[2.5px] text-gov-800' : ''}`} />
          <span className="text-xs mt-0.5">{t.navHelp}</span>
        </button>
      </nav>
    </div>
  );
};
