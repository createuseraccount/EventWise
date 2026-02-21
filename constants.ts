
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
      { task: 'Advance payment done', phase: 'Confirmation' },
      { task: 'Final menu approved', phase: 'Confirmation' },
      { task: 'Food quality verified', phase: 'Event Day' },
    ],
    'Venue': [
      { task: 'Venue shortlisted', phase: 'Planning' },
      { task: 'Dates confirmed', phase: 'Planning' },
      { task: 'Advance paid', phase: 'Confirmation' },
      { task: 'Decoration permission obtained', phase: 'Finalization' },
    ]
  };

  const list = checklists[category] || [
    { task: `${category} shortlisted`, phase: 'Planning' },
    { task: 'Budget finalized', phase: 'Planning' },
    { task: 'Contract signed', phase: 'Confirmation' },
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
  'Hire decorator',
  'Book entertainment (DJ/Band)',
  'Arrange transport for guests',
  'Book accommodation for outstation guests',
  'Finalize menu',
  'Purchase wedding rings',
  'Apply for marriage license',
  'Plan honeymoon',
  'Buy gifts for guests',
  'Schedule pre-wedding shoot',
  'Finalize priest/officiant',
  'Book mehndi artist',
  'Arrange return gifts'
];

export const DEFAULT_EVENT_CHECKLIST = [
  'Set date and time',
  'Finalize guest list',
  'Book venue',
  'Plan menu',
  'Send invitations',
  'Hire photographer',
  'Arrange decoration',
  'Book entertainment',
  'Order cake',
  'Plan return gifts',
  'Arrange audio/visual equipment',
  'Create run sheet'
];

export const DEFAULT_WEDDING_TIMELINE: TimelineItem[] = [
  { id: 't1', time: '10:00 AM', activity: 'Bridal Makeup Starts', isImportant: true },
  { id: 't2', time: '01:00 PM', activity: 'Lunch for Family & Guests' },
  { id: 't3', time: '03:30 PM', activity: 'Safaa Bandhai (Turban Tying)' },
  { id: 't4', time: '04:00 PM', activity: 'Groom & Baraat Arrival', isImportant: true },
  { id: 't5', time: '04:30 PM', activity: 'Milni Ceremony' },
  { id: 't6', time: '05:00 PM', activity: 'Bridal Entry' },
  { id: 't7', time: '05:30 PM', activity: 'Varmala Ceremony', isImportant: true },
  { id: 't8', time: '07:30 PM', activity: 'Dinner Service Begins' },
  { id: 't9', time: '09:00 PM', activity: 'Pheras / Wedding Rituals', isImportant: true },
  { id: 't10', time: '11:30 PM', activity: 'Vidaai' }
];

export const DEFAULT_EVENT_TIMELINE: TimelineItem[] = [
  { id: 'e1', time: '05:00 PM', activity: 'Setup & Sound Check' },
  { id: 'e2', time: '06:00 PM', activity: 'Guest Arrival & Welcome Drinks' },
  { id: 'e3', time: '06:45 PM', activity: 'Host Welcome Speech' },
  { id: 'e4', time: '07:00 PM', activity: 'Main Event / Performance', isImportant: true },
  { id: 'e5', time: '08:00 PM', activity: 'Cake Cutting / Toast', isImportant: true },
  { id: 'e6', time: '08:30 PM', activity: 'Dinner Served' },
  { id: 'e7', time: '10:00 PM', activity: 'Closing Remarks & Gift Distribution' }
];

export const INITIAL_WEDDING_CATEGORIES = (quality: Quality, tier: Tier, guests: number) => {
  const qm = QUALITY_MULTIPLIERS[quality];
  const tm = TIER_MULTIPLIERS[tier];

  return [
    {
      name: 'Venue & Infrastructure',
      items: [
        { id: 'v1', label: 'Venue Rental', cost: 100000 * qm * tm, side: BudgetSide.SHARED },
        { id: 'v2', label: 'Decoration & Theme Lighting', cost: 75000 * qm * tm, side: BudgetSide.SHARED }
      ]
    },
    {
      name: 'Food & Catering',
      items: [
        { id: 'f1', label: 'Main Catering', cost: 1200 * guests * qm, side: BudgetSide.SHARED }
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
        { id: 'be2', label: 'Catering & Beverages', cost: 750 * guests * qm }
      ]
    }
  ];
};
