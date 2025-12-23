
import React, { useState } from 'react';
import { GeneralEventPlan, Tier, Quality, EventType } from '../../types';
import { storage } from '../../utils/storage';
import { 
  INITIAL_EVENT_CATEGORIES, 
  DEFAULT_EVENT_CHECKLIST, 
  INDIAN_CITIES, 
  DEFAULT_EVENT_TIMELINE,
  DEFAULT_GUEST_STATS,
  DEFAULT_GIFT_CONFIG,
  VENDOR_CATEGORIES,
  GET_DEFAULT_VENDOR_CHECKLIST
} from '../../constants';
import { PartyPopper, ArrowRight, X, MapPin } from 'lucide-react';

interface PlannerProps {
  onComplete: (plan: GeneralEventPlan) => void;
  onCancel: () => void;
}

const GeneralEventPlanner: React.FC<PlannerProps> = ({ onComplete, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: EventType.BIRTHDAY,
    city: 'Mumbai',
    guests: 50,
    tier: Tier.METRO,
    quality: Quality.STANDARD,
    duration: 4,
    isOutdoor: false
  });

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = INDIAN_CITIES.find(c => c.name === e.target.value);
    if (selectedCity) {
      setFormData({ ...formData, city: selectedCity.name, tier: selectedCity.tier });
    }
  };

  const handleCreate = () => {
    const newPlan: GeneralEventPlan = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      city: formData.city,
      guestCount: formData.guests,
      tier: formData.tier,
      quality: formData.quality,
      durationHours: formData.duration,
      isOutdoor: formData.isOutdoor,
      createdAt: Date.now(),
      checklist: DEFAULT_EVENT_CHECKLIST.map(task => ({
        id: Math.random().toString(36).substr(2, 9),
        task,
        completed: false
      })),
      timeline: [...DEFAULT_EVENT_TIMELINE],
      guestStats: { ...DEFAULT_GUEST_STATS }, // Default init
      giftConfig: { ...DEFAULT_GIFT_CONFIG },
      categories: INITIAL_EVENT_CATEGORIES(formData.quality, formData.tier, formData.guests),
      contingencyPercent: 5,
      vendors: VENDOR_CATEGORIES.map(cat => ({
        id: Math.random().toString(36).substr(2, 9),
        category: cat,
        name: '',
        contact: '',
        budgetedAmount: 0,
        actualPaid: 0,
        checklist: GET_DEFAULT_VENDOR_CHECKLIST(cat),
        notes: '',
        lastGuestCountAtSync: formData.guests
      }))
    };
    storage.addPlan(newPlan);
    onComplete(newPlan);
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="bg-white rounded-3xl p-8 border shadow-xl shadow-slate-200/50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <PartyPopper size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Plan an Event</h2>
              <p className="text-sm text-slate-500">Birthday, Corporate or Parties</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Name</label>
            <input
              type="text"
              placeholder="e.g. 30th Birthday Bash"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as EventType })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {Object.values(EventType).filter(t => t !== EventType.WEDDING).map(t => (
                  <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Guests</label>
              <input
                type="number"
                value={formData.guests}
                onChange={e => setFormData({ ...formData, guests: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
               <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                 <MapPin size={14} className="text-indigo-500" /> City
               </label>
               <select 
                value={formData.city}
                onChange={handleCitySelect}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {INDIAN_CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1.5">Quality</label>
               <select 
                value={formData.quality}
                onChange={e => setFormData({ ...formData, quality: e.target.value as Quality })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {Object.values(Quality).map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-1.5">Duration (Hours)</label>
             <input
              type="number"
              value={formData.duration}
              onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <input 
              type="checkbox" 
              id="outdoor" 
              checked={formData.isOutdoor} 
              onChange={e => setFormData({...formData, isOutdoor: e.target.checked})}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
             />
             <label htmlFor="outdoor" className="text-sm font-medium text-slate-700 cursor-pointer">This is an Outdoor Event</label>
          </div>

          <button 
            onClick={handleCreate}
            disabled={!formData.name}
            className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
          >
            Generate Estimate <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralEventPlanner;
