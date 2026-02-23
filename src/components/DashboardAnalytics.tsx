import React, { useMemo } from 'react';
import { Plan } from '../../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CURRENCY } from '../../constants';

interface DashboardAnalyticsProps {
  plans: Plan[];
}

const COLORS = ['#4f46e5', '#e11d48', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'];

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ plans }) => {
  const chartData = useMemo(() => {
    if (plans.length === 0) return [];
    
    return plans.map((plan, index) => {
      const estimatedBudget = Math.round(plan.guestCount * 2500);
      return {
        name: plan.name,
        value: estimatedBudget,
        color: COLORS[index % COLORS.length]
      };
    });
  }, [plans]);

  if (plans.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm mt-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Budget Distribution Across Projects</h3>
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
              formatter={(value: number) => [`${CURRENCY}${value.toLocaleString('en-IN')}`, 'Estimated Budget']}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
