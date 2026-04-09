import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Globe, 
  Download, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  PieChart as PieChartIcon,
  Search,
  Phone,
  Calendar,
  MousePointer2,
  MapPin,
  ExternalLink,
  Info,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { Client } from '../types';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { MOCK_ADS_REPORTS } from '../mockData';

interface AnalyticsProps {
  activeClient: Client | null;
  setActiveTab: (tab: string) => void;
  setActiveClient: (client: Client | null) => void;
  setCampaignView: (view: 'list' | 'create') => void;
}

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

const COLORS = ['#7c3aed', '#0d9488', '#3b82f6', '#f59e0b', '#ef4444'];

function AdsReport({ platform, data, campaigns }: { platform: 'google' | 'facebook', data: any[], campaigns: any[] }) {
  const platformName = platform === 'google' ? 'Google Ads' : 'Facebook Ads';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Impressions', value: data.reduce((acc, d) => acc + d.impressions, 0).toLocaleString(), icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Clicks', value: data.reduce((acc, d) => acc + d.clicks, 0).toLocaleString(), icon: MousePointer2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Conversions', value: data.reduce((acc, d) => acc + d.conversions, 0).toLocaleString(), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Client Spends', value: `$${data.reduce((acc, d) => acc + d.spend, 0).toLocaleString()}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="card bg-white p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={cn(stat.bg, "p-2 rounded-lg", stat.color)}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm font-medium text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Impressions & Clicks */}
        <div className="card bg-white p-6">
          <h4 className="font-bold text-slate-800 mb-6">Impressions & Clicks</h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversions & Spend */}
        <div className="card bg-white p-6">
          <h4 className="font-bold text-slate-800 mb-6">Conversions & Spend</h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar yAxisId="left" dataKey="conversions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="spend" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Metrics */}
        <div className="card bg-white p-6">
          <h4 className="font-bold text-slate-800 mb-6">Efficiency Metrics (CPC & Cost/Conv)</h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="cpc" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="costPerConv" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="card bg-white p-6">
          <h4 className="font-bold text-slate-800 mb-6">Conversion Rate (%)</h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="convRate" stroke="#ec4899" fillOpacity={1} fill="url(#colorConv)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="card bg-white overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h4 className="font-bold text-slate-800">{platformName} Campaigns</h4>
          <button className="text-primary text-sm font-bold flex items-center gap-2 hover:underline">
            <Download size={16} /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Clicks</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Cost</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Revenue</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">ROI</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">CPC</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">CTR</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Sales</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">CPS</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Leads</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">CPL</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Impressions</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Avg. Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <button className="text-sm font-bold text-primary hover:underline text-left">
                      {campaign.name}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      campaign.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                    )}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right font-medium">{campaign.clicks.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right font-medium">${campaign.cost.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right font-medium">${campaign.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right font-medium">{campaign.roi}x</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right font-medium">${campaign.cpc}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right font-medium">{campaign.ctr}%</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right font-medium">{campaign.sales}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right font-medium">${campaign.cps}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right font-medium">{campaign.leads}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right font-medium">${campaign.cpl}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right font-medium">{campaign.impressions.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right font-medium">${campaign.avgRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReportPlaceholder({ title, description, icon: Icon }: { title: string, description: string, icon: any }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-400 mb-6 border border-slate-100 shadow-sm">
        <Icon size={40} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-md mx-auto mb-8">{description}</p>
      <div className="flex gap-3">
        <button className="btn-primary px-8">Refresh Data</button>
        <button className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">Configure Report</button>
      </div>
    </div>
  );
}

export function Analytics({ activeClient, setActiveTab, setActiveClient, setCampaignView }: AnalyticsProps) {
  const [activeReportTab, setActiveReportTab] = useState('google-ads');

  const reportTabs = [
    { id: 'google-ads', label: 'Google Ads Report', icon: Search },
    { id: 'facebook-ads', label: 'Facebook Ads Report', icon: Globe },
    { id: 'attribution', label: 'Attribution Report', icon: MousePointer2 },
    { id: 'call', label: 'Call Report', icon: Phone },
    { id: 'appointment', label: 'Appointment Report', icon: Calendar },
    { id: 'marketing-audit', label: 'Local Marketing Audit', icon: MapPin },
  ];

  const renderReportContent = () => {
    switch (activeReportTab) {
      case 'google-ads':
        return <AdsReport platform="google" data={MOCK_ADS_REPORTS.google} campaigns={MOCK_ADS_REPORTS.campaigns} />;
      case 'facebook-ads':
        return <AdsReport platform="facebook" data={MOCK_ADS_REPORTS.facebook} campaigns={MOCK_ADS_REPORTS.campaigns} />;
      case 'attribution':
        return <ReportPlaceholder title="Attribution Report" icon={MousePointer2} description="Track the complete customer journey and understand which touchpoints drive the most value." />;
      case 'call':
        return <ReportPlaceholder title="Call Report" icon={Phone} description="Detailed analytics for inbound and outbound calls, including duration, recording, and lead quality." />;
      case 'appointment':
        return <ReportPlaceholder title="Appointment Report" icon={Calendar} description="Monitor booking trends, show rates, and revenue generated from scheduled appointments." />;
      case 'marketing-audit':
        return <ReportPlaceholder title="Local Marketing Audit" icon={MapPin} description="Comprehensive analysis of local SEO, GMB performance, and competitive landscape in your area." />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {activeClient ? `${activeClient.name} Reporting` : 'Global Reporting'}
          </h1>
          <p className="text-slate-500 mt-1">Deep dive into performance metrics and trends</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => toast.success('Report generation started...')}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2"
          >
            <Download size={18} />
            Export PDF
          </button>
          <button 
            onClick={() => {
              toast.info('Opening report settings...');
            }}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2"
          >
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      {/* Reporting Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-fit">
        {reportTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReportTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              activeReportTab === tab.id
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div className="min-h-[400px]">
        {renderReportContent()}
      </div>
    </div>
  );
}
