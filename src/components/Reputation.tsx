import React, { useState } from 'react';
import { 
  Star, 
  Send, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  MoreVertical,
  Search,
  Filter,
  Mail,
  Smartphone,
  QrCode,
  Bot,
  Link as LinkIcon,
  Globe,
  Plus,
  ChevronRight,
  Facebook,
  Instagram,
  MessageCircle
} from 'lucide-react';
import { Client } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface ReputationProps {
  activeClient: Client | null;
}

const trendData = [
  { name: 'Mon', invites: 12, reviews: 4 },
  { name: 'Tue', invites: 18, reviews: 7 },
  { name: 'Wed', invites: 15, reviews: 5 },
  { name: 'Thu', invites: 25, reviews: 12 },
  { name: 'Fri', invites: 22, reviews: 9 },
  { name: 'Sat', invites: 30, reviews: 15 },
  { name: 'Sun', invites: 28, reviews: 14 },
];

const sentimentData = [
  { name: 'Positive', value: 75, color: '#10b981' },
  { name: 'Neutral', value: 15, color: '#f59e0b' },
  { name: 'Negative', value: 10, color: '#ef4444' },
];

const competitorData = [
  { name: 'Your Business', rating: 4.8, reviews: 156 },
  { name: 'Competitor A', rating: 4.2, reviews: 89 },
  { name: 'Competitor B', rating: 3.9, reviews: 210 },
  { name: 'Competitor C', rating: 4.5, reviews: 45 },
];

export function Reputation({ activeClient }: ReputationProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'reviews' | 'settings'>('overview');
  const [showSendModal, setShowSendModal] = useState(false);

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Configuration Checklist */}
      <div className="card bg-white p-6 border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Setup Checklist</h3>
              <p className="text-xs text-slate-500">Complete these steps to start collecting reviews</p>
            </div>
          </div>
          <button 
            onClick={() => setShowSendModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Send size={18} />
            Send Review Request
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Connect Google Business', status: 'completed' },
            { label: 'Generate Review Link', status: 'completed' },
            { label: 'Setup SMS Template', status: 'pending' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-primary/30 transition-all cursor-pointer">
              <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">{item.label}</span>
              {item.status === 'completed' ? (
                <CheckCircle2 size={18} className="text-emerald-500" />
              ) : (
                <Plus size={18} className="text-primary animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
          <div className="card bg-white p-6 border border-slate-100 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Invite Goals</p>
                <h4 className="text-2xl font-bold text-slate-900">124 / 200</h4>
              </div>
              <div className="p-2 bg-purple-50 text-primary rounded-lg">
                <Send size={18} />
              </div>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '62%' }} />
            </div>
            <p className="text-[10px] text-slate-500 font-medium">62% of monthly goal reached</p>
          </div>

          <div className="card bg-white p-6 border border-slate-100 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Rating</p>
                <h4 className="text-2xl font-bold text-slate-900">4.8</h4>
              </div>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Star size={18} />
              </div>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={14} className={i <= 4 ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
              ))}
            </div>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp size={10} />
              +0.2 from last month
            </p>
          </div>

          {/* Trends Chart */}
          <div className="col-span-2 card bg-white p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-slate-900">Invite & Review Trends</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs text-slate-500">Invites</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-500">Reviews</span>
                </div>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorInvites" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#94a3b8' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#94a3b8' }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="invites" 
                    stroke="#7c3aed" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorInvites)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="reviews" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorReviews)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sentiment & Competitors */}
        <div className="space-y-8">
          <div className="card bg-white p-6 border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-6">Sentiment Analysis</h4>
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-slate-900">75%</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Positive</span>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              {sentimentData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="text-slate-900 font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-white p-6 border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-4">Competitor Analysis</h4>
            <div className="space-y-4">
              {competitorData.map((comp, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className={cn("font-bold", i === 0 ? "text-primary" : "text-slate-600")}>
                      {comp.name}
                    </span>
                    <span className="text-slate-900 font-bold">{comp.rating} ★</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full", i === 0 ? "bg-primary" : "bg-slate-300")} 
                      style={{ width: `${(comp.rating / 5) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Latest Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-white p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-900">Latest Review Requests</h4>
            <button className="text-primary text-xs font-bold flex items-center gap-1">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'John Smith', status: 'Sent', time: '10 mins ago', type: 'SMS' },
              { name: 'Sarah Wilson', status: 'Opened', time: '2 hours ago', type: 'Email' },
              { name: 'Mike Johnson', status: 'Clicked', time: '5 hours ago', type: 'WhatsApp' },
            ].map((req, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Users size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{req.name}</p>
                    <p className="text-[10px] text-slate-500">{req.type} • {req.time}</p>
                  </div>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  req.status === 'Clicked' ? "bg-emerald-100 text-emerald-700" : 
                  req.status === 'Opened' ? "bg-purple-100 text-primary" : "bg-slate-100 text-slate-500"
                )}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card bg-white p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-900">Latest Reviews</h4>
            <button className="text-primary text-xs font-bold flex items-center gap-1">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Emily Davis', rating: 5, text: 'Amazing service! Highly recommend to everyone.', time: '1 hour ago' },
              { name: 'David Brown', rating: 4, text: 'Very good experience, will come back again.', time: '3 hours ago' },
            ].map((rev, i) => (
              <div key={i} className="p-3 hover:bg-slate-50 rounded-xl transition-colors space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                      <img src={`https://picsum.photos/seed/${rev.name}/100/100`} alt={rev.name} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{rev.name}</p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={10} className={s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.time}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 italic">"{rev.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-1 space-y-2">
        {[
          { id: 'ai', label: 'Reviews AI', icon: Bot },
          { id: 'link', label: 'Review Link', icon: LinkIcon },
          { id: 'sms', label: 'SMS Request', icon: Smartphone },
          { id: 'email', label: 'Email Request', icon: Mail },
          { id: 'whatsapp', label: 'WhatsApp Request', icon: MessageCircle },
          { id: 'qr', label: 'Reviews QR', icon: QrCode },
          { id: 'integrations', label: 'Integrations', icon: Globe },
        ].map(item => (
          <button 
            key={item.id}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-primary transition-all text-left group"
          >
            <item.icon size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="lg:col-span-3 space-y-8">
        <div className="card bg-white p-8 border border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Reviews AI</h3>
              <p className="text-sm text-slate-500">Automatically respond to reviews using AI</p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Personality</label>
              <div className="grid grid-cols-3 gap-3">
                {['Professional', 'Friendly', 'Casual'].map(p => (
                  <button key={p} className={cn(
                    "py-2 rounded-lg border text-sm font-bold transition-all",
                    p === 'Professional' ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Minimum Rating to Auto-Respond</label>
              <div className="flex gap-2">
                {[3, 4, 5].map(r => (
                  <button key={r} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold hover:bg-slate-50">
                    {r}+ Stars
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-white p-8 border border-slate-100 space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Review Link</h3>
          <div className="flex gap-4">
            <div className="flex-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-sm text-slate-600 truncate">
              https://g.page/r/your-business-link/review
            </div>
            <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all">
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reputation Management</h1>
          <p className="text-slate-500 mt-1">Monitor reviews, request feedback, and manage your online presence.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'requests', label: 'Requests', icon: Send },
            { id: 'reviews', label: 'Reviews', icon: Star },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'settings' && renderSettings()}
      
      {(activeTab === 'requests' || activeTab === 'reviews') && (
        <div className="card bg-white p-12 border border-slate-100 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto">
            {activeTab === 'requests' ? <Send size={32} /> : <Star size={32} />}
          </div>
          <h2 className="text-xl font-bold text-slate-900">Detailed {activeTab} View</h2>
          <p className="text-slate-500 max-w-sm mx-auto">
            This section will display a comprehensive list of your {activeTab} with advanced filtering and search capabilities.
          </p>
          <button className="btn-primary px-8">Get Started</button>
        </div>
      )}

      {/* Send Review Request Modal */}
      <AnimatePresence>
        {showSendModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-2xl font-bold text-slate-900">Send Review Request</h2>
                <p className="text-sm text-slate-500 mt-1">Request feedback from your customers via SMS or Email</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Customer Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email or Phone</label>
                    <input 
                      type="text" 
                      placeholder="e.g., john@example.com or +1234567890"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowSendModal(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      toast.success('Review request sent successfully!');
                      setShowSendModal(false);
                    }}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
