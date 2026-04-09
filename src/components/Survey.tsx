import React, { useState } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Send, 
  Calendar, 
  Users, 
  BarChart3, 
  MoreVertical, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  Search,
  Filter,
  Mail,
  MessageSquare,
  ArrowRight,
  Star,
  Trash2,
  HelpCircle
} from 'lucide-react';
import { Client } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface SurveyProps {
  activeClient: Client | null;
}

const MOCK_SURVEYS = [
  { 
    id: '1', 
    title: 'Post-Appointment Feedback', 
    responses: 45, 
    completionRate: '82%', 
    status: 'active', 
    lastSent: '2 hours ago',
    rating: 4.8
  },
  { 
    id: '2', 
    title: 'New Lead Qualification', 
    responses: 128, 
    completionRate: '65%', 
    status: 'active', 
    lastSent: '1 day ago',
    rating: 4.2
  },
  { 
    id: '3', 
    title: 'Product Satisfaction Survey', 
    responses: 89, 
    completionRate: '74%', 
    status: 'draft', 
    lastSent: 'Never',
    rating: 0
  },
];

const MOCK_EVENTS = [
  { id: 'e1', title: 'Strategy Session with John Doe', date: '2026-04-10', time: '10:00 AM' },
  { id: 'e2', title: 'Product Demo - TechCorp', date: '2026-04-11', time: '2:30 PM' },
  { id: 'e3', title: 'Follow-up Call: Sarah Smith', date: '2026-04-12', time: '11:15 AM' },
];

export function Survey({ activeClient }: SurveyProps) {
  const [view, setView] = useState<'list' | 'create' | 'send'>('list');
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
  const [showSendModal, setShowSendModal] = useState(false);

  const handleSendSurvey = (survey: any) => {
    setSelectedSurvey(survey);
    setShowSendModal(true);
  };

  const confirmSend = (eventId: string) => {
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    toast.success(`Survey request scheduled for event: ${event?.title}`);
    setShowSendModal(false);
  };

  if (view === 'create') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setView('list')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
          >
            <ArrowRight size={18} className="rotate-180" />
            Back to Surveys
          </button>
          <button className="btn-primary px-6">Save Survey</button>
        </div>

        <div className="card bg-white p-8 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Create New Survey</h2>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Survey Title</label>
              <input 
                type="text" 
                placeholder="e.g., Customer Satisfaction 2026"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Plus size={18} className="text-primary" />
              Survey Questions
            </h3>
            
            <div className="space-y-4">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question 1</span>
                  <button className="text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <input 
                  type="text" 
                  defaultValue="How satisfied were you with your recent appointment?"
                  className="w-full bg-white px-4 py-2 rounded-lg border border-slate-200 outline-none"
                />
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <div className="w-4 h-4 rounded border border-slate-300 bg-white" />
                    Rating Scale (1-5)
                  </div>
                </div>
              </div>

              <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2">
                <Plus size={18} />
                Add Question
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Surveys</h1>
          <p className="text-slate-500 mt-1">Collect feedback and insights from your customers</p>
        </div>
        <button 
          onClick={() => setView('create')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Create Survey
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Responses', value: '262', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Avg. Completion', value: '74%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Active Surveys', value: '2', icon: ClipboardList, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Avg. Rating', value: '4.5', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="card bg-white p-6 border border-slate-100 flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Survey List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">All Surveys</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search surveys..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {MOCK_SURVEYS.map((survey) => (
            <div key={survey.id} className="card bg-white p-6 border border-slate-100 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <ClipboardList size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{survey.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Users size={12} />
                        {survey.responses} responses
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        {survey.completionRate} completion
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock size={12} />
                        Last sent {survey.lastSent}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    survey.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                  )}>
                    {survey.status}
                  </div>
                  <button 
                    onClick={() => handleSendSurvey(survey)}
                    className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                    title="Send Survey Request"
                  >
                    <Send size={18} />
                  </button>
                  <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Send Survey Modal */}
      <AnimatePresence>
        {showSendModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-2xl font-bold text-slate-900">Send Survey Request</h2>
                <p className="text-sm text-slate-500 mt-1">Select a calendar event to associate this survey with</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Events</h3>
                  <div className="space-y-2">
                    {MOCK_EVENTS.map((event) => (
                      <button 
                        key={event.id}
                        onClick={() => confirmSend(event.id)}
                        className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                            <Calendar size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{event.title}</p>
                            <p className="text-xs text-slate-500">{event.date} at {event.time}</p>
                          </div>
                        </div>
                        <ArrowRight size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                  <HelpCircle className="text-amber-500 shrink-0" size={20} />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    The survey request will be sent automatically via Email and SMS 30 minutes after the event ends.
                  </p>
                </div>

                <button 
                  onClick={() => setShowSendModal(false)}
                  className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
