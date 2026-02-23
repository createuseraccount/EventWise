import React from 'react';
import { Crown, X, ArrowRight } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureName: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade, featureName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="bg-gradient-to-br from-amber-100 to-orange-50 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-orange-200 mb-6 transform -rotate-6">
            <Crown size={32} className="text-white fill-white" />
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 mb-2">Unlock {featureName}</h2>
          <p className="text-slate-600 text-sm font-medium">
            Upgrade your plan to unlock advanced Pro tools and create more projects.
          </p>
        </div>

        <div className="p-8 bg-white">
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Check size={14} />
              </div>
              Up to 5 or Unlimited Projects
            </li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Check size={14} />
              </div>
              All Pro Modules (Seating, Logistics)
            </li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Check size={14} />
              </div>
              Beautiful PDF & CSV Exports
            </li>
          </ul>

          <button 
            onClick={onUpgrade}
            className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-xl font-black text-lg hover:bg-slate-800 transition-colors shadow-xl shadow-slate-200"
          >
            View Upgrade Options <ArrowRight size={20} />
          </button>
          
          <button 
            onClick={onClose}
            className="w-full mt-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

const Check = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default UpgradeModal;
