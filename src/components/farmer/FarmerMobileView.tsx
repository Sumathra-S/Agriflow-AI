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
import { FarmerRegistrationModal } from './FarmerRegistrationModal';
import { IvrPhoneModal } from '../ivr/IvrPhoneModal';
import { UssdModal } from '../ivr/UssdModal';
import { FarmerProfile } from '../../types/procurement';
import { ReschedulingBanner } from './ReschedulingBanner';
import { ProcurementLifecycleCard } from './ProcurementLifecycleCard';
import { MyPreferencesModal } from './MyPreferencesModal';
import { BetterOptionCard } from './BetterOptionCard';
import { WhenShouldIArriveModal } from './WhenShouldIArriveModal';
import { VirtualQueueCard } from './VirtualQueueCard';
import { Home, Ticket, Bell, HelpCircle, WifiOff, Zap } from 'lucide-react';

export const FarmerMobileView: React.FC = () => {
  const { t } = useLanguage();
  const { congestionRisk } = useSimulation();

  // ONLY 4 tabs (Section 6 & 48): Home, My Booking, Alerts, Help
  const [activeTab, setActiveTab] = useState<'home' | 'booking' | 'alerts' | 'help'>('home');
  const [isSmsModalOpen, setIsSmsModalOpen] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isIvrModalOpen, setIsIvrModalOpen] = useState<boolean>(false);
  const [isUssdModalOpen, setIsUssdModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);
  const [isArrivalModalOpen, setIsArrivalModalOpen] = useState<boolean>(false);

  const [isLowConnectivity, setIsLowConnectivity] = useState<boolean>(false);
  const [isLowDataMode, setIsLowDataMode] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Assisted mode state
  const [assistedToken, setAssistedToken] = useState<string>('1024');
  const [assistedFarmerName, setAssistedFarmerName] = useState<string>('Sukhwinder Sharma');
  const [bookingSlot, setBookingSlot] = useState<string>('11:30 AM – 12:30 PM');
  const [bookingStatus, setBookingStatus] = useState<'CONFIRMED' | 'WAITING_LIST' | 'CANCELLED'>('CONFIRMED');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleSelectAssistedFarmer = (token: string, name: string) => {
    setAssistedToken(token);
    setAssistedFarmerName(name);
    setBookingStatus('CONFIRMED');
  };

  const handleBookingSuccess = (slot: string, isWaitingList?: boolean) => {
    if (isWaitingList) {
      setBookingStatus('WAITING_LIST');
    } else {
      setBookingSlot(slot);
      setBookingStatus('CONFIRMED');
    }
    setAssistedToken('1048');
    setActiveTab('booking');
  };

  const handleFarmerRegistered = (newFarmer: FarmerProfile) => {
    if (newFarmer.activeToken) setAssistedToken(newFarmer.activeToken);
    setAssistedFarmerName(newFarmer.name);
    setBookingStatus('CONFIRMED');
    setActiveTab('booking');
  };

  return (
    <div className={`flex flex-col min-h-[660px] max-w-md mx-auto shadow-md border-x border-slate-200 transition-colors ${
      isLowDataMode ? 'bg-white text-black' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* 1. Mobile Top Header with Greeting, Languages, IVR, USSD & Low Data Mode */}
      <FarmerHeader
        isLowConnectivity={isLowConnectivity}
        onToggleLowConnectivity={() => setIsLowConnectivity(!isLowConnectivity)}
        isLowDataMode={isLowDataMode}
        onToggleLowDataMode={() => setIsLowDataMode(!isLowDataMode)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onOpenIvr={() => setIsIvrModalOpen(true)}
        onOpenUssd={() => setIsUssdModalOpen(true)}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
      />

      {/* 2. Assisted Access / Common Service Centre (CSC) Bar */}
      <AssistedAccessBar
        currentFarmerToken={assistedToken}
        onSelectToken={handleSelectAssistedFarmer}
      />

      {/* 3. Low Data Mode Active Strip */}
      {isLowDataMode && (
        <div className="bg-slate-900 text-amber-300 px-4 py-1.5 text-xs font-mono font-bold flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>⚡ Low Data Mode: ON (2G/EDGE Optimized - 1.2 KB)</span>
          </div>
          <button
            onClick={() => setIsLowDataMode(false)}
            className="text-[10px] text-slate-300 underline hover:text-white"
          >
            Turn OFF
          </button>
        </div>
      )}

      {/* 4. Offline / Low Connectivity Warning Strip */}
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

      {/* 5. Main Tab Viewport */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Smart Centre Allocation Recommendation Banner (Better Option Found) */}
            <BetterOptionCard />

            {/* AI-Powered Virtual Queue & Dynamic Arrival Stage Card */}
            <VirtualQueueCard onOpenArrivalModal={() => setIsArrivalModalOpen(true)} />

            {/* Operational Delay Advisory & Rescheduling Recommendation */}
            <ReschedulingBanner />

            {/* Current Crowd Condition & Guidance Card */}
            <CongestionCard
              onOpenSmsModal={() => setIsSmsModalOpen(true)}
              onOpenBookingModal={() => setIsBookingModalOpen(true)}
              onOpenIvrModal={() => setIsIvrModalOpen(true)}
            />

            {/* Assigned Booking & Explainability Trigger */}
            <BookingCard
              tokenNumber={assistedToken}
              farmerName={assistedFarmerName}
              slotTime={bookingSlot}
              status={bookingStatus}
              onChangeSlot={() => setIsBookingModalOpen(true)}
              onStatusChange={setBookingStatus}
            />
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Procurement Booking & Status</h3>
                <p className="text-[11px] text-slate-500">Live token management & DBT payment tracking</p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="text-xs font-bold text-gov-800 bg-gov-100 hover:bg-gov-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                + Change Slot
              </button>
            </div>

            {/* Assigned Booking Card */}
            <BookingCard
              tokenNumber={assistedToken}
              farmerName={assistedFarmerName}
              slotTime={bookingSlot}
              status={bookingStatus}
              onChangeSlot={() => setIsBookingModalOpen(true)}
              onStatusChange={setBookingStatus}
            />

            {/* 8-Stage Lifecycle Progress & MSP Payout Receipt */}
            <ProcurementLifecycleCard />
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

      {/* 6. Modals (SMS, Booking, Registration, IVR, USSD) */}
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

      <FarmerRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegistered={handleFarmerRegistered}
      />

      <IvrPhoneModal
        isOpen={isIvrModalOpen}
        onClose={() => setIsIvrModalOpen(false)}
      />

      <UssdModal
        isOpen={isUssdModalOpen}
        onClose={() => setIsUssdModalOpen(false)}
      />

      <MyPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />

      <WhenShouldIArriveModal
        isOpen={isArrivalModalOpen}
        onClose={() => setIsArrivalModalOpen(false)}
      />

      {/* 7. Strict 4-Tab Bottom Navigation Bar (Section 6 & 48) */}
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
