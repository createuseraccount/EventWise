
import React, { useState } from 'react';
import { Plan, BudgetCategory, BudgetSide, WeddingPlan, Snapshot } from '../../types';
import { CURRENCY } from '../../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Download, Printer, Plus, Trash2, Edit3, Check, FileSpreadsheet, FileText, Heart, User, Users, History, Undo2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SummaryProps {
  plan: Plan;
  onUpdate: (updatedPlan: Plan) => void;
}

const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

const SUGGESTIONS = [
  'Venue Security', 'Valet Parking', 'Gifts for Guests', 
  'Alcohol & Bar', 'Extra Lighting', 'Floral Arrangements',
  'Travel/Flights', 'Hotel Rooms', 'Insurance', 'Marketing/Invites'
];

const Summary: React.FC<SummaryProps> = ({ plan, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const calculateTotal = () => {
    let base = 0;
    plan.categories.forEach(cat => {
      cat.items.forEach(item => base += item.cost);
    });
    return base + (base * (plan.contingencyPercent / 100));
  };

  const total = calculateTotal();
  const perGuest = total / plan.guestCount;

  const chartData = plan.categories.map(cat => ({
    name: cat.name,
    value: cat.items.reduce((acc, item) => acc + item.cost, 0)
  })).filter(d => d.value > 0);

  const handlePrintPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = "Category,Item,Cost,Side\n";
    plan.categories.forEach(cat => {
      cat.items.forEach(item => {
        csvContent += `"${cat.name}","${item.label}",${item.cost},"${item.side || 'N/A'}"\n`;
      });
    });

    const contingencyAmount = total - (total / (1 + plan.contingencyPercent/100));
    csvContent += `\n"Contingency (${plan.contingencyPercent}%)",,${Math.round(contingencyAmount)}\n`;
    csvContent += `"Grand Total",,${Math.round(total)}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${plan.name.replace(/\s+/g, '_')}_Budget.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateItem = (catIdx: number, itemIdx: number, field: string, value: any) => {
    const newCategories = [...plan.categories];
    const item = { ...newCategories[catIdx].items[itemIdx], [field]: value };
    newCategories[catIdx].items[itemIdx] = item;
    onUpdate({ ...plan, categories: newCategories });
  };

  const addItem = (catIdx: number, label: string = 'New Item') => {
    const newCategories = [...plan.categories];
    newCategories[catIdx].items.push({
      id: Date.now().toString(),
      label,
      cost: 0,
      side: BudgetSide.SHARED
    });
    onUpdate({ ...plan, categories: newCategories });
  };

  const removeItem = (catIdx: number, itemIdx: number) => {
    const newCategories = [...plan.categories];
    newCategories[catIdx].items.splice(itemIdx, 1);
    onUpdate({ ...plan, categories: newCategories });
  };

  const addCategory = () => {
    const name = prompt('Enter Category Name:');
    if (!name) return;
    const newCategories = [...plan.categories, { name, items: [] }];
    onUpdate({ ...plan, categories: newCategories });
  };

  const removeCategory = (catIdx: number) => {
    if (!confirm('Delete this entire category and all its items?')) return;
    const newCategories = [...plan.categories];
    newCategories.splice(catIdx, 1);
    onUpdate({ ...plan, categories: newCategories });
  };

  const restoreSnapshot = (snapshot: Snapshot) => {
    if (confirm(`Revert to "${snapshot.label}"? Unsaved changes will be lost.`)) {
      onUpdate({ ...snapshot.data, snapshots: plan.snapshots });
      setShowHistory(false);
    }
  };

  const isWedding = plan.type === 'WEDDING';
  const sideSplit = isWedding && (plan as WeddingPlan).sideSplitEnabled;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 md:space-y-6"
    >
      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 px-1 md:px-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col justify-center"
        >
          <p className="text-[10px] md:text-sm text-slate-500 font-black uppercase tracking-widest mb-1">Total Estimated</p>
          <h2 className="text-2xl md:text-3xl font-black text-indigo-600">{CURRENCY}{Math.round(total).toLocaleString('en-IN')}</h2>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col justify-center"
        >
          <p className="text-[10px] md:text-sm text-slate-500 font-black uppercase tracking-widest mb-1">Per Guest</p>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">{CURRENCY}{Math.round(perGuest).toLocaleString('en-IN')}</h2>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col justify-center"
        >
          <p className="text-[10px] md:text-sm text-slate-500 font-black uppercase tracking-widest mb-1">Guest Count</p>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">{plan.guestCount} People</h2>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-4 md:space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white p-5 md:p-6 rounded-2xl border shadow-sm h-fit"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-black uppercase tracking-tight">Allocation</h3>
              <div className="no-print flex gap-2">
                <button 
                  onClick={() => setShowHistory(!showHistory)} 
                  className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                  title="View History"
                >
                  <History size={18} />
                </button>
                <button onClick={handlePrintPDF} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"><Printer size={18} /></button>
              </div>
            </div>

            {showHistory ? (
              <div className="min-h-[250px] animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between mb-4">
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Version History</p>
                   <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                  {plan.snapshots && plan.snapshots.length > 0 ? (
                    plan.snapshots.map(sn => (
                      <div key={sn.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group">
                        <div className="min-w-0">
                          <p className="text-[11px] font-black text-slate-900 truncate">{sn.label}</p>
                          <p className="text-[9px] font-bold text-slate-400">{new Date(sn.timestamp).toLocaleDateString()} • {CURRENCY}{Math.round(sn.totalBudget).toLocaleString('en-IN')}</p>
                        </div>
                        <button onClick={() => restoreSnapshot(sn)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:shadow-sm active:scale-95 transition-all">
                          <Undo2 size={10} /> Revert
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center text-slate-400 italic text-sm">
                      No snapshots found.<br/>
                      <span className="text-[10px] uppercase font-black not-italic mt-2 block">Create snapshots using the Save button.</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-48 md:h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={window.innerWidth < 768 ? 40 : 60}
                      outerRadius={window.innerWidth < 768 ? 60 : 80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${CURRENCY}${value.toLocaleString('en-IN')}`} />
                    <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{ fontSize: '10px' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {!showHistory && (
              <div className="space-y-3 pt-4 border-t border-slate-100 no-print">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add missing pieces</p>
                 <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map(s => (
                      <button key={s} onClick={() => addItem(0, s)} className="px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200 rounded-full text-[10px] font-bold transition-all">
                        + {s}
                      </button>
                    ))}
                 </div>
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white p-5 md:p-6 rounded-2xl border shadow-sm no-print"
          >
            <h3 className="text-base md:text-lg font-black uppercase tracking-tight mb-4">Share Plan</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100"><FileSpreadsheet size={16} /> CSV</button>
              <button onClick={handlePrintPDF} className="flex items-center justify-center gap-2 p-3 bg-rose-50 text-rose-700 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100"><FileText size={16} /> PDF</button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white p-5 md:p-6 rounded-2xl border shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base md:text-lg font-black uppercase tracking-tight">Line Items</h3>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-xl text-[10px] md:text-sm font-black uppercase tracking-widest transition-all no-print ${
                isEditing ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isEditing ? <><Check size={14} /> Done</> : <><Edit3 size={14} /> Edit</>}
            </button>
          </div>

          <div className="space-y-6 max-h-[500px] md:max-h-[600px] overflow-y-auto pr-1 no-scrollbar md:pr-2 md:scrollbar-thin">
            {plan.categories.map((cat, catIdx) => (
              <div key={catIdx} className="group border-b last:border-0 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.name}</h4>
                  {isEditing && (
                    <button onClick={() => removeCategory(catIdx)} className="p-1 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={12} /></button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {cat.items.map((item, itemIdx) => (
                    <div key={item.id} className="flex flex-col gap-2 p-1.5 md:p-2 rounded-xl hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <input type="text" value={item.label} onChange={(e) => updateItem(catIdx, itemIdx, 'label', e.target.value)} className="flex-1 min-w-0 px-2 md:px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 font-bold" />
                            <div className="relative w-24 md:w-32 flex-shrink-0">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">{CURRENCY}</span>
                              <input type="number" value={item.cost} onChange={(e) => updateItem(catIdx, itemIdx, 'cost', e.target.value)} className="w-full pl-5 md:pl-6 pr-1 md:pr-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 font-black" />
                            </div>
                            <button onClick={() => removeItem(catIdx, itemIdx)} className="p-1.5 text-slate-300 hover:text-rose-500 flex-shrink-0"><Trash2 size={14} /></button>
                          </>
                        ) : (
                          <div className="flex justify-between w-full py-0.5 text-xs md:text-sm">
                            <span className="text-slate-700 font-medium flex items-center gap-1.5 min-w-0">
                               <span className="truncate">{item.label}</span>
                               {sideSplit && (
                                 <span className={`flex-shrink-0 text-[8px] px-1 py-0.5 rounded font-black tracking-tighter ${
                                   item.side === BudgetSide.BRIDE ? 'bg-rose-100 text-rose-600' :
                                   item.side === BudgetSide.GROOM ? 'bg-indigo-100 text-indigo-600' :
                                   'bg-slate-100 text-slate-400'
                                 }`}>
                                   {item.side}
                                 </span>
                               )}
                            </span>
                            <span className="font-black text-slate-900 flex-shrink-0 ml-2">{CURRENCY}{item.cost.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                      </div>
                      
                      {sideSplit && isEditing && (
                        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
                          <SideBtn active={item.side === BudgetSide.BRIDE} onClick={() => updateItem(catIdx, itemIdx, 'side', BudgetSide.BRIDE)} icon={<Heart size={8} />} color="rose" label="Bride" />
                          <SideBtn active={item.side === BudgetSide.GROOM} onClick={() => updateItem(catIdx, itemIdx, 'side', BudgetSide.GROOM)} icon={<User size={8} />} color="indigo" label="Groom" />
                          <SideBtn active={item.side === BudgetSide.SHARED || !item.side} onClick={() => updateItem(catIdx, itemIdx, 'side', BudgetSide.SHARED)} icon={<Users size={8} />} color="slate" label="Shared" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isEditing && (
                    <button onClick={() => addItem(catIdx)} className="flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:text-indigo-700 mt-2 px-2 py-1 uppercase tracking-widest"><Plus size={12} /> Add Item</button>
                  )}
                </div>
              </div>
            ))}

            {isEditing && (
              <button onClick={addCategory} className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-500 transition-all flex items-center justify-center gap-2"><Plus size={16} /> New Section</button>
            )}

            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Buffer ({plan.contingencyPercent}%)</span>
                <span>{CURRENCY}{Math.round(total - (total / (1 + plan.contingencyPercent/100))).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pt-2 font-black text-xl md:text-2xl text-indigo-600">
                <span>Total</span>
                <span>{CURRENCY}{Math.round(total).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const SideBtn = ({ active, onClick, icon, color, label }: any) => {
  const activeClasses = {
    rose: 'bg-rose-500 text-white',
    indigo: 'bg-indigo-600 text-white',
    slate: 'bg-slate-600 text-white'
  };
  const inactiveClasses = 'bg-slate-50 text-slate-400 hover:bg-slate-100';
  return (
    <button onClick={onClick} className={`flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tight transition-all flex-shrink-0 ${active ? activeClasses[color as keyof typeof activeClasses] : inactiveClasses}`}>
      {icon} {label}
    </button>
  );
};

export default Summary;
