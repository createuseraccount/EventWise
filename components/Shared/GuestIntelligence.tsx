
import React from 'react';
import { Plan, GuestStats, GiftConfig } from '../../types';
import { Users, Home, Smile, Briefcase, Crown, Utensils, Layout, Gift, PieChart } from 'lucide-react';
import { CURRENCY } from '../../constants';

interface GuestIntelligenceProps {
  plan: Plan;
  onUpdate: (updatedPlan: Plan) => void;
}

const GuestIntelligence: React.FC<GuestIntelligenceProps> = ({ plan, onUpdate }) => {
  const handleStatChange = (category: keyof GuestStats, value: number) => {
    const newStats = { ...plan.guestStats, [category]: value };
    // Explicitly cast Object.values to number[] to fix 'unknown' type error during reduction
    const newTotal = (Object.values(newStats) as number[]).reduce((acc, val) => acc + val, 0);
    
    // Sync with main guest count
    onUpdate({ 
      ...plan, 
      guestStats: newStats, 
      guestCount: newTotal 
    });
  };

  const handleGiftConfigChange = (category: keyof GiftConfig, value: number) => {
    onUpdate({
      ...plan,
      giftConfig: { ...plan.giftConfig, [category]: value }
    });
  };

  const totalGifts = 
    (plan.guestStats.family * plan.giftConfig.familyPerGift) +
    (plan.guestStats.friends * plan.giftConfig.friendsPerGift) +
    (plan.guestStats.office * plan.giftConfig.officePerGift) +
    (plan.guestStats.vip * plan.giftConfig.vipPerGift);

  const tablesNeeded = Math.ceil(plan.guestCount / 8);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CategoryCard 
          icon={<Home className="text-rose-500" />} 
          label="Family" 
          value={plan.guestStats.family} 
          onChange={(v) => handleStatChange('family', v)} 
          giftCost={plan.giftConfig.familyPerGift}
          onGiftChange={(v) => handleGiftConfigChange('familyPerGift', v)}
        />
        <CategoryCard 
          icon={<Smile className="text-amber-500" />} 
          label="Friends" 
          value={plan.guestStats.friends} 
          onChange={(v) => handleStatChange('friends', v)} 
          giftCost={plan.giftConfig.friendsPerGift}
          onGiftChange={(v) => handleGiftConfigChange('friendsPerGift', v)}
        />
        <CategoryCard 
          icon={<Briefcase className="text-indigo-500" />} 
          label="Office" 
          value={plan.guestStats.office} 
          onChange={(v) => handleStatChange('office', v)} 
          giftCost={plan.giftConfig.officePerGift}
          onGiftChange={(v) => handleGiftConfigChange('officePerGift', v)}
        />
        <CategoryCard 
          icon={<Crown className="text-purple-500" />} 
          label="VIPs" 
          value={plan.guestStats.vip} 
          onChange={(v) => handleStatChange('vip', v)} 
          giftCost={plan.giftConfig.vipPerGift}
          onGiftChange={(v) => handleGiftConfigChange('vipPerGift', v)}
        />
      </div>

      <div className="bg-white p-8 rounded-3xl border shadow-sm">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <PieChart className="text-indigo-600" /> Guest List Intelligence
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <IntelligenceStat 
            icon={<Utensils size={24} />} 
            label="Catering Impact" 
            value={plan.guestCount}
            suffix="Plates"
            description="Linked to your primary budget catering cost per plate."
          />
          <IntelligenceStat 
            icon={<Layout size={24} />} 
            label="Seating Plan" 
            value={tablesNeeded}
            suffix="Tables"
            description="Based on standard 8-person round table arrangement."
          />
          <IntelligenceStat 
            icon={<Gift size={24} />} 
            label="Gifting Budget" 
            value={`${CURRENCY}${totalGifts.toLocaleString('en-IN')}`}
            description="Estimated total cost for return gifts across all categories."
          />
        </div>
      </div>

      <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl text-indigo-600 shadow-sm">
            <Users size={24} />
          </div>
          <div>
            <h4 className="font-bold text-indigo-900">Pro Tip</h4>
            <p className="text-sm text-indigo-700 mt-1 leading-relaxed">
              We've synced your total guest count ({plan.guestCount}) with your master budget. 
              Changes here will automatically update your catering estimates to keep your planning precise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryCard = ({ icon, label, value, onChange, giftCost, onGiftChange }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <span className="font-bold text-slate-800">{label}</span>
    </div>
    <div className="space-y-4">
      <div>
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Guest Count</label>
        <input 
          type="number" 
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 outline-none font-bold"
        />
      </div>
      <div>
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Gift / Person</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">{CURRENCY}</span>
          <input 
            type="number" 
            value={giftCost} 
            onChange={(e) => onGiftChange(Number(e.target.value))}
            className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 outline-none font-bold text-xs"
          />
        </div>
      </div>
    </div>
  </div>
);

const IntelligenceStat = ({ icon, label, value, suffix, description }: any) => (
  <div className="space-y-2">
    <div className="flex items-center gap-3 text-slate-400 mb-1">
      {icon}
      <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-3xl font-black text-slate-900">
      {value} <span className="text-lg font-bold text-slate-400">{suffix}</span>
    </div>
    <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
  </div>
);

export default GuestIntelligence;
