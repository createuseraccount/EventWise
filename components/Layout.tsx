
import React from 'react';
import { Home, PlusCircle, List, Calculator, Coffee, HelpCircle, Mail, Info, Shield, Scale, LogOut, Settings, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50 no-print">
        <div className="flex items-center gap-2" onClick={() => setActiveTab('home')}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">EW</div>
          <span className="font-serif font-bold text-lg">EventWise</span>
        </div>
        <button onClick={onLogout} className="p-2 text-slate-400 hover:text-indigo-600">
          <LogOut size={20} />
        </button>
      </header>

      {/* Sidebar */}
      <aside className="no-print w-full md:w-64 bg-white border-r md:h-screen sticky top-0 flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Calculator size={24} />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg leading-tight">EventWise</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Pro Dashboard</p>
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
              label="New Project" 
              active={activeTab === 'create'} 
              onClick={() => setActiveTab('create')} 
            />
            <NavItem 
              icon={<List size={20} />} 
              label="All Plans" 
              active={activeTab === 'list'} 
              onClick={() => setActiveTab('list')} 
            />
          </nav>

          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Account</p>
            <NavItem 
              icon={<Crown size={18} />} 
              label="Upgrade to Pro" 
              active={activeTab === 'pricing'} 
              onClick={() => setActiveTab('pricing')} 
              highlight
            />
            <NavItem 
              icon={<Settings size={18} />} 
              label="Settings" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
            <NavItem 
              icon={<HelpCircle size={18} />} 
              label="Support" 
              active={activeTab === 'support'} 
              onClick={() => setActiveTab('support')} 
            />
          </nav>
        </div>

        <div className="p-4 border-t bg-slate-50">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-white hover:text-rose-600 hover:shadow-sm transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 min-h-screen relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto p-4 md:p-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Mobile Navigation */}
        <div className="md:hidden no-print fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex justify-around items-center z-50 shadow-lg safe-bottom">
          <MobileNavItem active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={20} />} label="Home" />
          <MobileNavItem active={activeTab === 'create'} onClick={() => setActiveTab('create')} icon={<PlusCircle size={20} />} label="New" />
          <MobileNavItem active={activeTab === 'list'} onClick={() => setActiveTab('list')} icon={<List size={20} />} label="Plans" />
          <MobileNavItem active={false} onClick={onLogout} icon={<LogOut size={20} />} label="Logout" />
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, highlight }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-indigo-50 text-indigo-700 font-semibold' 
        : highlight
          ? 'bg-gradient-to-r from-amber-100 to-orange-50 text-amber-900 hover:from-amber-200 hover:to-orange-100 font-bold shadow-sm border border-amber-200/50'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <span className={`${active ? 'text-indigo-600' : highlight ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</span>
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
  highlight?: boolean;
}

export default Layout;
