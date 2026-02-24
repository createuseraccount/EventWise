
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
  dueDate?: string;
}

export interface TimelineItem {
  id: string;
  time: string; // e.g., "10:30 AM"
  endTime?: string; // for conflict detection
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
  originalCost?: number;
  currency?: 'INR' | 'USD' | 'EUR' | 'AED';
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
  address?: string;
  mapLink?: string;
  budgetedAmount: number;
  actualPaid: number;
  checklist: VendorChecklistItem[];
  notes: string;
  lastGuestCountAtSync?: number;
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  assignedGuestIds: string[];
}

export interface Room {
  id: string;
  roomNo: string;
  guestNames: string;
  checkIn: string;
  checkOut: string;
  hotelName: string;
}

export interface Transport {
  id: string;
  time: string;
  guestNames: string;
  type: string;
  vehicle: string;
  contact: string;
}

export interface Flight {
  id: string;
  guestNames: string;
  flightNo: string;
  airline: string;
  arrivalTime: string;
  terminal: string;
  assignedPickupId?: string;
}

export interface Outfit {
  id: string;
  functionName: string;
  designer: string;
  cost: number;
  alterationDate: string;
  status: string;
  image?: string;
}

export interface Jewelry {
  id: string;
  name: string;
  status: 'SAFE' | 'WORN';
  notes: string;
}

export interface PaymentSchedule {
  id: string;
  vendorName: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  receiptImage?: string;
}

export interface GiftLog {
  id: string;
  from: string;
  item: string;
  type: 'CASH' | 'GIFT' | 'OTHER';
  value: number;
  thankYouSent: boolean;
  guestCategory: keyof GuestStats;
}

export interface Snapshot {
  id: string;
  timestamp: number;
  label: string;
  totalBudget: number;
  data: Plan; // Added full state capture for restoration
}

export interface RSVP {
  id: string;
  name: string;
  email: string;
  guests: number;
  status: 'ACCEPTED' | 'DECLINED' | 'MAYBE';
  dietaryRestrictions?: string;
  timestamp: number;
}

export interface PublicPageConfig {
  isEnabled: boolean;
  slug: string;
  coverImage?: string;
  themeColor?: string;
  showTimeline: boolean;
  showLocation: boolean;
  locationName?: string;
  googleMapsLink?: string;
  contactNumber?: string;
  allowRsvp: boolean;
  customMessage?: string;
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
  
  // Pro Fields
  tables?: Table[];
  rooms?: Room[];
  transports?: Transport[];
  flights?: Flight[];
  outfits?: Outfit[];
  jewelry?: Jewelry[];
  payments?: PaymentSchedule[];
  guestRsvps?: Record<string, 'YES' | 'NO' | 'MAYBE' | 'PENDING'>;
  gifts?: GiftLog[];
  snapshots?: Snapshot[];
  exchangeRates?: Record<string, number>;
  
  // Public Website
  publicPageConfig?: PublicPageConfig;
  rsvps?: RSVP[];
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
