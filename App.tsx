import React, { useState, useEffect, useMemo, useRef } from 'react';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import WeddingWizard from './components/WeddingPlanner/Wizard';
import GeneralEventPlanner from './components/EventPlanner/Planner';
import Summary from './components/Shared/Summary';
import Checklist from './components/Shared/Checklist';
import Timeline from './components/Shared/Timeline';
import GuestIntelligence from './components/Shared/GuestIntelligence';
import BudgetSplit from './components/Shared/BudgetSplit';
import VendorManager from './components/Shared/VendorManager';
import SeatingMapper from './components/ProModules/SeatingMapper';
import LogisticsHub from './components/ProModules/LogisticsHub';
import WardrobeVault from './components/ProModules/WardrobeVault';
import FinancialPro from './components/ProModules/FinancialPro';
import DestinationMatrix from './components/ProModules/DestinationMatrix';
import RunSheet from './components/ProModules/RunSheet';
import WebsiteManager from './components/PublicWebsite/WebsiteManager';
import GuestLandingPage from './components/PublicWebsite/GuestLandingPage';
import { HowToUse, SponsorUs, About, Contact, PrivacyPolicy, Terms } from './components/InfoPages';
import { Plan, EventType, WeddingPlan, Snapshot, RSVP } from './types';
import { storage } from './utils/storage';
import { authService } from './src/services/authService';
import { 
  Plus, 
  ArrowLeft, 
  ExternalLink, 
  Search, 
  Heart, 
  Cake, 
  Briefcase, 
  Star, 
  Music,
  LayoutGrid,
  Hotel,
  Plane,
  Zap,
  Download,
  X,
  Smartphone,
  Users,
  Store,
  Save,
  Check,
  Clock,
  Globe,
  Loader2
} from 'lucide-react';
import { CURRENCY } from './constants';

const EVENT_TYPE_ICONS: Record<EventType, React.ReactNode> = {
  [EventType.WEDDING]: <Heart size={12} />,
  [EventType.BIRTHDAY]: <Cake size={12} />,
  [EventType.CORPORATE]: <Briefcase size={12} />,
  [EventType.ANNIVERSARY]: <Star size={12} />,
  [EventType.PARTY]: <Music size={12} />,
};

type ViewMode = 'BUDGET' | 'GUESTS' | 'CHECKLIST' | 'TIMELINE' | 'SPLIT' | 'VENDORS' | 'SEATING' | 'LOGISTICS' | 'WARDROBE' | 'FINANCE' | 'DESTINATION' | 'RUNSHEET' | 'WEBSITE';
type AuthView = 'LANDING' | 'LOGIN' | 'SIGNUP';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('LANDING');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('home');
  const [viewMode, setViewMode] = useState<ViewMode>('BUDGET');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [isCreatingWedding, setIsCreatingWedding] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGuestView, setIsGuestView] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | EventType>('ALL');

  useEffect(() => {
    // Initialize Auth
    const initAuth = async () => {
      setIsAuthLoading(true);
      const { session } = await authService.getSession();
      
      if (session) {
        setIsLoggedIn(true);
        setPlans(storage.getPlans());
      } else {
        setIsLoggedIn(false);
      }
      setIsAuthLoading(false);
    };

    initAuth();

    // Listen for Auth Changes
    const subscription = authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true);
        setPlans(storage.getPlans());
        setAuthView('LANDING');
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setCurrentPlan(null);
        setAuthView('LANDING');
      }
    });

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const hasDismissed = sessionStorage.getItem('installBannerDismissed');
      if (!hasDismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    // Supabase auth state change listener will handle the state update
    setPlans(storage.getPlans());
    setActiveTab('home');
  };

  const handleLogout = async () => {
    await authService.signOut();
    // State will be updated by onAuthStateChange listener
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismissBanner = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem('installBannerDismissed', 'true');
  };

  const handleUpdatePlan = (updatedPlan: Plan) => {
    storage.updatePlan(updatedPlan);
    setPlans(storage.getPlans());
    setCurrentPlan(updatedPlan);
  };

  const handleRsvpSubmit = (rsvp: RSVP) => {
    if (!currentPlan) return;
    const updatedRsvps = [...(currentPlan.rsvps || []), rsvp];
    const updatedPlan = { ...currentPlan, rsvps: updatedRsvps };
    handleUpdatePlan(updatedPlan);
  };

  const createQuickSnapshot = () => {
    if (!currentPlan) return;
    setIsSaving(true);
    
    const base = currentPlan.categories.reduce((acc, cat) => acc + cat.items.reduce((i, item) => i + item.cost, 0), 0);
    const totalBudget = base * (1 + currentPlan.contingencyPercent / 100);
    
    const newSnapshot: Snapshot = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      label: `Quick Save - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      totalBudget: totalBudget,
      data: JSON.parse(JSON.stringify(currentPlan))
    };
    
    const updatedSnapshots = [newSnapshot, ...(currentPlan.snapshots || [])].slice(0, 10);
    handleUpdatePlan({ ...currentPlan, snapshots: updatedSnapshots });
    
    setTimeout(() => setIsSaving(false), 2000);
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

  // Guest View Rendering (Public Website)
  if (isGuestView && currentPlan) {
    return <GuestLandingPage plan={currentPlan} onRsvpSubmit={handleRsvpSubmit} onBack={() => setIsGuestView(false)} />;
  }

  // Auth Loading State
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
          <p className="text-slate-500 font-bold animate-pulse">Initializing Session...</p>
        </div>
      </div>
    );
  }

  // Auth Flow Rendering
  if (!isLoggedIn) {
    switch (authView) {
      case 'LOGIN':
        return <Login onLogin={handleLogin} onNavigateToSignUp={() => setAuthView('SIGNUP')} onBack={() => setAuthView('LANDING')} />;
      case 'SIGNUP':
        return <SignUp onSignUp={handleLogin} onNavigateToLogin={() => setAuthView('LOGIN')} onBack={() => setAuthView('LANDING')} />;
      default:
        return <LandingPage onLogin={() => setAuthView('LOGIN')} onSignUp={() => setAuthView('SIGNUP')} />;
    }
  }

  // Logged In Content
  let content;
  
  if (isCreatingWedding) {
    content = <WeddingWizard onComplete={handlePlanComplete} onCancel={() => setIsCreatingWedding(false)} />;
  } else if (isCreatingEvent) {
    content = <GeneralEventPlanner onComplete={handlePlanComplete} onCancel={() => setIsCreatingEvent(false)} />;
  } else if (currentPlan) {
    const isWedding = currentPlan.type === EventType.WEDDING;
    content = (
      <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print px-1 md:px-0">
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => setCurrentPlan(null)} className="p-2.5 hover:bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-all flex-shrink-0 bg-white md:bg-transparent shadow-sm md:shadow-none"><ArrowLeft size={20} /></button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 truncate">{currentPlan.name}</h1>
              <p className="text-[10px] md:text-sm text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">{EVENT_TYPE_ICONS[currentPlan.type]}{currentPlan.type} • {currentPlan.quality}</p>
            </div>
            <button 
              onClick={createQuickSnapshot} 
              className={`p-2.5 rounded-xl transition-all flex items-center gap-2 group ${isSaving ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-white border border-slate-100 text-slate-400 hover:border-indigo-600 hover:text-indigo-600 shadow-sm'}`}
              title="Quick Snapshot"
            >
              {isSaving ? <Check size={18} /> : <Save size={18} />}
              <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Snapshot</span>
            </button>
          </div>
          
          <div className="flex bg-white p-1 rounded-2xl border shadow-sm self-stretch md:self-auto overflow-x-auto no-scrollbar scroll-smooth">
            <ViewTab active={viewMode === 'BUDGET'} onClick={() => setViewMode('BUDGET')} icon={<LayoutGrid size={16} />} label="Budget" />
            <ViewTab active={viewMode === 'CHECKLIST'} onClick={() => setViewMode('CHECKLIST')} icon={<Check size={16} />} label="Checklist" />
            <ViewTab active={viewMode === 'TIMELINE'} onClick={() => setViewMode('TIMELINE')} icon={<Clock size={16} />} label="Timeline" />
            <ViewTab active={viewMode === 'RUNSHEET'} onClick={() => setViewMode('RUNSHEET')} icon={<Zap size={16} />} label="Run Sheet" />
            <ViewTab active={viewMode === 'DESTINATION'} onClick={() => setViewMode('DESTINATION')} icon={<Plane size={16} />} label="Destination" />
            <ViewTab active={viewMode === 'VENDORS'} onClick={() => setViewMode('VENDORS')} icon={<Store size={16} />} label="Vendors" />
            <ViewTab active={viewMode === 'LOGISTICS'} onClick={() => setViewMode('LOGISTICS')} icon={<Hotel size={16} />} label="Logistics" />
            <ViewTab active={viewMode === 'GUESTS'} onClick={() => setViewMode('GUESTS')} icon={<Users size={16} />} label="Guests" />
            <ViewTab active={viewMode === 'WEBSITE'} onClick={() => setViewMode('WEBSITE')} icon={<Globe size={16} />} label="Website" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8">
          {viewMode === 'BUDGET' && <Summary plan={currentPlan} onUpdate={handleUpdatePlan} />}
          {viewMode === 'CHECKLIST' && <Checklist plan={currentPlan} onUpdate={handleUpdatePlan} />}
          {viewMode === 'TIMELINE' && <Timeline plan={currentPlan} onUpdate={handleUpdatePlan} />}
          {viewMode === 'RUNSHEET' && <RunSheet plan={currentPlan} onUpdate={handleUpdatePlan} />}
          {viewMode === 'DESTINATION' && <DestinationMatrix plan={currentPlan} onUpdate={handleUpdatePlan} />}
          {viewMode === 'VENDORS' && <VendorManager plan={currentPlan} onUpdate={handleUpdatePlan} />}
          {viewMode === 'SEATING' && <SeatingMapper plan={currentPlan} onUpdate={handleUpdatePlan} />}
          {viewMode === 'LOGISTICS' && <LogisticsHub plan={currentPlan} onUpdate={handleUpdatePlan} />}
          {viewMode === 'WARDROBE' && isWedding && <WardrobeVault plan={currentPlan} onUpdate={handleUpdatePlan} />}
          {viewMode === 'FINANCE' && <FinancialPro plan={currentPlan} onUpdate={handleUpdatePlan} />}
          {viewMode === 'GUESTS' && <GuestIntelligence plan={currentPlan} onUpdate={handleUpdatePlan} />}
          {viewMode === 'WEBSITE' && <WebsiteManager plan={currentPlan} onUpdate={handleUpdatePlan} onViewLive={() => setIsGuestView(true)} />}
        </div>
      </div>
    );
  } else {
    // Dashboard / List View
    switch(activeTab) {
      case 'create': 
        // We can show a selection screen here or just default to one. 
        // For now, let's show a simple selection card UI
        content = (
          <div className="max-w-4xl mx-auto py-12 space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-slate-900">Start a New Project</h1>
              <p className="text-slate-500">Choose the type of event you want to plan</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button onClick={() => setIsCreatingWedding(true)} className="group bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-rose-100 transition-all text-left">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6 group-hover:scale-110 transition-transform">
                  <Heart size={32} fill="currentColor" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Wedding</h3>
                <p className="text-slate-500 text-sm">Complete wedding planner with rituals, wardrobe, and guest management.</p>
              </button>
              <button onClick={() => setIsCreatingEvent(true)} className="group bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all text-left">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                  <Briefcase size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">General Event</h3>
                <p className="text-slate-500 text-sm">Perfect for corporate events, birthdays, parties, and anniversaries.</p>
              </button>
            </div>
          </div>
        );
        break;
        
      case 'home':
      case 'list':
      default:
        content = (
          <div className="space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0 px-1 md:px-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div><h1 className="text-2xl md:text-3xl font-black text-slate-900">Dashboard</h1><p className="text-slate-500 text-sm md:text-base">Welcome back to your planning workspace</p></div>
              <div className="flex gap-2">
                <button onClick={() => setIsCreatingWedding(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all active:scale-95"><Plus size={16} /> Wedding</button>
                <button onClick={() => setIsCreatingEvent(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"><Plus size={16} /> Event</button>
              </div>
            </div>
            
            {/* Stats Overview (Mock) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Plans</p>
                 <p className="text-2xl font-black text-slate-900">{plans.length}</p>
               </div>
               <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Budget</p>
                 <p className="text-2xl font-black text-slate-900">{CURRENCY}{plans.reduce((acc, p) => acc + Math.round(p.guestCount * 2500), 0).toLocaleString('en-IN')}</p>
               </div>
               <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Tasks</p>
                 <p className="text-2xl font-black text-slate-900">12</p>
               </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="h-4 w-4 text-slate-400" /></div>
                <input type="text" className="block w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm transition-all font-medium" placeholder="Search your plans..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredPlans.map(plan => (
                <div key={plan.id} onClick={() => setCurrentPlan(plan)} className="group bg-white p-5 md:p-7 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest self-start ${plan.type === EventType.WEDDING ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>{EVENT_TYPE_ICONS[plan.type]}{plan.type}</div>
                  <h3 className="text-xl font-black text-slate-900 mt-5 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{plan.name}</h3>
                  <p className="text-xs text-slate-400 font-bold mb-6 uppercase tracking-wider">{plan.guestCount} Guests • {plan.city}</p>
                  <div className="mt-auto flex items-end justify-between">
                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Est. Budget</p><p className="text-xl font-black text-slate-900">{CURRENCY}{Math.round(plan.guestCount * 2500).toLocaleString('en-IN')}</p></div>
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm"><ExternalLink size={20} /></div>
                  </div>
                </div>
              ))}
              {filteredPlans.length === 0 && (
                <div className="col-span-full py-20 text-center space-y-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px]">
                   <p className="text-slate-400 font-bold">No matching plans found.</p>
                   <button onClick={() => setIsCreatingEvent(true)} className="text-indigo-600 font-bold hover:underline">Create your first plan</button>
                </div>
              )}
            </div>
          </div>
        );
        break;
      case 'how-to': content = <HowToUse />; break;
      case 'sponsor': content = <SponsorUs />; break;
      case 'about': content = <About />; break;
      case 'contact': content = <Contact />; break;
      case 'privacy': content = <PrivacyPolicy />; break;
      case 'terms': content = <Terms />; break;
    }
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {content}
      
      {/* PWA Install Banner */}
      {showInstallBanner && deferredPrompt && (
        <div className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-80 bg-slate-900 text-white p-5 rounded-[32px] shadow-2xl z-[100] animate-in slide-in-from-bottom-full duration-500 flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-900/50">
              <Smartphone size={24} />
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-0.5">Mobile Pro</p>
              <p className="text-sm font-bold text-slate-100 truncate">Install My Plan</p>
              <p className="text-[10px] text-slate-400">Add to home screen for offline use</p>
           </div>
           <div className="flex flex-col gap-2">
              <button onClick={handleDismissBanner} className="p-1.5 hover:bg-white/10 rounded-full transition-colors self-end"><X size={14}/></button>
              <button onClick={handleInstallClick} className="px-4 py-2 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-sm">Install</button>
           </div>
        </div>
      )}
    </Layout>
  );
};

const ViewTab: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>{icon}<span>{label}</span></button>
);

export default App;
