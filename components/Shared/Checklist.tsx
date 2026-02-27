
import React, { useState } from 'react';
import { ChecklistItem } from '../../types';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { List } from 'react-window';
import { usePlanStore } from '../../src/store/usePlanStore';

const Checklist: React.FC = () => {
  const plan = usePlanStore(state => state.currentPlan);
  const updatePlan = usePlanStore(state => state.updatePlan);
  const [newTask, setNewTask] = useState('');

  if (!plan) return null;

  const toggleTask = (id: string) => {
    const newChecklist = plan.checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    updatePlan({ checklist: newChecklist });
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      task: newTask.trim(),
      completed: false
    };
    updatePlan({ checklist: [...plan.checklist, newItem] });
    setNewTask('');
  };

  const deleteTask = (id: string) => {
    updatePlan({ checklist: plan.checklist.filter(item => item.id !== id) });
  };

  const handleDeletePlan = () => {
    if (confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      alert('Delete functionality would be triggered here.');
    }
  };

  const completedCount = plan.checklist.filter(i => i.completed).length;
  const progressPercent = plan.checklist.length ? Math.round((completedCount / plan.checklist.length) * 100) : 0;

  // Row component for react-window
  const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const item = plan.checklist[index];
    return (
      <div style={style} className="pr-2">
        <div 
          className={`flex items-center group gap-3 p-3 rounded-xl border transition-all duration-200 h-full ${
            item.completed ? 'bg-indigo-50/30 border-indigo-100' : 'bg-white border-slate-100 hover:border-indigo-200'
          }`}
        >
          <button onClick={() => toggleTask(item.id)} className="flex-shrink-0 transition-transform hover:scale-110">
            {item.completed ? (
              <CheckCircle2 className="text-indigo-600" size={20} />
            ) : (
              <Circle className="text-slate-300" size={20} />
            )}
          </button>
          <span className={`flex-1 text-sm ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>
            {item.task}
          </span>
          <button 
            onClick={() => deleteTask(item.id)} 
            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all no-print"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold">Planning Checklist</h3>
            <p className="text-sm text-slate-500">{completedCount} of {plan.checklist.length} tasks completed</p>
          </div>
          <div className="w-16 h-16 relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
              <circle 
                cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                strokeDasharray={175.92}
                strokeDashoffset={175.92 - (175.92 * progressPercent) / 100}
                className="text-indigo-600 transition-all duration-500 ease-out" 
              />
            </svg>
            <span className="absolute text-xs font-bold text-indigo-700">{progressPercent}%</span>
          </div>
        </div>

        <form onSubmit={addTask} className="flex gap-2 mb-6 no-print">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
          />
          <button type="submit" className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
            <Plus size={20} />
          </button>
        </form>

        <div className="h-[400px] w-full">
          <List
            rowCount={plan.checklist.length}
            rowHeight={60}
            rowComponent={Row}
            rowProps={{}}
            style={{ height: 400, width: '100%' }}
            className="custom-scrollbar"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="text-lg font-bold mb-6">Plan Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Total Guests</label>
                <span className="text-sm font-bold text-indigo-600">{plan.guestCount}</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="2000" 
                step="10"
                value={plan.guestCount} 
                onChange={(e) => updatePlan({ guestCount: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Contingency Buffer</label>
                <span className="text-sm font-bold text-indigo-600">{plan.contingencyPercent}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="30" 
                step="1"
                value={plan.contingencyPercent} 
                onChange={(e) => updatePlan({ contingencyPercent: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="flex justify-between text-xs text-slate-500 mb-4">
              <span>Location: {plan.city}</span>
              <span>Created: {new Date(plan.createdAt).toLocaleDateString()}</span>
            </div>
            
            <button 
              onClick={handleDeletePlan}
              className="w-full py-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> Delete This Plan
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checklist;
