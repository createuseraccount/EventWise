
import React, { useState } from 'react';
import { Plan, BudgetCategory, BudgetSide, WeddingPlan } from '../../types';
import { CURRENCY } from '../../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Download, Printer, Plus, Trash2, Edit3, Check, FileSpreadsheet, FileText, Heart, User, Users } from 'lucide-react';

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

  // Management Functions
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

  const isWedding = plan.type === 'WEDDING';
  const sideSplit = isWedding && (plan as WeddingPlan).sideSplitEnabled;

  return (
    <div className="space-y-6">
      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-center">
          <p className="text-sm text-slate-500 font-medium mb-1">Total Estimated Budget</p>
          <h2 className="text-3xl font-bold text-indigo-600">{CURRENCY}{Math.round(total).toLocaleString('en-IN')}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-center">
          <p className="text-sm text-slate-500 font-medium mb-1">Cost Per Guest</p>
          <h2 className="text-2xl font-bold text-slate-900">{CURRENCY}{Math.round(perGuest).toLocaleString('en-IN')}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-center">
          <p className="text-sm text-slate-500 font-medium mb-1">Guests</p>
          <h2 className="text-2xl font-bold text-slate-900">{plan.guestCount} People</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Chart & Export */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm h-fit">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Budget Allocation</h3>
              <div className="no-print">
                <button 
                  onClick={handlePrintPDF} 
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                  title="Quick Print"
                >
                  <Printer size={18} />
                </button>
              </div>
            </div>
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${CURRENCY}${value.toLocaleString('en-IN')}`}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 no-print">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quick Suggestions</p>
               <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map(s => (
                    <button 
                      key={s}
                      onClick={() => addItem(0, s)}
                      className="px-3 py-1 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200 rounded-full text-xs transition-all"
                    >
                      + {s}
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm no-print">
            <h3 className="text-lg font-bold mb-4">Export & Share</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all border border-emerald-100"
              >
                <FileSpreadsheet size={18} /> Export CSV
              </button>
              <button 
                onClick={handlePrintPDF}
                className="flex items-center justify-center gap-2 p-3 bg-rose-50 text-rose-700 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all border border-rose-100"
              >
                <FileText size={18} /> Download PDF
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-widest text-center">
              Professional reports ready for printing
            </p>
          </div>
        </div>

        {/* Right Column: Itemized List */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Itemized Details</h3>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-bold transition-all no-print ${
                isEditing ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isEditing ? <><Check size={16} /> Finish Editing</> : <><Edit3 size={16} /> Manage Items</>}
            </button>
          </div>

          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
            {plan.categories.map((cat, catIdx) => (
              <div key={catIdx} className="group border-b last:border-0 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{cat.name}</h4>
                  {isEditing && (
                    <button 
                      onClick={() => removeCategory(catIdx)}
                      className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {cat.items.map((item, itemIdx) => (
                    <div key={item.id} className="flex flex-col gap-2 p-2 rounded-xl hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <input 
                              type="text" 
                              value={item.label}
                              onChange={(e) => updateItem(catIdx, itemIdx, 'label', e.target.value)}
                              className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <div className="relative w-32">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">{CURRENCY}</span>
                              <input 
                                type="number" 
                                value={item.cost}
                                onChange={(e) => updateItem(catIdx, itemIdx, 'cost', e.target.value)}
                                className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                              />
                            </div>
                            <button 
                              onClick={() => removeItem(catIdx, itemIdx)}
                              className="p-2 text-slate-300 hover:text-rose-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <div className="flex justify-between w-full py-1 text-sm">
                            <span className="text-slate-700 flex items-center gap-2">
                               {item.label}
                               {sideSplit && (
                                 <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                                   item.side === BudgetSide.BRIDE ? 'bg-rose-100 text-rose-600' :
                                   item.side === BudgetSide.GROOM ? 'bg-indigo-100 text-indigo-600' :
                                   'bg-slate-100 text-slate-400'
                                 }`}>
                                   {item.side}
                                 </span>
                               )}
                            </span>
                            <span className="font-semibold text-slate-900">{CURRENCY}{item.cost.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Side Split Selector */}
                      {sideSplit && isEditing && (
                        <div className="flex gap-1">
                          <SideBtn 
                            active={item.side === BudgetSide.BRIDE} 
                            onClick={() => updateItem(catIdx, itemIdx, 'side', BudgetSide.BRIDE)}
                            icon={<Heart size={10} />}
                            color="rose"
                            label="Bride"
                          />
                          <SideBtn 
                            active={item.side === BudgetSide.GROOM} 
                            onClick={() => updateItem(catIdx, itemIdx, 'side', BudgetSide.GROOM)}
                            icon={<User size={10} />}
                            color="indigo"
                            label="Groom"
                          />
                          <SideBtn 
                            active={item.side === BudgetSide.SHARED || !item.side} 
                            onClick={() => updateItem(catIdx, itemIdx, 'side', BudgetSide.SHARED)}
                            icon={<Users size={10} />}
                            color="slate"
                            label="Shared"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isEditing && (
                    <button 
                      onClick={() => addItem(catIdx)}
                      className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 mt-2 px-2 py-1 rounded hover:bg-indigo-50 transition-all"
                    >
                      <Plus size={14} /> Add item to {cat.name}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isEditing && (
              <button 
                onClick={addCategory}
                className="w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-sm font-bold text-slate-400 hover:border-indigo-200 hover:text-indigo-500 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add New Budget Section
              </button>
            )}

            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                <span>Contingency ({plan.contingencyPercent}%)</span>
                <span>{CURRENCY}{Math.round(total - (total / (1 + plan.contingencyPercent/100))).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pt-2 font-black text-xl text-indigo-600">
                <span>Grand Total</span>
                <span>{CURRENCY}{Math.round(total).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    <button 
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${
        active ? activeClasses[color as keyof typeof activeClasses] : inactiveClasses
      }`}
    >
      {icon} {label}
    </button>
  );
};

export default Summary;
