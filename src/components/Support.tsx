import React, { useState } from 'react';
import { HelpCircle, BookOpen, MessageSquare, Lightbulb, Activity, ChevronRight, PlayCircle, Send, CheckCircle2 } from 'lucide-react';

const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'feedback' | 'status'>('faq');
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [feedbackForm, setFeedbackForm] = useState({ title: '', description: '' });
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

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call to feedback system
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFeedbackForm({ title: '', description: '' });
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <HelpCircle className="text-indigo-600" size={32} />
          Help & Support
        </h1>
        <p className="text-slate-500 mt-2">How can we help you plan your perfect event today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-2">
          <TabButton 
            active={activeTab === 'faq'} 
            onClick={() => setActiveTab('faq')} 
            icon={<BookOpen size={18} />} 
            label="Knowledge Base" 
          />
          <TabButton 
            active={activeTab === 'contact'} 
            onClick={() => setActiveTab('contact')} 
            icon={<MessageSquare size={18} />} 
            label="Contact Us" 
          />
          <TabButton 
            active={activeTab === 'feedback'} 
            onClick={() => setActiveTab('feedback')} 
            icon={<Lightbulb size={18} />} 
            label="Feature Requests" 
          />
          <TabButton 
            active={activeTab === 'status'} 
            onClick={() => setActiveTab('status')} 
            icon={<Activity size={18} />} 
            label="System Status" 
          />
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm min-h-[500px]">
          
          {/* Knowledge Base */}
          {activeTab === 'faq' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Guides</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <GuideCard title="Creating your first Event" desc="Learn the basics of setting up a new event project." />
                  <GuideCard title="Tracking your Budget" desc="How to track expenses and manage your vendor costs." />
                  <GuideCard title="Setting up your RSVP Site" desc="Create your public website and collect guest responses." />
                  <GuideCard title="Managing Vendors" desc="Keep track of payments, contracts, and contacts." />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Video Tutorials</h2>
                <div className="space-y-3">
                  <VideoLink title="How to use Event Pass Features" duration="3:45" />
                  <VideoLink title="Exporting PDF & CSV Reports" duration="2:30" />
                  <VideoLink title="Managing your Guest List" duration="4:15" />
                </div>
              </div>
            </div>
          )}

          {/* Contact & Ticketing */}
          {activeTab === 'contact' && (
            <div className="max-w-xl animate-in fade-in">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Send us a message</h2>
              <p className="text-slate-500 text-sm mb-6">Report a bug, ask a billing question, or just say hi. We usually respond within 24 hours.</p>
              
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
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-70"
                  >
                    <Send size={18} /> Send Message
                  </button>
                  <p className="text-xs text-slate-400 mt-4">
                    Or email us directly at <a href="mailto:support-eventwise@localtools.in" className="text-indigo-600 hover:underline">support-eventwise@localtools.in</a>
                  </p>
                </form>
              )}
            </div>
          )}

          {/* Feature Requests */}
          {activeTab === 'feedback' && (
            <div className="max-w-xl animate-in fade-in">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Suggest a Feature</h2>
              <p className="text-slate-500 text-sm mb-6">Have an idea to make the app better? We'd love to hear it!</p>
              
              {submitSuccess ? (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3">
                  <CheckCircle2 size={20} />
                  <p className="font-medium">Feature request submitted! Thank you for helping us improve EventWise.</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Feature Title</label>
                    <input 
                      required
                      type="text"
                      value={feedbackForm.title}
                      onChange={e => setFeedbackForm({...feedbackForm, title: e.target.value})}
                      placeholder="e.g., Add a weather widget"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                    <textarea 
                      required
                      rows={4}
                      value={feedbackForm.description}
                      onChange={e => setFeedbackForm({...feedbackForm, description: e.target.value})}
                      placeholder="How would this feature work? Why is it useful?"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-70"
                  >
                    <Lightbulb size={18} /> Submit Idea
                  </button>
                </form>
              )}

              <div className="mt-10 pt-8 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">Popular Requests</h3>
                <div className="space-y-3">
                  <IdeaCard title="Multi-user Collaboration" votes={124} />
                  <IdeaCard title="Seating Chart Builder" votes={89} />
                  <IdeaCard title="Mobile App (iOS/Android)" votes={56} />
                </div>
              </div>
            </div>
          )}

          {/* System Status */}
          {activeTab === 'status' && (
            <div className="animate-in fade-in">
              <h2 className="text-xl font-bold text-slate-900 mb-6">System Status</h2>
              
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-800">All Systems Operational</h3>
                  <p className="text-emerald-600 text-sm">Last checked: Just now</p>
                </div>
              </div>

              <div className="space-y-4">
                <StatusRow name="Web Application" status="operational" />
                <StatusRow name="Database & Storage" status="operational" />
                <StatusRow name="Authentication" status="operational" />
                <StatusRow name="Public Websites" status="operational" />
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

const GuideCard = ({ title, desc }: { title: string, desc: string }) => (
  <div className="p-4 border border-slate-100 rounded-2xl hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer group">
    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
      {title} <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400" />
    </h3>
    <p className="text-sm text-slate-500 mt-1">{desc}</p>
  </div>
);

const VideoLink = ({ title, duration }: { title: string, duration: string }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 cursor-pointer group transition-colors">
    <div className="flex items-center gap-3">
      <PlayCircle size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
      <span className="font-medium text-slate-700 group-hover:text-indigo-700">{title}</span>
    </div>
    <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md shadow-sm">{duration}</span>
  </div>
);

const IdeaCard = ({ title, votes }: { title: string, votes: number }) => (
  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
    <span className="font-medium text-slate-700">{title}</span>
    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-lg text-sm font-bold transition-colors">
      <ChevronRight size={14} className="-rotate-90" /> {votes}
    </button>
  </div>
);

const StatusRow = ({ name, status }: { name: string, status: 'operational' | 'degraded' | 'down' }) => (
  <div className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0">
    <span className="font-medium text-slate-700">{name}</span>
    {status === 'operational' && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Operational</span>}
    {status === 'degraded' && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Degraded</span>}
    {status === 'down' && <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">Outage</span>}
  </div>
);

export default Support;
