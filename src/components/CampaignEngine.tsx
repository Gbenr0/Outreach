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
  Calendar
} from 'lucide-react';
import { 
  MOCK_CAMPAIGNS, 
  MOCK_CLIENTS, 
  MOCK_SEGMENTS, 
  MOCK_TIMERS, 
  MOCK_LINKS, 
  MOCK_ADS 
} from '../mockData';
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
            <div className="card bg-slate-900 text-white">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-purple-400" />
                AI Optimization
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                Let our AI assistant help you craft the perfect copy and select the best performing assets for this campaign.
              </p>
              <button 
                onClick={() => {
                  setActiveTab('ai');
                  toast.info('Switching to AI Assistant for campaign copy...');
                }}
                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
              >
                Generate Copy with AI
              </button>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaigns.filter(c => c.type === 'email').map(campaign => (
                    <CampaignCard key={campaign.id} campaign={campaign} clients={clients} activeClient={activeClient} typeIcons={typeIcons} />
                  ))}
                  <button 
                    onClick={handleCreateClick}
                    className="card border-dashed border-2 border-slate-200 bg-transparent flex flex-col items-center justify-center gap-3 group hover:border-primary hover:bg-purple-50 transition-all min-h-[200px]"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                      <Plus size={24} />
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-slate-600 group-hover:text-primary">Create New Email</div>
                      <div className="text-xs text-slate-400">Start from a template</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {activeEmailSubTab === 'stats' && (
              <div className="card bg-white p-12 text-center animate-in fade-in duration-300">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-500 mx-auto mb-6">
                  <BarChart3 size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Email Statistics</h3>
                <p className="text-slate-500 max-w-md mx-auto">Track open rates, click-throughs, and conversion metrics across all your email campaigns.</p>
              </div>
            )}

            {activeEmailSubTab === 'templates' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="card bg-white p-0 overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
                    <div className="aspect-[3/4] bg-slate-100 flex items-center justify-center text-slate-300">
                      <FileText size={48} />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-sm">Template {i}</h4>
                      <p className="text-xs text-slate-400">Last used 2 days ago</p>
                    </div>
                  </div>
                ))}
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
          <MarketingModuleView 
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
