
import React from 'react';
import { HelpCircle, Coffee, Mail, Info, Shield, Scale, CheckCircle2, Heart, ExternalLink, Calculator, Globe, Lock } from 'lucide-react';

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

export const Contact: React.FC = () => (
  <div className="max-w-xl mx-auto py-20 text-center space-y-8 animate-in fade-in duration-500">
    <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[40px] flex items-center justify-center mx-auto mb-8">
      <Mail size={48} />
    </div>
    <h2 className="text-4xl font-black text-slate-900">Get in Touch</h2>
    <p className="text-slate-500 text-lg leading-relaxed">
      Have a feature request? Found a bug? Or just want to say hi? We'd love to hear from you.
    </p>
    <div className="pt-6">
      <a href="mailto:contact@localtools.in" className="text-3xl font-black text-indigo-600 hover:text-indigo-700 transition-colors underline decoration-indigo-200 underline-offset-8">
        contact@localtools.in
      </a>
    </div>
  </div>
);

export const PrivacyPolicy: React.FC = () => (
  <div className="max-w-4xl mx-auto py-12 space-y-10 animate-in fade-in duration-500">
    <h2 className="text-4xl font-black text-slate-900">Privacy Policy</h2>
    <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
      <p className="text-xl font-bold text-slate-800">Your data is yours. Period.</p>
      <p>
        EventWise Planner Pro (and its parent platform localtools.in) is built on a "Privacy-by-Design" architecture. We do not store any of your event data on our servers.
      </p>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">1. Data Collection</h3>
        <p>We do not collect personal information, email addresses, or phone numbers. We do not use tracking cookies or third-party analytics scripts that track your browsing behavior across other sites.</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">2. Local Storage</h3>
        <p>All plans, guest lists, and vendor information are stored exclusively in your browser's <code>LocalStorage</code>. This means the data never travels over the network to any server. If you clear your browser cache or use a different device, your data will not be available there unless you manually export and import it.</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">3. Third Party Links</h3>
        <p>Our app provides links to external sites (like PayPal). These sites have their own privacy policies which you should review.</p>
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
        <h3 className="text-lg font-bold text-slate-900">2. Personal Use</h3>
        <p>The tool is free for personal use. Commercial redistribution of the underlying code or logic without attribution to localtools.in is prohibited.</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">3. No Warranty</h3>
        <p>We do not guarantee that the service will be available 100% of the time. Since data is stored locally, we are not responsible for data loss due to browser resets or hardware failure.</p>
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
