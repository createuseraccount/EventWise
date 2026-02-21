
import React, { useState } from 'react';
import { Plan, Flight } from '../../types';
import { Plane, DollarSign, Plus, Trash2, Calendar, MapPin, Globe, RefreshCcw } from 'lucide-react';
import { CURRENCY } from '../../constants';

interface DestinationMatrixProps {
  plan: Plan;
  onUpdate: (updatedPlan: Plan) => void;
}

const EXCHANGE_RATES: Record<string, number> = {
  'USD': 83.5,
  'EUR': 90.2,
  'AED': 22.7,
  'INR': 1.0
};

const DestinationMatrix: React.FC<DestinationMatrixProps> = ({ plan, onUpdate }) => {
  const [flights, setFlights] = useState<Flight[]>(plan.flights || []);
  const [view, setView] = useState<'FLIGHTS' | 'CURRENCY'>('FLIGHTS');

  const updatePlan = (newFlights?: Flight[]) => {
    onUpdate({ ...plan, flights: newFlights || flights });
    if (newFlights) setFlights(newFlights);
  };

  const addFlight = () => {
    const nf: Flight = { id: Date.now().toString(), guestNames: '', flightNo: '', airline: '', arrivalTime: '', terminal: '' };
    updatePlan([...flights, nf]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Destination Matrix</h2>
          <p className="text-sm text-slate-500">Manage travel manifests and multi-currency expenses</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border shadow-sm">
          <button onClick={() => setView('FLIGHTS')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${view === 'FLIGHTS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>Manifest</button>
          <button onClick={() => setView('CURRENCY')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${view === 'CURRENCY' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>Currency</button>
        </div>
      </div>

      {view === 'FLIGHTS' ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={addFlight} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100"><Plus size={16} /> Add Flight</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flights.map(f => (
              <div key={f.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative group">
                <button onClick={() => updatePlan(flights.filter(fl => fl.id !== f.id))} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Plane size={20} /></div>
                  <input type="text" placeholder="Flight No (e.g. AI101)" value={f.flightNo} onChange={e => updatePlan(flights.map(fl => fl.id === f.id ? {...fl, flightNo: e.target.value} : fl))} className="font-bold text-slate-900 border-none bg-transparent outline-none w-full uppercase" />
                </div>
                <div className="space-y-4">
                   <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Guests</label>
                        <input type="text" value={f.guestNames} onChange={e => updatePlan(flights.map(fl => fl.id === f.id ? {...fl, guestNames: e.target.value} : fl))} className="w-full p-2 bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="Rahul + 2" />
                      </div>
                      <div className="w-24">
                        <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Time</label>
                        <input type="text" value={f.arrivalTime} onChange={e => updatePlan(flights.map(fl => fl.id === f.id ? {...fl, arrivalTime: e.target.value} : fl))} className="w-full p-2 bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="10:00 AM" />
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Airline</label>
                        <input type="text" value={f.airline} onChange={e => updatePlan(flights.map(fl => fl.id === f.id ? {...fl, airline: e.target.value} : fl))} className="w-full p-2 bg-slate-50 rounded-xl text-xs font-medium outline-none" />
                      </div>
                      <div className="w-24">
                        <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Terminal</label>
                        <input type="text" value={f.terminal} onChange={e => updatePlan(flights.map(fl => fl.id === f.id ? {...fl, terminal: e.target.value} : fl))} className="w-full p-2 bg-slate-50 rounded-xl text-xs font-medium outline-none" />
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
           <div className="bg-indigo-900 p-8 rounded-[40px] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl">
              <div className="p-6 bg-white/10 rounded-[32px] backdrop-blur-sm"><Globe size={48} /></div>
              <div className="space-y-2 text-center md:text-left">
                 <h3 className="text-2xl font-black">Exchange Rate Console</h3>
                 <p className="text-indigo-200 text-sm">Convert foreign expenses to {CURRENCY} automatically in your budget tab.</p>
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(EXCHANGE_RATES).filter(([k]) => k !== 'INR').map(([cur, rate]) => (
                <div key={cur} className="bg-white p-6 rounded-[32px] border shadow-sm flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-indigo-600">{cur}</div>
                      <div>
                         <p className="text-[9px] font-black uppercase text-slate-400">Current Rate</p>
                         <p className="text-lg font-black">{CURRENCY}{rate}</p>
                      </div>
                   </div>
                   <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><RefreshCcw size={16} /></button>
                </div>
              ))}
           </div>
           <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
              <div className="p-2 bg-amber-500 text-white rounded-xl"><DollarSign size={20} /></div>
              <p className="text-sm text-amber-800 leading-relaxed font-medium">To use these rates, go to the <strong>Budget</strong> view and click the "INR" label on any line item to switch its base currency.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default DestinationMatrix;
