
import React, { useState } from 'react';
import { Plan, Room, Transport } from '../../types';
import { Hotel, Truck, Plus, Trash2, MapPin, Calendar, User } from 'lucide-react';

interface LogisticsHubProps {
  plan: Plan;
  onUpdate: (updatedPlan: Plan) => void;
}

const LogisticsHub: React.FC<LogisticsHubProps> = ({ plan, onUpdate }) => {
  const [rooms, setRooms] = useState<Room[]>(plan.rooms || []);
  const [transports, setTransports] = useState<Transport[]>(plan.transports || []);
  const [activeView, setActiveView] = useState<'STAY' | 'TRAVEL'>('STAY');

  const updatePlan = (newRooms?: Room[], newTransports?: Transport[]) => {
    onUpdate({ 
      ...plan, 
      rooms: newRooms || rooms, 
      transports: newTransports || transports 
    });
    if (newRooms) setRooms(newRooms);
    if (newTransports) setTransports(newTransports);
  };

  const addRoom = () => {
    const nr: Room = { id: Date.now().toString(), roomNo: '', guestNames: '', checkIn: '', checkOut: '', hotelName: '' };
    updatePlan([...rooms, nr], undefined);
  };

  const addTransport = () => {
    const nt: Transport = { id: Date.now().toString(), time: '', guestNames: '', type: 'Pickup', vehicle: '', contact: '' };
    updatePlan(undefined, [...transports, nt]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Logistics Hub</h2>
          <p className="text-sm text-slate-500">Manage guest accommodation and travel schedules</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border shadow-sm self-start">
          <button onClick={() => setActiveView('STAY')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeView === 'STAY' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>Stay</button>
          <button onClick={() => setActiveView('TRAVEL')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeView === 'TRAVEL' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>Travel</button>
        </div>
      </div>

      {activeView === 'STAY' ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={addRoom} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100"><Plus size={16} /> Add Room</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map(room => (
              <div key={room.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative group">
                <button onClick={() => updatePlan(rooms.filter(r => r.id !== room.id), undefined)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Hotel size={20} /></div>
                  <input type="text" placeholder="Hotel Name" value={room.hotelName} onChange={e => updatePlan(rooms.map(r => r.id === room.id ? {...r, hotelName: e.target.value} : r))} className="font-bold text-slate-900 border-none bg-transparent outline-none w-full" />
                </div>
                <div className="space-y-4">
                   <div className="flex gap-4">
                      <div className="flex-1"><label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Room #</label><input type="text" value={room.roomNo} onChange={e => updatePlan(rooms.map(r => r.id === room.id ? {...r, roomNo: e.target.value} : r))} className="w-full p-2 bg-slate-50 rounded-xl text-xs font-bold outline-none" /></div>
                   </div>
                   <div><label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Guests</label><textarea value={room.guestNames} onChange={e => updatePlan(rooms.map(r => r.id === room.id ? {...r, guestNames: e.target.value} : r))} className="w-full p-2 bg-slate-50 rounded-xl text-xs font-medium outline-none h-20 resize-none" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={addTransport} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100"><Plus size={16} /> Add Schedule</button>
          </div>
          <div className="overflow-x-auto bg-white rounded-[32px] border shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Time</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Guests</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Vehicle/Driver</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transports.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4"><input type="text" value={t.time} onChange={e => updatePlan(undefined, transports.map(tr => tr.id === t.id ? {...tr, time: e.target.value} : tr))} className="bg-transparent border-none outline-none font-bold text-xs w-20" placeholder="10:00 AM" /></td>
                    <td className="px-6 py-4"><input type="text" value={t.type} onChange={e => updatePlan(undefined, transports.map(tr => tr.id === t.id ? {...tr, type: e.target.value} : tr))} className="bg-transparent border-none outline-none font-medium text-xs w-20" placeholder="Pickup" /></td>
                    <td className="px-6 py-4"><input type="text" value={t.guestNames} onChange={e => updatePlan(undefined, transports.map(tr => tr.id === t.id ? {...tr, guestNames: e.target.value} : tr))} className="bg-transparent border-none outline-none font-medium text-xs w-full min-w-[200px]" placeholder="Rahul, Neha..." /></td>
                    <td className="px-6 py-4"><input type="text" value={t.vehicle} onChange={e => updatePlan(undefined, transports.map(tr => tr.id === t.id ? {...tr, vehicle: e.target.value} : tr))} className="bg-transparent border-none outline-none font-medium text-xs w-full min-w-[150px]" placeholder="Innova / Driver Name" /></td>
                    <td className="px-6 py-4"><button onClick={() => updatePlan(undefined, transports.filter(tr => tr.id !== t.id))} className="text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsHub;
