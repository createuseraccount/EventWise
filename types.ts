
export enum EventType {
  WEDDING = 'WEDDING',
  BIRTHDAY = 'BIRTHDAY',
  CORPORATE = 'CORPORATE',
  ANNIVERSARY = 'ANNIVERSARY',
  PARTY = 'PARTY'
}

export enum Tier {
  METRO = 'METRO',
  TIER2 = 'TIER2',
  TIER3 = 'TIER3'
}

export enum Quality {
  BUDGET = 'BUDGET',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  LUXURY = 'LUXURY'
}

export enum BudgetSide {
  BRIDE = 'BRIDE',
  GROOM = 'GROOM',
  SHARED = 'SHARED'
}

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
}

export interface TimelineItem {
  id: string;
  time: string;
  activity: string;
  notes?: string;
  isImportant?: boolean;
  syncedTaskId?: string;
}

export interface GuestStats {
  family: number;
  friends: number;
  office: number;
  vip: number;
}

export interface GiftConfig {
  familyPerGift: number;
  friendsPerGift: number;
  officePerGift: number;
  vipPerGift: number;
}

export interface BudgetItem {
  id: string;
  label: string;
  cost: number;
  description?: string;
  side?: BudgetSide;
}

export interface BudgetCategory {
  name: string;
  items: BudgetItem[];
}

export type VendorPhase = 'Planning' | 'Confirmation' | 'Finalization' | 'Event Day';

export interface VendorChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  phase: VendorPhase;
}

export interface Vendor {
  id: string;
  category: string;
  name: string;
  contact: string;
  budgetedAmount: number;
  actualPaid: number;
  checklist: VendorChecklistItem[];
  notes: string;
  lastGuestCountAtSync?: number; // For tracking guest count changes
}

export interface BasePlan {
  id: string;
  name: string;
  type: EventType;
  city: string;
  guestCount: number;
  tier: Tier;
  quality: Quality;
  createdAt: number;
  checklist: ChecklistItem[];
  timeline: TimelineItem[];
  guestStats: GuestStats;
  giftConfig: GiftConfig;
  contingencyPercent: number;
  vendors: Vendor[];
}

export interface WeddingPlan extends BasePlan {
  days: number;
  functions: string[];
  cateringCostPerPlate: number;
  categories: BudgetCategory[];
  sideSplitEnabled?: boolean;
}

export interface GeneralEventPlan extends BasePlan {
  durationHours: number;
  isOutdoor: boolean;
  categories: BudgetCategory[];
}

export type Plan = WeddingPlan | GeneralEventPlan;
