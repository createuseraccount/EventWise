
import React, { useState } from 'react';
import { Plan, PaymentSchedule, GiftLog } from '../../types';
import { CreditCard, Gift, Plus, Trash2, CheckCircle2, Circle, Image as ImageIcon, Wallet } from 'lucide-react';
import { CURRENCY } from '../../constants';

interface FinancialProProps {
  plan: Plan;
  onUpdate: (updatedPlan: Plan) => void;
}

const FinancialPro: React.FC<FinancialProProps> = ({ plan, onUpdate }) => {
  const [payments, setPayments] = useState<PaymentSchedule[]>(plan.payments || []);
  const [gifts, setGifts] = useState<GiftLog[]>(plan.gifts || []);
  const [tab, setTab] = useState<'PAYMENTS' | 'GIFTS'>('PAYMENTS');

  const updatePlan = (newPayments?: PaymentSchedule[], newGifts?: GiftLog[]) => {
    onUpdate({ ...plan, payments: newPayments || payments, gifts: newGifts || gifts });
    if (newPayments) setPayments(newPayments);
    if (newGifts) setGifts(newGifts);
  };

  const addPayment = () => {
    const np: PaymentSchedule = { id: Date.now().toString(), vendorName: '', amount: 0, dueDate: '', paid: false };
    updatePlan([...payments, np], undefined);
  };

  const addGift = () => {
    // Fixed: Added missing properties required by GiftLog interface
    const ng: GiftLog = { 
      id: Date.now().toString(), 
      from: '', 
      item: '', 
      type: 'CASH',
      value: 0,
      thankYouSent: false,
      guestCategory: 'family'
    };
    updatePlan(undefined, [...gifts, ng]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Financial Pro</h2>
          <p className="text-sm text-slate-500">Track vendor installments and guest contributions</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border shadow-sm">
          <button onClick={() => setTab('PAYMENTS')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'PAYMENTS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>Installments</button>
          <button onClick={() => setTab('GIFTS')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'GIFTS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>Gift Log</button>
        </div>
      </div>

      {tab === 'PAYMENTS' ? (
        <div className="space-y-6">
          <div className="flex justify-end"><button onClick={addPayment} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 flex items-center gap-2"><Plus size={16} /> New Payment</button></div>
          <div className="overflow-x-auto bg-white rounded-[32px] border shadow-sm">
            <table className="w-full text-left">
              <thead><tr className="bg-slate-50/50 border-b"><th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Vendor</th><th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Due Date</th><th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Amount</th><th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Status</th><th className="px-6 py-4"></th></tr></thead>
              <tbody className="divide-y">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 group">
                    <td className="px-6 py-4"><input type="text" value={p.vendorName} onChange={e => updatePlan(payments.map(pay => pay.id === p.id ? {...pay, vendorName: e.target.value} : pay))} className="bg-transparent border-none outline-none font-bold text-xs" placeholder="Vendor Name" /></td>
                    <td className="px-6 py-4"><input type="date" value={p.dueDate} onChange={e => updatePlan(payments.map(pay => pay.id === p.id ? {...pay, dueDate: e.target.value} : pay))} className="bg-transparent border-none outline-none font-medium text-xs text-indigo-600" /></td>
                    <td className="px-6 py-4"><input type="number" value={p.amount} onChange={e => updatePlan(payments.map(pay => pay.id === p.id ? {...pay, amount: Number(e.target.value)} : pay))} className="bg-transparent border-none outline-none font-black text-xs w-24" /></td>
                    <td className="px-6 py-4"><button onClick={() => updatePlan(payments.map(pay => pay.id === p.id ? {...pay, paid: !pay.paid} : pay))}>{p.paid ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} className="text-slate-200" />}</button></td>
                    <td className="px-6 py-4"><button onClick={() => updatePlan(payments.filter(pay => pay.id !== p.id))} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end"><button onClick={addGift} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 flex items-center gap-2"><Plus size={16} /> Log Contribution</button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gifts.map(gift => (
              <div key={gift.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative group">
                <button onClick={() => updatePlan(undefined, gifts.filter(g => g.id !== gift.id))} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Wallet size={20} /></div>
                  <input type="text" value={gift.from} onChange={e => updatePlan(undefined, gifts.map(g => g.id === gift.id ? {...g, from: e.target.value} : g))} className="font-black text-slate-900 border-none outline-none w-full" placeholder="Guest Name" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <input type="text" value={gift.item} onChange={e => updatePlan(undefined, gifts.map(g => g.id === gift.id ? {...g, item: e.target.value} : g))} className="flex-1 bg-slate-50 p-2 rounded-xl text-xs font-bold outline-none" placeholder="Amount or Item..." />
                  <select value={gift.type} onChange={e => updatePlan(undefined, gifts.map(g => g.id === gift.id ? {...g, type: e.target.value as any} : g))} className="bg-slate-50 p-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-none">
                    <option value="CASH">Cash</option><option value="GIFT">Gift</option><option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialPro;
