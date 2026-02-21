
import React, { useState } from 'react';
import { Plan, Outfit, Jewelry } from '../../types';
import { Shirt, Diamond, Plus, Trash2, Calendar, ShieldCheck, ShieldAlert } from 'lucide-react';
import { CURRENCY } from '../../constants';

interface WardrobeVaultProps {
  plan: Plan;
  onUpdate: (updatedPlan: Plan) => void;
}

const WardrobeVault: React.FC<WardrobeVaultProps> = ({ plan, onUpdate }) => {
  const [outfits, setOutfits] = useState<Outfit[]>(plan.outfits || []);
  const [jewelry, setJewelry] = useState<Jewelry[]>(plan.jewelry || []);
  const [tab, setTab] = useState<'LOOKS' | 'VAULT'>('LOOKS');

  const updatePlan = (newOutfits?: Outfit[], newJewelry?: Jewelry[]) => {
    onUpdate({ ...plan, outfits: newOutfits || outfits, jewelry: newJewelry || jewelry });
    if (newOutfits) setOutfits(newOutfits);
    if (newJewelry) setJewelry(newJewelry);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Wardrobe Vault</h2>
          <p className="text-sm text-slate-500">Track outfits, alteration timelines, and jewelry safety</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border shadow-sm">
          <button onClick={() => setTab('LOOKS')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'LOOKS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>Looks</button>
          <button onClick={() => setTab('VAULT')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'VAULT' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>Vault</button>
        </div>
      </div>

      {tab === 'LOOKS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outfits.map(outfit => (
            <div key={outfit.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative group overflow-hidden">
              <button onClick={() => updatePlan(outfits.filter(o => o.id !== outfit.id))} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center"><Shirt size={24} /></div>
                <div>
                   <input type="text" value={outfit.functionName} onChange={e => updatePlan(outfits.map(o => o.id === outfit.id ? {...o, functionName: e.target.value} : o))} className="font-black text-slate-900 border-none outline-none w-full text-lg" placeholder="Haldi / Wedding" />
                   <input type="text" value={outfit.designer} onChange={e => updatePlan(outfits.map(o => o.id === outfit.id ? {...o, designer: e.target.value} : o))} className="text-xs text-slate-400 font-bold border-none outline-none w-full" placeholder="Designer Name" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-widest">Alteration</span>
                  <input type="date" value={outfit.alterationDate} onChange={e => updatePlan(outfits.map(o => o.id === outfit.id ? {...o, alterationDate: e.target.value} : o))} className="bg-slate-50 border-none rounded-lg p-1 font-bold text-indigo-600" />
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-xl font-black text-slate-900">{CURRENCY}{outfit.cost.toLocaleString('en-IN')}</span>
                   <select value={outfit.status} onChange={e => updatePlan(outfits.map(o => o.id === outfit.id ? {...o, status: e.target.value} : o))} className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border-none">
                     <option>Ready</option><option>In Tailoring</option><option>Designing</option>
                   </select>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => updatePlan([...outfits, { id: Date.now().toString(), functionName: '', designer: '', cost: 0, alterationDate: '', status: 'Designing' }])} className="border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-all py-10">
             <Plus size={32} /><span className="font-bold text-sm">Add New Look</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-8 border-b flex items-center justify-between">
              <h3 className="font-black text-lg">Jewelry Tracking</h3>
              <button onClick={() => updatePlan(undefined, [...jewelry, { id: Date.now().toString(), name: '', status: 'SAFE', notes: '' }])} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 flex items-center gap-2"><Plus size={16} /> Log Piece</button>
           </div>
           <div className="divide-y">
              {jewelry.map(item => (
                <div key={item.id} className="p-6 flex items-center gap-6 group hover:bg-slate-50/50 transition-all">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.status === 'SAFE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600 animate-pulse'}`}>
                    {item.status === 'SAFE' ? <ShieldCheck size={28} /> : <Diamond size={28} />}
                  </div>
                  <div className="flex-1">
                    <input type="text" value={item.name} onChange={e => updatePlan(undefined, jewelry.map(j => j.id === item.id ? {...j, name: e.target.value} : j))} className="font-black text-slate-900 bg-transparent border-none outline-none w-full text-lg" placeholder="Heirloom Necklace" />
                    <input type="text" value={item.notes} onChange={e => updatePlan(undefined, jewelry.map(j => j.id === item.id ? {...j, notes: e.target.value} : j))} className="text-sm text-slate-400 bg-transparent border-none outline-none w-full" placeholder="Storage location, locker number..." />
                  </div>
                  <div className="flex items-center gap-4">
                     <button onClick={() => updatePlan(undefined, jewelry.map(j => j.id === item.id ? {...j, status: j.status === 'SAFE' ? 'WORN' : 'SAFE'} : j))} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${item.status === 'SAFE' ? 'bg-slate-100 text-slate-600' : 'bg-rose-600 text-white shadow-lg shadow-rose-100'}`}>
                        {item.status === 'SAFE' ? 'In Locker' : 'Currently Worn'}
                     </button>
                     <button onClick={() => updatePlan(undefined, jewelry.filter(j => j.id !== item.id))} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
              {jewelry.length === 0 && <div className="p-20 text-center text-slate-400 font-medium">No jewelry items logged.</div>}
           </div>
        </div>
      )}
    </div>
  );
};

export default WardrobeVault;
