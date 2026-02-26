
import React, { useState } from 'react';
import { HelpCircle, Coffee, Mail, Info, Shield, Scale, CheckCircle2, Heart, ExternalLink, Calculator, Globe, Lock, Send } from 'lucide-react';

export const HowToUse: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-12 py-8 animate-in fade-in duration-500">
    <div className="text-center space-y-4">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold tracking-wide uppercase">
        <HelpCircle size={16} /> Guide
      </div>
      <h2 className="text-4xl font-black text-slate-900">How to Master Your Planning</h2>
      <p className="text-slate-500 max-w-2xl mx-auto">Follow these simple steps to go from overwhelmed to organized in minutes.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <StepCard step="01" title="Start a New Plan" description="Click 'New Planning' and choose between a Wedding or a General Event. Fill in the basics like city, guest count, and quality tier." />
      <StepCard step="02" title="Review Estimates" description="Our engine automatically generates a budget based on market rates for your chosen city and tier. Customize any item by clicking 'Manage Items'." />
      <StepCard step="03" title="Sync Guest Data" description="Use 'Guest Intelligence' to categorize your list. This automatically updates your catering plates and seating requirements across the app." />
      <StepCard step="04" title="Manage Vendors" description="The 'Vendors' tab provides specialized checklists for each category. Track payments, contracts, and set up warnings for budget overruns." />
      <StepCard step="05" title="Build Your Timeline" description="Schedule your day hour-by-hour. Mark key moments and sync them directly to your main planning checklist." />
      <StepCard step="06" title="Export & Share" description="Once your plan is ready, export it as a professional PDF or CSV to share with your family or vendors." />
    </div>

    <div className="bg-indigo-600 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">Who can use this tool?</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-3"><CheckCircle2 className="text-indigo-300" size={20} /> Couples planning their own wedding</li>
          <li className="flex items-center gap-3"><CheckCircle2 className="text-indigo-300" size={20} /> Professional event managers</li>
          <li className="flex items-center gap-3"><CheckCircle2 className="text-indigo-300" size={20} /> Families tracking shared expenses</li>
          <li className="flex items-center gap-3"><CheckCircle2 className="text-indigo-300" size={20} /> Corporate event coordinators</li>
        </ul>
      </div>
      <div className="p-8 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20">
        <Calculator size={64} className="opacity-50" />
      </div>
    </div>
  </div>
);

export const SponsorUs: React.FC = () => (
  <div className="max-w-2xl mx-auto py-12 text-center space-y-10 animate-in fade-in duration-500">
    <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-rose-100">
      <Coffee size={40} />
    </div>
    <div className="space-y-4">
      <h2 className="text-4xl font-black text-slate-900">Support Free Tools</h2>
      <p className="text-slate-500 text-lg leading-relaxed">
        We build free, privacy-focused tools to help the community. Your support helps us keep the servers running and the coffee flowing!
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6">
      <a href="https://paypal.me/patelsrushti" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Heart size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Buy Me a Coffee</h3>
            <p className="text-sm text-slate-400">Direct contribution via PayPal</p>
          </div>
        </div>
        <ExternalLink size={20} className="text-slate-300 group-hover:text-indigo-600" />
      </a>

      <div className="p-8 bg-slate-900 rounded-[40px] text-white space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Become a Sponsor</h3>
          <p className="text-slate-400">Interested in advertising or a bulk partnership? Drop us a line.</p>
        </div>
        <a href="mailto:sponsor@localtools.in" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/40">
          <Mail size={18} /> sponsor@localtools.in
        </a>
      </div>
    </div>
  </div>
);

export const About: React.FC = () => (
  <div className="max-w-3xl mx-auto py-12 space-y-12 animate-in fade-in duration-500">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-6">
        <Globe size={32} />
      </div>
      <h2 className="text-4xl font-black text-slate-900">Part of localtools.in</h2>
      <p className="text-slate-500 text-lg">EventWise Planner Pro is an open-source initiative dedicated to simplifying complex event logistics.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AboutCard title="Privacy First" icon={<Lock size={20} />} description="No accounts, no trackers. Your data never leaves your browser's local storage." />
      <AboutCard title="Production Ready" icon={<Calculator size={20} />} description="Built with professional-grade math engines and industry-standard cost tiers." />
      <AboutCard title="Fully Offline" icon={<Shield size={20} />} description="Works everywhere. No internet connection needed after the first load." />
      <AboutCard title="Always Free" icon={<Heart size={20} />} description="Our core tools will always remain free for individuals and couples." />
    </div>

    <div className="p-8 border border-dashed border-slate-200 rounded-[32px] text-center">
      <p className="text-slate-400 text-sm">Version 1.2.0 • Build 2024.11</p>
    </div>
  </div>
);

export const Contact: React.FC = () => {
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call to backend support system
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setContactForm({ subject: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto py-20 text-center space-y-8 animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[40px] flex items-center justify-center mx-auto mb-8">
        <Mail size={48} />
      </div>
      <h2 className="text-4xl font-black text-slate-900">Get in Touch</h2>
      <p className="text-slate-500 text-lg leading-relaxed mb-6">
        Report a bug, ask a billing question, or just say hi. We usually respond within 24 hours.
      </p>
      
      <div className="text-left bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        {submitSuccess ? (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3">
            <CheckCircle2 size={20} />
            <p className="font-medium">Message sent successfully! Our support team will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
              <select 
                required
                value={contactForm.subject}
                onChange={e => setContactForm({...contactForm, subject: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Select a topic...</option>
                <option value="Bug Report">Report a Bug</option>
                <option value="Billing Question">Billing Question</option>
                <option value="General Help">General Help</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
              <textarea 
                required
                rows={5}
                value={contactForm.message}
                onChange={e => setContactForm({...contactForm, message: e.target.value})}
                placeholder="Please describe your issue in detail..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-70"
            >
              <Send size={18} /> Send Message
            </button>
            <p className="text-xs text-slate-400 mt-4 text-center">
              Or email us directly at <a href="mailto:support-eventwise@localtools.in" className="text-indigo-600 hover:underline">support-eventwise@localtools.in</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export const PrivacyPolicy: React.FC = () => (
  <div className="max-w-4xl mx-auto py-12 space-y-10 animate-in fade-in duration-500">
    <h2 className="text-4xl font-black text-slate-900">Privacy Policy</h2>
    <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
      <p className="text-xl font-bold text-slate-800">Your data is yours. Period.</p>
      <p>
        EventWise Planner Pro (and its parent platform localtools.in) is built on a "Privacy-by-Design" architecture. We prioritize the security and privacy of your event data.
      </p>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">1. Data Collection & Storage</h3>
        <p>We collect and store your account information (email) and event planning data securely using Supabase, our backend provider. This allows you to access your plans across multiple devices. We do not use tracking cookies or third-party analytics scripts that track your browsing behavior across other sites.</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">2. Payment Processing</h3>
        <p>If you choose to upgrade to a paid plan, your payment information is processed securely by Razorpay. We do not store your credit card details or sensitive payment information on our servers.</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">3. Third Party Links</h3>
        <p>Our app provides links to external sites (like payment gateways). These sites have their own privacy policies which you should review.</p>
      </div>
    </div>
  </div>
);

export const Terms: React.FC = () => (
  <div className="max-w-4xl mx-auto py-12 space-y-10 animate-in fade-in duration-500">
    <h2 className="text-4xl font-black text-slate-900">Terms of Use</h2>
    <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
      <p>By using EventWise Planner Pro, you agree to the following simple terms:</p>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">1. "As-Is" Service</h3>
        <p>This tool is provided for estimation and organizational purposes only. While we strive for accuracy, actual costs from vendors may vary based on market conditions, negotiations, and seasonal demand. We are not responsible for any financial decisions made based on this tool.</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">2. Account & Usage</h3>
        <p>You are responsible for maintaining the security of your account. The tool offers a free tier for personal use, and premium features are available via paid upgrades. Commercial redistribution of the underlying code or logic without attribution to localtools.in is prohibited.</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">3. No Warranty</h3>
        <p>We do not guarantee that the service will be available 100% of the time. We are not responsible for data loss due to unforeseen technical issues or hardware failure.</p>
      </div>
    </div>
  </div>
);

const StepCard = ({ step, title, description }: any) => (
  <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-3 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 text-slate-50 font-black text-6xl select-none group-hover:text-indigo-50 transition-colors">{step}</div>
    <h4 className="font-bold text-slate-900 relative z-10">{title}</h4>
    <p className="text-sm text-slate-500 leading-relaxed relative z-10">{description}</p>
  </div>
);

const AboutCard = ({ title, icon, description }: any) => (
  <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-start gap-4">
    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  </div>
);
