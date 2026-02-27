import React, { useState } from 'react';
import { Plan, RSVP } from '../../types';
import { Calendar, MapPin, Clock, Users, CheckCircle2, XCircle, HelpCircle, ArrowLeft } from 'lucide-react';

interface GuestLandingPageProps {
  plan: Plan;
  onRsvpSubmit: (rsvp: RSVP) => void;
  onBack: () => void;
}

const GuestLandingPage: React.FC<GuestLandingPageProps> = ({ plan, onRsvpSubmit, onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState(1);
  const [status, setStatus] = useState<'ACCEPTED' | 'DECLINED' | 'MAYBE'>('ACCEPTED');
  const [dietary, setDietary] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rsvp: RSVP = {
      id: Date.now().toString(),
      name,
      email,
      guests,
      status,
      dietaryRestrictions: dietary,
      timestamp: Date.now()
    };
    onRsvpSubmit(rsvp);
    setSubmitted(true);
  };

  const config = plan.publicPageConfig || {
    isEnabled: true,
    slug: '',
    showTimeline: true,
    showLocation: true,
    allowRsvp: true
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
        <div className="font-black text-lg tracking-tight text-slate-900">{plan.name}</div>
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} /> Back to Planner
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] bg-slate-900 flex items-center justify-center overflow-hidden">
        {config.coverImage ? (
          <img src={config.coverImage} alt="Event Cover" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 opacity-90" />
        )}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-xs font-black uppercase tracking-widest mb-4">
            You're Invited
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
            {plan.name}
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-lg font-medium text-slate-200">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-indigo-400" />
              <span>{new Date(plan.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-600" />
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-indigo-400" />
              <span>{plan.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-24">
        {/* Welcome Message */}
        {config.customMessage && (
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">Welcome</h2>
            <p className="text-lg text-slate-600 leading-relaxed">{config.customMessage}</p>
          </div>
        )}

        {/* Timeline */}
        {config.showTimeline && plan.timeline.length > 0 && (
          <div className="space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">Event Schedule</h2>
              <p className="text-slate-500">A guide to the day's events</p>
            </div>
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 hidden md:block" />
              <div className="space-y-12">
                {plan.timeline.map((item, index) => (
                  <div key={item.id} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="flex-1 text-center md:text-left">
                      <div className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black uppercase tracking-widest mb-3">
                          {item.time}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{item.activity}</h3>
                        {item.notes && <p className="text-slate-500 text-sm">{item.notes}</p>}
                      </div>
                    </div>
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white border-4 border-indigo-50 shadow-sm text-indigo-600">
                      <Clock size={20} />
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Location */}
        {config.showLocation && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">Location</h2>
              <p className="text-slate-500">Getting to the venue</p>
            </div>
            
            {config.locationName || plan.vendors.find(v => v.category === 'Venue') ? (
              (() => {
                const venue = plan.vendors.find(v => v.category === 'Venue');
                const locationName = config.locationName || venue?.name || 'Venue Name';
                const mapLink = config.googleMapsLink || venue?.mapLink;
                const contact = config.contactNumber || venue?.contact;
                
                return (
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                      <h3 className="text-2xl font-bold text-slate-900">{locationName}</h3>
                      {venue?.address && !config.locationName && (
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">{venue.address}</p>
                      )}
                      
                      {contact && (
                        <p className="text-slate-600 font-medium">Contact: {contact}</p>
                      )}
                      
                      {mapLink && (
                        <a 
                          href={mapLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                        >
                          <MapPin size={18} /> Open in Google Maps
                        </a>
                      )}
                    </div>
                    
                    {mapLink ? (
                      <div className="w-full md:w-1/2 h-64 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative group">
                         {/* We can't embed real google maps without API key, so we show a placeholder that links out */}
                         <a href={mapLink} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-slate-100 group-hover:bg-slate-200 transition-colors">
                            <div className="text-center space-y-2">
                               <MapPin size={40} className="mx-auto text-indigo-500" />
                               <p className="font-bold text-slate-600">View on Map</p>
                            </div>
                         </a>
                      </div>
                    ) : (
                      <div className="w-full md:w-1/2 h-64 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400">
                        <MapPin size={32} />
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm h-96 flex items-center justify-center bg-slate-100">
                <div className="text-center space-y-4">
                  <MapPin size={48} className="mx-auto text-slate-300" />
                  <p className="text-slate-500 font-medium">Venue details coming soon</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RSVP Form */}
        {config.allowRsvp && (
          <div className="max-w-xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl shadow-indigo-900/5">
            <div className="text-center mb-10 space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">RSVP</h2>
              <p className="text-slate-500">Please let us know if you can make it</p>
            </div>

            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Thank You!</h3>
                <p className="text-slate-500">Your response has been recorded.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-indigo-600 font-bold hover:underline"
                >
                  Submit another response
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setStatus('ACCEPTED')}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${status === 'ACCEPTED' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                    >
                      <CheckCircle2 size={24} />
                      <span className="font-bold text-sm">Joyfully Accept</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('DECLINED')}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${status === 'DECLINED' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                    >
                      <XCircle size={24} />
                      <span className="font-bold text-sm">Regretfully Decline</span>
                    </button>
                  </div>
                  
                  {status === 'ACCEPTED' && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Number of Guests</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={guests} 
                          onChange={(e) => setGuests(parseInt(e.target.value))}
                          className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <span className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl font-black text-slate-900 border border-slate-200">
                          {guests}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  {status === 'ACCEPTED' && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Dietary Restrictions</label>
                      <textarea 
                        value={dietary}
                        onChange={(e) => setDietary(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all h-24 resize-none"
                        placeholder="Any allergies or special requests?"
                      />
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
                >
                  Send RSVP
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-12 border-t border-slate-200">
          <p className="text-slate-400 text-sm">Powered by <span className="font-serif font-bold text-slate-600">EventWise</span></p>
        </div>
      </div>
    </div>
  );
};

export default GuestLandingPage;
