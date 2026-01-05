
import React from 'react';
import { Home, PlusCircle, List, Calculator, Coffee, HelpCircle, Mail, Info, Shield, Scale } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50 no-print">
        <div className="flex items-center gap-2" onClick={() => setActiveTab('home')}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
          <span className="font-bold text-lg">EventWise</span>
        </div>
        <button onClick={() => setActiveTab('how-to')} className="p-2 text-slate-400 hover:text-indigo-600">
          <HelpCircle size={20} />
        </button>
      </header>

      {/* Sidebar */}
      <aside className="no-print w-full md:w-64 bg-white border-r md:h-screen sticky top-0 flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Calculator size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">EventWise</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Planner Pro</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Main Menu</p>
            <NavItem 
              icon={<Home size={20} />} 
              label="Dashboard" 
              active={activeTab === 'home'} 
              onClick={() => setActiveTab('home')} 
            />
            <NavItem 
              icon={<PlusCircle size={20} />} 
              label="New Planning" 
              active={activeTab === 'create'} 
              onClick={() => setActiveTab('create')} 
            />
            <NavItem 
              icon={<List size={20} />} 
              label="My Plans" 
              active={activeTab === 'list'} 
              onClick={() => setActiveTab('list')} 
            />
          </nav>

          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Resources</p>
            <NavItem 
              icon={<HelpCircle size={18} />} 
              label="How to Use" 
              active={activeTab === 'how-to'} 
              onClick={() => setActiveTab('how-to')} 
            />
            <NavItem 
              icon={<Coffee size={18} />} 
              label="Sponsor Us" 
              active={activeTab === 'sponsor'} 
              onClick={() => setActiveTab('sponsor')} 
            />
            <NavItem 
              icon={<Info size={18} />} 
              label="About" 
              active={activeTab === 'about'} 
              onClick={() => setActiveTab('about')} 
            />
            <NavItem 
              icon={<Mail size={18} />} 
              label="Contact" 
              active={activeTab === 'contact'} 
              onClick={() => setActiveTab('contact')} 
            />
          </nav>

          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Legal</p>
            <NavItem 
              icon={<Shield size={16} />} 
              label="Privacy Policy" 
              active={activeTab === 'privacy'} 
              onClick={() => setActiveTab('privacy')} 
            />
            <NavItem 
              icon={<Scale size={16} />} 
              label="Terms" 
              active={activeTab === 'terms'} 
              onClick={() => setActiveTab('terms')} 
            />
          </nav>
        </div>

        <div className="p-4 border-t bg-slate-50">
          <div className="bg-white rounded-xl p-3 border border-slate-200 text-slate-600 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest">Part of</p>
            <p className="text-sm font-black text-indigo-600">localtools.in</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 min-h-screen relative">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden no-print fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex justify-around items-center z-50 shadow-lg">
          <MobileNavItem active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={20} />} label="Home" />
          <MobileNavItem active={activeTab === 'create'} onClick={() => setActiveTab('create')} icon={<PlusCircle size={20} />} label="New" />
          <MobileNavItem active={activeTab === 'list'} onClick={() => setActiveTab('list')} icon={<List size={20} />} label="Plans" />
          <MobileNavItem active={activeTab === 'sponsor'} onClick={() => setActiveTab('sponsor')} icon={<Coffee size={20} />} label="Support" />
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-indigo-50 text-indigo-700 font-semibold' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <span className={`${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

const MobileNavItem = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

export default Layout;
