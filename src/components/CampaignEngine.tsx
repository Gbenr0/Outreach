import React, { useState } from 'react';
import { 
  Plus, 
  Filter, 
  MoreVertical, 
  Megaphone, 
  Mail, 
  MessageSquare, 
  Smartphone,
  Play,
  Pause,
  Copy,
  Trash2,
  ArrowLeft,
  DollarSign,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Rocket,
  Circle,
  ArrowRight,
  ShieldCheck,
  Zap,
  X,
  Share2,
  Clock,
  Link as LinkIcon,
  Layout,
  BarChart3,
  FileText,
  Calendar,
  Type,
  Image as ImageIcon,
  Square,
  Columns,
  Settings2,
  Eye,
  Save,
  Undo2,
  Redo2,
  MousePointer2,
  Layers,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Globe
} from 'lucide-react';
import { 
  MOCK_CAMPAIGNS, 
  MOCK_CLIENTS, 
  MOCK_SEGMENTS, 
  MOCK_TIMERS, 
  MOCK_LINKS, 
  MOCK_ADS,
  MOCK_EMAIL_STATS,
  MOCK_EMAIL_TEMPLATES,
  MOCK_ENGAGEMENT_DATA
} from '../mockData';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { cn } from '../lib/utils';
import { Client } from '../types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { Launchpad } from './Launchpad';
import { SocialPlanner } from './SocialPlanner';

interface CampaignEngineProps {
  clients: Client[];
  activeClient: Client | null;
  setActiveTab: (tab: string) => void;
  setActiveClient: (client: Client | null) => void;
  view: 'list' | 'create';
  setView: (view: 'list' | 'create') => void;
}

type MarketingTab = 'social' | 'emails' | 'timers' | 'links' | 'ads';
type EmailSubTab = 'stats' | 'campaigns' | 'templates';

export function CampaignEngine({ clients, activeClient, setActiveTab, setActiveClient, view, setView }: CampaignEngineProps) {
  const [activeMarketingTab, setActiveMarketingTab] = useState<MarketingTab>('social');
  const [activeEmailSubTab, setActiveEmailSubTab] = useState<EmailSubTab>('campaigns');
  const [filter, setFilter] = useState('all');
  const [statsCampaignFilter, setStatsCampaignFilter] = useState('all');
  const [showTemplateOverlay, setShowTemplateOverlay] = useState(false);
  const [showBlankTemplateEditor, setShowBlankTemplateEditor] = useState(false);
  const [showReadinessModal, setShowReadinessModal] = useState(false);
  const [showLaunchpadDrawer, setShowLaunchpadDrawer] = useState(false);
  
  const launchpad = activeClient?.launchpad || {
    channels: { email: false, sms: false, social: false, whatsapp: false },
    crm: { contacts: false, pipelines: false },
    setup: { domain: false, funnel: false, automation: false, tracking: false },
    score: 0
  };

  const handleCreateClick = () => {
    if (!activeClient) {
      toast.error('Please select a client first');
      return;
    }

    if (launchpad.score < 40) {
      setShowReadinessModal(true);
    } else if (launchpad.score < 80) {
      toast.warning('Your Launchpad is partially ready. Some features may be limited.');
      setView('create');
    } else {
      setView('create');
    }
  };
  
  const campaigns = activeClient 
    ? MOCK_CAMPAIGNS.filter(c => c.clientId === activeClient.id)
    : MOCK_CAMPAIGNS;

  const typeIcons = {
    social: Megaphone,
    email: Mail,
    sms: Smartphone,
    whatsapp: MessageSquare
  };

  const mainTabs = [
    { id: 'social', label: 'Social Planner', icon: Share2 },
    { id: 'emails', label: 'Emails', icon: Mail },
    { id: 'timers', label: 'Countdown Timers', icon: Clock },
    { id: 'links', label: 'Trigger Links', icon: LinkIcon },
    { id: 'ads', label: 'Ad Manager', icon: Layout },
  ];

  const emailSubTabs = [
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'campaigns', label: 'Campaigns', icon: Mail },
    { id: 'templates', label: 'Templates', icon: FileText },
  ];

  if (view === 'create') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('list')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Campaign</h1>
            <p className="text-slate-500 mt-1">Design your next high-impact marketing campaign</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-white space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Campaign Name</label>
                <input 
                  type="text" 
                  defaultValue={activeClient ? `${activeClient.name} - ${activeClient.industry} Growth` : ''}
                  placeholder="e.g., Summer Solstice Sale 2024"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Channel</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                    <option disabled={!launchpad.channels.social} value="social">
                      Social Media {!launchpad.channels.social && '(Connect in Launchpad)'}
                    </option>
                    <option disabled={!launchpad.channels.email} value="email">
                      Email Marketing {!launchpad.channels.email && '(Connect in Launchpad)'}
                    </option>
                    <option disabled={!launchpad.channels.sms} value="sms">
                      SMS Blast {!launchpad.channels.sms && '(Connect in Launchpad)'}
                    </option>
                    <option disabled={!launchpad.channels.whatsapp} value="whatsapp">
                      WhatsApp Business {!launchpad.channels.whatsapp && '(Connect in Launchpad)'}
                    </option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Campaign Type / Template</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                    <option value="standard">Standard Broadcast</option>
                    <option value="review_booster">Google Review Booster</option>
                    <option value="newsletter">Monthly Newsletter</option>
                    <option value="event">Event Promotion</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Target Audience</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                    <option value="default">Default Launchpad Audience</option>
                    <option disabled={!launchpad.crm.contacts} value="all">
                      All Leads {!launchpad.crm.contacts && '(Sync CRM first)'}
                    </option>
                    <option value="new">New Prospects</option>
                    <option disabled={!launchpad.setup.tracking} value="retargeting">
                      Retargeting List {!launchpad.setup.tracking && '(Enable Tracking first)'}
                    </option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Target Segment</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                    <option value="all">All Contacts</option>
                    {MOCK_SEGMENTS.filter(s => !activeClient || s.clientId === activeClient.id).map(segment => (
                      <option key={segment.id} value={segment.id}>{segment.name} ({segment.contactCount} contacts)</option>
                    ))}
                    <option value="new">New Customers (Last 30 days)</option>
                    <option value="inactive">Inactive (No visit this year)</option>
                    <option value="loyal">Loyal (4+ visits/week)</option>
                    <option value="leads">Unconverted Leads (CRM)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Campaign Objective</label>
                <textarea 
                  rows={4}
                  defaultValue={activeClient?.goals?.[0] ? `Our primary goal is to ${activeClient.goals[0].toLowerCase()}.` : ''}
                  placeholder="Describe what you want to achieve with this campaign..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                />
              </div>
            </div>

            <div className="card bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Budget & Schedule</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  <ShieldCheck size={14} />
                  Tracking Inherited
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Daily Budget</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Start Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card bg-primary text-white overflow-hidden relative" style={{ 
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)', 
              backgroundSize: '20px 20px' 
            }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-purple-200" />
                  AI Optimization
                </h3>
                <p className="text-sm text-purple-100 mb-6">
                  Let our AI assistant help you craft the perfect copy and select the best performing assets for this campaign.
                </p>
                <button 
                  onClick={() => {
                    setActiveTab('ai');
                    toast.info('Switching to AI Assistant for campaign copy...');
                  }}
                  className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-white/20"
                >
                  Generate Copy with AI
                </button>
              </div>
            </div>

            <div className="card bg-white border-2 border-primary/10">
              <h3 className="font-bold mb-4">Summary</h3>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Reach</span>
                  <span className="font-bold">12.5k - 18k</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Est. Conversion Rate</span>
                  <span className="font-bold text-emerald-600">~3.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Platform Fees</span>
                  <span className="font-bold">$45.00</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between text-base">
                  <span className="font-bold">Total Est. Cost</span>
                  <span className="font-bold text-primary">$450.00</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    toast.success(`Proof sent to client for approval!`);
                  }}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-600 transition-all flex items-center justify-center gap-2"
                >
                  <Mail size={18} />
                  Send Proof to Client
                </button>
                <button 
                  onClick={() => {
                    setView('list');
                    toast.success('Campaign launched successfully!');
                  }}
                  className="w-full btn-primary py-4 text-lg"
                >
                  Launch Campaign
                </button>
              </div>
              <button 
                onClick={() => setView('list')}
                className="w-full mt-3 py-2 text-sm text-slate-500 font-medium hover:text-slate-700"
              >
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderMarketingContent = () => {
    switch (activeMarketingTab) {
      case 'social':
        return (
          <div className="animate-in fade-in duration-500">
            {activeClient ? (
              <SocialPlanner client={activeClient} />
            ) : (
              <div className="card bg-white p-12 text-center border-dashed border-2 border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4">
                  <Calendar size={32} />
                </div>
                <h4 className="font-bold mb-2">No Client Selected</h4>
                <p className="text-sm text-slate-500 mb-6">Please select a sub-account to manage their social media presence.</p>
              </div>
            )}
          </div>
        );
      case 'emails':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
              {emailSubTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveEmailSubTab(tab.id as EmailSubTab)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all",
                    activeEmailSubTab === tab.id 
                      ? "bg-white text-primary shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {activeEmailSubTab === 'campaigns' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                  <div className="flex gap-1">
                    {['all', 'active', 'scheduled', 'paused', 'completed'].map(f => (
                      <button
                        key={f}
                        onClick={() => {
                          setFilter(f);
                          toast.info(`Filtering by status: ${f}`);
                        }}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors",
                          filter === f ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={handleCreateClick}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus size={18} />
                    New Email Campaign
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Campaign Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Leads</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Spend</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Open Rate</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Performance</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {campaigns
                        .filter(c => c.type === 'email' && (filter === 'all' || c.status === filter))
                        .map(campaign => (
                          <tr key={campaign.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                  <Mail size={16} />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-800 group-hover:text-primary transition-colors">{campaign.name}</div>
                                  <div className="text-[10px] text-slate-400 font-medium">Started {campaign.startDate}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "w-2 h-2 rounded-full",
                                  campaign.status === 'active' ? "bg-emerald-500" : 
                                  campaign.status === 'scheduled' ? "bg-blue-500" : "bg-slate-300"
                                )} />
                                <span className="text-xs font-bold text-slate-600 capitalize">{campaign.status}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-sm font-bold text-slate-700">{campaign.leads}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-sm font-bold text-slate-700">${campaign.spend}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-sm font-bold text-primary">{campaign.analytics?.openRate || 0}%</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                                campaign.performance === 'high' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                campaign.performance === 'stable' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                "bg-rose-50 text-rose-600 border border-rose-100"
                              )}>
                                {campaign.performance}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-primary transition-all shadow-sm border border-transparent hover:border-slate-100">
                                  <Pause size={14} />
                                </button>
                                <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-primary transition-all shadow-sm border border-transparent hover:border-slate-100">
                                  <Copy size={14} />
                                </button>
                                <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-rose-500 transition-all shadow-sm border border-transparent hover:border-slate-100">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {campaigns.filter(c => c.type === 'email' && (filter === 'all' || c.status === filter)).length === 0 && (
                    <div className="py-20 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                        <Mail size={32} />
                      </div>
                      <h4 className="font-bold text-slate-800">No campaigns found</h4>
                      <p className="text-sm text-slate-500">Try adjusting your filters or create a new campaign.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeEmailSubTab === 'stats' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Email Performance Analytics</h3>
                    <p className="text-sm text-slate-500">Real-time engagement tracking for your campaigns</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500">Filter by Campaign:</span>
                    <select 
                      value={statsCampaignFilter}
                      onChange={(e) => setStatsCampaignFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">All Campaigns</option>
                      {campaigns.filter(c => c.type === 'email').map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="card bg-white p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Avg. Open Rate</div>
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <CheckCircle2 size={16} />
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="text-3xl font-bold">32.4%</div>
                      <div className="text-xs font-bold text-emerald-500 mb-1">+2.1%</div>
                    </div>
                    <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '32.4%' }} />
                    </div>
                  </div>
                  <div className="card bg-white p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Click-Through Rate</div>
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Zap size={16} />
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="text-3xl font-bold">4.8%</div>
                      <div className="text-xs font-bold text-blue-500 mb-1">+0.5%</div>
                    </div>
                    <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '4.8%' }} />
                    </div>
                  </div>
                  <div className="card bg-white p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Conversion Rate</div>
                      <div className="p-2 bg-purple-50 text-primary rounded-lg">
                        <Rocket size={16} />
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="text-3xl font-bold">1.2%</div>
                      <div className="text-xs font-bold text-primary mb-1">+0.2%</div>
                    </div>
                    <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '12%' }} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card bg-white p-6">
                    <h4 className="font-bold text-slate-800 mb-6">Engagement Summary</h4>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={MOCK_ENGAGEMENT_DATA}
                          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fontWeight: 600, fill: '#475569' }}
                            width={80}
                          />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend 
                            verticalAlign="bottom" 
                            height={36} 
                            iconType="circle"
                            formatter={(value) => <span className="text-xs font-bold text-slate-500">{value === 'email' ? 'Email Campaign' : value === 'workflow' ? 'Workflow Campaign' : 'Bulk Action Campaign'}</span>}
                          />
                          <Bar dataKey="email" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="workflow" stackId="a" fill="#818cf8" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="bulk" stackId="a" fill="#93c5fd" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="card bg-white p-6">
                    <h4 className="font-bold text-slate-800 mb-6">Performance Analysis</h4>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_EMAIL_STATS}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: '#64748b' }}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: '#64748b' }}
                          />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend 
                            verticalAlign="top" 
                            align="right"
                            iconType="circle"
                            wrapperStyle={{ paddingBottom: '20px' }}
                            formatter={(value) => <span className="text-xs font-bold text-slate-500 capitalize">{value}</span>}
                          />
                          <Bar dataKey="delivered" fill="#6366f1" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="bounced" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="unsubscribed" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="spam" fill="#64748b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeEmailSubTab === 'templates' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Email Templates</h3>
                    <p className="text-sm text-slate-500">Choose a starting point for your next campaign</p>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setShowTemplateOverlay(!showTemplateOverlay)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Plus size={18} />
                      New
                    </button>

                    <AnimatePresence>
                      {showTemplateOverlay && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowTemplateOverlay(false)}
                          />
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 z-20 overflow-hidden"
                          >
                            <div className="p-2">
                              {[
                                { id: 'existing', label: 'Create Template from existing campaign', icon: Copy, desc: 'Clone from a previous send' },
                                { id: 'library', label: 'Email Marketing Templates', icon: Layout, desc: 'Browse our designer library' },
                                { id: 'blank', label: 'Blank Template', icon: FileText, desc: 'Start from scratch' },
                                { id: 'import', label: 'Import Email', icon: Smartphone, desc: 'Upload HTML or URL' },
                              ].map((option) => (
                                <button
                                  key={option.id}
                                  onClick={() => {
                                    if (option.id === 'blank') {
                                      setShowBlankTemplateEditor(true);
                                    } else {
                                      toast.success(`Starting flow: ${option.label}`);
                                    }
                                    setShowTemplateOverlay(false);
                                  }}
                                  className="w-full flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group"
                                >
                                  <div className="p-2 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <option.icon size={16} />
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{option.label}</div>
                                    <div className="text-[10px] text-slate-400">{option.desc}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {MOCK_EMAIL_TEMPLATES.map(template => (
                    <div key={template.id} className="card bg-white p-0 overflow-hidden group cursor-pointer hover:shadow-lg transition-all border border-slate-200">
                      <div className="aspect-[3/4] bg-slate-50 flex items-center justify-center text-slate-200 group-hover:bg-purple-50 transition-all relative">
                        <img 
                          src={template.thumbnail} 
                          alt={template.name}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button className="px-4 py-2 bg-white text-primary rounded-full text-xs font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
                            Use Template
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-sm text-slate-800">{template.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1">{template.description}</p>
                        <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <Clock size={10} />
                          Last used {template.lastUsed}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'timers':
        return (
          <MarketingModuleView 
            title="Countdown Timers" 
            icon={Clock} 
            description="Create urgency with dynamic countdown timers for your emails and landing pages." 
            data={MOCK_TIMERS}
          />
        );
      case 'links':
        return (
          <MarketingModuleView 
            title="Trigger Links" 
            icon={LinkIcon} 
            description="Track clicks and trigger automated workflows when users interact with your links." 
            data={MOCK_LINKS}
          />
        );
      case 'ads':
        return (
          <AdManagerView 
            title="Ad Manager" 
            icon={Layout} 
            description="Manage your Facebook, Instagram, and Google Ads campaigns from one central dashboard." 
            data={MOCK_ADS}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <AnimatePresence>
        {showBlankTemplateEditor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 bg-slate-50 flex flex-col"
          >
            {/* Editor Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowBlankTemplateEditor(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <input 
                    type="text" 
                    defaultValue="Untitled Template" 
                    className="font-bold text-slate-800 bg-transparent border-none outline-none focus:ring-0 p-0 text-lg w-64"
                  />
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Draft • Last saved just now</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-100 rounded-lg p-1 mr-4">
                  <button className="p-1.5 text-slate-500 hover:bg-white hover:text-primary rounded-md transition-all">
                    <Undo2 size={16} />
                  </button>
                  <button className="p-1.5 text-slate-500 hover:bg-white hover:text-primary rounded-md transition-all">
                    <Redo2 size={16} />
                  </button>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-xl transition-all">
                  <Eye size={18} />
                  Preview
                </button>
                <button 
                  onClick={() => {
                    toast.success('Template saved successfully!');
                    setShowBlankTemplateEditor(false);
                  }}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Template
                </button>
              </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar - Blocks */}
              <aside className="w-72 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
                <div className="p-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Content Blocks</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Type, label: 'Text', color: 'text-blue-500', bg: 'bg-blue-50' },
                      { icon: ImageIcon, label: 'Image', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                      { icon: Square, label: 'Button', color: 'text-primary', bg: 'bg-purple-50' },
                      { icon: Columns, label: 'Columns', color: 'text-orange-500', bg: 'bg-orange-50' },
                      { icon: Share2, label: 'Social', color: 'text-pink-500', bg: 'bg-pink-50' },
                      { icon: LinkIcon, label: 'Divider', color: 'text-slate-500', bg: 'bg-slate-50' },
                      { icon: Play, label: 'Video', color: 'text-rose-500', bg: 'bg-rose-50' },
                      { icon: BarChart3, label: 'Chart', color: 'text-cyan-500', bg: 'bg-cyan-50' },
                    ].map((block) => (
                      <button 
                        key={block.label}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 hover:border-primary hover:shadow-md transition-all group"
                      >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110", block.bg, block.color)}>
                          <block.icon size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{block.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-3 text-primary mb-2">
                    <Sparkles size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">AI Assistant</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-4">Let AI help you write compelling copy or generate images for your template.</p>
                  <button className="w-full py-2 bg-white border border-primary/20 text-primary text-xs font-bold rounded-xl hover:bg-primary hover:text-white transition-all">
                    Generate with AI
                  </button>
                </div>
              </aside>

              {/* Main Canvas */}
              <main className="flex-1 bg-slate-100 p-12 overflow-y-auto flex justify-center">
                <div className="w-full max-w-[600px] min-h-[800px] bg-white shadow-2xl rounded-sm flex flex-col">
                  {/* Email Content Area */}
                  <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 w-16">Subject:</span>
                        <input type="text" placeholder="Enter subject line..." className="flex-1 bg-transparent border-none text-sm outline-none focus:ring-0 p-0" />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 w-16">Preview:</span>
                        <input type="text" placeholder="Enter preview text..." className="flex-1 bg-transparent border-none text-sm outline-none focus:ring-0 p-0" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 m-8 rounded-xl group hover:border-primary/30 transition-all cursor-pointer">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all mb-4">
                      <MousePointer2 size={32} />
                    </div>
                    <h4 className="font-bold text-slate-400 group-hover:text-slate-600 transition-colors">Drag and drop blocks here</h4>
                    <p className="text-xs text-slate-400 mt-1">Or click a block in the sidebar to add it</p>
                  </div>

                  <footer className="p-8 text-center border-t border-slate-100">
                    <div className="flex justify-center gap-4 mb-4">
                      <div className="w-8 h-8 rounded-full bg-slate-100" />
                      <div className="w-8 h-8 rounded-full bg-slate-100" />
                      <div className="w-8 h-8 rounded-full bg-slate-100" />
                    </div>
                    <p className="text-[10px] text-slate-400">© 2026 Outreach Agency. All rights reserved.</p>
                    <p className="text-[10px] text-slate-400 mt-1">You are receiving this because you subscribed to our newsletter.</p>
                    <button className="text-[10px] text-primary font-bold mt-2 hover:underline">Unsubscribe</button>
                  </footer>
                </div>
              </main>

              {/* Right Sidebar - Properties */}
              <aside className="w-80 bg-white border-l border-slate-200 flex flex-col overflow-y-auto">
                <div className="flex border-b border-slate-100">
                  <button className="flex-1 py-4 text-xs font-bold text-primary border-b-2 border-primary">Properties</button>
                  <button className="flex-1 py-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Global Styles</button>
                </div>

                <div className="p-6 space-y-8">
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Canvas Settings</h4>
                      <Settings2 size={14} className="text-slate-400" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Background Color</label>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg border border-slate-200 bg-white" />
                          <input type="text" defaultValue="#FFFFFF" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Content Width</label>
                        <div className="flex items-center gap-2">
                          <input type="range" className="flex-1 accent-primary" />
                          <span className="text-xs font-bold text-slate-600 w-12 text-right">600px</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Typography</h4>
                      <Settings2 size={14} className="text-slate-400" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Font Family</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none">
                          <option>Inter, sans-serif</option>
                          <option>Georgia, serif</option>
                          <option>Monospace</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Text Size</label>
                          <input type="number" defaultValue={16} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Line Height</label>
                          <input type="number" defaultValue={1.5} step={0.1} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none" />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Layers size={16} className="text-primary" />
                      <h4 className="text-xs font-bold text-slate-800">Layer Management</h4>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Select an element on the canvas to edit its specific properties and layer order.</p>
                  </section>
                </div>
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {activeClient ? `${activeClient.name} Marketing` : 'Marketing Hub'}
          </h1>
          <p className="text-slate-500 mt-1">Manage and launch marketing campaigns across all channels</p>
        </div>
        <div className="flex gap-2">
          {launchpad.score >= 80 && (
            <button 
              onClick={() => {
                toast.success('Quick Launch initiated! Using Launchpad defaults.');
                setView('list');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <Zap size={16} className="text-primary" />
              Quick Launch
            </button>
          )}
          <button 
            onClick={handleCreateClick}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Launch Campaign
          </button>
        </div>
      </div>

      {/* Main Marketing Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px overflow-x-auto no-scrollbar">
        {mainTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveMarketingTab(tab.id as MarketingTab)}
            className={cn(
              "px-6 py-4 text-sm font-bold flex items-center gap-2 transition-all relative",
              activeMarketingTab === tab.id 
                ? "text-primary" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
            {activeMarketingTab === tab.id && (
              <motion.div 
                layoutId="activeMarketingTab" 
                className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" 
              />
            )}
          </button>
        ))}
      </div>

      {renderMarketingContent()}

      <AnimatePresence>
        {showReadinessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl border border-slate-200"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                  <AlertCircle size={40} />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">Workspace Not Ready</h2>
                  <p className="text-slate-500">
                    Your Launchpad score is <span className="font-bold text-rose-600">{launchpad.score}%</span>. 
                    You must complete essential setup before launching campaigns.
                  </p>
                </div>

                <div className="w-full space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left mb-2">Missing Requirements</div>
                  {[
                    { label: 'Email Connection', ok: launchpad.channels.email },
                    { label: 'CRM Sync', ok: launchpad.crm.contacts },
                    { label: 'Tracking Setup', ok: launchpad.setup.tracking },
                  ].map((req, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">{req.label}</span>
                      {req.ok ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <Circle size={16} className="text-slate-300" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col w-full gap-3">
                  <button 
                    onClick={() => {
                      setShowLaunchpadDrawer(true);
                      setShowReadinessModal(false);
                    }}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                  >
                    Fix Setup Inline <ArrowRight size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('launchpad');
                      setShowReadinessModal(false);
                    }}
                    className="w-full py-2 text-sm font-bold text-slate-600 hover:text-slate-900"
                  >
                    Go to Full Launchpad
                  </button>
                  <button 
                    onClick={() => setShowReadinessModal(false)}
                    className="w-full py-2 text-sm font-bold text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showLaunchpadDrawer && (
          <div className="fixed inset-0 z-[60] flex justify-end bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Rocket size={20} className="text-primary" />
                  <h2 className="font-bold text-slate-900">Inline Setup</h2>
                </div>
                <button 
                  onClick={() => setShowLaunchpadDrawer(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Launchpad activeClient={activeClient} isInline onClose={() => setShowLaunchpadDrawer(false)} />
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50">
                <button 
                  onClick={() => setShowLaunchpadDrawer(false)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                >
                  Return to Campaign
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AdManagerView({ title, icon: Icon, description, data }: { title: string, icon: any, description: string, data?: any[] }) {
  const [activeSubTab, setActiveSubTab] = useState<'campaigns' | 'connections'>('campaigns');
  const [connectedAccounts, setConnectedAccounts] = useState({
    facebook: true,
    instagram: true,
    google: false,
    linkedin: false,
    twitter: false
  });

  const platforms = [
    { id: 'facebook', name: 'Facebook Ads', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'instagram', name: 'Instagram Ads', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: 'google', name: 'Google Ads', icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'linkedin', name: 'LinkedIn Ads', icon: Linkedin, color: 'text-blue-700', bg: 'bg-blue-50' },
    { id: 'twitter', name: 'X (Twitter) Ads', icon: Twitter, color: 'text-slate-900', bg: 'bg-slate-50' },
  ];

  const handleConnect = (id: string) => {
    const isConnecting = !connectedAccounts[id as keyof typeof connectedAccounts];
    setConnectedAccounts(prev => ({ ...prev, [id]: isConnecting }));
    toast.success(isConnecting ? `${id.charAt(0).toUpperCase() + id.slice(1)} account connected!` : `${id.charAt(0).toUpperCase() + id.slice(1)} account disconnected.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveSubTab('campaigns')}
            className={cn(
              "px-4 py-2 text-sm font-bold rounded-lg transition-all",
              activeSubTab === 'campaigns' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Campaigns
          </button>
          <button 
            onClick={() => setActiveSubTab('connections')}
            className={cn(
              "px-4 py-2 text-sm font-bold rounded-lg transition-all",
              activeSubTab === 'connections' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Connections
          </button>
        </div>
      </div>

      {activeSubTab === 'campaigns' ? (
        <>
          <div className="flex justify-end">
            <button className="btn-primary flex items-center gap-2">
              <Plus size={18} />
              Create Ad Campaign
            </button>
          </div>
          {data && data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((item, i) => (
                <div key={i} className="card bg-white group hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-secondary rounded-lg text-primary">
                      <Icon size={20} />
                    </div>
                    <h4 className="font-bold group-hover:text-primary transition-colors">{item.name}</h4>
                  </div>
                  <p className="text-sm text-slate-500 mb-6">{item.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.status}</span>
                    <button className="text-primary text-xs font-bold hover:underline">Manage</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card bg-white p-12 text-center min-h-[300px] flex flex-col items-center justify-center border-dashed border-2 border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
                <Icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">No {title} found</h3>
              <p className="text-slate-500 max-w-xs mx-auto mb-6">Start by creating your first {title.toLowerCase()} to drive more conversions.</p>
              <button className="btn-primary px-8">Get Started</button>
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform) => {
            const isConnected = connectedAccounts[platform.id as keyof typeof connectedAccounts];
            return (
              <div key={platform.id} className="card bg-white flex flex-col items-center text-center p-8 group hover:shadow-md transition-all">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", platform.bg, platform.color)}>
                  <platform.icon size={32} />
                </div>
                <h4 className="font-bold text-slate-800 mb-1">{platform.name}</h4>
                <p className="text-xs text-slate-500 mb-6">Connect your {platform.name} account to sync campaigns and reporting.</p>
                <button 
                  onClick={() => handleConnect(platform.id)}
                  className={cn(
                    "w-full py-2.5 rounded-xl text-sm font-bold transition-all",
                    isConnected 
                      ? "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100" 
                      : "bg-primary text-white hover:bg-primary/90 shadow-sm"
                  )}
                >
                  {isConnected ? 'Disconnect Account' : 'Connect Account'}
                </button>
                {isConnected && (
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    <CheckCircle2 size={12} />
                    Connected
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MarketingModuleView({ title, icon: Icon, description, data }: { title: string, icon: any, description: string, data?: any[] }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Create New
        </button>
      </div>

      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, i) => (
            <div key={i} className="card bg-white group hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-secondary rounded-lg text-primary">
                  <Icon size={20} />
                </div>
                <h4 className="font-bold group-hover:text-primary transition-colors">{item.name}</h4>
              </div>
              <p className="text-sm text-slate-500 mb-6">{item.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.status}</span>
                <button className="text-primary text-xs font-bold hover:underline">Manage</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card bg-white p-12 text-center min-h-[300px] flex flex-col items-center justify-center border-dashed border-2 border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
            <Icon size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">No {title} found</h3>
          <p className="text-slate-500 max-w-xs mx-auto mb-6">Start by creating your first {title.toLowerCase()} to drive more conversions.</p>
          <button className="btn-primary px-8">Get Started</button>
        </div>
      )}
    </div>
  );
}

function CampaignCard({ campaign, clients, activeClient, typeIcons }: any) {
  const Icon = typeIcons[campaign.type as keyof typeof typeIcons];
  const client = clients.find((c: any) => c.id === campaign.clientId);

  return (
    <div className="card bg-white group hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-lg text-primary">
            <Icon size={20} />
          </div>
          <div>
            <h4 className="font-bold group-hover:text-primary transition-colors">{campaign.name}</h4>
            {!activeClient && (
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <img src={client?.logo} className="w-3 h-3 rounded-full" />
                {client?.name}
              </div>
            )}
          </div>
        </div>
        <button 
          onClick={() => toast.info(`Options for campaign: ${campaign.name}`)}
          className="p-1 text-slate-400 hover:text-slate-600"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="text-xs text-slate-500 mb-1">Leads</div>
          <div className="text-lg font-bold">{campaign.leads}</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="text-xs text-slate-500 mb-1">Spend</div>
          <div className="text-lg font-bold">${campaign.spend}</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className={cn(
            "w-2 h-2 rounded-full",
            campaign.status === 'active' ? "bg-emerald-500" : "bg-slate-300"
          )} />
          <span className="text-xs font-medium text-slate-600 capitalize">{campaign.status}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => toast.success(`Campaign "${campaign.name}" paused.`)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" 
            title="Pause"
          >
            <Pause size={16} />
          </button>
          <button 
            onClick={() => toast.success(`Campaign "${campaign.name}" duplicated.`)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" 
            title="Duplicate"
          >
            <Copy size={16} />
          </button>
          <button 
            onClick={() => toast.error(`Campaign "${campaign.name}" deleted.`)}
            className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition-colors" 
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
