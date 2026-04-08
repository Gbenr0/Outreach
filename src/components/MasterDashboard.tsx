import React from 'react';
import { cn } from '../lib/utils';
import { 
  TrendingUp, 
  Users, 
  Megaphone, 
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { MOCK_CLIENTS } from '../mockData';
import { toast } from 'sonner';

const data = [
  { name: 'Mon', leads: 40, revenue: 2400 },
  { name: 'Tue', leads: 30, revenue: 1398 },
  { name: 'Wed', leads: 20, revenue: 9800 },
  { name: 'Thu', leads: 27, revenue: 3908 },
  { name: 'Fri', leads: 18, revenue: 4800 },
  { name: 'Sat', leads: 23, revenue: 3800 },
  { name: 'Sun', leads: 34, revenue: 4300 },
];

import { Client } from '../types';

interface MasterDashboardProps {
  clients: Client[];
  setActiveTab: (tab: string) => void;
  setActiveClient: (client: Client | null) => void;
  setCampaignView: (view: 'list' | 'create') => void;
}

export function MasterDashboard({ clients, setActiveTab, setActiveClient, setCampaignView }: MasterDashboardProps) {
  const totalLeads = clients.reduce((acc, c) => acc + c.totalLeads, 0);
  const totalRevenue = clients.reduce((acc, c) => acc + c.revenueImpact, 0);
  const activeCampaigns = clients.reduce((acc, c) => acc + c.activeCampaigns, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agency Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's a global overview of your agency's performance.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setActiveTab('analytics');
              toast.success('Generating global agency report...');
            }}
            className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            Global Report
          </button>
          <button 
            onClick={() => {
              setActiveTab('subaccounts');
              toast.info('Opening sub-accounts management...');
            }}
            className="btn-primary px-6 py-3 shadow-lg shadow-primary/20"
          >
            Manage Accounts
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Global Leads" 
          value={totalLeads.toLocaleString()} 
          change="+12.5%" 
          isPositive={true} 
          icon={Users} 
          color="blue"
        />
        <StatCard 
          title="Revenue Impact" 
          value={`$${(totalRevenue / 1000).toFixed(1)}k`} 
          change="+8.2%" 
          isPositive={true} 
          icon={DollarSign} 
          color="emerald"
        />
        <StatCard 
          title="Active Campaigns" 
          value={activeCampaigns.toString()} 
          change="+2" 
          isPositive={true} 
          icon={Megaphone} 
          color="purple"
        />
        <StatCard 
          title="Avg. Conversion" 
          value="4.2%" 
          change="-0.5%" 
          isPositive={false} 
          icon={TrendingUp} 
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 card bg-white border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-lg">Agency Growth</h3>
              <p className="text-sm text-slate-400">Aggregated performance across all sub-accounts</p>
            </div>
            <select 
              onChange={(e) => toast.info(`Timeframe changed to: ${e.target.value}`)}
              className="bg-slate-50 border-none text-sm font-bold rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="card bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <AlertCircle size={20} className="text-amber-500" />
              Recent Activity
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">Live</span>
          </div>
          <div className="space-y-4">
            <AlertItem 
              type="warning" 
              title="Campaign Alert" 
              desc="LuxeLiving: 'Luxury Penthouse' is below target ROI." 
              onClick={() => {
                const luxeLiving = MOCK_CLIENTS.find(c => c.name === 'LuxeLiving');
                if (luxeLiving) setActiveClient(luxeLiving);
                setActiveTab('marketing');
                toast.warning('Navigating to campaign...');
              }}
            />
            <AlertItem 
              type="success" 
              title="Performance Milestone" 
              desc="EcoStride: Spring Launch leads up 40% today." 
              onClick={() => {
                const ecoStride = MOCK_CLIENTS.find(c => c.name === 'EcoStride');
                if (ecoStride) setActiveClient(ecoStride);
                setActiveTab('reporting');
                toast.success('Viewing analytics...');
              }}
            />
            <AlertItem 
              type="info" 
              title="New Lead Segment" 
              desc="TechNova: 15 new enterprise leads identified." 
              onClick={() => {
                const techNova = MOCK_CLIENTS.find(c => c.name === 'TechNova');
                if (techNova) setActiveClient(techNova);
                setActiveTab('contacts');
                toast.info('Viewing CRM...');
              }}
            />
          </div>
          <button 
            onClick={() => toast.info('Viewing all agency activity...')}
            className="w-full mt-8 py-3 text-sm text-slate-500 font-bold hover:text-primary hover:bg-purple-50 rounded-xl transition-all"
          >
            View All Activity
          </button>
        </div>
      </div>

      {/* Top Performing Accounts */}
      <div className="card bg-white border-slate-200 shadow-sm overflow-hidden p-0">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-lg">Top Performing Accounts</h3>
            <p className="text-sm text-slate-500">Sub-accounts with the highest growth this week</p>
          </div>
          <button 
            onClick={() => setActiveTab('subaccounts')}
            className="text-sm text-primary font-bold hover:underline"
          >
            View All Sub-Accounts
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-8 py-4">Account</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Campaigns</th>
                <th className="px-8 py-4">Total Leads</th>
                <th className="px-8 py-4">Revenue</th>
                <th className="px-8 py-4">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.slice(0, 3).map(client => (
                <tr 
                  key={client.id} 
                  onClick={() => {
                    setActiveClient(client);
                    setActiveTab('dashboard');
                    toast.success(`Switching to ${client.name}...`);
                  }}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img src={client.logo} alt={client.name} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{client.name}</div>
                        <div className="text-xs text-slate-400">{client.industry}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-emerald-100">Healthy</span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-600">{client.activeCampaigns}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-900">{client.totalLeads.toLocaleString()}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-900">${(client.revenueImpact / 1000).toFixed(1)}k</td>
                  <td className="px-8 py-5">
                    <div className="w-24 h-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.slice(0, 5)}>
                          <Area type="monotone" dataKey="leads" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, isPositive, icon: Icon, color }: any) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-primary border-purple-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100"
  };

  return (
    <div className="card bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className={cn("p-3 rounded-2xl border", colors[color as keyof typeof colors])}>
          <Icon size={24} />
        </div>
        <div className={cn(
          "flex items-center text-[10px] font-bold px-2 py-1 rounded-lg border",
          isPositive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
        )}>
          {isPositive ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</p>
        <h4 className="text-3xl font-bold mt-1 text-slate-900">{value}</h4>
      </div>
    </div>
  );
}

function AlertItem({ type, title, desc, onClick }: any) {
  const colors = {
    warning: "bg-amber-50 border-amber-100 text-amber-800 hover:bg-amber-100",
    success: "bg-emerald-50 border-emerald-100 text-emerald-800 hover:bg-emerald-100",
    info: "bg-blue-50 border-blue-100 text-blue-800 hover:bg-blue-100"
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-3 rounded-lg border text-sm cursor-pointer transition-colors", 
        colors[type as keyof typeof colors]
      )}
    >
      <div className="font-bold mb-0.5">{title}</div>
      <div className="opacity-80 leading-snug">{desc}</div>
    </div>
  );
}
