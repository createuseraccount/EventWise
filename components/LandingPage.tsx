
import React from 'react';
import { Heart, PartyPopper, Sparkles, TrendingUp, Calendar, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onCreateWedding: () => void;
  onCreateEvent: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCreateWedding, onCreateEvent }) => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold tracking-wide uppercase">
          <Sparkles size={16} />
          Smart Planning Made Simple
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Plan Your Dream Event <br/> <span className="text-indigo-600 italic">Without the Stress</span>
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          Comprehensive wedding and event planning calculators for India. Estimate budgets, track checklists, and organize everything in one private place.
        </p>
      </div>

      {/* Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="group bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 cursor-pointer flex flex-col items-center text-center space-y-6" onClick={onCreateWedding}>
          <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <Heart size={48} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-3xl font-black mb-3">Wedding Planning</h2>
            <p className="text-slate-500">Full-scale multi-day wedding estimation. Includes catering, jewelry, decor & more.</p>
          </div>
          <button className="px-8 py-4 bg-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 group-hover:bg-rose-600 transition-colors">
            Start Wedding Wizard
          </button>
        </div>

        <div className="group bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 cursor-pointer flex flex-col items-center text-center space-y-6" onClick={onCreateEvent}>
          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <PartyPopper size={48} />
          </div>
          <div>
            <h2 className="text-3xl font-black mb-3">General Events</h2>
            <p className="text-slate-500">Corporate meets, birthdays, or anniversaries. Quick estimates & planning tools.</p>
          </div>
          <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
            Plan New Event
          </button>
        </div>
      </div>

      {/* Stats/Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<TrendingUp size={24} />} 
          title="Smart Budgeting" 
          description="Automatic cost calculations based on city tiers and guest counts."
        />
        <FeatureCard 
          icon={<Calendar size={24} />} 
          title="Dynamic Checklist" 
          description="Pre-filled task lists that adapt to your specific event type."
        />
        <FeatureCard 
          icon={<ShieldCheck size={24} />} 
          title="100% Private" 
          description="No accounts needed. All data lives safely in your browser."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
    <div className="w-12 h-12 bg-slate-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default LandingPage;
