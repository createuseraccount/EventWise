
import { Plan } from '../types';

const STORAGE_KEY = 'eventwise_plans_v1';

export const storage = {
  getPlans: (): Plan[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  savePlans: (plans: Plan[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  },
  addPlan: (plan: Plan): void => {
    const plans = storage.getPlans();
    storage.savePlans([...plans, plan]);
  },
  updatePlan: (updatedPlan: Plan): void => {
    const plans = storage.getPlans();
    storage.savePlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  },
  deletePlan: (id: string): void => {
    const plans = storage.getPlans();
    storage.savePlans(plans.filter(p => p.id !== id));
  }
};
