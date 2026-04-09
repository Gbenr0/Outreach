import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  Calendar, 
  Inbox, 
  BarChart3, 
  Settings as SettingsIcon, 
  Plus,
  ChevronDown,
  Search,
  Zap,
  Bell,
  Sparkles,
  Rocket,
  Target,
  CreditCard,
  Award,
  HardDrive,
  Star,
  ShoppingBag,
  Store,
  ClipboardList
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Client } from '../types';
import { MOCK_CLIENTS } from '../mockData';
import { toast } from 'sonner';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  clients: Client[];
  activeClient: Client | null;
  setActiveClient: (client: Client | null) => void;
  setShowCreateModal: (show: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, clients, activeClient, setActiveClient, setShowCreateModal }: SidebarProps) {
  const [isClientSelectorOpen, setIsClientSelectorOpen] = useState(false);

  const agencyNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subaccounts', label: 'Sub-Accounts', icon: Store },
    { id: 'prospecting', label: 'Prospecting', icon: Target },
    { id: 'conversations', label: 'Agency Inbox', icon: Inbox },
    { id: 'reporting', label: 'Global Reporting', icon: BarChart3 },
    { id: 'automation', label: 'Agency Automation', icon: Zap },
    { id: 'ai-agents', label: 'AI Assistant', icon: Sparkles },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  ];

  const subAccountNavItems = [
    { id: 'launchpad', label: 'Launch Pad', icon: Rocket },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'conversations', label: 'Conversations', icon: Inbox },
    { id: 'calendar', label: 'Content Calendar', icon: Calendar },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'opportunities', label: 'Opportunities', icon: Target },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'ai-agents', label: 'AI Agents', icon: Sparkles },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'survey', label: 'Survey', icon: ClipboardList },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'membership', label: 'Membership', icon: Award },
    { id: 'media', label: 'Media Storage', icon: HardDrive },
    { id: 'reputation', label: 'Reputation', icon: Star },
    { id: 'reporting', label: 'Reporting', icon: BarChart3 },
    { id: 'marketplace', label: 'App Marketplace', icon: ShoppingBag },
  ];

  const navItems = activeClient ? subAccountNavItems : agencyNavItems;

  return (
    <aside className="w-64 border-r border-slate-200 h-screen flex flex-col bg-white sticky top-0">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">O</div>
          <span className="text-xl font-bold tracking-tight">Outreach</span>
        </div>

        {/* Context Switcher / Organization Switcher */}
        <div className="relative mb-6">
          <button 
            onClick={() => setIsClientSelectorOpen(!isClientSelectorOpen)}
            className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {activeClient ? (
                <>
                  <img src={activeClient.logo} alt={activeClient.name} className="w-6 h-6 rounded-md object-cover" />
                  <span className="font-medium truncate text-sm">{activeClient.name}</span>
                </>
              ) : (
                <>
                  <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center text-primary">
                    <Store size={14} />
                  </div>
                  <span className="font-medium text-sm">Agency View</span>
                </>
              )}
            </div>
            <ChevronDown size={16} className={cn("text-slate-400 transition-transform", isClientSelectorOpen && "rotate-180")} />
          </button>

          {isClientSelectorOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 max-h-[400px] overflow-y-auto">
              <button 
                onClick={() => {
                  setActiveClient(null);
                  setActiveTab('dashboard');
                  setIsClientSelectorOpen(false);
                  toast.success('Switched to Agency View');
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors text-sm",
                  !activeClient && "bg-purple-50 text-primary font-medium"
                )}
              >
                <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                  <Store size={14} />
                </div>
                Agency Dashboard
              </button>
              <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sub-Accounts</div>
              {clients.map(client => (
                <button 
                  key={client.id}
                  onClick={() => {
                    setActiveClient(client);
                    setActiveTab('dashboard');
                    setIsClientSelectorOpen(false);
                    toast.success(`Switched to ${client.name}`);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors text-sm",
                    activeClient?.id === client.id && "bg-purple-50 text-primary font-medium"
                  )}
                >
                  <img src={client.logo} alt={client.name} className="w-6 h-6 rounded-md object-cover" />
                  <span className="truncate">{client.name}</span>
                </button>
              ))}
              
              <div className="mt-2 pt-2 border-t border-slate-100 px-2">
                <button 
                  onClick={() => {
                    setShowCreateModal(true);
                    setIsClientSelectorOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 bg-primary/5 text-primary hover:bg-primary/10 rounded-lg transition-all text-sm font-bold"
                >
                  <Plus size={16} />
                  Create Sub-Account
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative flex-1 min-h-0">
          <nav className="space-y-1 h-full overflow-y-auto -mx-2 px-2 pb-4 scrollbar-hide">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "sidebar-item w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                  activeTab === item.id 
                    ? "bg-primary/10 text-primary font-semibold shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon size={18} />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
          {/* Subtle fade effect at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100">
          <button 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "sidebar-item w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
              activeTab === 'settings' 
                ? "bg-primary/10 text-primary font-semibold shadow-sm" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <SettingsIcon size={18} />
            <span className="text-sm">Settings</span>
          </button>
          <div 
            onClick={() => toast.info('Viewing user profile...')}
            className="mt-4 flex items-center gap-3 px-3 cursor-pointer hover:bg-slate-50 py-2 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
              <img src="https://picsum.photos/seed/operator/100/100" alt="Operator" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">Alex Operator</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Agency Admin</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
