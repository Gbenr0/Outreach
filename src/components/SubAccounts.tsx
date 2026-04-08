import React, { useState } from 'react';
import { Client } from '../types';
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  ExternalLink,
  Settings,
  Shield,
  ArrowUpRight,
  X,
  Building2,
  Mail,
  Phone,
  User,
  Target,
  Palette,
  Calendar,
  Clock
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface SubAccountsProps {
  clients: Client[];
  setActiveClient: (client: Client | null) => void;
  setActiveTab: (tab: string) => void;
  setShowCreateModal: (show: boolean) => void;
}

const miniChartData = [
  { value: 40 }, { value: 30 }, { value: 60 }, { value: 80 }, { value: 50 }, { value: 90 }
];

export function SubAccounts({ clients, setActiveClient, setActiveTab, setShowCreateModal }: SubAccountsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sub-Accounts</h1>
          <p className="text-slate-500 mt-1">Manage and switch between your {clients.length} business accounts</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Create Sub-Account
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sub-accounts by name, industry, or ID..."
            className="w-full pl-12 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-slate-50 border-none text-sm rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20">
            <option>All Industries</option>
            <option>Real Estate</option>
            <option>E-commerce</option>
            <option>Technology</option>
          </select>
          <select className="bg-slate-50 border-none text-sm rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20">
            <option>Sort by: Newest</option>
            <option>Sort by: Performance</option>
            <option>Sort by: Name</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <div 
            key={client.id} 
            className="card bg-white group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={client.logo} alt={client.name} className="w-14 h-14 rounded-2xl object-cover shadow-md" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{client.name}</h3>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{client.industry}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Leads</p>
                <div className="flex items-end justify-between">
                  <span className="text-xl font-bold">{client.totalLeads.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                    <ArrowUpRight size={10} /> 12%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Revenue</p>
                <div className="flex items-end justify-between">
                  <span className="text-xl font-bold">${(client.revenueImpact / 1000).toFixed(1)}k</span>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                    <ArrowUpRight size={10} /> 8%
                  </span>
                </div>
              </div>
            </div>

            <div className="h-12 w-full mb-6 opacity-50 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniChartData}>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={client.color} 
                    fill={client.color} 
                    fillOpacity={0.1} 
                    strokeWidth={2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <User size={14} className="text-slate-400" />
                <span>{client.contactPerson || 'No contact person'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Mail size={14} className="text-slate-400" />
                <span className="truncate">{client.contactEmail || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone size={14} className="text-slate-400" />
                <span>{client.contactPhone || 'No phone provided'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <Calendar size={12} className="text-slate-400" />
                  <span>Added: {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <Clock size={12} className="text-slate-400" />
                  <span>Login: {client.lastLoginAt ? new Date(client.lastLoginAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setActiveClient(client);
                  setActiveTab('dashboard');
                  toast.success(`Switched to ${client.name} Workspace`);
                }}
                className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                <ExternalLink size={16} />
                Switch to Account
              </button>
              <button 
                onClick={() => toast.info('Opening account settings...')}
                className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                title="Account Settings"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={() => setShowCreateModal(true)}
          className="card border-dashed border-2 border-slate-200 bg-transparent flex flex-col items-center justify-center gap-4 group hover:border-primary hover:bg-purple-50 transition-all min-h-[280px]"
        >
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
            <Plus size={32} />
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-slate-700 group-hover:text-primary">Add New Sub-Account</div>
            <p className="text-sm text-slate-400 max-w-[200px] mt-1">Onboard a new business and start managing their growth.</p>
          </div>
        </button>
      </div>
    </div>
  );
}
