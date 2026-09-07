import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { quantityDemandEngine } from '../../services/engine/quantityDemandEngine';
import { eventBus } from '../../services/engine/eventBus';
import {
  Wheat,
  Scale,
  Calendar,
  Truck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  Clock,
  Check
} from 'lucide-react';

interface SmartBookingWizardProps {
  onBookingComplete: (token: string, centreName: string, slotTime: string, quantityKg: number) => void;
  onCancel?: () => void;
}

export const SmartBookingWizard: React.FC<SmartBookingWizardProps> = ({
  onBookingComplete,
  onCancel
}) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const [crop, setCrop] = useState<string>('Paddy (Grade A)');
  const [quantityKg, setQuantityKg] = useState<number>(1000);
  const [dateSlot, setDateSlot] = useState<string>('Today • 11:30 AM – 12:30 PM');
  const [village, setVillage] = useState<string>('Singanallur');
  const [vehicle, setVehicle] = useState<string>('Tractor Trolley');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookedToken, setBookedToken] = useState<string | null>(null);

  const crops = [
    { id: 'paddy', name: 'Paddy (Grade A)', msp: '₹2,300 / quintal', icon: '🌾' },
    { id: 'wheat', name: 'Wheat (Sharbati)', msp: '₹2,275 / quintal', icon: '🌱' },
    { id: 'maize', name: 'Maize (Hybrid)', msp: '₹2,090 / quintal', icon: '🌽' },
    { id: 'mustard', name: 'Mustard Seeds', msp: '₹5,650 / quintal', icon: '🌻' }
  ];

  const quantityPresets = [500, 1000, 2000, 5000];

  const slotOptions = [
    { id: 's1', time: 'Today • 09:00 AM – 11:00 AM', crowd: 'LOW', label: '🟢 Low Crowd' },
    { id: 's2', time: 'Today • 11:30 AM – 12:30 PM', crowd: 'OPTIMAL', label: '⭐ Recommended' },
    { id: 's3', time: 'Today • 02:00 PM – 04:00 PM', crowd: 'MODERATE', label: '🟡 Moderate Crowd' },
    { id: 's4', time: 'Tomorrow • 10:00 AM – 12:00 PM', crowd: 'LOW', label: '🟢 Low Crowd' }
  ];

  const recommendation = quantityDemandEngine.recommendBestCentre(
    village,
    quantityKg,
    'FEWEST_FARMERS'
  );

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedToken = 'AF-108';
      setBookedToken(generatedToken);
      setIsSubmitting(false);

      eventBus.publish(
        'TOKEN_GENERATED',
        {
          token: generatedToken,
          crop,
          quantityKg,
          centre: recommendation.recommendedCentre.centreName,
          slot: dateSlot,
          farmer: 'Ravi Kumar'
        },
        'SmartBookingWizard'
      );

      setTimeout(() => {
        onBookingComplete(
          generatedToken,
          recommendation.recommendedCentre.centreName,
          dateSlot,
          quantityKg
        );
      }, 1200);
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
      {/* Header & Step Tracker */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gov-700 bg-gov-50 px-2.5 py-0.5 rounded-full border border-gov-200">
              5-Step Smart Procurement Booking
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-1">Book Procurement Slot</h2>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">
            Step {step} of 5
          </span>
        </div>

        {/* Progress Dots */}
        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map(s => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-gov-700' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Crop Selection */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Wheat className="h-5 w-5 text-gov-700" />
            <h3 className="text-sm font-bold text-slate-900">Select Crop for Procurement</h3>
          </div>
          <p className="text-xs text-slate-500">Choose the crop you wish to sell under Government MSP:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {crops.map(c => (
              <button
                key={c.id}
                onClick={() => setCrop(c.name)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  crop === c.name
                    ? 'border-gov-700 bg-gov-50 ring-2 ring-gov-600/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                    <p className="text-[11px] font-mono text-emerald-700 font-semibold">{c.msp}</p>
                  </div>
                </div>
                {crop === c.name && <Check className="h-4 w-4 text-gov-700" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Quantity in kg */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-gov-700" />
            <h3 className="text-sm font-bold text-slate-900">Crop Quantity to Bring (in Kilograms)</h3>
          </div>
          <p className="text-xs text-slate-500">
            Capacity is calculated in tonnes. Accurately entering weight avoids center weighbridge bottlenecks.
          </p>

          {/* Quick presets */}
          <div className="grid grid-cols-4 gap-2">
            {quantityPresets.map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => setQuantityKg(preset)}
                className={`py-2 px-1 text-center rounded-lg border text-xs font-bold font-mono transition-all ${
                  quantityKg === preset
                    ? 'bg-gov-800 text-white border-gov-800'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {preset >= 1000 ? `${preset / 1000} Tonnes` : `${preset} kg`}
              </button>
            ))}
          </div>

          {/* Direct Input */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Exact Weight (kg)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={100}
                max={25000}
                step={50}
                value={quantityKg}
                onChange={e => setQuantityKg(Math.max(50, Number(e.target.value)))}
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-600"
              />
              <span className="text-xs font-bold text-slate-600 font-mono">
                = {(quantityKg / 1000).toFixed(2)} Metric Tonnes
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Estimated MSP Payout: <span className="font-bold text-emerald-700 font-mono">₹{((quantityKg * 23)).toLocaleString('en-IN')}</span> (at ₹23/kg base rate)
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Date & Preferred Slot */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gov-700" />
            <h3 className="text-sm font-bold text-slate-900">Select Date & Time Window</h3>
          </div>
          <p className="text-xs text-slate-500">
            Slots are dynamic. Green slots guarantee zero wait time at the weighbridge.
          </p>

          <div className="space-y-2.5">
            {slotOptions.map(slot => (
              <button
                key={slot.id}
                onClick={() => setDateSlot(slot.time)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  dateSlot === slot.time
                    ? 'border-gov-700 bg-gov-50 ring-2 ring-gov-600/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-900">{slot.time}</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200">
                  {slot.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Village & Transport */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-gov-700" />
            <h3 className="text-sm font-bold text-slate-900">Origin Village & Transport Mode</h3>
          </div>
          <p className="text-xs text-slate-500">
            Used to calculate smart departure advisories based on road traffic:
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Farmer Village
              </label>
              <select
                value={village}
                onChange={e => setVillage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-800"
              >
                <option value="Singanallur">Singanallur (8.5 km to Centre C)</option>
                <option value="Sulur">Sulur (14.2 km to Centre C)</option>
                <option value="Ondipudur">Ondipudur (6.1 km to Centre C)</option>
                <option value="Kallapatti">Kallapatti (11.0 km to Centre C)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Vehicle Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Tractor Trolley', 'Mini Truck (Pick-up)', 'Bullock Cart'].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVehicle(v)}
                    className={`p-2.5 text-center rounded-lg border text-xs font-semibold transition-all ${
                      vehicle === v
                        ? 'bg-gov-800 text-white border-gov-800'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Capacity-Aware Recommendation & Confirmation */}
      {step === 5 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gov-700" />
            <h3 className="text-sm font-bold text-slate-900">Capacity-Aware Allocation Confirmation</h3>
          </div>

          {/* Centre Recommendation Card */}
          <div className="bg-gradient-to-br from-gov-50 to-emerald-50 border border-gov-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Optimal Centre Match
              </span>
              <span className="text-xs font-mono font-bold text-slate-600">
                {(quantityKg / 1000).toFixed(1)}t load
              </span>
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900">
                {recommendation.recommendedCentre.centreName}
              </h4>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-gov-700" />
                {recommendation.recommendedCentre.location} • 8.5 km travel distance
              </p>
            </div>

            <div className="bg-white/90 rounded-lg p-3 border border-gov-100 text-xs text-slate-700 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Remaining Daily Capacity:</span>
                <span className="font-bold font-mono text-emerald-700">
                  {recommendation.recommendedCentre.remainingCapacityTonnes.toFixed(0)} Tonnes Available
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expected Queue at Arrival:</span>
                <span className="font-bold font-mono text-slate-900">
                  {recommendation.recommendedCentre.farmerCount} trolleys (~18 mins wait)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Slot:</span>
                <span className="font-bold text-gov-800">{dateSlot}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 italic">
              💡 {recommendation.explanation}
            </p>
          </div>

          {/* Success state if token generated */}
          {bookedToken && (
            <div className="bg-emerald-600 text-white rounded-xl p-4 text-center space-y-2 animate-pulse">
              <CheckCircle2 className="h-8 w-8 mx-auto" />
              <h4 className="text-base font-black">Slot Confirmed: Token #{bookedToken}</h4>
              <p className="text-xs text-emerald-100">
                Confirmation SMS sent to +91 98765 43210. Redirecting to live queue tracker...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            disabled={isSubmitting || !!bookedToken}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        ) : (
          onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          )
        )}

        <div className="ml-auto">
          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 bg-gov-800 hover:bg-gov-900 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Next Step <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting || !!bookedToken}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all shadow-md"
            >
              {isSubmitting ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Confirm Booking & Generate Token</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
