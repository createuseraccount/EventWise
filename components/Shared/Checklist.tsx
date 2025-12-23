
import React, { useState } from 'react';
import { Plan, ChecklistItem } from '../../types';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';

interface ChecklistProps {
  plan: Plan;
  onUpdate: (updatedPlan: Plan) => void;
}

const Checklist: React.FC<ChecklistProps> = ({ plan, onUpdate }) => {
  const [newTask, setNewTask] = useState('');

  const toggleTask = (id: string) => {
    const newChecklist = plan.checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdate({ ...plan, checklist: newChecklist });
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      task: newTask.trim(),
      completed: false
    };
    onUpdate({ ...plan, checklist: [...plan.checklist, newItem] });
    setNewTask('');
  };

  const deleteTask = (id: string) => {
    onUpdate({ ...plan, checklist: plan.checklist.filter(item => item.id !== id) });
  };

  const completedCount = plan.checklist.filter(i => i.completed).length;
  const progressPercent = plan.checklist.length ? Math.round((completedCount / plan.checklist.length) * 100) : 0;

  return (
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

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {plan.checklist.map((item) => (
          <div 
            key={item.id} 
            className={`flex items-center group gap-3 p-3 rounded-xl border transition-all duration-200 ${
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
        ))}
      </div>
    </div>
  );
};

export default Checklist;
