
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import WeddingWizard from './components/WeddingPlanner/Wizard';
import GeneralEventPlanner from './components/EventPlanner/Planner';
import Summary from './components/Shared/Summary';
import Checklist from './components/Shared/Checklist';
import Timeline from './components/Shared/Timeline';
import GuestIntelligence from './components/Shared/GuestIntelligence';
import BudgetSplit from './components/Shared/BudgetSplit';
import VendorManager from './components/Shared/VendorManager';
import { Plan, EventType, WeddingPlan } from './types';
import { storage } from './utils/storage';
import { 
  Trash2, 
  Plus, 
  ArrowLeft, 
  ExternalLink, 
  Search, 
  Filter, 
  X, 
  Heart, 
  Cake, 
  Briefcase, 
  Star, 
  Music,
  LayoutGrid,
  ClipboardList,
  Clock,
  Users,
  GitMerge,
  MapPin,
  Utensils,
  Camera,
  Store
} from 'lucide-react';
import { CURRENCY, GET_DEFAULT_VENDOR_CHECKLIST, VENDOR_CATEGORIES } from './constants';

const EVENT_TYPE_ICONS: Record<EventType, React.ReactNode> = {
  [EventType.WEDDING]: <Heart size={12} />,
  [EventType.BIRTHDAY]: <Cake size={12} />,
  [EventType.CORPORATE]: <Briefcase size={12} />,
  [EventType.ANNIVERSARY]: <Star size={12} />,
  [EventType.PARTY]: <Music size={12} />,
};

type ViewMode = 'BUDGET' | 'GUESTS' | 'CHECKLIST' | 'TIMELINE' | 'SPLIT' | 'VENDORS';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [viewMode, setViewMode] = useState<ViewMode>('BUDGET');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [isCreatingWedding, setIsCreatingWedding] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | EventType>('ALL');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPlans(storage.getPlans());

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.metaKey && e.key === 'k')) && activeTab === 'list' && !currentPlan) {
        if (document.activeElement !== searchInputRef.current) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, currentPlan]);

  // Centralized navigation handler to reset all transient states
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPlan(null);
    setIsCreatingWedding(false);
    setIsCreatingEvent(false);
  };

  const handleUpdatePlan = (updatedPlan: Plan) => {
    storage.updatePlan(updatedPlan);
    setPlans(storage.getPlans());
    setCurrentPlan(updatedPlan);
  };

  const handleDeletePlan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this plan?')) {
      storage.deletePlan(id);
      setPlans(storage.getPlans());
      if (currentPlan?.id === id) setCurrentPlan(null);
    }
  };

  const handlePlanComplete = (plan: Plan) => {
    setPlans(storage.getPlans());
    setCurrentPlan(plan);
    setIsCreatingWedding(false);
    setIsCreatingEvent(false);
    setActiveTab('list');
    setViewMode('BUDGET');
  };

  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'ALL' || plan.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [plans, searchQuery, filterType]);

  const getBookingStatus = (plan: Plan) => {
    // We check both the master checklist AND the new Vendors module
    const checkMaster = (keywords: string[]) => 
      plan.checklist.some(item => 
        keywords.some(k => item.task.toLowerCase().includes(k)) && item.completed
      );

    const checkVendors = (category: string) => {
      if (!plan.vendors) return false;
      const v = plan.vendors.find(vend => vend.category === category);
      // Considered booked if contract is signed or advance paid (using logic on default tasks)
      return v?.checklist.some(i => i.completed && (i.task.toLowerCase().includes('contract') || i.task.toLowerCase().includes('advance') || i.task.toLowerCase().includes('shortlisted')));
    };

    return {
      venue: checkMaster(['venue', 'place', 'location booked', 'venue confirmed']) || checkVendors('Venue'),
      caterer: checkMaster(['caterer', 'catering', 'food', 'menu confirmed']) || checkVendors('Caterer'),
      photographer: checkMaster(['photograph', 'camera', 'video', 'cinematographer']) || checkVendors('Photographer')
    };
  };

  // Content rendering based on state
  let content;
  if (isCreatingWedding) {
    content = <WeddingWizard onComplete={handlePlanComplete} onCancel={() => setIsCreatingWedding(false)} />;
  } else if (isCreatingEvent) {
    content = <GeneralEventPlanner onComplete={handlePlanComplete} onCancel={() => setIsCreatingEvent(false)} />;
  } else if (currentPlan) {
    const showSplitTab = currentPlan.type === EventType.WEDDING && (currentPlan as WeddingPlan).sideSplitEnabled;
    content = (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentPlan(null)} 
              className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900">{currentPlan.name}</h1>
              <p className="text-sm text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
                {EVENT_TYPE_ICONS[currentPlan.type]}
                {currentPlan.type} • {currentPlan.quality}
              </p>
            </div>
          </div>
          
          <div className="flex bg-white p-1 rounded-2xl border shadow-sm self-start md:self-auto overflow-x-auto no-scrollbar">
            <ViewTab active={viewMode === 'BUDGET'} onClick={() => setViewMode('BUDGET')} icon={<LayoutGrid size={16} />} label="Budget" />
            <ViewTab active={viewMode === 'VENDORS'} onClick={() => setViewMode('VENDORS')} icon={<Store size={16} />} label="Vendors" />
            {showSplitTab && <ViewTab active={viewMode === 'SPLIT'} onClick={() => setViewMode('SPLIT')} icon={<GitMerge size={16} />} label="Split" />}
            <ViewTab active={viewMode === 'GUESTS'} onClick={() => setViewMode('GUESTS')} icon={<Users size={16} />} label="Guests" />
            <ViewTab active={viewMode === 'CHECKLIST'} onClick={() => setViewMode('CHECKLIST')} icon={<ClipboardList size={16} />} label="Checklist" />
            <ViewTab active={viewMode === 'TIMELINE'} onClick={() => setViewMode('TIMELINE')} icon={<Clock size={16} />} label="Timeline" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {viewMode === 'BUDGET' && <div className="animate-in fade-in slide-in-from-left-4 duration-300"><Summary plan={currentPlan} onUpdate={handleUpdatePlan} /></div>}
          {viewMode === 'VENDORS' && <div className="animate-in fade-in zoom-in-95 duration-300"><VendorManager plan={currentPlan} onUpdate={handleUpdatePlan} /></div>}
          {viewMode === 'SPLIT' && showSplitTab && <div className="max-w-5xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300"><BudgetSplit plan={currentPlan as WeddingPlan} onUpdate={handleUpdatePlan} /></div>}
          {viewMode === 'GUESTS' && <div className="max-w-5xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300"><GuestIntelligence plan={currentPlan} onUpdate={handleUpdatePlan} /></div>}
          {viewMode === 'CHECKLIST' && <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-300"><Checklist plan={currentPlan} onUpdate={handleUpdatePlan} /></div>}
          {viewMode === 'TIMELINE' && <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-300"><Timeline plan={currentPlan} onUpdate={handleUpdatePlan} /></div>}
        </div>
        
        <div className="max-w-4xl mx-auto w-full bg-white p-6 rounded-2xl border shadow-sm no-print">
          <h3 className="text-lg font-bold mb-4">Plan Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-slate-700">Total Guests</label><span className="text-sm font-bold text-indigo-600">{currentPlan.guestCount}</span></div>
                <input type="range" min="1" max="2000" step="1" value={currentPlan.guestCount} onChange={(e) => handleUpdatePlan({...currentPlan, guestCount: Number(e.target.value)})} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">Adjusting this will override guest category distributions.</p>
              </div>
              <div>
                <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-slate-700">Contingency Buffer</label><span className="text-sm font-bold text-indigo-600">{currentPlan.contingencyPercent}%</span></div>
                <input type="range" min="0" max="25" step="1" value={currentPlan.contingencyPercent} onChange={(e) => handleUpdatePlan({...currentPlan, contingencyPercent: Number(e.target.value)})} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              </div>
            </div>
            <div className="flex flex-col justify-end gap-3 pt-4 border-t md:border-t-0 md:pt-0">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium"><span>Location: {currentPlan.city}</span><span>Created: {new Date(currentPlan.createdAt).toLocaleDateString()}</span></div>
              <button onClick={(e) => { handleDeletePlan(currentPlan.id, e); setCurrentPlan(null); }} className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"><Trash2 size={16} /> Delete This Plan</button>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (activeTab === 'home' || (activeTab === 'list' && plans.length === 0)) {
    content = <LandingPage onCreateWedding={() => setIsCreatingWedding(true)} onCreateEvent={() => setIsCreatingEvent(true)} />;
  } else if (activeTab === 'list') {
    content = (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div><h1 className="text-3xl font-black text-slate-900">Your Plans</h1><p className="text-slate-500">All your event calculations in one place</p></div>
          <div className="flex gap-2">
            <button onClick={() => setIsCreatingWedding(true)} className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-100 whitespace-nowrap hover:bg-rose-600 transition-colors"><Plus size={16} /> Wedding</button>
            <button onClick={() => setIsCreatingEvent(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 whitespace-nowrap hover:bg-indigo-700 transition-colors"><Plus size={16} /> Event</button>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="h-5 w-5 text-slate-400" /></div>
            <input ref={searchInputRef} type="text" className="block w-full pl-12 pr-20 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm transition-all" placeholder="Search plans..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
              {searchQuery ? <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600"><X size={16} /></button> : <div className="hidden md:block text-[10px] text-slate-400 font-bold uppercase tracking-tight">Press /</div>}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
              <Filter size={14} className="text-slate-400" /><FilterChip label="All" active={filterType === 'ALL'} onClick={() => setFilterType('ALL')} />
              {(Object.keys(EventType) as Array<keyof typeof EventType>).map(type => <FilterChip key={type} label={type.charAt(0) + type.slice(1).toLowerCase()} active={filterType === EventType[type]} onClick={() => setFilterType(EventType[type])} />)}
            </div>
            <div className="text-[11px] font-bold text-slate-400">{filteredPlans.length} {filteredPlans.length === 1 ? 'Plan' : 'Plans'} found</div>
          </div>
        </div>

        {filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map(plan => {
              const total = plan.categories.reduce((acc, cat) => acc + cat.items.reduce((iAcc, item) => iAcc + item.cost, 0), 0) * (1 + plan.contingencyPercent/100);
              const bookings = getBookingStatus(plan);
              return (
                <div key={plan.id} onClick={() => setCurrentPlan(plan)} className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col">
                  <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${plan.type === EventType.WEDDING ? 'bg-rose-500' : 'bg-indigo-500'}`} />
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${plan.type === EventType.WEDDING ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>{EVENT_TYPE_ICONS[plan.type]}{plan.type}</div>
                    <button onClick={(e) => handleDeletePlan(plan.id, e)} className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors z-10"><Trash2 size={16} /></button>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{plan.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mb-4"><span>{plan.guestCount} Guests</span><span>•</span><span className="flex items-center gap-1"><Clock size={12} /> {plan.timeline?.length || 0} slots</span></div>
                  
                  <div className="flex items-center gap-2 mb-6 no-print">
                    <BookingIcon icon={<MapPin size={12} />} label="Venue" booked={bookings.venue} />
                    <BookingIcon icon={<Utensils size={12} />} label="Catering" booked={bookings.caterer} />
                    <BookingIcon icon={<Camera size={12} />} label="Photo" booked={bookings.photographer} />
                  </div>

                  <div className="mt-auto flex items-end justify-between">
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Estimated Budget</p><p className="text-xl font-black text-slate-900">{CURRENCY}{Math.round(total).toLocaleString('en-IN')}</p></div>
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300"><ExternalLink size={20} /></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] p-12 md:p-20 border border-dashed border-slate-200 text-center space-y-6">
            <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-[32px] flex items-center justify-center mx-auto"><Search size={48} className="opacity-50" /></div>
            <div className="max-w-xs mx-auto text-center"><h3 className="text-xl font-bold text-slate-900 mb-2">No matching plans</h3><p className="text-slate-500 text-sm">Clear your search or filter to see all your events.</p></div>
          </div>
        )}
      </div>
    );
  } else {
    // Default fallback
    content = <LandingPage onCreateWedding={() => setIsCreatingWedding(true)} onCreateEvent={() => setIsCreatingEvent(true)} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={handleTabChange}>
      {content}
    </Layout>
  );
};

const BookingIcon: React.FC<{ icon: React.ReactNode, label: string, booked: boolean }> = ({ icon, label, booked }) => (
  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-tight transition-all ${booked ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
    {icon}<span>{label}</span>
  </div>
);

const FilterChip: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`px-5 py-2 rounded-2xl text-[11px] font-bold transition-all flex-shrink-0 border ${active ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}>{label}</button>
);

const ViewTab: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>{icon}<span>{label}</span></button>
);

export default App;
