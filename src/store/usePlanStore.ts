import { create } from 'zustand';
import { Plan } from '../../types';
import { databaseService } from '../services/databaseService';

interface PlanState {
  plans: Plan[];
  currentPlan: Plan | null;
  setPlans: (plans: Plan[]) => void;
  setCurrentPlan: (plan: Plan | null) => void;
  updatePlan: (updates: Partial<Plan>) => void;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  plans: [],
  currentPlan: null,
  setPlans: (plans) => set({ plans }),
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  updatePlan: async (updates) => {
    const { currentPlan, plans } = get();
    if (!currentPlan) return;

    const updatedPlan = { ...currentPlan, ...updates };
    
    // Optimistic update
    set({
      currentPlan: updatedPlan,
      plans: plans.map(p => p.id === updatedPlan.id ? updatedPlan : p)
    });

    try {
      await databaseService.updateProject(updatedPlan);
    } catch (error) {
      console.error('Error updating plan:', error);
      // Revert on error could be implemented here
    }
  },
}));
