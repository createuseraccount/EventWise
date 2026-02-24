import React, { useState } from 'react';
import { Plan, PublicPageConfig, RSVP } from '../../types';
import { Globe, Eye, Copy, CheckCircle2, Settings, Image as ImageIcon, MapPin, Calendar, Clock, Users, ExternalLink, Share2 } from 'lucide-react';

interface WebsiteManagerProps {
  plan: Plan;
  onUpdate: (updatedPlan: Plan) => void;
  onViewLive: () => void;
}

const WebsiteManager: React.FC<WebsiteManagerProps> = ({ plan, onUpdate, onViewLive }) => {
  const [activeTab, setActiveTab] = useState<'SETTINGS' | 'RSVPS'>('SETTINGS');
  const [copied, setCopied] = useState(false);

  const config = plan.publicPageConfig || {
    isEnabled: false,
    slug: plan.id,
    showTimeline: true,
    showLocation: true,
    allowRsvp: true,
    customMessage: `We can't wait to celebrate with you!`
  };

  const updateConfig = (updates: Partial<PublicPageConfig>) => {
    onUpdate({
      ...plan,
      publicPageConfig: { ...config, ...updates }
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://myplan.app/e/${config.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rsvps = plan.rsvps || [];
  const acceptedCount = rsvps.filter(r => r.status === 'ACCEPTED').reduce((acc, r) => acc + r.guests, 0);
  const declinedCount = rsvps.filter(r => r.status === 'DECLINED').length;
  const pendingCount = rsvps.filter(r => r.status === 'MAYBE').length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Card */}
      <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${config.isEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
            <Globe size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Event Website</h2>
            <p className="text-slate-500 font-medium text-sm">Manage your public landing page and RSVPs</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
            <button 
              onClick={() => updateConfig({ isEnabled: !config.isEnabled })}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${config.isEnabled ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {config.isEnabled ? 'Published' : 'Draft'}
            </button>
          </div>
          <button 
            onClick={onViewLive}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <Eye size={18} /> <span className="hidden md:inline">View Live Site</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column: Navigation & Stats */}
        <div className="space-y-6">
          <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab('SETTINGS')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'SETTINGS' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Settings size={18} /> Settings
            </button>
            <button 
              onClick={() => setActiveTab('RSVPS')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'RSVPS' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Users size={18} /> RSVPs <span className="ml-auto bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">{rsvps.length}</span>
            </button>
          </div>

          {/* RSVP Summary Card */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900">Response Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">Accepted</p>
                <p className="text-3xl font-black text-emerald-700">{acceptedCount}</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <p className="text-xs font-black uppercase tracking-widest text-rose-400 mb-1">Declined</p>
                <p className="text-3xl font-black text-rose-700">{declinedCount}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 col-span-2">
                <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1">Pending / Maybe</p>
                <p className="text-3xl font-black text-amber-700">{pendingCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'SETTINGS' ? (
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8 animate-in fade-in duration-300">
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900">Website Configuration</h3>
                
                {/* Share Link */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Public Link</p>
                    <p className="text-sm font-medium text-slate-700 truncate">https://myplan.app/e/{config.slug}</p>
                  </div>
                  <button 
                    onClick={handleCopyLink}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                    title="Copy Link"
                  >
                    {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                  </button>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Show Timeline</p>
                        <p className="text-xs text-slate-500">Display the event schedule to guests</p>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors relative ${config.showTimeline ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${config.showTimeline ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                    <input type="checkbox" className="hidden" checked={config.showTimeline} onChange={(e) => updateConfig({ showTimeline: e.target.checked })} />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Show Location Map</p>
                        <p className="text-xs text-slate-500">Display venue location and directions</p>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors relative ${config.showLocation ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${config.showLocation ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                    <input type="checkbox" className="hidden" checked={config.showLocation} onChange={(e) => updateConfig({ showLocation: e.target.checked })} />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Allow RSVPs</p>
                        <p className="text-xs text-slate-500">Enable guests to submit responses</p>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors relative ${config.allowRsvp ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${config.allowRsvp ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                    <input type="checkbox" className="hidden" checked={config.allowRsvp} onChange={(e) => updateConfig({ allowRsvp: e.target.checked })} />
                  </label>
                </div>

                {/* Location Details */}
                {config.showLocation && (
                  <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-slate-900">Location Details</h4>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Venue Name / Address</label>
                      <input 
                        type="text" 
                        value={config.locationName || ''}
                        onChange={(e) => updateConfig({ locationName: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-medium"
                        placeholder="e.g. The Grand Hotel, City Center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Google Maps Link</label>
                      <input 
                        type="url" 
                        value={config.googleMapsLink || ''}
                        onChange={(e) => updateConfig({ googleMapsLink: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-medium"
                        placeholder="https://maps.google.com/..."
                      />
                    </div>
                  </div>
                )}

                {/* Contact Details */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Contact Number</label>
                  <input 
                    type="tel" 
                    value={config.contactNumber || ''}
                    onChange={(e) => updateConfig({ contactNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    placeholder="Phone number for guest queries"
                  />
                </div>

                {/* Custom Message */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Welcome Message</label>
                  <textarea 
                    value={config.customMessage || ''}
                    onChange={(e) => updateConfig({ customMessage: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all h-32 resize-none"
                    placeholder="Write a welcome message for your guests..."
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Guest Responses</h3>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  <ExternalLink size={14} /> Export CSV
                </button>
              </div>

              {rsvps.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <Users size={40} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium">No RSVPs received yet.</p>
                  <p className="text-xs text-slate-400">Share your website link to start collecting responses.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rsvps.map((rsvp) => (
                    <div key={rsvp.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-900">{rsvp.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                            rsvp.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                            rsvp.status === 'DECLINED' ? 'bg-rose-100 text-rose-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {rsvp.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          {rsvp.email} • {rsvp.guests} Guest{rsvp.guests > 1 ? 's' : ''}
                        </p>
                        {rsvp.dietaryRestrictions && (
                          <div className="mt-2 text-xs bg-white p-2 rounded-lg border border-slate-200 inline-block text-slate-600">
                            <span className="font-bold">Dietary:</span> {rsvp.dietaryRestrictions}
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {new Date(rsvp.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteManager;
