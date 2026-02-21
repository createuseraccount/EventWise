import React from 'react';
import { Plan, EventType } from '../types';
import { 
  LayoutGrid, 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Globe, 
  Store, 
  ArrowRight,
  Heart,
  Briefcase,
  Plus
} from 'lucide-react';
import { CURRENCY } from '../constants';

interface DashboardProps {
  plans: Plan[];
  onSelectPlan: (plan: Plan) => void;
  onCreateWedding: () => void;
  onCreateEvent: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ plans, onSelectPlan, onCreateWedding, onCreateEvent }) => {
  const totalBudget = plans.reduce((acc, p) => {
    const base = p.categories.reduce((cAcc, cat) => cAcc + cat.items.reduce((iAcc, item) => iAcc + item.cost, 0), 0);
    return acc + base * (1 + p.contingencyPercent / 100);
  }, 0);

  const totalGuests = plans.reduce((acc, p) => acc + p.guestCount, 0);
  const totalRsvps = plans.reduce((acc, p) => acc + (p.rsvps?.length || 0), 0);
  
  const allChecklistItems = plans.flatMap(p => p.checklist);
  const completedTasks = allChecklistItems.filter(i => i.completed).length;
  const taskProgress = allChecklistItems.length > 0 ? Math.round((completedTasks / allChecklistItems.length) * 100) : 0;

  if (plans.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-12 animate-in fade-in duration-700">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center mx-auto shadow-xl shadow-indigo-100 animate-bounce">
            <LayoutGrid size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Your Planning Hub</h1>
          <p className="text-xl text-slate-500 max-w-xl mx-auto">Start your journey by creating your first event plan. We'll help you manage everything from budget to RSVPs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button 
            onClick={onCreateWedding}
            className="group bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-rose-100 transition-all text-left space-y-6"
          >
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
              <Heart size={32} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Wedding Planner</h3>
              <p className="text-slate-500 leading-relaxed">A comprehensive suite for the big day. Manage rituals, wardrobe, budget splits, and more.</p>
            </div>
            <div className="flex items-center gap-2 text-rose-600 font-bold group-hover:gap-4 transition-all">
              Start Planning <ArrowRight size={20} />
            </div>
          </button>

          <button 
            onClick={onCreateEvent}
            className="group bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all text-left space-y-6"
          >
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <Briefcase size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">General Event</h3>
              <p className="text-slate-500 leading-relaxed">Perfect for corporate galas, birthdays, or anniversaries. Focused on logistics and flow.</p>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-4 transition-all">
              Start Planning <ArrowRight size={20} />
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Planning Dashboard</h1>
          <p className="text-slate-500 font-medium">Overview of your active projects and milestones</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCreateWedding} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all active:scale-95">
            <Plus size={18} /> Wedding
          </button>
          <button onClick={onCreateEvent} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
            <Plus size={18} /> Event
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Stats - Large Card */}
        <div className="md:col-span-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Financial Overview</h3>
            </div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Budget</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-5xl md:text-6xl font-black text-slate-900">{CURRENCY}{totalBudget.toLocaleString('en-IN')}</p>
            <p className="text-slate-500 font-medium">Estimated total across {plans.length} active projects</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-50">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Guests</p>
              <p className="text-xl font-black text-slate-900">{totalGuests}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">RSVPs Recv.</p>
              <p className="text-xl font-black text-slate-900">{totalRsvps}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vendors</p>
              <p className="text-xl font-black text-slate-900">{plans.reduce((acc, p) => acc + p.vendors.length, 0)}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tasks Done</p>
              <p className="text-xl font-black text-emerald-600">{taskProgress}%</p>
            </div>
          </div>
        </div>

        {/* Website Status - Small Card */}
        <div className="md:col-span-4 bg-indigo-600 p-8 rounded-[40px] text-white flex flex-col justify-between space-y-8 shadow-xl shadow-indigo-100">
          <div className="flex items-center justify-between">
            <Globe size={32} className="text-indigo-200" />
            <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">Live Sites</div>
          </div>
          <div>
            <h3 className="text-2xl font-black mb-2">Public Portals</h3>
            <p className="text-indigo-100 text-sm leading-relaxed">Guests are interacting with your event websites in real-time.</p>
          </div>
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-400 flex items-center justify-center text-xs font-bold">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-white text-indigo-600 flex items-center justify-center text-xs font-bold">
              +{totalRsvps}
            </div>
          </div>
        </div>

        {/* Checklist Progress - Small Card */}
        <div className="md:col-span-4 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <CheckCircle2 size={28} className="text-emerald-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Milestones</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-slate-900">{taskProgress}%</h3>
              <p className="text-xs font-bold text-slate-500">{completedTasks}/{allChecklistItems.length} Tasks</p>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000" 
                style={{ width: `${taskProgress}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium">You're ahead of schedule on most projects. Keep it up!</p>
        </div>

        {/* Recent Plans - Medium Card */}
        <div className="md:col-span-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">Active Projects</h3>
            <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plans.slice(0, 4).map(plan => (
              <button 
                key={plan.id}
                onClick={() => onSelectPlan(plan)}
                className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all text-left group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${plan.type === EventType.WEDDING ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-600'}`}>
                  {plan.type === EventType.WEDDING ? <Heart size={20} fill="currentColor" /> : <Briefcase size={20} />}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-900 truncate">{plan.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{plan.city} • {plan.guestCount} Guests</p>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Milestone - Full Width or Large Card */}
        <div className="md:col-span-12 bg-slate-50 p-8 rounded-[40px] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-[24px] shadow-sm flex items-center justify-center text-indigo-600 flex-shrink-0">
              <Clock size={32} />
            </div>
            <div>
              <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Next Milestone</p>
              <h3 className="text-2xl font-black text-slate-900">Finalize Venue Logistics</h3>
              <p className="text-slate-500 font-medium">Scheduled for tomorrow at 10:00 AM • Grand Hyatt Mumbai</p>
            </div>
          </div>
          <button className="w-full md:w-auto px-8 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-900 hover:bg-slate-100 transition-all shadow-sm">
            Open Timeline
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
