import React, { useState, useEffect } from 'react';
import { X, Mail, UserPlus, Loader2, Shield, Trash2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Plan } from '../../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
}

interface Member {
  id: string;
  user_email: string;
  role: string;
  created_at: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, plan }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
      fetchCurrentUser();
    }
  }, [isOpen, plan.id]);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserEmail(user.email || null);
    }
  };

  const fetchMembers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('project_members')
        .select('*')
        .eq('project_id', plan.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (err: any) {
      console.error('Error fetching members:', err);
      // Don't show error if table doesn't exist yet (graceful degradation)
      if (err.code !== '42P01') {
        setError('Failed to load collaborators.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsInviting(true);
    setError(null);
    setSuccess(false);

    try {
      // Check if trying to invite themselves
      if (email.toLowerCase() === currentUserEmail?.toLowerCase()) {
        throw new Error("You cannot invite yourself.");
      }

      // Check if already a member
      if (members.some(m => m.user_email.toLowerCase() === email.toLowerCase())) {
        throw new Error("This user is already a collaborator.");
      }

      const { error } = await supabase
        .from('project_members')
        .insert({
          project_id: plan.id,
          user_email: email.toLowerCase(),
          role: role
        });

      if (error) {
        if (error.code === '42P01') {
          throw new Error("The project_members table has not been created in Supabase yet. Please run the SQL setup script.");
        }
        throw error;
      }

      setSuccess(true);
      setEmail('');
      fetchMembers();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error inviting user:', err);
      setError(err.message || 'Failed to invite user.');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMembers(members.filter(m => m.id !== id));
    } catch (err: any) {
      console.error('Error removing member:', err);
      setError('Failed to remove collaborator.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-900">Share Project</h2>
            <p className="text-sm text-slate-500 font-medium mt-1 truncate max-w-[250px]">{plan.name}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-medium flex items-start gap-3">
              <Shield size={18} className="flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-sm font-medium flex items-center gap-3">
              <CheckCircle2 size={18} className="flex-shrink-0" />
              <p>Invitation sent successfully!</p>
            </div>
          )}

          <form onSubmit={handleInvite} className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-2">Invite Collaborator</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="partner@email.com"
                  className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
                />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-28 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium text-slate-700"
              >
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isInviting || !email}
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
            >
              {isInviting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
              Send Invite
            </button>
          </form>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Shield size={16} className="text-indigo-600" /> Who has access
            </h3>
            
            <div className="space-y-3">
              {/* Owner */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {currentUserEmail ? currentUserEmail.charAt(0).toUpperCase() : 'ME'}
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-slate-900 truncate">{currentUserEmail || 'You'}</p>
                    <p className="text-xs text-slate-500">Owner</p>
                  </div>
                </div>
              </div>

              {/* Members */}
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 size={20} className="animate-spin text-slate-400" />
                </div>
              ) : (
                members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {member.user_email.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-bold text-slate-900 truncate">{member.user_email}</p>
                        <p className="text-xs text-slate-500 capitalize">{member.role}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove access"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
              
              {!isLoading && members.length === 0 && (
                <p className="text-center text-sm text-slate-500 py-4">No other collaborators yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
