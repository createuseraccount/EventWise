
import React, { useState } from 'react';
import { Plan, TimelineItem, ChecklistItem } from '../../types';
import { Clock, Plus, Trash2, ArrowUp, ArrowDown, Star, ListPlus, CheckCircle2, Edit } from 'lucide-react';

interface TimelineProps {
  plan: Plan;
  onUpdate: (updatedPlan: Plan) => void;
}

const Timeline: React.FC<TimelineProps> = ({ plan, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ time: '', activity: '', notes: '' });

  const updateTimeline = (items: TimelineItem[]) => {
    onUpdate({ ...plan, timeline: items });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.time || !newItem.activity) return;
    
    if (editingId) {
      const updatedTimeline = plan.timeline.map(item => 
        item.id === editingId ? { ...item, ...newItem } : item
      );
      updateTimeline(updatedTimeline);
      setEditingId(null);
    } else {
      const item: TimelineItem = {
        id: Date.now().toString(),
        ...newItem,
        isImportant: false
      };
      updateTimeline([...plan.timeline, item]);
    }
    
    setNewItem({ time: '', activity: '', notes: '' });
    setIsAdding(false);
  };

  const startEdit = (item: TimelineItem) => {
    setNewItem({ time: item.time, activity: item.activity, notes: item.notes || '' });
    setEditingId(item.id);
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setNewItem({ time: '', activity: '', notes: '' });
    setEditingId(null);
    setIsAdding(false);
  };

  const removeItem = (id: string) => {
    updateTimeline(plan.timeline.filter(i => i.id !== id));
  };

  const toggleImportant = (id: string) => {
    updateTimeline(plan.timeline.map(i => 
      i.id === id ? { ...i, isImportant: !i.isImportant } : i
    ));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...plan.timeline];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    updateTimeline(newItems);
  };

  const syncToChecklist = (item: TimelineItem) => {
    const existingTask = plan.checklist.find(t => t.id === item.syncedTaskId);
    
    if (existingTask) {
      alert(`"${item.activity}" is already synced to your checklist.`);
      return;
    }

    if (confirm(`Link "${item.activity}" to your Planning Checklist as a task?`)) {
      const taskId = Math.random().toString(36).substr(2, 9);
      const newTask: ChecklistItem = {
        id: taskId,
        task: `Finalize logistics: ${item.activity} (${item.time})`,
        completed: false
      };
      
      const updatedTimeline = plan.timeline.map(ti => 
        ti.id === item.id ? { ...ti, syncedTaskId: taskId } : ti
      );

      onUpdate({ 
        ...plan, 
        timeline: updatedTimeline,
        checklist: [newTask, ...plan.checklist] 
      });
    }
  };

  const handleDeletePlan = () => {
    if (confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      alert('Delete functionality would be triggered here.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold">Event Day Flow</h3>
            <p className="text-sm text-slate-500">Timeline of key moments</p>
          </div>
          <button 
            onClick={() => {
              setNewItem({ time: '', activity: '', notes: '' });
              setEditingId(null);
              setIsAdding(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all no-print"
          >
            <Plus size={16} /> Add Slot
          </button>
        </div>

        <div className="relative space-y-4">
          {/* Timeline Line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 no-print" />

          {plan.timeline.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <Clock size={40} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm font-medium">Your timeline is empty. Start adding moments!</p>
            </div>
          )}

          {plan.timeline.map((item, index) => {
            const isSynced = item.syncedTaskId && plan.checklist.some(t => t.id === item.syncedTaskId);
            
            return (
              <div key={item.id} className="relative pl-12 group">
                {/* Marker */}
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-colors ${
                  item.isImportant ? 'bg-amber-400 text-white' : 'bg-indigo-600 text-white'
                }`}>
                  <Clock size={16} />
                </div>

                {/* Content Card */}
                <div className={`p-4 rounded-xl border transition-all ${
                  item.isImportant ? 'bg-amber-50/30 border-amber-200' : 'bg-white border-slate-100 hover:border-slate-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">{item.time}</span>
                        {item.isImportant && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 uppercase px-1.5 py-0.5 bg-amber-100 rounded">
                            <Star size={10} fill="currentColor" /> Key Moment
                          </span>
                        )}
                        {isSynced && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase px-1.5 py-0.5 bg-emerald-100 rounded">
                            <CheckCircle2 size={10} /> Linked
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">{item.activity}</h4>
                      {item.notes && <p className="text-xs text-slate-500 mt-1">{item.notes}</p>}
                    </div>

                    <div className="flex items-center gap-1 no-print md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 disabled:opacity-0"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button 
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === plan.timeline.length - 1}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 disabled:opacity-0"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button 
                        onClick={() => toggleImportant(item.id)}
                        className={`p-1.5 ${item.isImportant ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'}`}
                        title="Mark as Key Moment"
                      >
                        <Star size={14} fill={item.isImportant ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={() => syncToChecklist(item)}
                        className={`p-1.5 transition-colors ${isSynced ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-600'}`}
                        title={isSynced ? "Already Linked to Checklist" : "Link to Checklist"}
                      >
                        {isSynced ? <CheckCircle2 size={14} /> : <ListPlus size={14} />}
                      </button>
                      <button 
                        onClick={() => startEdit(item)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isAdding && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{editingId ? 'Edit Timeline Moment' : 'Add Timeline Moment'}</h3>
                <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-600"><Plus size={24} className="rotate-45" /></button>
              </div>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Time</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 06:30 PM"
                    value={newItem.time}
                    onChange={e => setNewItem({...newItem, time: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Activity</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Grand Entry"
                    value={newItem.activity}
                    onChange={e => setNewItem({...newItem, activity: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes (Optional)</label>
                  <textarea 
                    placeholder="Additional details..."
                    value={newItem.notes}
                    onChange={e => setNewItem({...newItem, notes: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none h-20 resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-colors"
                  >
                    {editingId ? 'Update Moment' : 'Save Moment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
                onChange={(e) => onUpdate({ ...plan, guestCount: parseInt(e.target.value) })}
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
                onChange={(e) => onUpdate({ ...plan, contingencyPercent: parseInt(e.target.value) })}
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
    </div>
  );
};

export default Timeline;
