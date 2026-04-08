export interface LaunchpadStatus {
  channels: {
    email: boolean;
    sms: boolean;
    social: boolean;
    whatsapp: boolean;
  };
  crm: {
    contacts: boolean;
    pipelines: boolean;
  };
  setup: {
    domain: boolean;
    funnel: boolean;
    automation: boolean;
    tracking: boolean;
  };
  score: number; // 0-100
}

export interface ServicePlan {
  emailFrequency: 'weekly' | 'bi-weekly' | 'monthly';
  socialPostingSchedule: string; // e.g., "3x per week"
  blogFrequency: 'weekly' | 'monthly';
}

export interface ClientSchedule {
  nextCall: string;
  preferredContactTime: string;
  reminders: string[];
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  color: string;
  industry: string;
  goals: string[];
  activeCampaigns: number;
  totalLeads: number;
  revenueImpact: number;
  launchpad?: LaunchpadStatus;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt?: string;
  lastLoginAt?: string;
  servicePlan?: ServicePlan;
  schedule?: ClientSchedule;
  forwardPlanning?: {
    blogTopics: string[];
    campaignIdeas: string[];
  };
}

export interface Task {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  category: 'email' | 'social' | 'blog' | 'call' | 'other';
}

export interface Segment {
  id: string;
  clientId: string;
  name: string;
  description: string;
  contactCount: number;
  filters: {
    location?: string;
    behavior?: string;
    action?: string;
    lastEngaged?: string;
  };
}

export interface Campaign {
  id: string;
  clientId: string;
  name: string;
  type: 'social' | 'email' | 'sms' | 'whatsapp';
  status: 'active' | 'scheduled' | 'paused' | 'completed';
  performance: 'high' | 'stable' | 'low';
  leads: number;
  spend: number;
  startDate: string;
  endDate?: string;
  targetSegments?: string[]; // Array of segment IDs
  analytics?: {
    openRate: number;
    bounceRate: number;
    unsubscribeRate: number;
  };
}

export interface Lead {
  id: string;
  clientId: string;
  name: string;
  email: string;
  phone?: string;
  socialHandles?: {
    instagram?: string;
    facebook?: string;
    x?: string;
  };
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed';
  value: number;
  source: string;
  createdAt: string;
  avatar?: string;
  segments: string[]; // Array of segment IDs
  location?: string;
  lastEngagedAt?: string;
}

export interface Message {
  id: string;
  clientId: string;
  contactId: string;
  sender: string;
  content: string;
  type: 'email' | 'sms' | 'whatsapp' | 'instagram' | 'facebook' | 'x';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'unread' | 'replied';
  assignedTo?: string;
  isInternal?: boolean;
  attachments?: string[];
}

export interface ContentItem {
  id: string;
  clientId: string;
  title: string;
  type: 'post' | 'email' | 'ad' | 'blog';
  platform: string;
  scheduledAt: string;
  status: 'draft' | 'pending' | 'approved' | 'published';
  content?: string;
  author?: string;
}

export interface Blog {
  id: string;
  clientId: string;
  title: string;
  content: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'published_externally';
  createdAt: string;
  updatedAt: string;
}

export interface SocialPost {
  id: string;
  clientId: string;
  caption: string;
  platforms: ('instagram' | 'facebook' | 'x' | 'linkedin')[];
  mediaUrl?: string;
  scheduledAt: string;
  status: 'draft' | 'scheduled' | 'published';
}

export interface PostingPlan {
  id: string;
  clientId: string;
  days: {
    day: string;
    theme: string;
  }[];
}
