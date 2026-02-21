import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Save, X, LogOut } from 'lucide-react';

interface JournalEntry {
  id: number;
  content: string;
  timestamp: string;
}

interface JournalProps {
  token: string;
  onLogout: () => void;
}

const Journal: React.FC<JournalProps> = ({ token, onLogout }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/journals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Failed to fetch entries', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newEntry.trim()) return;

    try {
      const response = await fetch('/api/journals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newEntry }),
      });

      if (response.ok) {
        setNewEntry('');
        setIsCreating(false);
        fetchEntries();
      }
    } catch (error) {
      console.error('Failed to create entry', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const response = await fetch(`/api/journals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setEntries(entries.filter((e) => e.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete entry', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">My Journal</h1>
          <p className="text-slate-500 font-medium">Capture your thoughts and memories</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-sm font-bold"
        >
          <LogOut size={18} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>

      {!isCreating && (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full py-6 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-3 group"
        >
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            <Plus size={20} />
          </div>
          Write a new entry...
        </button>
      )}

      {isCreating && (
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="What's on your mind today?"
            className="w-full h-40 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-medium text-slate-700"
            autoFocus
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!newEntry.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save size={16} />
              Save Entry
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading your memories...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="font-bold">No entries yet.</p>
            <p className="text-sm mt-1">Start writing your first journal entry above.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all group relative"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                <Calendar size={14} />
                {new Date(entry.timestamp).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
              
              <button
                onClick={() => handleDelete(entry.id)}
                className="absolute top-6 right-6 p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                title="Delete Entry"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Journal;
