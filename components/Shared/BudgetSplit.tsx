
import React from 'react';
import { Plan, WeddingPlan, BudgetSide } from '../../types';
import { CURRENCY } from '../../constants';
import { Users, Heart, User, TrendingUp, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface BudgetSplitProps {
  plan: WeddingPlan;
  onUpdate: (updatedPlan: Plan) => void;
}

const BudgetSplit: React.FC<BudgetSplitProps> = ({ plan }) => {
  const getSideTotal = (side: BudgetSide) => {
    let total = 0;
    plan.categories.forEach(cat => {
      cat.items.forEach(item => {
        if (item.side === side) {
          total += item.cost;
        }
      });
    });
    return total;
  };

  const brideSpecific = getSideTotal(BudgetSide.BRIDE);
  const groomSpecific = getSideTotal(BudgetSide.GROOM);
  const sharedTotal = getSideTotal(BudgetSide.SHARED);
  
  // Contingency proportional application
  const totalBase = brideSpecific + groomSpecific + sharedTotal;
  const contingencyFactor = 1 + (plan.contingencyPercent / 100);
  
  const brideFinal = (brideSpecific + (sharedTotal / 2)) * contingencyFactor;
  const groomFinal = (groomSpecific + (sharedTotal / 2)) * contingencyFactor;
  const grandTotal = totalBase * contingencyFactor;

  const bridePercent = grandTotal > 0 ? (brideFinal / grandTotal) * 100 : 50;
  const groomPercent = 100 - bridePercent;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="bg-white p-8 rounded-3xl border shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold">Bride vs Groom Split</h3>
            <p className="text-sm text-slate-500 italic">Allocation based on itemized assignments + 50% shared expenses</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Visual Split Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3">
            <span className="text-rose-500">Bride Side ({bridePercent.toFixed(1)}%)</span>
            <span className="text-indigo-600">Groom Side ({groomPercent.toFixed(1)}%)</span>
          </div>
          <div className="h-6 w-full bg-slate-100 rounded-full flex overflow-hidden shadow-inner border border-slate-200">
            <div 
              style={{ width: `${bridePercent}%` }} 
              className="h-full bg-rose-400 transition-all duration-1000 ease-out relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <div 
              style={{ width: `${groomPercent}%` }} 
              className="h-full bg-indigo-500 transition-all duration-1000 ease-out relative"
            >
              <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bride Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-rose-50/30 p-6 rounded-3xl border border-rose-100 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500 text-white rounded-xl">
                <Heart size={20} />
              </div>
              <h4 className="text-lg font-black text-rose-900">Bride's Estimated Share</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-rose-700/70">
                <span>Specific Expenses</span>
                <span className="font-bold">{CURRENCY}{brideSpecific.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-rose-700/70">
                <span>50% Shared Costs</span>
                <span className="font-bold">{CURRENCY}{(sharedTotal / 2).toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-4 border-t border-rose-100 flex justify-between items-end">
                <span className="text-xs font-bold text-rose-400 uppercase">Grand Total (Incl. Buffer)</span>
                <span className="text-3xl font-black text-rose-600">{CURRENCY}{Math.round(brideFinal).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </motion.div>

          {/* Groom Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-indigo-50/30 p-6 rounded-3xl border border-indigo-100 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 text-white rounded-xl">
                <User size={20} />
              </div>
              <h4 className="text-lg font-black text-indigo-900">Groom's Estimated Share</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-indigo-700/70">
                <span>Specific Expenses</span>
                <span className="font-bold">{CURRENCY}{groomSpecific.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-indigo-700/70">
                <span>50% Shared Costs</span>
                <span className="font-bold">{CURRENCY}{(sharedTotal / 2).toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-4 border-t border-indigo-100 flex justify-between items-end">
                <span className="text-xs font-bold text-indigo-400 uppercase">Grand Total (Incl. Buffer)</span>
                <span className="text-3xl font-black text-indigo-600">{CURRENCY}{Math.round(groomFinal).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="p-6 bg-slate-100 rounded-2xl border border-slate-200"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl text-slate-600 shadow-sm">
            <Info size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">How this works</h4>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              In the <strong>Budget</strong> tab, you can now assign each expense to a specific side or keep it as shared. 
              Costs marked as "Shared" are automatically split 50/50 between both parties in this summary.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BudgetSplit;
