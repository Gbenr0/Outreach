import { Client, Campaign, Lead, Message, ContentItem, Task, Segment, Blog, SocialPost, PostingPlan, ContactNote, ContactTask, ContactAppointment, ContactPayment } from './types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'EcoStride',
    logo: 'https://picsum.photos/seed/eco/100/100',
    color: '#7c3aed', // Updated to purple as per guidelines
    industry: 'Sustainable Fashion',
    goals: ['Increase brand awareness', 'Drive online sales'],
    activeCampaigns: 4,
    totalLeads: 1240,
    revenueImpact: 45000,
    contactPerson: 'Alex Rivera',
    contactEmail: 'alex.rivera@ecostride.com',
    contactPhone: '+1 (555) 234-5678',
    createdAt: '2025-12-15T08:30:00Z',
    lastLoginAt: '2026-04-06T14:20:00Z',
    servicePlan: {
      emailFrequency: 'weekly',
      socialPostingSchedule: '3x per week',
      blogFrequency: 'monthly'
    },
    schedule: {
      nextCall: '2026-04-10T10:00:00Z',
      preferredContactTime: 'Tuesdays at 10 AM',
      reminders: ['Check spring collection inventory', 'Review social engagement']
    },
    forwardPlanning: {
      blogTopics: ['Sustainable Fabrics 101', 'Eco-friendly Summer Trends'],
      campaignIdeas: ['Earth Day Flash Sale', 'New Arrival Teasers']
    },
    launchpad: {
      channels: { email: true, sms: false, social: true, whatsapp: false },
      crm: { contacts: true, pipelines: true },
      setup: { domain: true, funnel: false, automation: true, tracking: true },
      score: 65
    }
  },
  {
    id: '2',
    name: 'TechNova',
    logo: 'https://picsum.photos/seed/tech/100/100',
    color: '#7c3aed',
    industry: 'SaaS',
    goals: ['Lead generation', 'User retention'],
    activeCampaigns: 6,
    totalLeads: 3500,
    revenueImpact: 120000,
    contactPerson: 'Sarah Chen',
    contactEmail: 'sarah.chen@technova.io',
    contactPhone: '+1 (555) 876-5432',
    createdAt: '2026-01-10T11:45:00Z',
    lastLoginAt: '2026-04-07T09:15:00Z',
    servicePlan: {
      emailFrequency: 'bi-weekly',
      socialPostingSchedule: '5x per week',
      blogFrequency: 'weekly'
    },
    schedule: {
      nextCall: '2026-04-12T14:00:00Z',
      preferredContactTime: 'Thursdays at 2 PM',
      reminders: ['Finalize Q2 roadmap', 'Update help center docs']
    },
    forwardPlanning: {
      blogTopics: ['AI in SaaS', 'Scaling your infrastructure'],
      campaignIdeas: ['Referral Program Launch', 'Enterprise Plan Promo']
    },
    launchpad: {
      channels: { email: true, sms: true, social: true, whatsapp: true },
      crm: { contacts: true, pipelines: true },
      setup: { domain: true, funnel: true, automation: true, tracking: true },
      score: 100
    }
  },
  {
    id: '3',
    name: 'LuxeLiving',
    logo: 'https://picsum.photos/seed/luxe/100/100',
    color: '#7c3aed',
    industry: 'Real Estate',
    goals: ['High-intent leads', 'Property viewings'],
    activeCampaigns: 2,
    totalLeads: 450,
    revenueImpact: 850000,
    contactPerson: 'Marcus Thorne',
    contactEmail: 'm.thorne@luxeliving.com',
    contactPhone: '+1 (555) 432-1098',
    createdAt: '2026-03-05T16:20:00Z',
    lastLoginAt: '2026-04-05T10:00:00Z',
    servicePlan: {
      emailFrequency: 'monthly',
      socialPostingSchedule: '2x per week',
      blogFrequency: 'monthly'
    },
    schedule: {
      nextCall: '2026-04-15T11:00:00Z',
      preferredContactTime: 'Wednesdays at 11 AM',
      reminders: ['Verify penthouse listing details', 'Schedule virtual tour']
    },
    forwardPlanning: {
      blogTopics: ['Luxury Market Trends 2026', 'Investing in Real Estate'],
      campaignIdeas: ['Exclusive Preview Event', 'Neighborhood Spotlight']
    },
    launchpad: {
      channels: { email: false, sms: false, social: false, whatsapp: false },
      crm: { contacts: false, pipelines: false },
      setup: { domain: false, funnel: false, automation: false, tracking: false },
      score: 0
    }
  },
];

export const MOCK_SEGMENTS: Segment[] = [
  {
    id: 's1',
    clientId: '1',
    name: 'Inactive Users',
    description: 'Users who have not engaged in the last 30 days',
    contactCount: 450,
    filters: { lastEngaged: '30 days' }
  },
  {
    id: 's2',
    clientId: '1',
    name: 'New Leads',
    description: 'Leads captured in the last 7 days',
    contactCount: 120,
    filters: { behavior: 'new' }
  },
  {
    id: 's3',
    clientId: '1',
    name: 'High Value',
    description: 'Customers with lifetime value > $500',
    contactCount: 85,
    filters: { action: 'purchase' }
  },
  {
    id: 's4',
    clientId: '2',
    name: 'Trial Users',
    description: 'Users currently on a 14-day free trial',
    contactCount: 850,
    filters: { behavior: 'trial' }
  },
  {
    id: 's5',
    clientId: '2',
    name: 'Churn Risk',
    description: 'Users with low activity in the last 14 days',
    contactCount: 120,
    filters: { behavior: 'low_activity' }
  }
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    clientId: '1',
    name: 'Spring Collection Launch',
    type: 'social',
    status: 'active',
    performance: 'high',
    leads: 450,
    spend: 1200,
    startDate: '2024-03-01',
    targetSegments: ['s2', 's3'],
    analytics: {
      openRate: 24.5,
      bounceRate: 1.2,
      unsubscribeRate: 0.5
    }
  },
  {
    id: 'c2',
    clientId: '2',
    name: 'Q1 Feature Update',
    type: 'email',
    status: 'active',
    performance: 'stable',
    leads: 890,
    spend: 500,
    startDate: '2024-03-10',
    analytics: {
      openRate: 32.1,
      bounceRate: 0.8,
      unsubscribeRate: 0.2
    }
  },
  {
    id: 'c3',
    clientId: '3',
    name: 'Luxury Penthouse Promo',
    type: 'social',
    status: 'active',
    performance: 'low',
    leads: 12,
    spend: 3000,
    startDate: '2024-03-15',
  },
  {
    id: 'c4',
    clientId: '2',
    name: 'Referral Program',
    type: 'email',
    status: 'scheduled',
    performance: 'stable',
    leads: 0,
    spend: 200,
    startDate: '2024-04-15',
  },
  {
    id: 'c5',
    clientId: '1',
    name: 'Abandoned Cart Recovery',
    type: 'email',
    status: 'active',
    performance: 'high',
    leads: 156,
    spend: 300,
    startDate: '2024-03-20',
    analytics: {
      openRate: 45.2,
      bounceRate: 0.5,
      unsubscribeRate: 0.1
    }
  },
  {
    id: 'c6',
    clientId: '1',
    name: 'Monthly Newsletter - April',
    type: 'email',
    status: 'scheduled',
    performance: 'stable',
    leads: 0,
    spend: 150,
    startDate: '2024-04-01',
  },
  {
    id: 'c7',
    clientId: '2',
    name: 'Review Booster Campaign',
    type: 'email',
    status: 'completed',
    performance: 'high',
    leads: 320,
    spend: 400,
    startDate: '2024-02-15',
    analytics: {
      openRate: 38.5,
      bounceRate: 1.1,
      unsubscribeRate: 0.3
    }
  },
  {
    id: 'c8',
    clientId: '3',
    name: 'Re-engagement Blast',
    type: 'email',
    status: 'paused',
    performance: 'low',
    leads: 45,
    spend: 600,
    startDate: '2024-03-05',
    analytics: {
      openRate: 12.8,
      bounceRate: 4.2,
      unsubscribeRate: 2.5
    }
  }
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 'l1',
    clientId: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 123-4567',
    socialHandles: {
      instagram: '@sarah_j',
      facebook: 'sarah.johnson.official'
    },
    status: 'new',
    value: 150,
    source: 'Instagram Ad',
    createdAt: '2024-03-28T10:00:00Z',
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    segments: ['s2'],
    location: 'New York, NY',
    lastEngagedAt: '2024-03-28T10:00:00Z',
    businessName: 'Johnson & Co',
    tags: ['VIP', 'Interested'],
    lastActivityAt: '2024-03-28T10:15:00Z'
  },
  {
    id: 'l2',
    clientId: '2',
    name: 'Mike Chen',
    email: 'mike@technova.io',
    phone: '+1 (555) 987-6543',
    status: 'qualified',
    value: 2400,
    source: 'LinkedIn Outreach',
    createdAt: '2024-03-27T14:30:00Z',
    avatar: 'https://picsum.photos/seed/mike/200/200',
    segments: ['s4'],
    location: 'San Francisco, CA',
    lastEngagedAt: '2024-03-27T14:30:00Z',
    businessName: 'TechNova Solutions',
    tags: ['SaaS', 'High Intent'],
    lastActivityAt: '2024-03-27T15:00:00Z'
  },
  {
    id: 'l3',
    clientId: '1',
    name: 'Emma Wilson',
    email: 'emma.w@gmail.com',
    phone: '+1 (555) 444-5555',
    status: 'proposal',
    value: 450,
    source: 'Referral',
    createdAt: '2024-03-25T09:00:00Z',
    avatar: 'https://picsum.photos/seed/emma/200/200',
    segments: ['s3'],
    location: 'Austin, TX',
    lastEngagedAt: '2024-03-26T11:00:00Z',
    businessName: 'Wilson Creative',
    tags: ['Creative', 'Referral'],
    lastActivityAt: '2024-03-26T12:00:00Z'
  },
  {
    id: 'l4',
    clientId: '3',
    name: 'David Miller',
    email: 'david.miller@luxury.com',
    phone: '+1 (555) 777-8888',
    status: 'contacted',
    value: 12000,
    source: 'Google Search',
    createdAt: '2024-03-20T16:00:00Z',
    avatar: 'https://picsum.photos/seed/david/200/200',
    segments: [],
    location: 'Miami, FL',
    lastEngagedAt: '2024-03-21T10:00:00Z',
    businessName: 'Miller Estates',
    tags: ['Real Estate', 'High Value'],
    lastActivityAt: '2024-03-21T11:00:00Z'
  }
];

export const MOCK_CONTACT_NOTES: ContactNote[] = [
  { id: 'n1', contactId: 'l1', content: 'Interested in the new eco-sneakers.', author: 'Alex Operator', createdAt: '2024-03-28T10:10:00Z' },
  { id: 'n2', contactId: 'l1', content: 'Follow up next week about size availability.', author: 'Alex Operator', createdAt: '2024-03-28T10:20:00Z' },
];

export const MOCK_CONTACT_TASKS: ContactTask[] = [
  { id: 'ct1', contactId: 'l1', title: 'Send size guide', dueDate: '2024-03-29T10:00:00Z', status: 'pending', priority: 'medium' },
  { id: 'ct2', contactId: 'l2', title: 'Schedule demo', dueDate: '2024-03-30T14:00:00Z', status: 'completed', priority: 'high' },
];

export const MOCK_CONTACT_APPOINTMENTS: ContactAppointment[] = [
  { id: 'ca1', contactId: 'l1', title: 'Fitting Session', startTime: '2024-04-05T14:00:00Z', endTime: '2024-04-05T15:00:00Z', status: 'scheduled' },
];

export const MOCK_CONTACT_PAYMENTS: ContactPayment[] = [
  { id: 'cp1', contactId: 'l1', amount: 150, status: 'paid', date: '2024-03-28T11:00:00Z', description: 'Eco-Sneakers Pre-order' },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    clientId: '1',
    title: 'Review Spring Campaign Draft',
    description: 'Check the copy and images for the upcoming collection launch.',
    dueDate: '2026-04-08T17:00:00Z',
    priority: 'high',
    status: 'pending',
    category: 'email'
  },
  {
    id: 't2',
    clientId: '1',
    title: 'Schedule Social Posts',
    description: 'Plan out the next week of Instagram and Facebook content.',
    dueDate: '2026-04-09T12:00:00Z',
    priority: 'medium',
    status: 'pending',
    category: 'social'
  },
  {
    id: 't3',
    clientId: '1',
    title: 'Weekly Sync Call',
    description: 'Discuss performance and next steps with Alex.',
    dueDate: '2026-04-10T10:00:00Z',
    priority: 'high',
    status: 'pending',
    category: 'call'
  },
  {
    id: 't4',
    clientId: '2',
    title: 'Update Onboarding Flow',
    description: 'Improve the first-time user experience based on feedback.',
    dueDate: '2026-04-12T09:00:00Z',
    priority: 'medium',
    status: 'pending',
    category: 'other'
  }
];

export const MOCK_BLOGS: Blog[] = [
  {
    id: 'b1',
    clientId: '1',
    title: 'The Future of Sustainable Fashion',
    content: 'Sustainable fashion is not just a trend, it is a necessity. As we move into 2026, the industry is seeing a massive shift towards circular economy models and biodegradable materials. Brands like EcoStride are leading the charge by ensuring every piece of clothing has a minimal environmental footprint.',
    status: 'pending_approval',
    createdAt: '2026-04-01T09:00:00Z',
    updatedAt: '2026-04-02T14:00:00Z'
  },
  {
    id: 'b2',
    clientId: '1',
    title: '10 Tips for an Eco-Friendly Wardrobe',
    content: 'Building an eco-friendly wardrobe starts with quality over quantity. 1. Choose natural fibers. 2. Support ethical brands. 3. Repair instead of replace. 4. Shop second-hand. 5. Wash clothes less frequently...',
    status: 'draft',
    createdAt: '2026-04-05T11:00:00Z',
    updatedAt: '2026-04-05T11:00:00Z'
  },
  {
    id: 'b3',
    clientId: '2',
    title: 'Scaling Your SaaS in 2026',
    content: 'Scaling a SaaS business requires more than just a great product. It requires a deep understanding of your users and a robust infrastructure that can handle growth. In this post, we explore the key strategies for scaling in the current market.',
    status: 'published_externally',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-16T12:00:00Z'
  }
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    clientId: '1',
    contactId: 'l1',
    sender: 'Sarah Johnson',
    content: 'Do you have the eco-sneakers in size 8?',
    type: 'instagram',
    timestamp: '2024-03-28T10:05:00Z',
    status: 'unread',
  },
  {
    id: 'm2',
    clientId: '1',
    contactId: 'l1',
    sender: 'Sarah Johnson',
    content: 'I also saw your email about the spring collection. Is it available in-store?',
    type: 'email',
    timestamp: '2024-03-28T10:15:00Z',
    status: 'unread',
  },
];

export const MOCK_CONTENT: ContentItem[] = [
  {
    id: 'ct1',
    clientId: '1',
    title: 'Sustainability Monday',
    type: 'post',
    platform: 'Instagram',
    scheduledAt: '2026-03-30T09:00:00Z',
    status: 'approved',
  },
  {
    id: 'ct2',
    clientId: '2',
    title: 'New Feature Announcement',
    type: 'email',
    platform: 'Mailchimp',
    scheduledAt: '2026-03-31T10:00:00Z',
    status: 'pending',
  },
];

export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'sp1',
    clientId: '1',
    caption: 'Check out our new eco-friendly sneakers! 🌿 #SustainableFashion #EcoStride',
    platforms: ['instagram', 'facebook'],
    mediaUrl: 'https://picsum.photos/seed/sneakers/800/800',
    scheduledAt: '2026-04-08T10:00:00Z',
    status: 'scheduled'
  },
  {
    id: 'sp2',
    clientId: '1',
    caption: 'Sustainability is not a trend, it is a lifestyle. Join us on our journey. ✨',
    platforms: ['instagram', 'x'],
    mediaUrl: 'https://picsum.photos/seed/nature/800/800',
    scheduledAt: '2026-04-10T14:00:00Z',
    status: 'draft'
  },
  {
    id: 'sp3',
    clientId: '1',
    caption: 'Our Spring Collection is officially LIVE! Shop now at the link in bio. 🛍️',
    platforms: ['instagram', 'facebook', 'x'],
    mediaUrl: 'https://picsum.photos/seed/spring/800/800',
    scheduledAt: '2026-04-05T09:00:00Z',
    status: 'published'
  },
  {
    id: 'sp4',
    clientId: '2',
    caption: 'New Feature Alert! 🚀 We just released our AI-powered analytics dashboard. Check it out now!',
    platforms: ['linkedin', 'x'],
    mediaUrl: 'https://picsum.photos/seed/analytics/800/800',
    scheduledAt: '2026-04-09T11:00:00Z',
    status: 'scheduled'
  },
  {
    id: 'sp5',
    clientId: '2',
    caption: 'How to scale your SaaS in 2026? Read our latest blog post for insights. 📈',
    platforms: ['linkedin', 'facebook'],
    mediaUrl: 'https://picsum.photos/seed/scale/800/800',
    scheduledAt: '2026-04-12T15:00:00Z',
    status: 'draft'
  },
  {
    id: 'sp6',
    clientId: '3',
    caption: 'Exclusive Preview: Penthouse at The Heights. Luxury living at its finest. 🏙️',
    platforms: ['instagram', 'facebook'],
    mediaUrl: 'https://picsum.photos/seed/penthouse/800/800',
    scheduledAt: '2026-04-11T10:00:00Z',
    status: 'scheduled'
  }
];

export const MOCK_POSTING_PLANS: PostingPlan[] = [
  {
    id: 'pp1',
    clientId: '1',
    days: [
      { day: 'Monday', theme: 'Sustainability Tips' },
      { day: 'Wednesday', theme: 'Product Showcases' },
      { day: 'Friday', theme: 'Community Highlights' }
    ]
  },
  {
    id: 'pp2',
    clientId: '2',
    days: [
      { day: 'Tuesday', theme: 'Feature Spotlights' },
      { day: 'Thursday', theme: 'Customer Stories' },
      { day: 'Saturday', theme: 'Industry News' }
    ]
  },
  {
    id: 'pp3',
    clientId: '3',
    days: [
      { day: 'Tuesday', theme: 'New Listings' },
      { day: 'Thursday', theme: 'Market Updates' },
      { day: 'Sunday', theme: 'Open House Previews' }
    ]
  }
];

export const MOCK_MARKETPLACE = [
  { name: 'Google Ads Connector', description: 'Sync your Google Ads data directly into Outreach for unified reporting.', status: 'Installed' },
  { name: 'Mailchimp Sync', description: 'Automate contact syncing between Mailchimp and Outreach CRM.', status: 'Available' },
  { name: 'Stripe Billing', description: 'Manage client subscriptions and payments seamlessly.', status: 'Installed' },
  { name: 'WhatsApp Business', description: 'Send automated updates and support via WhatsApp.', status: 'Available' }
];

export const MOCK_PAYMENTS = [
  { name: 'INV-2024-001', description: 'EcoStride - Monthly Marketing Service', status: 'Paid', amount: '$2,500' },
  { name: 'INV-2024-002', description: 'TechNova - Q1 Campaign Management', status: 'Pending', amount: '$5,000' },
  { name: 'INV-2024-003', description: 'LuxeLiving - Social Media Retainer', status: 'Paid', amount: '$1,800' }
];

export const MOCK_MEMBERSHIP = [
  { name: 'Agency Onboarding', description: 'A complete guide for new clients to get started with Outreach.', status: 'Active' },
  { name: 'Marketing Masterclass', description: 'Advanced strategies for scaling small business marketing.', status: 'Draft' }
];

export const MOCK_MEDIA = [
  { name: 'Spring_Collection_Hero.jpg', description: 'Main banner for EcoStride spring campaign.', status: 'Image' },
  { name: 'TechNova_Logo_Vector.svg', description: 'High-resolution logo for TechNova branding.', status: 'Vector' },
  { name: 'LuxeLiving_Penthouse_Tour.mp4', description: 'Video tour of the new penthouse listing.', status: 'Video' }
];

export const MOCK_REPUTATION = [
  { name: 'Google Review - Sarah J.', description: "EcoStride's customer service is top-notch! Highly recommend.", status: '5 Stars' },
  { name: 'Facebook Feedback - Mike C.', description: 'TechNova has really helped us scale our operations.', status: '4 Stars' }
];

export const MOCK_TIMERS = [
  { name: 'Spring Sale Countdown', description: 'Ends in 3 days, 4 hours.', status: 'Active' },
  { name: 'Webinar Registration', description: 'Closes in 12 hours.', status: 'Active' }
];

export const MOCK_LINKS = [
  { name: 'Spring Collection PDF', description: 'Trigger: Send follow-up email on click.', status: 'Active' },
  { name: 'Pricing Page', description: 'Trigger: Notify sales team on click.', status: 'Active' }
];

export const MOCK_ADS = [
  { name: 'EcoStride - Instagram Retargeting', description: 'Targeting users who visited the spring collection.', status: 'Running' },
  { name: 'TechNova - LinkedIn Lead Gen', description: 'Targeting SaaS decision makers.', status: 'Paused' }
];

export const MOCK_EMAIL_STATS = [
  { name: 'Mon', delivered: 1150, bounced: 20, unsubscribed: 5, spam: 2 },
  { name: 'Tue', delivered: 1080, bounced: 15, unsubscribed: 8, spam: 1 },
  { name: 'Wed', delivered: 1450, bounced: 30, unsubscribed: 12, spam: 3 },
  { name: 'Thu', delivered: 1250, bounced: 25, unsubscribed: 10, spam: 2 },
  { name: 'Fri', delivered: 1180, bounced: 18, unsubscribed: 7, spam: 1 },
  { name: 'Sat', delivered: 980, bounced: 12, unsubscribed: 4, spam: 0 },
  { name: 'Sun', delivered: 1050, bounced: 22, unsubscribed: 9, spam: 2 },
];

export const MOCK_EMAIL_TEMPLATES = [
  { id: 't1', name: 'Welcome Series', description: 'Automated welcome email for new subscribers.', lastUsed: '2024-04-01', thumbnail: 'https://picsum.photos/seed/welcome/400/600' },
  { id: 't2', name: 'Monthly Newsletter', description: 'Standard layout for monthly updates.', lastUsed: '2024-03-25', thumbnail: 'https://picsum.photos/seed/newsletter/400/600' },
  { id: 't3', name: 'Flash Sale Promo', description: 'High-conversion layout for limited time offers.', lastUsed: '2024-03-15', thumbnail: 'https://picsum.photos/seed/sale/400/600' },
  { id: 't4', name: 'Abandoned Cart', description: 'Recovery email for incomplete purchases.', lastUsed: '2024-04-05', thumbnail: 'https://picsum.photos/seed/cart/400/600' },
  { id: 't5', name: 'Review Request', description: 'Follow-up email to collect customer reviews.', lastUsed: '2024-04-02', thumbnail: 'https://picsum.photos/seed/review/400/600' },
  { id: 't6', name: 'Product Update', description: 'Clean layout for feature announcements.', lastUsed: '2024-03-20', thumbnail: 'https://picsum.photos/seed/update/400/600' },
];

export const MOCK_ENGAGEMENT_DATA = [
  { name: 'Delivered', email: 10500, workflow: 8200, bulk: 6300 },
  { name: 'Opened', email: 4483, workflow: 423, bulk: 5722 },
  { name: 'Clicked', email: 1200, workflow: 150, bulk: 2100 },
  { name: 'Ordered', email: 450, workflow: 20, bulk: 85 },
];

export const MOCK_ADS_REPORTS = {
  google: [
    { name: 'Mon', impressions: 4500, clicks: 280, conversions: 12, spend: 150, cpc: 0.54, costPerConv: 12.5, spendPerConv: 12.5, convRate: 4.2 },
    { name: 'Tue', impressions: 5200, clicks: 310, conversions: 15, spend: 180, cpc: 0.58, costPerConv: 12.0, spendPerConv: 12.0, convRate: 4.8 },
    { name: 'Wed', impressions: 4800, clicks: 290, conversions: 10, spend: 160, cpc: 0.55, costPerConv: 16.0, spendPerConv: 16.0, convRate: 3.4 },
    { name: 'Thu', impressions: 6100, clicks: 420, conversions: 22, spend: 210, cpc: 0.50, costPerConv: 9.5, spendPerConv: 9.5, convRate: 5.2 },
    { name: 'Fri', impressions: 5800, clicks: 380, conversions: 18, spend: 195, cpc: 0.51, costPerConv: 10.8, spendPerConv: 10.8, convRate: 4.7 },
    { name: 'Sat', impressions: 3200, clicks: 150, conversions: 5, spend: 90, cpc: 0.60, costPerConv: 18.0, spendPerConv: 18.0, convRate: 3.3 },
    { name: 'Sun', impressions: 3800, clicks: 190, conversions: 8, spend: 110, cpc: 0.58, costPerConv: 13.7, spendPerConv: 13.7, convRate: 4.2 },
  ],
  facebook: [
    { name: 'Mon', impressions: 8500, clicks: 480, conversions: 22, spend: 120, cpc: 0.25, costPerConv: 5.4, spendPerConv: 5.4, convRate: 4.5 },
    { name: 'Tue', impressions: 9200, clicks: 510, conversions: 25, spend: 140, cpc: 0.27, costPerConv: 5.6, spendPerConv: 5.6, convRate: 4.9 },
    { name: 'Wed', impressions: 8800, clicks: 490, conversions: 20, spend: 130, cpc: 0.26, costPerConv: 6.5, spendPerConv: 6.5, convRate: 4.1 },
    { name: 'Thu', impressions: 10100, clicks: 620, conversions: 32, spend: 160, cpc: 0.25, costPerConv: 5.0, spendPerConv: 5.0, convRate: 5.1 },
    { name: 'Fri', impressions: 9800, clicks: 580, conversions: 28, spend: 155, cpc: 0.26, costPerConv: 5.5, spendPerConv: 5.5, convRate: 4.8 },
    { name: 'Sat', impressions: 6200, clicks: 250, conversions: 15, spend: 80, cpc: 0.32, costPerConv: 5.3, spendPerConv: 5.3, convRate: 6.0 },
    { name: 'Sun', impressions: 7800, clicks: 390, conversions: 18, spend: 100, cpc: 0.25, costPerConv: 5.5, spendPerConv: 5.5, convRate: 4.6 },
  ],
  campaigns: [
    { id: 'c1', name: 'Spring Sale 2024', status: 'Active', clicks: 1240, cost: 450, revenue: 1200, roi: 2.6, cpc: 0.36, ctr: 2.4, sales: 45, cps: 10.0, leads: 120, cpl: 3.75, impressions: 52000, avgRevenue: 26.6 },
    { id: 'c2', name: 'New Arrivals Retargeting', status: 'Active', clicks: 850, cost: 320, revenue: 950, roi: 2.9, cpc: 0.38, ctr: 3.1, sales: 32, cps: 10.0, leads: 85, cpl: 3.76, impressions: 27400, avgRevenue: 29.6 },
    { id: 'c3', name: 'Brand Awareness - Video', status: 'Paused', clicks: 2100, cost: 150, revenue: 0, roi: 0, cpc: 0.07, ctr: 1.2, sales: 0, cps: 0, leads: 45, cpl: 3.33, impressions: 175000, avgRevenue: 0 },
    { id: 'c4', name: 'Competitor Conquesting', status: 'Active', clicks: 450, cost: 600, revenue: 800, roi: 1.3, cpc: 1.33, ctr: 0.8, sales: 12, cps: 50.0, leads: 30, cpl: 20.0, impressions: 56000, avgRevenue: 66.6 },
    { id: 'c5', name: 'Holiday Gift Guide', status: 'Completed', clicks: 3200, cost: 1200, revenue: 4500, roi: 3.7, cpc: 0.37, ctr: 2.8, sales: 150, cps: 8.0, leads: 450, cpl: 2.66, impressions: 114000, avgRevenue: 30.0 },
  ]
};
