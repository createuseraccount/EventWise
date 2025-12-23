
import React from 'react';
import { Home, PlusCircle, List, Calculator, Settings, Info } from 'lucide-react';

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

        <nav className="flex-1 px-4 space-y-1 py-2">
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

        <div className="p-4 border-t bg-slate-50">
          <div className="bg-indigo-600 rounded-xl p-4 text-white">
            <h3 className="text-sm font-semibold mb-1">Local Mode</h3>
            <p className="text-xs text-indigo-100 leading-relaxed">Your data stays on your device. Secure & Private.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 min-h-screen relative">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden no-print fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-3 flex justify-between items-center z-50 shadow-lg">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <Home size={20} />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button onClick={() => setActiveTab('create')} className={`flex flex-col items-center gap-1 ${activeTab === 'create' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <PlusCircle size={20} />
            <span className="text-[10px] font-medium">New</span>
          </button>
          <button onClick={() => setActiveTab('list')} className={`flex flex-col items-center gap-1 ${activeTab === 'list' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <List size={20} />
            <span className="text-[10px] font-medium">Plans</span>
          </button>
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-indigo-50 text-indigo-700 font-semibold' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <span className={`${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

export default Layout;
