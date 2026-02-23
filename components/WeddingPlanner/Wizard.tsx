
import React, { useState } from 'react';
import { WeddingPlan, Tier, Quality, EventType, Vendor } from '../../types';
import { 
  INITIAL_WEDDING_CATEGORIES, 
  DEFAULT_WEDDING_CHECKLIST, 
  INDIAN_CITIES, 
  DEFAULT_WEDDING_TIMELINE,
  DEFAULT_GUEST_STATS,
  DEFAULT_GIFT_CONFIG,
  VENDOR_CATEGORIES,
  GET_DEFAULT_VENDOR_CHECKLIST
} from '../../constants';
import { ArrowRight, ArrowLeft, Heart, CheckCircle2, MapPin, GitMerge } from 'lucide-react';

interface WizardProps {
  onComplete: (plan: WeddingPlan) => void;
  onCancel: () => void;
}

const WeddingWizard: React.FC<WizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [planData, setPlanData] = useState<Partial<WeddingPlan>>({
    type: EventType.WEDDING,
    name: '',
    city: 'Mumbai',
    guestCount: 200,
    tier: Tier.METRO,
    quality: Quality.STANDARD,
    days: 2,
    functions: ['Wedding', 'Reception'],
    contingencyPercent: 10,
    sideSplitEnabled: false,
    guestStats: { ...DEFAULT_GUEST_STATS },
    giftConfig: { ...DEFAULT_GIFT_CONFIG }
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = () => {
    const finalPlan: WeddingPlan = {
      ...planData,
      id: Date.now().toString(),
      createdAt: Date.now(),
      checklist: DEFAULT_WEDDING_CHECKLIST.map(task => ({
        id: Math.random().toString(36).substr(2, 9),
        task,
        completed: false
      })),
      timeline: [...DEFAULT_WEDDING_TIMELINE],
      categories: INITIAL_WEDDING_CATEGORIES(
        planData.quality || Quality.STANDARD, 
        planData.tier || Tier.METRO, 
        planData.guestCount || 200
      ),
      cateringCostPerPlate: planData.quality === Quality.LUXURY ? 2500 : 1000,
      vendors: VENDOR_CATEGORIES.map(cat => ({
        id: Math.random().toString(36).substr(2, 9),
        category: cat,
        name: '',
        contact: '',
        budgetedAmount: 0,
        actualPaid: 0,
        checklist: GET_DEFAULT_VENDOR_CHECKLIST(cat),
        notes: '',
        lastGuestCountAtSync: planData.guestCount || 200
      }))
    } as WeddingPlan;

    onComplete(finalPlan);
  };

  const handleCitySelect = (cityName: string, tier: Tier) => {
    setPlanData({ ...planData, city: cityName, tier });
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-200 text-slate-400'
            }`}>
              {step > s ? <CheckCircle2 size={20} /> : s}
            </div>
            {s < 3 && <div className={`h-1 flex-1 mx-4 rounded ${step > s ? 'bg-indigo-600' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-8 border shadow-xl shadow-slate-200/50">
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart size={32} />
              </div>
              <h2 className="text-2xl font-bold">The Big Details</h2>
              <p className="text-slate-500">Let's start with the basics of your celebration</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Wedding Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul & Neha's Wedding"
                  value={planData.name}
                  onChange={e => setPlanData({ ...planData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Guest Count</label>
                  <input
                    type="number"
                    value={planData.guestCount}
                    onChange={e => setPlanData({ ...planData, guestCount: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Number of Days</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={planData.days}
                    onChange={e => setPlanData({ ...planData, days: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
             <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Location & Style</h2>
              <p className="text-slate-500">Pick your city and luxury level</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-indigo-500" /> Select City
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 no-scrollbar">
                  {INDIAN_CITIES.map(city => (
                    <button
                      key={city.name}
                      onClick={() => handleCitySelect(city.name, city.tier)}
                      className={`px-3 py-2 rounded-lg border text-[11px] font-bold transition-all ${
                        planData.city === city.name 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                      }`}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Wedding Quality</label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(Quality) as Array<keyof typeof Quality>).map(q => (
                    <button
                      key={q}
                      onClick={() => setPlanData({ ...planData, quality: Quality[q] })}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all ${
                        planData.quality === Quality[q] ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                      }`}
                    >
                      <p className="font-bold">{q}</p>
                      <p className="text-xs opacity-70">
                        {q === 'BUDGET' ? 'Essential & Cozy' : q === 'STANDARD' ? 'Elegant & Value' : q === 'PREMIUM' ? 'Grand & Stylish' : 'Pure Opulence'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
             <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Functions & Logistics</h2>
              <p className="text-slate-500">Events and budget features</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {['Engagement', 'Haldi', 'Mehndi', 'Sangeet', 'Wedding', 'Reception', 'Cocktail Party'].map(f => {
                const isSelected = planData.functions?.includes(f);
                return (
                  <button
                    key={f}
                    onClick={() => {
                      const current = planData.functions || [];
                      setPlanData({
                        ...planData,
                        functions: isSelected ? current.filter(item => item !== f) : [...current, f]
                      });
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${isSelected ? 'bg-white text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                      {isSelected && <CheckCircle2 size={14} />}
                    </div>
                    {f}
                  </button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-100">
               <label className="block text-sm font-bold text-slate-700 mb-4">Advanced Features</label>
               <button 
                  onClick={() => setPlanData({...planData, sideSplitEnabled: !planData.sideSplitEnabled})}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    planData.sideSplitEnabled ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'
                  }`}
               >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${planData.sideSplitEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <GitMerge size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Enable Side Split</p>
                      <p className="text-xs opacity-70">Assign budgets to Bride vs Groom side</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative transition-all ${planData.sideSplitEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${planData.sideSplitEnabled ? 'right-1' : 'left-1'}`} />
                  </div>
               </button>
            </div>
          </div>
        )}

        <div className="mt-10 flex gap-4">
          {step > 1 && (
            <button onClick={prevStep} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border border-slate-200 rounded-2xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <ArrowLeft size={18} /> Back
            </button>
          )}
          <button 
            onClick={step === 3 ? handleFinish : nextStep} 
            disabled={!planData.name && step === 1}
            className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
          >
            {step === 3 ? 'Create Wedding Plan' : 'Next Step'} <ArrowRight size={18} />
          </button>
        </div>
        
        <button onClick={onCancel} className="mt-4 w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors">
          Cancel and return to home
        </button>
      </div>
    </div>
  );
};

export default WeddingWizard;
