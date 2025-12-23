
import { Tier, Quality, TimelineItem, GuestStats, GiftConfig, BudgetSide, Vendor, VendorChecklistItem } from './types';

export const CURRENCY = '₹';

export const TIER_MULTIPLIERS: Record<Tier, number> = {
  [Tier.METRO]: 1.6,
  [Tier.TIER2]: 1.0,
  [Tier.TIER3]: 0.75
};

export const QUALITY_MULTIPLIERS: Record<Quality, number> = {
  [Quality.BUDGET]: 0.5,
  [Quality.STANDARD]: 1.0,
  [Quality.PREMIUM]: 3.0,
  [Quality.LUXURY]: 8.0
};

export const DEFAULT_GUEST_STATS: GuestStats = {
  family: 50,
  friends: 30,
  office: 15,
  vip: 5
};

export const DEFAULT_GIFT_CONFIG: GiftConfig = {
  familyPerGift: 500,
  friendsPerGift: 300,
  officePerGift: 250,
  vipPerGift: 1500
};

export const INDIAN_CITIES = [
  { name: 'Mumbai', tier: Tier.METRO },
  { name: 'Delhi NCR', tier: Tier.METRO },
  { name: 'Bangalore', tier: Tier.METRO },
  { name: 'Hyderabad', tier: Tier.METRO },
  { name: 'Chennai', tier: Tier.METRO },
  { name: 'Kolkata', tier: Tier.METRO },
  { name: 'Pune', tier: Tier.TIER2 },
  { name: 'Ahmedabad', tier: Tier.TIER2 },
  { name: 'Jaipur', tier: Tier.TIER2 },
  { name: 'Lucknow', tier: Tier.TIER2 },
  { name: 'Chandigarh', tier: Tier.TIER2 },
  { name: 'Indore', tier: Tier.TIER2 },
  { name: 'Goa', tier: Tier.TIER2 },
  { name: 'Other Tier 2', tier: Tier.TIER2 },
  { name: 'Other Tier 3 / Town', tier: Tier.TIER3 }
];

export const VENDOR_CATEGORIES = [
  'Venue',
  'Caterer',
  'Decorator',
  'Photographer',
  'Makeup Artist',
  'Entertainment',
  'Transport',
  'Invitations',
  'Accommodation',
  'Ritual',
  'Miscellaneous'
];

export const GET_DEFAULT_VENDOR_CHECKLIST = (category: string): VendorChecklistItem[] => {
  const commonPhases = {
    Planning: 'Planning',
    Confirmation: 'Confirmation',
    Finalization: 'Finalization',
    EventDay: 'Event Day'
  } as const;

  const checklists: Record<string, { task: string; phase: any }[]> = {
    'Caterer': [
      { task: 'Caterer shortlisted', phase: 'Planning' },
      { task: 'Menu type selected (Veg / Non-Veg / Both)', phase: 'Planning' },
      { task: 'Per-plate cost finalized', phase: 'Planning' },
      { task: 'Live counters finalized', phase: 'Planning' },
      { task: 'Menu tasting completed', phase: 'Confirmation' },
      { task: 'Final menu approved', phase: 'Confirmation' },
      { task: 'Advance payment done', phase: 'Confirmation' },
      { task: 'Final guest count shared', phase: 'Finalization' },
      { task: 'Serving time confirmed', phase: 'Finalization' },
      { task: 'Special meals noted (kids, Jain, allergy)', phase: 'Finalization' },
      { task: 'Setup completed', phase: 'Event Day' },
      { task: 'Food quality verified', phase: 'Event Day' },
      { task: 'Final payment cleared', phase: 'Event Day' },
    ],
    'Venue': [
      { task: 'Venue shortlisted', phase: 'Planning' },
      { task: 'Dates confirmed', phase: 'Planning' },
      { task: 'Capacity matches guest count', phase: 'Planning' },
      { task: 'Contract signed', phase: 'Confirmation' },
      { task: 'Parking confirmed', phase: 'Logistics' }, // Custom phase names can be mapped to closest standard if needed, but let's stick to user request phases
      { task: 'Power backup available', phase: 'Confirmation' },
      { task: 'Advance paid', phase: 'Confirmation' },
      { task: 'Decoration permission obtained', phase: 'Finalization' },
      { task: 'Sound permission obtained', phase: 'Finalization' },
      { task: 'Balance due noted', phase: 'Finalization' },
    ],
    'Decorator': [
      { task: 'Theme finalized', phase: 'Planning' },
      { task: 'Color palette approved', phase: 'Planning' },
      { task: 'Stage & mandap design approved', phase: 'Confirmation' },
      { task: 'Flower type finalized', phase: 'Confirmation' },
      { task: 'Lighting plan confirmed', phase: 'Finalization' },
      { task: 'Setup & dismantle responsibility agreed', phase: 'Finalization' },
    ],
    'Photographer': [
      { task: 'Photographer finalized', phase: 'Planning' },
      { task: 'Style selected (Traditional / Candid / Cinematic)', phase: 'Planning' },
      { task: 'Events coverage list shared', phase: 'Confirmation' },
      { task: 'Shot list prepared', phase: 'Finalization' },
      { task: 'Family photo list created', phase: 'Finalization' },
      { task: 'Raw photos timeline agreed', phase: 'Event Day' },
    ],
    'Makeup Artist': [
      { task: 'Artist finalized', phase: 'Planning' },
      { task: 'Package selected', phase: 'Planning' },
      { task: 'Trial session completed', phase: 'Confirmation' },
      { task: 'Makeup timing confirmed', phase: 'Finalization' },
      { task: 'Emergency kit prepared', phase: 'Event Day' },
    ]
  };

  const list = checklists[category] || [
    { task: `${category} shortlisted`, phase: 'Planning' },
    { task: 'Budget finalized', phase: 'Planning' },
    { task: 'Contract signed', phase: 'Confirmation' },
    { task: 'Advance paid', phase: 'Confirmation' },
    { task: 'Final briefing completed', phase: 'Finalization' },
    { task: 'On-site coordination', phase: 'Event Day' },
  ];

  return list.map(item => ({
    id: Math.random().toString(36).substr(2, 9),
    task: item.task,
    completed: false,
    phase: item.phase
  }));
};

export const DEFAULT_WEDDING_CHECKLIST = [
  'Finalize guest list',
  'Book venue',
  'Choose caterer',
  'Hire photographer',
  'Buy bridal & groom outfits',
  'Send invitations',
  'Book makeup artist',
  'Arrange guest transport',
  'Confirm menu',
  'Marriage registration'
];

export const DEFAULT_EVENT_CHECKLIST = [
  'Set date and time',
  'Finalize guest list',
  'Book venue',
  'Plan menu',
  'Confirm entertainment',
  'Send invites',
  'Vendor payments done',
  'Backup plan ready'
];

export const DEFAULT_WEDDING_TIMELINE: TimelineItem[] = [
  { id: 't1', time: '10:00 AM', activity: 'Bridal Makeup Starts', isImportant: true },
  { id: 't2', time: '04:00 PM', activity: 'Groom & Baraat Arrival' },
  { id: 't3', time: '05:30 PM', activity: 'Varmala Ceremony', isImportant: true },
  { id: 't4', time: '07:30 PM', activity: 'Dinner Service Begins' },
  { id: 't5', time: '09:00 PM', activity: 'Pheras / Wedding Rituals', isImportant: true },
  { id: 't6', time: '11:30 PM', activity: 'Vidaai' }
];

export const DEFAULT_EVENT_TIMELINE: TimelineItem[] = [
  { id: 'e1', time: '06:00 PM', activity: 'Guest Arrival & Welcome Drinks' },
  { id: 'e2', time: '07:00 PM', activity: 'Grand Entry & Cake Cutting', isImportant: true },
  { id: 'e3', time: '08:00 PM', activity: 'Performances / Entertainment' },
  { id: 'e4', time: '09:30 PM', activity: 'Dinner is Served' },
  { id: 'e5', time: '11:00 PM', activity: 'Event Conclusion' }
];

export const INITIAL_WEDDING_CATEGORIES = (quality: Quality, tier: Tier, guests: number) => {
  const qm = QUALITY_MULTIPLIERS[quality];
  const tm = TIER_MULTIPLIERS[tier];

  return [
    {
      name: 'Venue & Infrastructure',
      items: [
        { id: 'v1', label: 'Venue Rental', cost: 100000 * qm * tm, side: BudgetSide.SHARED },
        { id: 'v2', label: 'Decoration & Theme Lighting', cost: 75000 * qm * tm, side: BudgetSide.SHARED },
        { id: 'v3', label: 'Stage & Seating Setup', cost: 25000 * qm * tm, side: BudgetSide.SHARED },
        { id: 'v4', label: 'Generator & Power', cost: 10000 * qm, side: BudgetSide.SHARED }
      ]
    },
    {
      name: 'Food & Catering',
      items: [
        { id: 'f1', label: 'Main Catering (Per Plate)', cost: 1200 * guests * qm, side: BudgetSide.SHARED },
        { id: 'f2', label: 'Welcome Drinks & Starters', cost: 300 * guests * qm, side: BudgetSide.SHARED },
        { id: 'f3', label: 'Dessert & Mocktail Bar', cost: 150 * guests * qm, side: BudgetSide.SHARED }
      ]
    },
    {
      name: 'Photography & Makeup',
      items: [
        { id: 'p1', label: 'Traditional & Cinematic Video', cost: 60000 * qm, side: BudgetSide.SHARED },
        { id: 'p2', label: 'Candid Photography', cost: 35000 * qm, side: BudgetSide.SHARED },
        { id: 'p3', label: 'Bridal HD Makeup', cost: 25000 * qm, side: BudgetSide.BRIDE },
        { id: 'p4', label: 'Family Makeup Packages', cost: 15000 * qm, side: BudgetSide.SHARED }
      ]
    },
    {
      name: 'Clothing & Jewelry',
      items: [
        { id: 'c1', label: 'Bridal Lehengas / Sarees', cost: 80000 * qm, side: BudgetSide.BRIDE },
        { id: 'c2', label: 'Groom Sherwani / Suits', cost: 40000 * qm, side: BudgetSide.GROOM },
        { id: 'c3', label: 'Wedding Jewelry', cost: 250000 * qm, side: BudgetSide.SHARED }
      ]
    },
    {
      name: 'Entertainment',
      items: [
        { id: 'e1', label: 'DJ with Sound System', cost: 25000 * qm, side: BudgetSide.SHARED },
        { id: 'e2', label: 'Live Band / Singers', cost: 40000 * qm, side: BudgetSide.SHARED },
        { id: 'e3', label: 'Event Host / Emcee', cost: 10000 * qm, side: BudgetSide.SHARED }
      ]
    }
  ];
};

export const INITIAL_EVENT_CATEGORIES = (quality: Quality, tier: Tier, guests: number) => {
  const qm = QUALITY_MULTIPLIERS[quality];
  const tm = TIER_MULTIPLIERS[tier];

  return [
    {
      name: 'Essentials',
      items: [
        { id: 'be1', label: 'Venue Rental', cost: 25000 * qm * tm },
        { id: 'be2', label: 'Catering & Beverages', cost: 750 * guests * qm },
        { id: 'be3', label: 'Event Decor', cost: 20000 * qm * tm }
      ]
    },
    {
      name: 'Entertainment & Staff',
      items: [
        { id: 'ee1', label: 'Music / Sound', cost: 12000 * qm },
        { id: 'ee2', label: 'Manpower / Ushers', cost: 5000 * qm },
        { id: 'ee3', label: 'Photography', cost: 15000 * qm }
      ]
    }
  ];
};
