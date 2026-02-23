
import React from 'react';
import { CheckCircle, Zap, Shield, Layout, ArrowRight, Star, Menu, X, Clock, Globe, Users, Store, Plane, Check } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignUp }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">MP</div>
              <span className="font-bold text-xl tracking-tight">My Plan</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Testimonials</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a>
              <button onClick={onLogin} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Log in</button>
              <button onClick={onSignUp} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                Sign up free
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-4 py-4 space-y-4 animate-in slide-in-from-top-5">
            <a href="#features" className="block text-sm font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#testimonials" className="block text-sm font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>Testimonials</a>
            <button onClick={() => { onLogin(); setIsMenuOpen(false); }} className="block w-full text-left text-sm font-medium text-slate-600">Log in</button>
            <button onClick={() => { onSignUp(); setIsMenuOpen(false); }} className="block w-full px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium text-center">Sign up free</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-6 border border-indigo-100">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
          v2.0 Now Available
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          Master your events <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">without the chaos.</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500 mb-10">
          The all-in-one workspace for professional event planning. Budgeting, checklists, and vendor management in one beautiful interface.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={onSignUp} className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
            Start Planning for Free <ArrowRight size={20} />
          </button>
          <button onClick={onLogin} className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all hover:-translate-y-1">
            View Demo
          </button>
        </div>
        
        <div className="mt-16 relative rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden bg-slate-50 max-w-5xl mx-auto group">
           <div className="absolute top-0 left-0 right-0 h-10 bg-white border-b border-slate-200 flex items-center px-4 gap-2 z-20">
             <div className="w-3 h-3 rounded-full bg-rose-400"></div>
             <div className="w-3 h-3 rounded-full bg-amber-400"></div>
             <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
             <div className="ml-4 flex-1 bg-slate-100 h-5 rounded-md max-w-xs"></div>
           </div>
           <div className="pt-14 pb-16 px-6 md:px-12 bg-slate-50/50 relative">
              {/* Bento Grid Representation of the actual app modules */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Top Row */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-44 flex flex-col justify-between hover:border-indigo-200 transition-colors">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600"><Zap size={20} /></div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Budgeting</p>
                    <p className="font-bold text-slate-900">Real-time Tracking</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-44 flex flex-col justify-between hover:border-indigo-200 transition-colors">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600"><CheckCircle size={20} /></div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Checklist</p>
                    <p className="font-bold text-slate-900">Smart Milestones</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-44 flex flex-col justify-between hover:border-indigo-200 transition-colors">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600"><Clock size={20} /></div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Timeline</p>
                    <p className="font-bold text-slate-900">Event Day Flow</p>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-72 md:col-span-2 flex flex-col justify-between hover:border-indigo-200 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100"><Globe size={24} /></div>
                    <div className="flex -space-x-2">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                          <img src={`https://picsum.photos/seed/${i+10}/32/32`} alt="avatar" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 mb-2">Public Event Website</h4>
                    <p className="text-slate-500 max-w-md">Automatically generate a read-only landing page for guests to view the schedule, location maps, and submit RSVPs directly into the system.</p>
                  </div>
                </div>
                <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800 h-72 flex flex-col justify-between hover:bg-slate-800 transition-colors">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-indigo-400"><Users size={24} /></div>
                  <div className="text-white">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Guest Intel</p>
                    <h4 className="text-xl font-bold mb-2">RSVP Manager</h4>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-3/4"></div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">75% Responses Received</p>
                  </div>
                </div>
              </div>
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent h-40 bottom-0 top-auto z-10"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-base text-indigo-600 font-black uppercase tracking-widest">The Platform</h2>
            <p className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Everything you need to succeed
            </p>
            <p className="mt-4 max-w-2xl text-lg text-slate-500 mx-auto font-medium">
              Powerful tools designed to help you organize, track, and execute perfect events from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Zap className="text-indigo-600" size={24} />}
              title="Budget Control"
              description="Real-time budget management with category breakdowns and expense forecasting."
            />
            <FeatureCard 
              icon={<CheckCircle className="text-indigo-600" size={24} />}
              title="Smart Checklist"
              description="Never miss a detail with automated checklists that adapt to your event type."
            />
            <FeatureCard 
              icon={<Clock className="text-indigo-600" size={24} />}
              title="Event Timeline"
              description="Detailed day-of schedule with key moments and real-time synchronization."
            />
            <FeatureCard 
              icon={<Globe className="text-indigo-600" size={24} />}
              title="Guest Website"
              description="Automatically generated landing pages for guest RSVPs and event info."
            />
            <FeatureCard 
              icon={<Users className="text-indigo-600" size={24} />}
              title="Guest Intel"
              description="Manage RSVPs, dietary requirements, and seating arrangements effortlessly."
            />
            <FeatureCard 
              icon={<Store className="text-indigo-600" size={24} />}
              title="Vendor Hub"
              description="Keep track of all your vendors, contracts, and payments in one centralized hub."
            />
            <FeatureCard 
              icon={<Plane className="text-indigo-600" size={24} />}
              title="Logistics Hub"
              description="Manage travel, accommodation, and transport for all your guests and VIPs."
            />
            <FeatureCard 
              icon={<Shield className="text-indigo-600" size={24} />}
              title="Secure Storage"
              description="Your data is encrypted and stored locally. We prioritize your privacy above all else."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-base text-indigo-600 font-black uppercase tracking-widest">Pricing</h2>
            <p className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Simple, transparent pricing
            </p>
            <p className="mt-4 max-w-2xl text-lg text-slate-500 mx-auto font-medium">
              Start for free, upgrade when you need more power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Free Starter</h3>
                <p className="text-slate-500 text-sm h-10">Perfect for small, simple events.</p>
                <div className="mt-6">
                  <span className="text-4xl font-black text-slate-900">₹0</span>
                  <span className="text-slate-500 font-medium">/forever</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <PricingFeature text="Up to 2 Active Projects" included />
                <PricingFeature text="Unlimited Guests" included />
                <PricingFeature text="Basic Budget & Checklist" included />
                <PricingFeature text="Advanced Pro Modules" included={false} />
              </ul>
              <button onClick={onSignUp} className="w-full py-3 px-6 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                Start Free
              </button>
            </div>

            {/* Event Pass */}
            <div className="bg-indigo-600 p-8 rounded-[32px] border border-indigo-500 shadow-2xl shadow-indigo-200 flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
              <div className="mb-8 text-white">
                <h3 className="text-xl font-bold mb-2">Event Pass</h3>
                <p className="text-indigo-200 text-sm h-10">Premium tools for a handful of events.</p>
                <div className="mt-6">
                  <span className="text-4xl font-black">₹99</span>
                  <span className="text-indigo-200 font-medium">/one-time</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-indigo-100">
                <PricingFeature text="Up to 5 Active Projects" included light />
                <PricingFeature text="Unlimited Guests" included light />
                <PricingFeature text="Seating Mapper 👑" included light />
                <PricingFeature text="PDF & CSV Exports 👑" included light />
              </ul>
              <button onClick={onSignUp} className="w-full py-3 px-6 bg-white text-indigo-600 rounded-xl font-black hover:bg-indigo-50 transition-colors shadow-lg">
                Get Event Pass
              </button>
            </div>

            {/* Pro Planner */}
            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  Pro Planner <Star size={16} className="text-amber-400 fill-amber-400" />
                </h3>
                <p className="text-slate-500 text-sm h-10">For professional planners.</p>
                <div className="mt-6">
                  <span className="text-4xl font-black text-slate-900">₹999</span>
                  <span className="text-slate-500 font-medium">/one-time</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <PricingFeature text="Unlimited Projects" included />
                <PricingFeature text="All Pro Modules 👑" included />
                <PricingFeature text="White-label Exports" included />
                <PricingFeature text="Priority Support" included />
              </ul>
              <button onClick={onSignUp} className="w-full py-3 px-6 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
                Get Pro Planner
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold text-xs">MP</div>
            <span className="font-bold text-slate-900">My Plan</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">Contact</a>
          </div>
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} My Plan Inc.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed">
      {description}
    </p>
  </div>
);

const PricingFeature = ({ text, included, light = false }: { text: string, included: boolean, light?: boolean }) => (
  <li className="flex items-start gap-3">
    {included ? (
      <Check size={20} className={`flex-shrink-0 ${light ? 'text-indigo-300' : 'text-emerald-500'}`} />
    ) : (
      <X size={20} className="flex-shrink-0 text-slate-300" />
    )}
    <span className={`text-sm font-medium ${!included ? 'text-slate-400 line-through' : ''}`}>
      {text}
    </span>
  </li>
);

export default LandingPage;

