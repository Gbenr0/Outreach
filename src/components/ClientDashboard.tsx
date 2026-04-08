import React from 'react';
import { 
  Users, 
  Megaphone, 
  DollarSign,
  Target,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  User,
  Mail,
  Phone,
  Info,
  CheckCircle2,
  Clock,
  Calendar,
  Zap,
  MessageSquare,
  Share2,
  FileText,
  Lightbulb,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Client, Task } from '../types';
import { MOCK_TASKS } from '../mockData';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface ClientDashboardProps {
  client: Client;
  setActiveTab: (tab: string) => void;
  setActiveClient: (client: Client | null) => void;
  setCampaignView: (view: 'list' | 'create') => void;
}

export function ClientDashboard({ client, setActiveTab, setActiveClient, setCampaignView }: ClientDashboardProps) {
  const clientTasks = MOCK_TASKS.filter(t => t.clientId === client.id);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-rose-600 bg-rose-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'email': return <Mail size={16} />;
      case 'social': return <Share2 size={16} />;
      case 'blog': return <FileText size={16} />;
      case 'call': return <Phone size={16} />;
      default: return <Zap size={16} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={client.logo} alt={client.name} className="w-20 h-20 rounded-[2rem] object-cover shadow-md border-4 border-white" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{client.name} Dashboard</h1>
            <div className="flex items-center gap-2 mt-1 text-slate-500">
              <span className="text-sm font-bold text-primary">{client.industry}</span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
              <span className="text-sm font-medium">Marketing Coordinator View</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => toast.info('Opening brand assets...')}
            className="px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            Brand Assets
          </button>
          <button 
            onClick={() => {
              setCampaignView('create');
              setActiveTab('campaigns');
            }}
            className="btn-primary px-6 py-2.5 flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            New Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Tasks & Schedule */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tasks & Next Actions */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <CheckCircle2 size={18} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Tasks & Next Actions</h2>
              </div>
              <button className="text-sm font-bold text-primary hover:underline">View All Tasks</button>
            </div>
            
            <div className="grid gap-4">
              {clientTasks.length > 0 ? clientTasks.map((task) => (
                <div key={task.id} className="card bg-white hover:shadow-md transition-all group border-slate-100">
                  <div className="flex items-start gap-4">
                    <button className="mt-1 w-6 h-6 rounded-lg border-2 border-slate-200 flex items-center justify-center hover:border-primary transition-colors group-hover:bg-primary/5">
                      <CheckCircle2 size={14} className="text-transparent group-hover:text-primary/30" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", getPriorityColor(task.priority))}>
                          {task.priority}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          {getCategoryIcon(task.category)}
                          {task.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{task.title}</h4>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-1">{task.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-slate-400 flex items-center gap-1 justify-end">
                        <Clock size={12} />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                      <button className="mt-2 p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="card bg-slate-50 border-dashed border-2 border-slate-200 flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="font-bold text-slate-500">All caught up!</p>
                  <p className="text-sm text-slate-400">No pending tasks for this client.</p>
                </div>
              )}
              <button className="card border-dashed border-2 border-slate-200 bg-transparent flex items-center justify-center gap-2 py-4 group hover:border-primary hover:bg-purple-50 transition-all">
                <Plus size={18} className="text-slate-400 group-hover:text-primary" />
                <span className="font-bold text-slate-500 group-hover:text-primary">Add Custom Task</span>
              </button>
            </div>
          </section>

          {/* Schedule & Contact */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Client Schedule</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card bg-white border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Sync Call</p>
                    <p className="text-lg font-bold text-slate-900">
                      {client.schedule ? new Date(client.schedule.nextCall).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'Not Scheduled'}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-600">Preferred Time</span>
                    <span className="text-sm font-bold text-slate-900">{client.schedule?.preferredContactTime || 'TBD'}</span>
                  </div>
                  <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    Reschedule Call
                  </button>
                </div>
              </div>

              <div className="card bg-white border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-500" />
                  Reminders
                </h4>
                <div className="space-y-3">
                  {client.schedule?.reminders.map((reminder, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                      <p className="text-sm font-medium text-amber-900">{reminder}</p>
                    </div>
                  )) || <p className="text-sm text-slate-400 italic">No active reminders.</p>}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Service Plan & Forward Planning */}
        <div className="space-y-8">
          {/* Service Plan Overview */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Zap size={18} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Service Plan</h2>
            </div>
            
            <div className="card bg-emerald-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-emerald-300 text-xs font-bold uppercase tracking-wider">Active Deliverables</p>
                  <span className="px-2 py-1 bg-emerald-500/20 rounded-lg text-[10px] font-bold border border-emerald-500/30">PREMIUM PLAN</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <Mail size={20} />
                      </div>
                      <span className="font-bold">Email Marketing</span>
                    </div>
                    <span className="text-sm text-emerald-300 font-medium capitalize">{client.servicePlan?.emailFrequency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <Share2 size={20} />
                      </div>
                      <span className="font-bold">Social Posting</span>
                    </div>
                    <span className="text-sm text-emerald-300 font-medium">{client.servicePlan?.socialPostingSchedule}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <span className="font-bold">Blog Management</span>
                    </div>
                    <span className="text-sm text-emerald-300 font-medium capitalize">{client.servicePlan?.blogFrequency}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Forward Planning */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-50 text-primary rounded-xl flex items-center justify-center">
                <Lightbulb size={18} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Forward Planning</h2>
            </div>
            
            <div className="card bg-white border-slate-100">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Future Blog Topics</h4>
                  <div className="space-y-2">
                    {client.forwardPlanning?.blogTopics.map((topic, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl group cursor-pointer hover:bg-purple-50 transition-colors">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-primary shadow-sm">
                          <FileText size={14} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Campaign Ideas</h4>
                  <div className="space-y-2">
                    {client.forwardPlanning?.campaignIdeas.map((idea, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl group cursor-pointer hover:bg-purple-50 transition-colors">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-primary shadow-sm">
                          <Lightbulb size={14} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{idea}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-bold text-slate-400 hover:border-primary hover:text-primary hover:bg-purple-50 transition-all">
                  Generate More Ideas (AI)
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
