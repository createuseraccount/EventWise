import React, { useState } from 'react';
import { User, Bell, CreditCard, Shield, Download, Trash2, Globe, Moon, Sun, Monitor, CheckCircle2, Loader2, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'notifications' | 'billing' | 'data'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <User className="text-indigo-600" size={32} />
          Account Settings
        </h1>
        <p className="text-slate-500 mt-2">Manage your profile, preferences, and subscription.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-2">
          <TabButton 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
            icon={<User size={18} />} 
            label="Profile" 
          />
          <TabButton 
            active={activeTab === 'preferences'} 
            onClick={() => setActiveTab('preferences')} 
            icon={<Globe size={18} />} 
            label="Preferences" 
          />
          <TabButton 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')} 
            icon={<Bell size={18} />} 
            label="Notifications" 
          />
          <TabButton 
            active={activeTab === 'billing'} 
            onClick={() => setActiveTab('billing')} 
            icon={<CreditCard size={18} />} 
            label="Billing & Plan" 
          />
          <TabButton 
            active={activeTab === 'data'} 
            onClick={() => setActiveTab('data')} 
            icon={<Shield size={18} />} 
            label="Data & Privacy" 
          />
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm min-h-[500px]">
          
          {saveSuccess && (
            <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={20} />
              <p className="font-medium">Settings saved successfully!</p>
            </div>
          )}

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Information</h2>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-black shadow-inner">
                    MP
                  </div>
                  <div>
                    <button type="button" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
                      Change Avatar
                    </button>
                    <p className="text-xs text-slate-400 mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="John Doe"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue="john@example.com"
                      disabled
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-400 mt-1.5">Contact support to change your email.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-70 shadow-lg shadow-indigo-200"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Preferences */}
          {activeTab === 'preferences' && (
            <form onSubmit={handleSave} className="space-y-8 animate-in fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Regional Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Default Currency</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                      <option value="INR">₹ Indian Rupee (INR)</option>
                      <option value="USD">$ US Dollar (USD)</option>
                      <option value="EUR">€ Euro (EUR)</option>
                      <option value="GBP">£ British Pound (GBP)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Time Zone</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                      <option value="IST">(UTC+05:30) Indian Standard Time</option>
                      <option value="UTC">(UTC+00:00) Coordinated Universal Time</option>
                      <option value="EST">(UTC-05:00) Eastern Time</option>
                      <option value="PST">(UTC-08:00) Pacific Time</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Appearance</h2>
                <div className="grid grid-cols-3 gap-4 max-w-lg">
                  <button type="button" className="flex flex-col items-center gap-3 p-4 border-2 border-indigo-600 bg-indigo-50 rounded-2xl text-indigo-700">
                    <Sun size={24} />
                    <span className="font-bold text-sm">Light</span>
                  </button>
                  <button type="button" className="flex flex-col items-center gap-3 p-4 border-2 border-slate-200 bg-white rounded-2xl text-slate-500 hover:border-slate-300">
                    <Moon size={24} />
                    <span className="font-bold text-sm">Dark</span>
                  </button>
                  <button type="button" className="flex flex-col items-center gap-3 p-4 border-2 border-slate-200 bg-white rounded-2xl text-slate-500 hover:border-slate-300">
                    <Monitor size={24} />
                    <span className="font-bold text-sm">System</span>
                  </button>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-70 shadow-lg shadow-indigo-200"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Preferences
                </button>
              </div>
            </form>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleSave} className="space-y-8 animate-in fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Email Notifications</h2>
                <div className="space-y-4">
                  <ToggleRow 
                    title="New RSVPs" 
                    description="Get notified when a guest submits their RSVP on your public website." 
                    defaultChecked={true} 
                  />
                  <ToggleRow 
                    title="Budget Alerts" 
                    description="Receive an alert when you exceed 90% of your allocated budget for a category." 
                    defaultChecked={true} 
                  />
                  <ToggleRow 
                    title="Upcoming Tasks" 
                    description="Weekly digest of pending checklist items and vendor payments." 
                    defaultChecked={false} 
                  />
                  <ToggleRow 
                    title="Product Updates" 
                    description="News about new features, templates, and improvements to My Plan." 
                    defaultChecked={true} 
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-70 shadow-lg shadow-indigo-200"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Notifications
                </button>
              </div>
            </form>
          )}

          {/* Billing & Plan */}
          {activeTab === 'billing' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Current Plan</h2>
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-white/20">
                        <Star size={14} className="text-amber-400" /> Pro Plan
                      </div>
                      <h3 className="text-3xl font-black mb-1">₹4,999<span className="text-lg text-slate-400 font-medium">/year</span></h3>
                      <p className="text-slate-300 text-sm">Your next billing date is October 15, 2024.</p>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                        Manage Subscription
                      </button>
                      <button className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-colors">
                        View Invoices
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Payment Method</h2>
                <div className="flex items-center justify-between p-5 border border-slate-200 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-500 text-xs border border-slate-200">
                      VISA
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Visa ending in 4242</p>
                      <p className="text-sm text-slate-500">Expires 12/2025</p>
                    </div>
                  </div>
                  <button className="text-indigo-600 font-bold text-sm hover:underline">Edit</button>
                </div>
              </div>
            </div>
          )}

          {/* Data & Privacy */}
          {activeTab === 'data' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Export Your Data</h2>
                <p className="text-slate-500 text-sm mb-6">Download a copy of all your event plans, budgets, and guest lists in CSV or JSON format.</p>
                
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm">
                    <Download size={18} /> Export as CSV
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm">
                    <Download size={18} /> Export as JSON
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h2 className="text-xl font-bold text-rose-600 mb-4">Danger Zone</h2>
                <p className="text-slate-500 text-sm mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                
                <div className="p-5 border border-rose-200 bg-rose-50 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-rose-900">Delete Account</h3>
                    <p className="text-sm text-rose-700 mt-1">Permanently delete your account and all associated data.</p>
                  </div>
                  <button className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200 whitespace-nowrap">
                    <Trash2 size={18} /> Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
      active 
        ? 'bg-indigo-50 text-indigo-700' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    {icon} {label}
  </button>
);

const ToggleRow = ({ title, description, defaultChecked }: { title: string, description: string, defaultChecked: boolean }) => {
  const [checked, setChecked] = useState(defaultChecked);
  
  return (
    <div className="flex items-start justify-between p-4 border border-slate-100 rounded-2xl hover:border-indigo-100 transition-colors">
      <div className="pr-8">
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{description}</p>
      </div>
      <button 
        type="button"
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
};

// Simple Star icon for the Pro Plan badge
const Star = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export default Settings;
