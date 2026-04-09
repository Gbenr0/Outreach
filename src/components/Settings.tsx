import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Building2, 
  Mail, 
  Shield, 
  CreditCard, 
  Link as LinkIcon, 
  Globe, 
  MessageSquare, 
  Zap,
  Check,
  Plus,
  ExternalLink,
  Search,
  AlertCircle,
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface SettingsProps {
  activeClient: any | null;
}

export function Settings({ activeClient }: SettingsProps) {
  const [activeSection, setActiveSection] = useState('integrations');

  const sections = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'integrations', label: 'Integrations', icon: LinkIcon },
    { id: 'email-services', label: 'Email Services', icon: Mail },
    { id: 'team', label: 'Team Management', icon: Shield },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'integrations':
        return <IntegrationsSection />;
      case 'email-services':
        return <EmailServicesSection />;
      case 'general':
        return <GeneralSettings />;
      case 'team':
        return <TeamSection />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
              <SettingsIcon size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Settings</h3>
            <p className="text-slate-500 max-w-xs mx-auto">This section is currently under development. Check back soon for more options.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Settings Sidebar */}
      <div className="w-full lg:w-64 shrink-0">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-2 shadow-sm sticky top-8">
          <div className="px-4 py-3 mb-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Settings Menu</h2>
          </div>
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  activeSection === section.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <section.icon size={18} />
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <h1 className="text-2xl font-bold text-slate-900">
              {sections.find(s => s.id === activeSection)?.label}
            </h1>
            <p className="text-slate-500 mt-1">
              Manage your {activeSection.replace('-', ' ')} and preferences
            </p>
          </div>
          <div className="p-8">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationsSection() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const integrations = [
    {
      name: 'Google Business Profile',
      description: 'Manage reviews, posts, and business information directly.',
      icon: Globe,
      color: 'bg-blue-50 text-blue-600',
      status: 'connected',
      category: 'Social'
    },
    {
      name: 'Facebook & Instagram',
      description: 'Connect your pages to schedule posts and manage messages.',
      icon: MessageSquare,
      color: 'bg-indigo-50 text-indigo-600',
      status: 'disconnected',
      category: 'Social'
    },
    {
      name: 'LinkedIn',
      description: 'Publish professional updates and track engagement.',
      icon: LinkIcon,
      color: 'bg-sky-50 text-sky-600',
      status: 'disconnected',
      category: 'Social'
    },
    {
      name: 'Slack',
      description: 'Get real-time notifications for leads and campaign updates.',
      icon: Zap,
      color: 'bg-emerald-50 text-emerald-600',
      status: 'connected',
      category: 'Communication'
    },
    {
      name: 'Zapier',
      description: 'Connect with 5,000+ apps to automate your workflows.',
      icon: Zap,
      color: 'bg-orange-50 text-orange-600',
      status: 'disconnected',
      category: 'Automation'
    },
    {
      name: 'Stripe',
      description: 'Accept payments and manage subscriptions for your clients.',
      icon: CreditCard,
      color: 'bg-indigo-50 text-indigo-600',
      status: 'disconnected',
      category: 'Payments'
    },
    {
      name: 'TikTok',
      description: 'Connect your TikTok Business account for video marketing.',
      icon: Globe,
      color: 'bg-slate-900 text-white',
      status: 'disconnected',
      category: 'Social'
    },
    {
      name: 'WhatsApp Business',
      description: 'Send automated messages and support customers on WhatsApp.',
      icon: MessageSquare,
      color: 'bg-emerald-500 text-white',
      status: 'disconnected',
      category: 'Communication'
    },
    {
      name: 'HubSpot',
      description: 'Sync contacts and deals with your HubSpot CRM.',
      icon: LinkIcon,
      color: 'bg-orange-500 text-white',
      status: 'disconnected',
      category: 'CRM'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="relative flex-1 max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search integrations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((integration, i) => (
          <div key={i} className="group p-6 rounded-2xl border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-xl", integration.color)}>
                <integration.icon size={24} />
              </div>
              <span className={cn(
                "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                integration.status === 'connected' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
              )}>
                {integration.status}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{integration.name}</h3>
            <p className="text-sm text-slate-500 mb-6">{integration.description}</p>
            <button className={cn(
              "w-full py-2.5 rounded-xl text-sm font-bold transition-all",
              integration.status === 'connected'
                ? "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/10"
            )}>
              {integration.status === 'connected' ? 'Disconnect' : 'Connect Now'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
            <Plus size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Request Integration</h4>
            <p className="text-sm text-slate-500">Don't see what you're looking for? Let us know.</p>
          </div>
          <button className="ml-auto px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all">
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

function EmailServicesSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const emailServices = [
    {
      name: 'SendGrid',
      description: 'Industry-standard transactional and marketing email service.',
      logo: 'https://picsum.photos/seed/sendgrid/100/100',
      status: 'connected',
      tags: ['Transactional', 'Marketing']
    },
    {
      name: 'Mailchimp',
      description: 'Popular all-in-one marketing platform for small businesses.',
      logo: 'https://picsum.photos/seed/mailchimp/100/100',
      status: 'disconnected',
      tags: ['Marketing', 'Automation']
    },
    {
      name: 'AWS SES',
      description: 'High-scale, cost-effective email sending for developers.',
      logo: 'https://picsum.photos/seed/aws/100/100',
      status: 'disconnected',
      tags: ['Scale', 'Developer']
    },
    {
      name: 'Resend',
      description: 'The modern email API for developers. Simple and powerful.',
      logo: 'https://picsum.photos/seed/resend/100/100',
      status: 'disconnected',
      tags: ['Modern', 'API']
    },
    {
      name: 'Postmark',
      description: 'Lightning-fast delivery for your transactional emails.',
      logo: 'https://picsum.photos/seed/postmark/100/100',
      status: 'disconnected',
      tags: ['Transactional', 'Speed']
    },
    {
      name: 'Mailgun',
      description: 'The email service for developers. Powerful APIs.',
      logo: 'https://picsum.photos/seed/mailgun/100/100',
      status: 'disconnected',
      tags: ['API', 'Scale']
    },
    {
      name: 'Brevo',
      description: 'Complete marketing suite with email, SMS, and chat.',
      logo: 'https://picsum.photos/seed/brevo/100/100',
      status: 'disconnected',
      tags: ['Marketing', 'SMS']
    },
    {
      name: 'Twilio',
      description: 'Programmable communications for global scale.',
      logo: 'https://picsum.photos/seed/twilio/100/100',
      status: 'disconnected',
      tags: ['SMS', 'Voice']
    },
    {
      name: 'ActiveCampaign',
      description: 'Email marketing, marketing automation, and CRM tools.',
      logo: 'https://picsum.photos/seed/activecampaign/100/100',
      status: 'disconnected',
      tags: ['Automation', 'CRM']
    },
    {
      name: 'Constant Contact',
      description: 'Easy-to-use email marketing for small businesses.',
      logo: 'https://picsum.photos/seed/constantcontact/100/100',
      status: 'disconnected',
      tags: ['Marketing', 'Simple']
    },
    {
      name: 'GetResponse',
      description: 'Inbound marketing solution with email and webinars.',
      logo: 'https://picsum.photos/seed/getresponse/100/100',
      status: 'disconnected',
      tags: ['Marketing', 'Webinars']
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search email services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all">
            All Types
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all">
            Connected
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {emailServices.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((service, i) => (
          <div key={i} className="p-6 rounded-2xl border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all bg-white">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl border border-slate-100 overflow-hidden shadow-sm shrink-0">
                <img src={service.logo} alt={service.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-900 truncate">{service.name}</h3>
                  {service.status === 'connected' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                      <Check size={12} /> Connected
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {service.tags.map((tag, j) => (
                    <span key={j} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2">{service.description}</p>
            <div className="flex gap-3">
              <button className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all",
                service.status === 'connected'
                  ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/10"
              )}>
                {service.status === 'connected' ? 'Manage' : 'Configure'}
              </button>
              <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
          <AlertCircle size={20} />
        </div>
        <div>
          <h4 className="font-bold text-blue-900">Important Note</h4>
          <p className="text-sm text-blue-700/80 mt-1">
            Email service configuration requires valid API keys and domain verification. 
            Please ensure your DNS settings are correctly configured before attempting to connect a new service.
          </p>
          <button className="mt-4 text-blue-700 text-sm font-bold flex items-center gap-2 hover:underline">
            View Documentation <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamSection() {
  const members = [
    { name: 'Alex Operator', email: 'alex@outreach.com', role: 'Agency Admin', avatar: 'https://picsum.photos/seed/alex/100/100', status: 'Active' },
    { name: 'Sarah Miller', email: 'sarah@outreach.com', role: 'Campaign Manager', avatar: 'https://picsum.photos/seed/sarah/100/100', status: 'Active' },
    { name: 'John Doe', email: 'john@outreach.com', role: 'Content Creator', avatar: 'https://picsum.photos/seed/john/100/100', status: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-900">Team Members</h3>
        <button className="btn-primary px-4 py-2 flex items-center gap-2 text-sm">
          <Plus size={16} />
          Invite Member
        </button>
      </div>

      <div className="border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Member</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{member.name}</div>
                      <div className="text-xs text-slate-500">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{member.role}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    member.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                  )}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-slate-600">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900">Agency Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Agency Name</label>
              <input 
                type="text" 
                defaultValue="Outreach Digital Agency"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Support Email</label>
              <input 
                type="email" 
                defaultValue="support@outreach.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Website URL</label>
              <input 
                type="url" 
                defaultValue="https://outreach.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900">Agency Branding</h3>
          <div className="p-6 border border-slate-200 rounded-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary/20">
                O
              </div>
              <div>
                <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-bold hover:bg-primary/20 transition-all mb-2">
                  Change Logo
                </button>
                <p className="text-xs text-slate-400">Recommended: 512x512px PNG or SVG</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Primary Brand Color</label>
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-primary rounded-xl border border-slate-200" />
                <input 
                  type="text" 
                  defaultValue="#7c3aed"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
        <button className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">
          Reset Changes
        </button>
        <button 
          onClick={() => toast.success('Settings saved successfully!')}
          className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
