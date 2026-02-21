
import React, { useState, useMemo } from 'react';
import { Plan, Vendor, VendorChecklistItem, VendorPhase } from '../../types';
import { VENDOR_CATEGORIES, CURRENCY, GET_DEFAULT_VENDOR_CHECKLIST } from '../../constants';
import { 
  Building2, UtensilsCrossed, Palette, Camera, Sparkles, Music, 
  Truck, Mail, Bed, MoreHorizontal, CheckCircle2, Circle, 
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
  'Miscellaneous': <MoreHorizontal size={20} />,
};

const VendorManager: React.FC<VendorManagerProps> = ({ plan, onUpdate }) => {
  const [activeCategory, setActiveCategory] = useState(VENDOR_CATEGORIES[0]);

  const vendors = useMemo(() => {
    let currentVendors = plan.vendors || [];
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
    <div className="flex flex-col lg:flex-row gap-6 md:gap-8 animate-in fade-in duration-500">
      <div className="w-full lg:w-72 space-y-2">
        <h3 className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 md:mb-4">Vendors</h3>
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar pb-2 md:pb-0 px-2 lg:px-0">
          {VENDOR_CATEGORIES.map(cat => {
            const v = vendors.find(vend => vend.category === cat);
            const done = v?.checklist.filter(i => i.completed).length || 0;
            const tot = v?.checklist.length || 0;
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center justify-between p-3 rounded-2xl transition-all border whitespace-nowrap min-w-max lg:min-w-0 flex-shrink-0 ${
                  isActive 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-indigo-500'}>{CATEGORY_ICONS[cat]}</span>
                  <span className="text-xs font-bold uppercase tracking-tight">{cat}</span>
                </div>
                <span className={`hidden md:inline-block text-[9px] font-black px-1.5 py-0.5 rounded ml-2 ${isActive ? 'bg-white/20' : 'bg-slate-50 text-slate-400'}`}>
                  {done}/{tot}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="bg-white p-5 md:p-8 rounded-[28px] md:rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[22px] md:rounded-3xl flex items-center justify-center text-white shadow-lg flex-shrink-0 ${completionPercent === 100 ? 'bg-emerald-500 shadow-emerald-100' : 'bg-indigo-600 shadow-indigo-100'}`}>
              <div className="text-center">
                <p className="text-base md:text-xl font-black">{completionPercent}%</p>
                <p className="text-[7px] md:text-[8px] uppercase tracking-tighter">Tasks</p>
              </div>
            </div>
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 truncate">{activeCategory}</h2>
              <div className="flex items-center gap-3 md:gap-4 mt-1 text-[10px] md:text-sm text-slate-500 font-medium overflow-x-auto no-scrollbar">
                <span className="flex items-center gap-1.5 whitespace-nowrap"><CheckCircle2 size={14} className="text-emerald-500"/> {activeVendor.checklist.filter(i => i.completed).length} items</span>
                <span className="flex items-center gap-1.5 whitespace-nowrap"><Circle size={14} className="text-slate-300"/> {activeVendor.checklist.filter(i => !i.completed).length} left</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 no-print">
            <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 md:mb-2 text-center md:text-left">Payments</p>
            <div className="flex items-end gap-2 justify-center md:justify-start">
              <span className="text-xl md:text-2xl font-black text-indigo-600">{CURRENCY}{activeVendor.actualPaid.toLocaleString('en-IN')}</span>
              <span className="text-[10px] md:text-sm font-bold text-slate-400 mb-1">paid</span>
            </div>
          </div>
        </div>

        {(hasGuestCountWarning || budgetWarning) && (
          <div className="space-y-3">
            {hasGuestCountWarning && (
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-2xl gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-100 flex-shrink-0"><AlertTriangle size={18} /></div>
                  <div className="text-xs">
                    <p className="font-bold text-amber-900 uppercase">Guest count changed</p>
                    <p className="text-amber-700">Now {plan.guestCount} guests. Reconfirm logistics.</p>
                  </div>
                </div>
                <button onClick={syncGuestCount} className="w-full md:w-auto px-4 py-2 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 shadow-md shadow-amber-100 transition-all">Resolve</button>
              </div>
            )}
            {budgetWarning && (
              <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                <div className="p-2 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-100 flex-shrink-0"><AlertTriangle size={18} /></div>
                <div className="text-xs">
                  <p className="font-bold text-rose-900 uppercase">Budget Warning</p>
                  <p className="text-rose-700">Costs are exceeding 30% of total event budget.</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[28px] md:rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 md:px-8 md:py-6 border-b border-slate-50 flex items-center justify-between">
                <h4 className="font-bold text-sm md:text-base flex items-center gap-2">
                  <CreditCard size={18} className="text-indigo-600" /> Professional Checklist
                </h4>
                <div className="flex gap-1">
                    {phases.map(p => {
                      const pItems = activeVendor.checklist.filter(i => i.phase === p);
                      const isDone = pItems.length > 0 && pItems.every(i => i.completed);
                      return (
                        <div key={p} className={`w-8 md:w-12 h-1 rounded-full ${isDone ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                      );
                    })}
                </div>
              </div>

              <div className="p-1 md:p-2">
                {phases.map(phase => {
                  const items = activeVendor.checklist.filter(i => i.phase === phase);
                  if (items.length === 0) return null;

                  return (
                    <div key={phase} className="mb-4 md:mb-6 last:mb-0">
                      <div className="px-5 py-2 md:px-6 md:py-3 flex items-center gap-3">
                        <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest">{phase}</span>
                        <div className="h-[1px] flex-1 bg-slate-50" />
                      </div>
                      <div className="px-3 md:px-4 space-y-1">
                        {items.map(item => (
                          <button
                            key={item.id}
                            onClick={() => toggleTask(item.id)}
                            className={`w-full flex items-center gap-3 md:gap-4 p-3.5 md:p-4 rounded-2xl transition-all group ${
                              item.completed ? 'bg-emerald-50/30' : 'hover:bg-slate-50 active:bg-slate-100'
                            }`}
                          >
                            <div className={`transition-transform duration-300 ${item.completed ? 'text-emerald-500' : 'text-slate-200'}`}>
                              {item.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                            </div>
                            <span className={`text-xs md:text-sm font-medium flex-1 text-left ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                              {item.task}
                            </span>
                            <ChevronRight size={14} className="opacity-0 md:group-hover:opacity-100 text-slate-300" />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-[28px] md:rounded-[32px] border border-slate-100 shadow-sm space-y-5">
              <h4 className="font-black text-[10px] md:text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Info size={14} /> Basic Details
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-tight mb-1">Company Name</label>
                  <input type="text" value={activeVendor.name} onChange={e => updateVendor({ name: e.target.value })} placeholder="Vendor Name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs font-bold" />
                </div>
                
                {activeCategory === 'Venue' && (
                  <>
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-tight mb-1">Address</label>
                      <textarea 
                        value={activeVendor.address || ''} 
                        onChange={e => updateVendor({ address: e.target.value })} 
                        placeholder="Full Address" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs font-medium resize-none h-20" 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-tight mb-1">Google Maps Link</label>
                      <input 
                        type="text" 
                        value={activeVendor.mapLink || ''} 
                        onChange={e => updateVendor({ mapLink: e.target.value })} 
                        placeholder="https://maps.google.com/..." 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs font-medium text-indigo-600" 
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-tight mb-1">Contact Details</label>
                  <input type="text" value={activeVendor.contact} onChange={e => updateVendor({ contact: e.target.value })} placeholder="Phone / Email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-tight mb-1">Budgeted</label>
                    <input type="number" value={activeVendor.budgetedAmount} onChange={e => updateVendor({ budgetedAmount: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs font-mono font-bold" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-tight mb-1">Total Paid</label>
                    <input type="number" value={activeVendor.actualPaid} onChange={e => updateVendor({ actualPaid: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs font-mono font-bold text-indigo-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-[28px] md:rounded-[32px] text-white space-y-4">
               <h4 className="font-black text-[10px] md:text-xs uppercase tracking-widest text-slate-400">Notes</h4>
               <textarea value={activeVendor.notes} onChange={e => updateVendor({ notes: e.target.value })} placeholder="..." className="w-full h-32 md:h-40 bg-slate-800 border-0 rounded-2xl p-4 text-xs md:text-sm text-slate-300 outline-none resize-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorManager;
