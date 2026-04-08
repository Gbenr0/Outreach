import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MasterDashboard } from './components/MasterDashboard';
import { SubAccounts } from './components/SubAccounts';
import { ClientDashboard } from './components/ClientDashboard';
import { CampaignEngine } from './components/CampaignEngine';
import { ContentCalendar } from './components/ContentCalendar';
import { SocialPlanner } from './components/SocialPlanner';
import { Launchpad } from './components/Launchpad';
import { CRM } from './components/CRM';
import { Conversations } from './components/Conversations';
import { AIAssistant } from './components/AIAssistant';
import { Analytics } from './components/Analytics';
import { Automation } from './components/Automation';
import { Client } from './types';
import { 
  MOCK_CLIENTS, 
  MOCK_MARKETPLACE, 
  MOCK_PAYMENTS, 
  MOCK_MEMBERSHIP, 
  MOCK_MEDIA, 
  MOCK_REPUTATION 
} from './mockData';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';
import * as Icons from 'lucide-react';
import { 
  X, 
  Building2, 
  Mail, 
  Phone, 
  User, 
  Target, 
  Plus,
  Palette 
} from 'lucide-react';

function ModuleView({ title, icon, description, data }: { title: string, icon: string, description: string, data?: any[] }) {
  const Icon = (Icons as any)[icon] || Icons.HelpCircle;
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-slate-500 mt-1">{description}</p>
        </div>
        <button className="btn-primary px-6 py-2.5 flex items-center gap-2">
          <Plus size={18} />
          Add New
        </button>
      </div>

      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-slate-800">{item.name || item.title}</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4">{item.description || item.content || 'Manage your details here.'}</p>
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.status || 'Active'}</span>
                <button className="text-primary text-xs font-bold hover:underline">View Details</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-4 shadow-sm">
            <Icon size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No {title} found</h2>
          <p className="text-slate-500 max-w-xs mx-auto mb-6">Start by adding your first {title.toLowerCase()} to manage your operations.</p>
          <button className="btn-primary px-8">Get Started</button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [campaignView, setCampaignView] = useState<'list' | 'create'>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State for new sub-account
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    color: '#7c3aed',
    goals: ''
  });

  const handleUpdateClient = (clientId: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...updates } : c));
    if (activeClient?.id === clientId) {
      setActiveClient(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.industry) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newClient: Client = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      industry: formData.industry,
      contactPerson: formData.contactPerson,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      color: formData.color,
      goals: formData.goals.split(',').map(g => g.trim()).filter(g => g !== ''),
      logo: `https://picsum.photos/seed/${formData.name.toLowerCase().replace(/\s/g, '')}/100/100`,
      activeCampaigns: 0,
      totalLeads: 0,
      revenueImpact: 0,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      launchpad: {
        channels: { email: false, sms: false, social: false, whatsapp: false },
        crm: { contacts: false, pipelines: false },
        setup: { domain: false, funnel: false, automation: false, tracking: false },
        score: 0
      }
    };

    setClients(prev => [...prev, newClient]);
    toast.success(`Successfully added ${newClient.name}!`);
    setShowCreateModal(false);
    setFormData({
      name: '',
      industry: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      color: '#7c3aed',
      goals: ''
    });
  };

  const renderContent = () => {
    if (!activeClient) {
      // Agency Context
      switch (activeTab) {
        case 'dashboard':
          return (
            <MasterDashboard 
              clients={clients}
              setActiveTab={setActiveTab} 
              setActiveClient={setActiveClient} 
              setCampaignView={setCampaignView}
            />
          );
        case 'subaccounts':
          return (
            <SubAccounts 
              clients={clients}
              setActiveClient={setActiveClient} 
              setActiveTab={setActiveTab} 
              setShowCreateModal={setShowCreateModal}
            />
          );
        case 'prospecting':
          return (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Agency Prospecting</h1>
                <p className="text-slate-500 mt-1">Manage your agency's own sales pipeline and high-value leads</p>
              </div>
              <CRM 
                clients={clients}
                activeClient={null} 
                setActiveTab={setActiveTab} 
                setActiveClient={setActiveClient} 
                setCampaignView={setCampaignView}
              />
            </div>
          );
        case 'conversations':
          return (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Agency Inbox</h1>
                <p className="text-slate-500 mt-1">Unified communication for all agency-level inquiries</p>
              </div>
              <Conversations 
                clients={clients}
                activeClient={null} 
                setActiveTab={setActiveTab} 
                setActiveClient={setActiveClient} 
                onUpdateClient={handleUpdateClient}
              />
            </div>
          );
        case 'reporting':
          return (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Global Reporting</h1>
                <p className="text-slate-500 mt-1">Aggregated performance analytics across all sub-accounts</p>
              </div>
              <Analytics 
                activeClient={null} 
                setActiveTab={setActiveTab} 
                setActiveClient={setActiveClient} 
                setCampaignView={setCampaignView}
              />
            </div>
          );
        case 'automation':
          return (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Agency Automation</h1>
                <p className="text-slate-500 mt-1">Global workflows and operational automations for your agency</p>
              </div>
              <Automation 
                activeClient={null} 
                setActiveTab={setActiveTab} 
                setActiveClient={setActiveClient} 
              />
            </div>
          );
        case 'ai-agents':
          return (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Agency AI Assistant</h1>
                <p className="text-slate-500 mt-1">AI-powered insights and assistance for agency management</p>
              </div>
              <AIAssistant 
                activeClient={null} 
                setActiveTab={setActiveTab} 
                setActiveClient={setActiveClient} 
              />
            </div>
          );
        case 'marketplace':
          return (
            <ModuleView 
              title="Agency Marketplace" 
              icon="ShoppingBag" 
              description="Discover and install powerful extensions to scale your agency operations." 
              data={MOCK_MARKETPLACE}
            />
          );
        default:
          return (
            <MasterDashboard 
              clients={clients}
              setActiveTab={setActiveTab} 
              setActiveClient={setActiveClient} 
              setCampaignView={setCampaignView}
            />
          );
      }
    }

    // Sub-Account Context
    switch (activeTab) {
      case 'launchpad':
        return (
          <Launchpad 
            activeClient={activeClient} 
            onUpdateClient={handleUpdateClient}
          />
        );
      case 'dashboard':
        return (
          <ClientDashboard 
            client={activeClient} 
            setActiveTab={setActiveTab} 
            setActiveClient={setActiveClient} 
            setCampaignView={setCampaignView}
          />
        );
      case 'conversations':
        return (
          <Conversations 
            clients={clients}
            activeClient={activeClient} 
            setActiveTab={setActiveTab} 
            setActiveClient={setActiveClient} 
            onUpdateClient={handleUpdateClient}
          />
        );
      case 'calendar':
        return (
          <ContentCalendar 
            clients={clients}
            activeClient={activeClient} 
            setActiveTab={setActiveTab} 
            setActiveClient={setActiveClient} 
            setCampaignView={setCampaignView}
          />
        );
      case 'contacts':
      case 'opportunities':
        return (
          <CRM 
            clients={clients}
            activeClient={activeClient} 
            setActiveTab={setActiveTab} 
            setActiveClient={setActiveClient} 
            setCampaignView={setCampaignView}
          />
        );
      case 'payments':
        return (
          <ModuleView 
            title="Payments" 
            icon="CreditCard" 
            description="Manage invoices, subscriptions, and payment gateways." 
            data={MOCK_PAYMENTS}
          />
        );
      case 'ai-agents':
        return (
          <AIAssistant 
            activeClient={activeClient} 
            setActiveTab={setActiveTab} 
            setActiveClient={setActiveClient} 
          />
        );
      case 'marketing':
        return (
          <CampaignEngine 
            clients={clients}
            activeClient={activeClient} 
            setActiveTab={setActiveTab} 
            setActiveClient={setActiveClient} 
            view={campaignView}
            setView={setCampaignView}
          />
        );
      case 'automation':
        return (
          <Automation 
            activeClient={activeClient} 
            setActiveTab={setActiveTab} 
            setActiveClient={setActiveClient} 
          />
        );
      case 'membership':
        return (
          <ModuleView 
            title="Membership" 
            icon="Award" 
            description="Create and manage courses, communities, and member areas." 
            data={MOCK_MEMBERSHIP}
          />
        );
      case 'media':
        return (
          <ModuleView 
            title="Media Storage" 
            icon="HardDrive" 
            description="Centralized storage for all your brand assets and campaign media." 
            data={MOCK_MEDIA}
          />
        );
      case 'reputation':
        return (
          <ModuleView 
            title="Reputation" 
            icon="Star" 
            description="Monitor reviews, manage Google Business Profile, and request feedback." 
            data={MOCK_REPUTATION}
          />
        );
      case 'reporting':
        return (
          <Analytics 
            activeClient={activeClient} 
            setActiveTab={setActiveTab} 
            setActiveClient={setActiveClient} 
            setCampaignView={setCampaignView}
          />
        );
      case 'marketplace':
        return (
          <ModuleView 
            title="App Marketplace" 
            icon="ShoppingBag" 
            description="Extend your workspace with powerful integrations and add-ons." 
            data={MOCK_MARKETPLACE}
          />
        );
      default:
        return (
          <ClientDashboard 
            client={activeClient} 
            setActiveTab={setActiveTab} 
            setActiveClient={setActiveClient} 
            setCampaignView={setCampaignView}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        clients={clients}
        activeClient={activeClient}
        setActiveClient={setActiveClient}
        setShowCreateModal={setShowCreateModal}
      />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        <div className="flex-1 p-8 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${activeClient?.id || 'master'}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3 
              }}
              className="w-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Global Create Sub-Account Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Create Sub-Account</h2>
                    <p className="text-sm text-slate-500">Onboard a new client business to your agency</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddClient} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Building2 size={14} className="text-slate-400" />
                      Business Name <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., TechNova Solutions"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Target size={14} className="text-slate-400" />
                      Industry <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      required
                      type="text" 
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      placeholder="e.g., Sustainable Fashion"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      Contact Person
                    </label>
                    <input 
                      type="text" 
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                      placeholder="e.g., Alex Rivera"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      Contact Email
                    </label>
                    <input 
                      type="email" 
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                      placeholder="e.g., alex@business.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      Contact Phone
                    </label>
                    <input 
                      type="tel" 
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                      placeholder="e.g., +1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Palette size={14} className="text-slate-400" />
                      Brand Color
                    </label>
                    <div className="flex gap-3">
                      <input 
                        type="color" 
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer p-1"
                      />
                      <input 
                        type="text" 
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Target size={14} className="text-slate-400" />
                    Business Goals (comma separated)
                  </label>
                  <textarea 
                    value={formData.goals}
                    onChange={(e) => setFormData({...formData, goals: e.target.value})}
                    placeholder="e.g., Increase brand awareness, Drive online sales"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none h-24"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
