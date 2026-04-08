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
  Info
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
  Pie
} from 'recharts';
import { Client } from '../types';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

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
    { id: 'attribution', label: 'Attribution Report', icon: MousePointer2 },
    { id: 'call', label: 'Call Report', icon: Phone },
    { id: 'appointment', label: 'Appointment Report', icon: Calendar },
    { id: 'marketing-audit', label: 'Local Marketing Audit', icon: MapPin },
  ];

  const renderReportContent = () => {
    switch (activeReportTab) {
      case 'google-ads':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Spend', value: '$1,240.50', change: '+12%', icon: Search, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Impressions', value: '45.2k', change: '+8%', icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Clicks', value: '2,840', change: '+15%', icon: MousePointer2, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Avg. CPC', value: '$0.44', change: '-5%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map((stat, i) => (
                <div key={i} className="card bg-white p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={stat.bg + " p-2 rounded-lg " + stat.color}>
                      < stat.icon size={20} />
                    </div>
                    <div className="text-emerald-600 text-xs font-bold flex items-center">
                      <ArrowUpRight size={14} className="mr-1" />
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <h4 className="text-2xl font-bold mt-1">{stat.value}</h4>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card bg-white">
                <h3 className="font-bold text-lg mb-6">Spend vs Conversions</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card bg-white">
                <h3 className="font-bold text-lg mb-6">Top Performing Keywords</h3>
                <div className="space-y-4">
                  {[
                    { keyword: 'sustainable fashion', clicks: 840, ctr: '4.2%', spend: '$340' },
                    { keyword: 'eco friendly clothes', clicks: 620, ctr: '3.8%', spend: '$280' },
                    { keyword: 'organic cotton tees', clicks: 450, ctr: '3.1%', spend: '$190' },
                    { keyword: 'ethical clothing brand', clicks: 380, ctr: '2.9%', spend: '$150' },
                  ].map((kw, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-bold text-slate-900">{kw.keyword}</p>
                        <p className="text-xs text-slate-500">{kw.clicks} clicks • {kw.ctr} CTR</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{kw.spend}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Spend</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
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
