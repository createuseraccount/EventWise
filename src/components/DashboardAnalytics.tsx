import React, { useMemo } from 'react';
import { Plan, RSVP, PaymentSchedule, ChecklistItem } from '../../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CURRENCY } from '../../constants';
import { CheckCircle, Clock, Users, IndianRupee, Calendar, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardAnalyticsProps {
  plans: Plan[];
}

const COLORS = ['#4f46e5', '#e11d48', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'];

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ plans }) => {
  const { totalBudget, totalSpent, pendingTasks, upcomingPayments, recentRsvps, chartData } = useMemo(() => {
    let budget = 0;
    let spent = 0;
    let tasks = 0;
    let payments: (PaymentSchedule & { planName: string })[] = [];
    let rsvps: (RSVP & { planName: string })[] = [];
    let chart: { name: string; value: number; color: string }[] = [];

    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    plans.forEach((plan, index) => {
      // Budget & Spent
      let planBudget = 0;
      plan.categories.forEach(cat => {
        cat.items.forEach(item => {
          planBudget += item.cost;
        });
      });
      budget += planBudget;

      let planSpent = 0;
      plan.vendors.forEach(vendor => {
        planSpent += vendor.actualPaid;
      });
      spent += planSpent;

      // Pending Tasks
      tasks += plan.checklist.filter(t => !t.completed).length;

      // Upcoming Payments
      if (plan.payments) {
        plan.payments.forEach(payment => {
          if (!payment.paid && payment.dueDate) {
            const dueDate = new Date(payment.dueDate);
            if (dueDate >= now && dueDate <= sevenDaysFromNow) {
              payments.push({ ...payment, planName: plan.name });
            }
          }
        });
      }

      // Recent RSVPs
      if (plan.rsvps) {
        plan.rsvps.forEach(rsvp => {
          rsvps.push({ ...rsvp, planName: plan.name });
        });
      }

      // Chart Data
      chart.push({
        name: plan.name,
        value: planBudget || Math.round(plan.guestCount * 2500), // Fallback if no budget set
        color: COLORS[index % COLORS.length]
      });
    });

    // Sort payments by due date
    payments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    // Sort RSVPs by timestamp descending
    rsvps.sort((a, b) => b.timestamp - a.timestamp);

    return {
      totalBudget: budget,
      totalSpent: spent,
      pendingTasks: tasks,
      upcomingPayments: payments.slice(0, 5),
      recentRsvps: rsvps.slice(0, 5),
      chartData: chart
    };
  }, [plans]);

  if (plans.length === 0) return null;

  const budgetProgress = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Plans</p>
            <p className="text-2xl font-black text-slate-900">{plans.length}</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <IndianRupee size={24} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Budget vs Spent</p>
            <div className="flex items-end justify-between mb-1">
              <p className="text-xl font-black text-slate-900">{CURRENCY}{totalSpent.toLocaleString('en-IN')}</p>
              <p className="text-xs font-bold text-slate-400">/ {CURRENCY}{totalBudget.toLocaleString('en-IN')}</p>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${budgetProgress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-full rounded-full ${budgetProgress > 90 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Tasks</p>
            <p className="text-2xl font-black text-slate-900">{pendingTasks}</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm lg:col-span-1"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-6">Budget Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${CURRENCY}${value.toLocaleString('en-IN')}`, 'Budget']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Upcoming Deadlines / Payments */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Upcoming Payments</h3>
            <span className="px-2.5 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-bold">Next 7 Days</span>
          </div>
          
          {upcomingPayments.length > 0 ? (
            <div className="space-y-4">
              {upcomingPayments.map(payment => (
                <div key={payment.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CreditCard size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{payment.vendorName}</p>
                    <p className="text-xs text-slate-500 truncate">{payment.planName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{CURRENCY}{payment.amount.toLocaleString('en-IN')}</p>
                    <p className="text-xs font-bold text-rose-500">{new Date(payment.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-3">
                <CheckCircle size={24} />
              </div>
              <p className="text-sm font-bold text-slate-900">All caught up!</p>
              <p className="text-xs text-slate-500 mt-1">No payments due in the next 7 days.</p>
            </div>
          )}
        </motion.div>

        {/* Recent RSVPs */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Recent RSVPs</h3>
            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold">Live</span>
          </div>
          
          {recentRsvps.length > 0 ? (
            <div className="space-y-4">
              {recentRsvps.map(rsvp => (
                <div key={rsvp.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    rsvp.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600' :
                    rsvp.status === 'DECLINED' ? 'bg-rose-50 text-rose-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    <Users size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{rsvp.name}</p>
                    <p className="text-xs text-slate-500 truncate">{rsvp.planName}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      rsvp.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                      rsvp.status === 'DECLINED' ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {rsvp.status}
                    </span>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">
                      {rsvp.guests} {rsvp.guests === 1 ? 'Guest' : 'Guests'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-3">
                <Users size={24} />
              </div>
              <p className="text-sm font-bold text-slate-900">No RSVPs yet</p>
              <p className="text-xs text-slate-500 mt-1">Share your public website to get started.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
