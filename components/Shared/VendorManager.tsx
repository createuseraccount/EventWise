
import React, { useState, useMemo } from 'react';
import { Plan, Vendor, VendorChecklistItem, VendorPhase } from '../../types';
import { VENDOR_CATEGORIES, CURRENCY, GET_DEFAULT_VENDOR_CHECKLIST } from '../../constants';
import { 
  Building2, UtensilsCrossed, Palette, Camera, Sparkles, Music, 
  Truck, Mail, Bed, Sun, MoreHorizontal, CheckCircle2, Circle, 
  AlertTriangle, CreditCard, ChevronRight, Info, Plus, Trash2
} from 'lucide-react';

interface VendorManagerProps {
  plan: Plan;
  onUpdate: (updatedPlan: Plan) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Venue': <Building2 size={20} />,
  'Caterer': <UtensilsCrossed size={20} />,
  'Decorator': <Palette size={20} />,
  'Photographer': <Camera size={20} />,
  'Makeup Artist': <Sparkles size={20} />,
  'Entertainment': <Music size={20} />,
  'Transport': <Truck size={20} />,
  'Invitations': <Mail size={20} />,
  'Accommodation': <Bed size={20} />,
  'Ritual': <Sun size={20} />,
  'Miscellaneous': <MoreHorizontal size={20} />,
};

const VendorManager: React.FC<VendorManagerProps> = ({ plan, onUpdate }) => {
  const [activeCategory, setActiveCategory] = useState(VENDOR_CATEGORIES[0]);

  // Ensure vendors exist in plan (migration/init)
  const vendors = useMemo(() => {
    let currentVendors = plan.vendors || [];
    // If a category isn't represented, initialize it
    const missing = VENDOR_CATEGORIES.filter(cat => !currentVendors.some(v => v.category === cat));
    if (missing.length > 0) {
      const newVendors = missing.map(cat => ({
        id: Math.random().toString(36).substr(2, 9),
        category: cat,
        name: '',
        contact: '',
        budgetedAmount: 0,
        actualPaid: 0,
        checklist: GET_DEFAULT_VENDOR_CHECKLIST(cat),
        notes: '',
        lastGuestCountAtSync: plan.guestCount
      }));
      currentVendors = [...currentVendors, ...newVendors];
      // Save it back via parent update if needed, but we can just use the memory for rendering
    }
    return currentVendors;
  }, [plan.vendors, plan.guestCount]);

  const activeVendor = vendors.find(v => v.category === activeCategory)!;

  const updateVendor = (updates: Partial<Vendor>) => {
    const newVendors = vendors.map(v => v.id === activeVendor.id ? { ...v, ...updates } : v);
    onUpdate({ ...plan, vendors: newVendors });
  };

  const toggleTask = (taskId: string) => {
    const newChecklist = activeVendor.checklist.map(item => 
      item.id === taskId ? { ...item, completed: !item.completed } : item
    );
    updateVendor({ checklist: newChecklist });
  };

  const completionPercent = useMemo(() => {
    const total = activeVendor.checklist.length;
    if (total === 0) return 0;
    const completed = activeVendor.checklist.filter(i => i.completed).length;
    return Math.round((completed / total) * 100);
  }, [activeVendor.checklist]);

  // Correlation Logic
  const hasGuestCountWarning = activeVendor.lastGuestCountAtSync !== plan.guestCount && 
    ['Caterer', 'Venue', 'Invitations', 'Accommodation'].includes(activeCategory);

  const budgetWarning = activeVendor.budgetedAmount > 0 && 
    activeVendor.category === 'Decorator' && 
    (activeVendor.budgetedAmount / (plan.categories.reduce((acc, c) => acc + c.items.reduce((i, item) => i + item.cost, 0), 0)) > 0.3);

  const syncGuestCount = () => {
    updateVendor({ lastGuestCountAtSync: plan.guestCount });
  };

  const phases: VendorPhase[] = ['Planning', 'Confirmation', 'Finalization', 'Event Day'];

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-72 space-y-2">
        <h3 className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Vendor Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2">
          {VENDOR_CATEGORIES.map(cat => {
            const v = vendors.find(vend => vend.category === cat);
            const done = v?.checklist.filter(i => i.completed).length || 0;
            const tot = v?.checklist.length || 0;
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center justify-between p-3 rounded-2xl transition-all border ${
                  isActive 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-indigo-500'}>{CATEGORY_ICONS[cat]}</span>
                  <span className="text-sm font-bold">{cat}</span>
                </div>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20' : 'bg-slate-50 text-slate-400'}`}>
                  {done}/{tot}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {/* Header Summary */}
        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-lg ${completionPercent === 100 ? 'bg-emerald-500 shadow-emerald-100' : 'bg-indigo-600 shadow-indigo-100'}`}>
              <div className="text-center">
                <p className="text-xl font-black">{completionPercent}%</p>
                <p className="text-[8px] uppercase tracking-tighter">Done</p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{activeCategory} Management</h2>
              <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500"/> {activeVendor.checklist.filter(i => i.completed).length} items confirmed</span>
                <span className="flex items-center gap-1.5"><Circle size={14} className="text-slate-300"/> {activeVendor.checklist.filter(i => !i.completed).length} pending</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center border-l border-slate-100 pl-6 no-print">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Budget Tracking</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-black text-indigo-600">{CURRENCY}{activeVendor.actualPaid.toLocaleString('en-IN')}</span>
              <span className="text-sm font-bold text-slate-400 mb-1">paid of {CURRENCY}{activeVendor.budgetedAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Warnings & Alerts */}
        {(hasGuestCountWarning || budgetWarning) && (
          <div className="space-y-3">
            {hasGuestCountWarning && (
              <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-2xl animate-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-100">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-900">Guest count has changed!</p>
                    <p className="text-xs text-amber-700">The count is now {plan.guestCount}, which might affect {activeCategory} logistics.</p>
                  </div>
                </div>
                <button 
                  onClick={syncGuestCount}
                  className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all shadow-md shadow-amber-100"
                >
                  Sync & Resolve
                </button>
              </div>
            )}
            {budgetWarning && (
              <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl animate-in slide-in-from-top-2">
                <div className="p-2 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-100">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-rose-900">Décor budget alert</p>
                  <p className="text-xs text-rose-700">Décor currently accounts for {Math.round((activeVendor.budgetedAmount / (plan.categories.reduce((acc, c) => acc + c.items.reduce((i, item) => i + item.cost, 0), 0))) * 100)}% of the total budget. This is high!</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Checklist Area */}
          <div className="xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <h4 className="font-bold flex items-center gap-2">
                  <CreditCard size={18} className="text-indigo-600" /> Professional Checklist
                </h4>
                <div className="flex gap-2">
                   {/* Progress bar across phases */}
                   <div className="flex gap-1">
                      {phases.map(p => (
                        <div key={p} className={`w-12 h-1.5 rounded-full ${
                          activeVendor.checklist.filter(i => i.phase === p).every(i => i.completed) && activeVendor.checklist.some(i => i.phase === p)
                          ? 'bg-emerald-500' : 'bg-slate-100'
                        }`} title={p} />
                      ))}
                   </div>
                </div>
              </div>

              <div className="p-2">
                {phases.map(phase => {
                  const items = activeVendor.checklist.filter(i => i.phase === phase);
                  if (items.length === 0) return null;

                  return (
                    <div key={phase} className="mb-6 last:mb-0">
                      <div className="px-6 py-3 flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{phase} Phase</span>
                        <div className="h-[1px] flex-1 bg-slate-50" />
                      </div>
                      <div className="px-4 space-y-1">
                        {items.map(item => (
                          <button
                            key={item.id}
                            onClick={() => toggleTask(item.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                              item.completed ? 'bg-emerald-50/30' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className={`transition-transform duration-300 group-hover:scale-110 ${item.completed ? 'text-emerald-500' : 'text-slate-200'}`}>
                              {item.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                            </div>
                            <span className={`text-sm font-medium flex-1 text-left ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                              {item.task}
                            </span>
                            <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-all ${item.completed ? 'text-emerald-200' : 'text-slate-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Details & Notes Sidebar */}
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-5">
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Info size={16} /> Basic Details
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Vendor / Firm Name</label>
                  <input 
                    type="text" 
                    value={activeVendor.name} 
                    onChange={e => updateVendor({ name: e.target.value })}
                    placeholder="Enter business name..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 outline-none text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Contact Details</label>
                  <input 
                    type="text" 
                    value={activeVendor.contact} 
                    onChange={e => updateVendor({ contact: e.target.value })}
                    placeholder="Phone or email..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 outline-none text-sm font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Budgeted ({CURRENCY})</label>
                    <input 
                      type="number" 
                      value={activeVendor.budgetedAmount} 
                      onChange={e => updateVendor({ budgetedAmount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 outline-none text-sm font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Paid ({CURRENCY})</label>
                    <input 
                      type="number" 
                      value={activeVendor.actualPaid} 
                      onChange={e => updateVendor({ actualPaid: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 outline-none text-sm font-mono font-bold text-indigo-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-[32px] text-white space-y-4">
               <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400">Personal Notes</h4>
               <textarea 
                  value={activeVendor.notes}
                  onChange={e => updateVendor({ notes: e.target.value })}
                  placeholder="Specific requests, contract clauses, or follow-ups..."
                  className="w-full h-40 bg-slate-800 border-0 rounded-2xl p-4 text-sm text-slate-300 placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500/50 outline-none resize-none"
               />
            </div>

            <div className="p-6 bg-indigo-50 rounded-[32px] border border-indigo-100">
               <div className="flex items-start gap-4">
                 <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm"><Info size={20}/></div>
                 <div>
                   <h5 className="font-bold text-indigo-900 text-sm">Offline Secure</h5>
                   <p className="text-[10px] text-indigo-700 leading-relaxed mt-1">Vendor details and contact info are stored locally and never leave your browser.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorManager;
