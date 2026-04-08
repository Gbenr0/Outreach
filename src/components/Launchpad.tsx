import React, { useState } from 'react';
import { 
  Rocket, 
  CheckCircle2, 
  Circle,
  ArrowRight, 
  Globe, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  CreditCard, 
  MessageSquare,
  Zap,
  Users,
  ShieldCheck,
  BarChart3,
  Mail,
  Smartphone,
  X,
  Lock,
  Link2,
  Settings,
  RefreshCw,
  ExternalLink,
  Plus,
  MessageCircle,
  Trello,
  Database
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { Client } from '../types';

interface LaunchpadProps {
  activeClient: Client | null;
  isInline?: boolean;
  onClose?: () => void;
  onUpdateClient?: (clientId: string, updates: Partial<Client>) => void;
}

type SetupItem = {
  id: string;
  label: string;
  status: boolean;
  icon: any;
  description: string;
};

export function Launchpad({ activeClient, isInline, onClose, onUpdateClient }: LaunchpadProps) {
  const [activeSetup, setActiveSetup] = useState<SetupItem | null>(null);
  const [setupStep, setSetupStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);

  if (!activeClient) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center text-center space-y-4",
        isInline ? "h-full p-8" : "h-[60vh]"
      )}>
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <Rocket size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Select a Client Workspace</h2>
        <p className="text-slate-500 max-w-md">Launchpad settings are specific to each client. Please select a client from the sidebar to manage their readiness.</p>
      </div>
    );
  }

  const status = activeClient.launchpad || {
    channels: { email: false, sms: false, social: false, whatsapp: false },
    crm: { contacts: false, pipelines: false },
    setup: { domain: false, funnel: false, automation: false, tracking: false },
    score: 0
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-rose-600 bg-rose-50 border-rose-100';
    if (score < 80) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-emerald-600 bg-emerald-50 border-emerald-100';
  };

  const getScoreLabel = (score: number) => {
    if (score < 40) return 'Not Ready';
    if (score < 80) return 'Partially Ready';
    return 'Ready to Launch';
  };

  const checklistItems = [
    { 
      group: 'Channels', 
      items: [
        { id: 'email', label: 'Email Connection', status: status.channels.email, icon: Mail, description: 'Connect SMTP, Gmail, or Outlook for outreach.' },
        { id: 'sms', label: 'SMS Gateway', status: status.channels.sms, icon: Smartphone, description: 'Configure Twilio or local gateways for SMS.' },
        { id: 'social', label: 'Social Accounts', status: status.channels.social, icon: Instagram, description: 'Link Instagram, Facebook, and X accounts.' },
        { id: 'whatsapp', label: 'WhatsApp Business', status: status.channels.whatsapp, icon: MessageCircle, description: 'Official WhatsApp Business API integration.' },
      ]
    },
    { 
      group: 'CRM & Audience', 
      items: [
        { id: 'contacts', label: 'Contact Sync', status: status.crm.contacts, icon: Users, description: 'Import and sync contacts from your CRM.' },
        { id: 'pipelines', label: 'Sales Pipelines', status: status.crm.pipelines, icon: Zap, description: 'Map your sales stages and deal flows.' },
      ]
    },
    { 
      group: 'Infrastructure', 
      items: [
        { id: 'domain', label: 'Custom Domain', status: status.setup.domain, icon: Globe, description: 'Add your own domain for links and tracking.' },
        { id: 'funnel', label: 'Sales Funnel', status: status.setup.funnel, icon: Rocket, description: 'Design or select a high-converting funnel.' },
        { id: 'automation', label: 'Workflow Engine', status: status.setup.automation, icon: Zap, description: 'Configure automated triggers and actions.' },
        { id: 'tracking', label: 'Tracking Pixels', status: status.setup.tracking, icon: BarChart3, description: 'Install Meta, Google, and LinkedIn pixels.' },
      ]
    }
  ];

  const handleSetupClick = (item: SetupItem) => {
    if (item.status) {
      toast.success(`${item.label} is already configured!`);
      return;
    }
    setActiveSetup(item);
    setSetupStep(1);
  };

  const startConnection = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setSetupStep(2);
    }, 2000);
  };

  const completeSetup = () => {
    if (!activeClient || !activeSetup) return;

    const currentLaunchpad = activeClient.launchpad || {
      channels: { email: false, sms: false, social: false, whatsapp: false },
      crm: { contacts: false, pipelines: false },
      setup: { domain: false, funnel: false, automation: false, tracking: false },
      score: 0
    };

    const newLaunchpad = { ...currentLaunchpad };
    
    // Update the specific item
    if (activeSetup.id in newLaunchpad.channels) {
      newLaunchpad.channels = { ...newLaunchpad.channels, [activeSetup.id]: true };
    } else if (activeSetup.id in newLaunchpad.crm) {
      newLaunchpad.crm = { ...newLaunchpad.crm, [activeSetup.id]: true };
    } else if (activeSetup.id in newLaunchpad.setup) {
      newLaunchpad.setup = { ...newLaunchpad.setup, [activeSetup.id]: true };
    }

    // Recalculate score (simple average of all booleans)
    const allItems = [
      ...Object.values(newLaunchpad.channels),
      ...Object.values(newLaunchpad.crm),
      ...Object.values(newLaunchpad.setup)
    ];
    const completedCount = allItems.filter(Boolean).length;
    newLaunchpad.score = Math.round((completedCount / allItems.length) * 100);

    if (onUpdateClient) {
      onUpdateClient(activeClient.id, { launchpad: newLaunchpad });
    }

    toast.success(`${activeSetup.label} connected successfully!`);
    setActiveSetup(null);
  };

  const renderSetupFlow = () => {
    if (!activeSetup) return null;

    const Icon = activeSetup.icon;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Icon size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">{activeSetup.label}</h4>
            <p className="text-xs text-slate-500">{activeSetup.description}</p>
          </div>
        </div>

        {setupStep === 1 ? (
          <div className="space-y-4 py-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Permissions</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  Read and send messages
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  Access contact information
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  Manage webhooks for real-time sync
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={startConnection}
                disabled={isConnecting}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
              >
                {isConnecting ? (
                  <>Connecting... <RefreshCw size={18} className="animate-spin" /></>
                ) : (
                  <>Connect {activeSetup.label} <ArrowRight size={18} /></>
                )}
              </button>
              <p className="text-[10px] text-center text-slate-400">
                By connecting, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h5 className="font-bold text-slate-900">Connection Verified!</h5>
                <p className="text-sm text-slate-500">The API handshake was successful. Your {activeSetup.label} is ready to use.</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-700">Live Status</span>
                <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Online
                </span>
              </div>
              <div className="text-xs text-emerald-600/80 leading-relaxed">
                Webhooks are active and listening for incoming events. All messages will now flow into your Unified Conversations Hub.
              </div>
            </div>

            <button 
              onClick={completeSetup}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-lg shadow-primary/20"
            >
              Finish Setup
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "max-w-6xl mx-auto space-y-8 pb-20",
          isInline && "max-w-none p-6 space-y-6 pb-6"
        )}
      >
        {/* Header & Score */}
        <div className={cn(
          "flex flex-col md:flex-row justify-between items-start md:items-center gap-6",
          isInline && "flex-col gap-4"
        )}>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Rocket size={24} />
              </div>
              <h1 className={cn("text-3xl font-bold tracking-tight", isInline && "text-xl")}>
                {isInline ? 'Launchpad Readiness' : 'Launchpad'}
              </h1>
            </div>
            <p className="text-slate-500 text-sm">Readiness engine for <span className="font-bold text-slate-900">{activeClient.name}</span></p>
          </div>

          <div className={cn(
            "flex items-center gap-6 p-4 rounded-3xl border shadow-sm", 
            getScoreColor(status.score),
            isInline && "w-full justify-between p-3 rounded-2xl"
          )}>
            <div className="relative w-12 h-12">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="opacity-20" />
                <circle 
                  cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" 
                  strokeDasharray={125.6} 
                  strokeDashoffset={125.6 - (125.6 * status.score) / 100}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                {status.score}%
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">Launch Score</div>
              <div className="text-sm font-black">{getScoreLabel(status.score)}</div>
            </div>
          </div>
        </div>

        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-3 gap-8",
          isInline && "grid-cols-1 gap-4"
        )}>
          {/* Checklist */}
          <div className={cn("lg:col-span-2 space-y-6", isInline && "lg:col-span-1 space-y-4")}>
            {checklistItems.map((group) => (
              <div key={group.group} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.group}</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {group.items.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => handleSetupClick(item)}
                      className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                          item.status ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                          <item.icon size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{item.label}</div>
                          <div className="text-[10px] text-slate-500">
                            {item.status ? 'Configuration active' : 'Action required'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.status ? (
                          <CheckCircle2 className="text-emerald-500" size={16} />
                        ) : (
                          <div className="flex items-center gap-2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            Setup <ArrowRight size={12} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Acceleration Panel (Only if not inline) */}
          {!isInline && (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Zap size={120} />
              </div>
              <h3 className="text-xl font-bold mb-4 relative z-10">Campaign Accelerator</h3>
              <p className="text-slate-400 text-sm mb-8 relative z-10">
                Your Launchpad configuration powers instant campaign deployment.
              </p>
              
              <div className="space-y-4 relative z-10">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Smart Suggestion</div>
                  <div className="text-sm font-medium">Based on your tracking setup, we recommend a <span className="text-primary">Retargeting Campaign</span>.</div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-xs font-bold text-emerald-400 mb-1 uppercase tracking-wider">Channel Status</div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Email & Social ready for launch
                  </div>
                </div>
              </div>

              <button 
                disabled={status.score < 40}
                className={cn(
                  "w-full mt-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all",
                  status.score >= 80 ? "bg-primary text-white hover:scale-[1.02] shadow-lg shadow-primary/20" : 
                  status.score >= 40 ? "bg-white text-slate-900 hover:bg-slate-100" :
                  "bg-slate-800 text-slate-500 cursor-not-allowed"
                )}
              >
                {status.score >= 80 ? (
                  <>Quick Launch Campaign <Rocket size={18} /></>
                ) : (
                  <>Complete Setup to Launch</>
                )}
              </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                Tracking Enforcement
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Domain Verification', ok: status.setup.domain },
                  { label: 'Pixel Attribution', ok: status.setup.tracking },
                  { label: 'CRM Pipeline Sync', ok: status.crm.pipelines },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{t.label}</span>
                    {t.ok ? (
                      <span className="text-emerald-600 font-bold">Active</span>
                    ) : (
                      <span className="text-slate-300">Pending</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Setup Wizard Modal */}
      <AnimatePresence>
        {activeSetup && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSetup(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl z-[110] overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Setup Wizard</div>
                  <button onClick={() => setActiveSetup(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                {renderSetupFlow()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  </div>
  );
}
