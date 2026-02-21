
import React, { useMemo, useState } from 'react';
import { Plan, TimelineItem, Vendor } from '../../types';
import { Clock, AlertTriangle, Phone, MessageCircle, MoreHorizontal, UserCheck, Calendar } from 'lucide-react';

interface RunSheetProps {
  plan: Plan;
  onUpdate: (updatedPlan: Plan) => void;
}

const timeToMinutes = (timeStr: string) => {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let [_, hours, mins, ampm] = match;
  let h = parseInt(hours);
  const m = parseInt(mins);
  if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
  if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
  return h * 60 + m;
};

const RunSheet: React.FC<RunSheetProps> = ({ plan, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'FLOW' | 'DIRECTORY'>('FLOW');

  const conflicts = useMemo(() => {
    const sorted = [...(plan.timeline || [])].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
    const overlapIds = new Set<string>();
    
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i+1];
      const currentMin = timeToMinutes(current.time);
      const nextMin = timeToMinutes(next.time);
      
      // Basic 30-min buffer or explicit end-time check
      if (nextMin < currentMin + 30) {
        overlapIds.add(current.id);
        overlapIds.add(next.id);
      }
    }
    return overlapIds;
  }, [plan.timeline]);

  const sendWhatsApp = (vendor: Vendor, template: string) => {
    const text = encodeURIComponent(template.replace('[VENDOR]', vendor.name).replace('[EVENT]', plan.name));
    window.open(`https://wa.me/${vendor.contact.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Run Sheet Command</h2>
          <p className="text-sm text-slate-500">On-site coordination and vendor directory</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border shadow-sm">
          <button onClick={() => setActiveTab('FLOW')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'FLOW' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>Event Flow</button>
          <button onClick={() => setActiveTab('DIRECTORY')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'DIRECTORY' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>Directory</button>
        </div>
      </div>

      {activeTab === 'FLOW' ? (
        <div className="space-y-6">
           {conflicts.size > 0 && (
             <div className="p-4 bg-rose-50 border border-rose-200 rounded-[32px] flex items-center gap-4 text-rose-700 animate-pulse">
                <AlertTriangle className="flex-shrink-0" />
                <p className="text-xs font-bold">CONFLICT DETECTED: Multiple items are scheduled within 30 minutes of each other. Review your flow.</p>
             </div>
           )}
           <div className="space-y-4">
              {[...(plan.timeline || [])].sort((a,b) => timeToMinutes(a.time) - timeToMinutes(b.time)).map(item => (
                <div key={item.id} className={`p-6 rounded-[32px] border flex items-center gap-6 transition-all ${conflicts.has(item.id) ? 'bg-rose-50/50 border-rose-200' : 'bg-white border-slate-100 hover:shadow-lg'}`}>
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm ${conflicts.has(item.id) ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {item.time}
                   </div>
                   <div className="flex-1">
                      <h4 className="font-black text-slate-900">{item.activity}</h4>
                      <p className="text-xs text-slate-400 font-medium">{item.notes || 'No details provided'}</p>
                   </div>
                   <div className="flex gap-2">
                      <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><UserCheck size={18}/></button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {plan.vendors.filter(v => v.name).map(v => (
             <div key={v.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black">
                      {v.category[0]}
                   </div>
                   <div>
                      <h4 className="font-black text-slate-900">{v.name}</h4>
                      <p className="text-[10px] font-black uppercase text-slate-400">{v.category}</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => window.open(`tel:${v.contact}`)} className="flex items-center justify-center gap-2 p-3 bg-slate-900 text-white rounded-2xl text-xs font-bold"><Phone size={14}/> Call</button>
                   <button onClick={() => sendWhatsApp(v, "Hi [VENDOR], I'm checking in on the status for [EVENT]. Are we on schedule?")} className="flex items-center justify-center gap-2 p-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold"><MessageCircle size={14}/> WhatsApp</button>
                </div>
             </div>
           ))}
           {plan.vendors.filter(v => v.name).length === 0 && (
             <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] text-center text-slate-400">
                <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium">No vendors with names/contact info found.<br/>Update them in the Vendors tab first.</p>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default RunSheet;
