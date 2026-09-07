import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSimulation } from '../../context/SimulationContext';
import { useAuth } from '../../context/AuthContext';
import { FarmerHeader } from './FarmerHeader';
import { CongestionCard } from './CongestionCard';
import { BookingCard } from './BookingCard';
import { FarmerNotifications } from './FarmerNotifications';
import { ProcurementHelp } from './ProcurementHelp';
import { SmsModal } from './SmsModal';
import { AssistedAccessBar } from './AssistedAccessBar';
import { FarmerRegistrationModal } from './FarmerRegistrationModal';
import { IvrPhoneModal } from '../ivr/IvrPhoneModal';
import { UssdModal } from '../ivr/UssdModal';
import { FarmerProfile, FarmerNavigationTab } from '../../types/procurement';
import { ReschedulingBanner } from './ReschedulingBanner';
import { ProcurementLifecycleCard } from './ProcurementLifecycleCard';
import { MyPreferencesModal } from './MyPreferencesModal';
import { BetterOptionCard } from './BetterOptionCard';
import { WhenShouldIArriveModal } from './WhenShouldIArriveModal';
import { SmartBookingWizard } from './SmartBookingWizard';
import { BestCentreScreen } from './BestCentreScreen';
import { MyQueueScreen } from './MyQueueScreen';
import { PaymentVoucherScreen } from './PaymentVoucherScreen';
import { FarmerProfileScreen } from './FarmerProfileScreen';
import {
  Home,
  CalendarPlus,
  Compass,
  Ticket,
  Activity,
  CreditCard,
  Bell,
  User,
  HelpCircle,
  WifiOff,
  Zap,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const FarmerMobileView: React.FC = () => {
  const { t } = useLanguage();
  const { congestionRisk } = useSimulation();
  const { logout } = useAuth();

  // Strict 9-Tab Farmer Experience (Prompt Section 2 & 66)
  const [activeTab, setActiveTab] = useState<FarmerNavigationTab>('home');
  const [isSmsModalOpen, setIsSmsModalOpen] = useState<boolean>(false);
  const [isIvrModalOpen, setIsIvrModalOpen] = useState<boolean>(false);
  const [isUssdModalOpen, setIsUssdModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);
  const [isArrivalModalOpen, setIsArrivalModalOpen] = useState<boolean>(false);

  const [isLowConnectivity, setIsLowConnectivity] = useState<boolean>(false);
  const [isLowDataMode, setIsLowDataMode] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Assisted mode & booking state
  const [tokenNumber, setTokenNumber] = useState<string>('AF-108');
  const [farmerName, setFarmerName] = useState<string>('Ravi Kumar');
  const [bookingSlot, setBookingSlot] = useState<string>('Today • 11:30 AM – 12:30 PM');
  const [bookingStatus, setBookingStatus] = useState<'CONFIRMED' | 'WAITING_LIST' | 'CANCELLED'>('CONFIRMED');
  const [quantityKg, setQuantityKg] = useState<number>(1000);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleSelectAssistedFarmer = (token: string, name: string) => {
    setTokenNumber(token);
    setFarmerName(name);
    setBookingStatus('CONFIRMED');
  };

  const handleBookingComplete = (token: string, centreName: string, slotTime: string, qty: number) => {
    setTokenNumber(token);
    setBookingSlot(slotTime);
    setQuantityKg(qty);
    setBookingStatus('CONFIRMED');
    setActiveTab('queue');
  };

  const handleFarmerRegistered = (newFarmer: FarmerProfile) => {
    if (newFarmer.activeToken) setTokenNumber(newFarmer.activeToken);
    setFarmerName(newFarmer.name);
    setBookingStatus('CONFIRMED');
    setActiveTab('queue');
  };

  const tabsConfig: { id: FarmerNavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { id: 'book', label: 'Book Slot', icon: <CalendarPlus className="h-4 w-4" /> },
    { id: 'best-centre', label: 'Best Centre', icon: <Compass className="h-4 w-4" /> },
    { id: 'queue', label: 'My Queue', icon: <Ticket className="h-4 w-4" /> },
    { id: 'status', label: 'Status', icon: <Activity className="h-4 w-4" /> },
    { id: 'payment', label: 'Payment', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'notifications', label: 'Alerts', icon: <Bell className="h-4 w-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
    { id: 'help', label: 'Help', icon: <HelpCircle className="h-4 w-4" /> }
  ];

  return (
    <div className={`flex flex-col min-h-[720px] max-w-md mx-auto shadow-md border-x border-slate-200 dark:border-slate-800 transition-colors ${
      isLowDataMode
        ? 'bg-white text-black'
        : 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100'
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
        onLogout={logout}
      />

      {/* 2. Assisted Access / Common Service Centre (CSC) Bar */}
      <AssistedAccessBar
        currentFarmerToken={tokenNumber}
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

      {/* 5. 9-Tab Horizontal Scrollable Navigation Strip */}
      <div className="bg-white border-b border-slate-200 px-2 py-2 overflow-x-auto no-scrollbar shadow-xs">
        <div className="flex items-center gap-1.5 min-w-max">
          {tabsConfig.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-gov-800 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.id === 'notifications' && congestionRisk === 'HIGH' && (
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Main Tab Viewport */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {/* Tab 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Quick Greeting & Next Procurement Card */}
            <div className="bg-gradient-to-br from-gov-800 to-gov-900 text-white rounded-2xl p-4 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                    Next Procurement Session
                  </span>
                  <h2 className="text-base font-black">Singanallur Procurement Centre (Centre C)</h2>
                </div>
                <span className="bg-emerald-400/20 text-emerald-300 text-xs font-mono font-black px-2.5 py-1 rounded-full border border-emerald-400/30">
                  {tokenNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-white/10 rounded-xl p-3 backdrop-blur-sm text-xs">
                <div>
                  <span className="text-[10px] text-slate-300 block">Assigned Slot:</span>
                  <strong className="font-mono text-emerald-200">{bookingSlot}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-300 block">Current Queue:</span>
                  <strong className="font-mono text-white">8 Farmers Ahead (~18m)</strong>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setActiveTab('queue')}
                  className="flex-1 bg-emerald-400 hover:bg-emerald-300 text-gov-950 text-xs font-black py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Ticket className="h-3.5 w-3.5" />
                  <span>Track My Turn (Queue)</span>
                </button>
                <button
                  onClick={() => setActiveTab('book')}
                  className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                >
                  New Slot
                </button>
              </div>
            </div>

            {/* Quick Navigation Tiles (6 Critical Actions) */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveTab('book')}
                className="bg-white p-3 rounded-xl border border-slate-200 text-center hover:border-gov-400 transition-all shadow-xs group"
              >
                <div className="p-2 bg-gov-50 text-gov-800 rounded-lg w-fit mx-auto mb-1 group-hover:bg-gov-100">
                  <CalendarPlus className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 block">Book Slot</span>
              </button>

              <button
                onClick={() => setActiveTab('best-centre')}
                className="bg-white p-3 rounded-xl border border-slate-200 text-center hover:border-gov-400 transition-all shadow-xs group"
              >
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg w-fit mx-auto mb-1 group-hover:bg-emerald-100">
                  <Compass className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 block">Best Centre</span>
              </button>

              <button
                onClick={() => setActiveTab('payment')}
                className="bg-white p-3 rounded-xl border border-slate-200 text-center hover:border-gov-400 transition-all shadow-xs group"
              >
                <div className="p-2 bg-amber-50 text-amber-800 rounded-lg w-fit mx-auto mb-1 group-hover:bg-amber-100">
                  <CreditCard className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 block">MSP Payout</span>
              </button>
            </div>

            {/* Smart Centre Allocation Recommendation Banner */}
            <BetterOptionCard />

            {/* Rescheduling Advisory if any */}
            <ReschedulingBanner />

            {/* Current Crowd Condition & Guidance Card */}
            <CongestionCard
              onOpenSmsModal={() => setIsSmsModalOpen(true)}
              onOpenBookingModal={() => setActiveTab('book')}
              onOpenIvrModal={() => setIsIvrModalOpen(true)}
            />

            {/* Assigned Booking Card with SMS trigger */}
            <BookingCard
              tokenNumber={tokenNumber}
              farmerName={farmerName}
              slotTime={bookingSlot}
              status={bookingStatus}
              onChangeSlot={() => setActiveTab('book')}
              onStatusChange={setBookingStatus}
            />
          </div>
        )}

        {/* Tab 2: BOOK SLOT */}
        {activeTab === 'book' && (
          <SmartBookingWizard
            onBookingComplete={handleBookingComplete}
            onCancel={() => setActiveTab('home')}
          />
        )}

        {/* Tab 3: BEST CENTRE */}
        {activeTab === 'best-centre' && (
          <BestCentreScreen
            onSelectCentre={(cid) => setActiveTab('book')}
          />
        )}

        {/* Tab 4: MY QUEUE */}
        {activeTab === 'queue' && (
          <MyQueueScreen
            tokenNumber={tokenNumber}
            onProceedToCentre={() => setActiveTab('status')}
          />
        )}

        {/* Tab 5: PROCUREMENT STATUS */}
        {activeTab === 'status' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Procurement Lifecycle</h3>
                <p className="text-[11px] text-slate-500">Real-time step tracking from booking to DBT credit</p>
              </div>
              <span className="text-xs font-mono font-bold text-gov-800 bg-gov-50 px-2.5 py-1 rounded-full border border-gov-200">
                #{tokenNumber}
              </span>
            </div>
            <ProcurementLifecycleCard />
          </div>
        )}

        {/* Tab 6: PAYMENT */}
        {activeTab === 'payment' && (
          <PaymentVoucherScreen
            farmerName={farmerName}
            tokenNumber={tokenNumber}
            cropName="Paddy (Grade A)"
            quantityKg={quantityKg}
          />
        )}

        {/* Tab 7: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <FarmerNotifications />
          </div>
        )}

        {/* Tab 8: PROFILE */}
        {activeTab === 'profile' && (
          <FarmerProfileScreen
            isLowDataMode={isLowDataMode}
            onToggleLowDataMode={() => setIsLowDataMode(!isLowDataMode)}
          />
        )}

        {/* Tab 9: HELP */}
        {activeTab === 'help' && (
          <div className="space-y-4">
            <ProcurementHelp />
          </div>
        )}
      </main>

      {/* 7. Modals */}
      <SmsModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        tokenNumber={tokenNumber}
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

      {/* 8. Fixed Bottom Navigation Bar (Fast 5-Button Dock) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-slate-900 border-t border-slate-300 dark:border-slate-800 px-2 py-2 flex items-center justify-around z-20 shadow-xl">
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl min-w-[62px] transition-all ${
            activeTab === 'home'
              ? 'text-gov-900 dark:text-emerald-300 font-extrabold bg-gov-50 dark:bg-emerald-950/60'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <Home className={`h-5 w-5 ${activeTab === 'home' ? 'stroke-[2.5px] text-gov-800 dark:text-emerald-400' : ''}`} />
          <span className="text-[11px] mt-0.5">Home</span>
        </button>

        {/* Tab 2: Book */}
        <button
          onClick={() => setActiveTab('book')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl min-w-[62px] transition-all ${
            activeTab === 'book'
              ? 'text-gov-900 dark:text-emerald-300 font-extrabold bg-gov-50 dark:bg-emerald-950/60'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <CalendarPlus className={`h-5 w-5 ${activeTab === 'book' ? 'stroke-[2.5px] text-gov-800 dark:text-emerald-400' : ''}`} />
          <span className="text-[11px] mt-0.5">Book</span>
        </button>

        {/* Tab 4: Queue */}
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl min-w-[62px] transition-all ${
            activeTab === 'queue'
              ? 'text-gov-900 dark:text-emerald-300 font-extrabold bg-gov-50 dark:bg-emerald-950/60'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <Ticket className={`h-5 w-5 ${activeTab === 'queue' ? 'stroke-[2.5px] text-gov-800 dark:text-emerald-400' : ''}`} />
          <span className="text-[11px] mt-0.5">Queue</span>
        </button>

        {/* Tab 6: Payment */}
        <button
          onClick={() => setActiveTab('payment')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl min-w-[62px] transition-all ${
            activeTab === 'payment'
              ? 'text-gov-900 dark:text-emerald-300 font-extrabold bg-gov-50 dark:bg-emerald-950/60'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <CreditCard className={`h-5 w-5 ${activeTab === 'payment' ? 'stroke-[2.5px] text-gov-800 dark:text-emerald-400' : ''}`} />
          <span className="text-[11px] mt-0.5">Payout</span>
        </button>

        {/* Tab 9: Help */}
        <button
          onClick={() => setActiveTab('help')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl min-w-[62px] transition-all ${
            activeTab === 'help'
              ? 'text-gov-900 dark:text-emerald-300 font-extrabold bg-gov-50 dark:bg-emerald-950/60'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <HelpCircle className={`h-5 w-5 ${activeTab === 'help' ? 'stroke-[2.5px] text-gov-800 dark:text-emerald-400' : ''}`} />
          <span className="text-[11px] mt-0.5">Help</span>
        </button>
      </nav>
    </div>
  );
};
