
import React, { useState } from 'react';
import { Plan, Table } from '../../types';
import { Layout, Users, Plus, Trash2, Edit2 } from 'lucide-react';

interface SeatingMapperProps {
  plan: Plan;
  onUpdate: (updatedPlan: Plan) => void;
}

const SeatingMapper: React.FC<SeatingMapperProps> = ({ plan, onUpdate }) => {
  const [tables, setTables] = useState<Table[]>(plan.tables || []);

  const updatePlan = (newTables: Table[]) => {
    setTables(newTables);
    onUpdate({ ...plan, tables: newTables });
  };

  const addTable = () => {
    const newTable: Table = {
      id: Date.now().toString(),
      name: `Table ${tables.length + 1}`,
      capacity: 10,
      assignedGuestIds: []
    };
    updatePlan([...tables, newTable]);
  };

  const removeTable = (id: string) => {
    updatePlan(tables.filter(t => t.id !== id));
  };

  const updateTable = (id: string, updates: Partial<Table>) => {
    updatePlan(tables.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Seating Mapper</h2>
          <p className="text-sm text-slate-500">Plan table arrangements and guest placements</p>
        </div>
        <button onClick={addTable} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <Plus size={18} /> Add Table
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative">
            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => removeTable(table.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full border-4 border-slate-50 flex items-center justify-center bg-slate-50 text-slate-300">
                <Layout size={32} />
              </div>
              <div>
                <input 
                  type="text" 
                  value={table.name} 
                  onChange={(e) => updateTable(table.id, { name: e.target.value })}
                  className="text-lg font-black text-slate-900 border-none bg-transparent text-center focus:ring-0 w-full"
                />
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Users size={14} className="text-indigo-600" />
                  <span className="text-xs font-bold text-slate-400">
                    <input 
                      type="number" 
                      value={table.capacity} 
                      onChange={(e) => updateTable(table.id, { capacity: Number(e.target.value) })}
                      className="w-10 bg-transparent border-none p-0 text-center font-black text-indigo-600"
                    /> Seats
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50">
               <textarea 
                  placeholder="Type guest names separated by commas..."
                  value={table.assignedGuestIds.join(', ')}
                  onChange={(e) => updateTable(table.id, { assignedGuestIds: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full h-24 bg-slate-50 border-none rounded-2xl p-3 text-xs text-slate-600 outline-none resize-none"
               />
            </div>
          </div>
        ))}

        {tables.length === 0 && (
          <div className="col-span-full py-20 border-2 border-dashed border-slate-200 rounded-[40px] text-center space-y-4">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
               <Layout size={32} />
             </div>
             <p className="text-slate-500 font-medium">No tables added yet. Start your floor plan!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatingMapper;
