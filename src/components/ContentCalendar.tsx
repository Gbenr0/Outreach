import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  Search,
  Instagram,
  Mail,
  Facebook,
  Twitter,
  MoreVertical,
  Calendar as CalendarIcon,
  ArrowLeft,
  Clock,
  Image as ImageIcon,
  Send,
  Sparkles
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { MOCK_CONTENT } from '../mockData';
import { cn } from '../lib/utils';
import { Client } from '../types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface ContentCalendarProps {
  clients: Client[];
  activeClient: Client | null;
  setActiveTab: (tab: string) => void;
  setActiveClient: (client: Client | null) => void;
  setCampaignView: (view: 'list' | 'create') => void;
}

export function ContentCalendar({ clients, activeClient, setActiveTab, setActiveClient, setCampaignView }: ContentCalendarProps) {
  const [view, setView] = useState<'calendar' | 'schedule'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const content = activeClient 
    ? MOCK_CONTENT.filter(c => c.clientId === activeClient.id)
    : MOCK_CONTENT;

  const platformIcons = {
    Instagram: Instagram,
    Mailchimp: Mail,
    Facebook: Facebook,
    Twitter: Twitter
  };

  return (
    <AnimatePresence mode="wait">
      {view === 'calendar' ? (
        <motion.div 
          key="calendar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-8 p-8 bg-white/40 rounded-[2.5rem] border border-slate-200/60 shadow-sm backdrop-blur-sm"
        >
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
              <p className="text-slate-500 mt-1">Plan and schedule content across all platforms</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => toast.info('Opening bulk content uploader...')}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Bulk Upload
              </button>
              <button 
                onClick={() => setView('schedule')}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Schedule Post
              </button>
            </div>
          </div>

          <div className="card bg-white p-0 overflow-hidden">
            {/* Calendar Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button 
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1 text-xs font-bold hover:bg-white hover:shadow-sm rounded-md transition-all"
                  >
                    Today
                  </button>
                  <button 
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search content..." 
                    onChange={(e) => e.target.value && toast.info(`Searching for: ${e.target.value}`)}
                    className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none w-48"
                  />
                </div>
                <button 
                  onClick={() => toast.info('Opening calendar filters...')}
                  className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <Filter size={18} />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 bg-slate-50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-[140px]">
              {calendarDays.map((day, i) => {
                const dayContent = content.filter(c => isSameDay(new Date(c.scheduledAt), day));
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());

                return (
                  <div 
                    key={i} 
                    className={cn(
                      "p-2 border-r border-b border-slate-100 relative group transition-colors hover:bg-slate-50/50",
                      !isCurrentMonth && "bg-slate-50/30 text-slate-300",
                      i % 7 === 6 && "border-r-0",
                      dayContent.length > 0 && isCurrentMonth && "bg-primary/[0.02]"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className={cn(
                        "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full",
                        isToday ? "bg-primary text-white shadow-sm" : "text-slate-500"
                      )}>
                        {format(day, 'd')}
                      </div>
                      {dayContent.length > 0 && isCurrentMonth && (
                        <div className="text-[10px] font-bold text-primary/40 px-1">
                          {dayContent.length}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1 overflow-y-auto max-h-[90px] scrollbar-hide">
                      {dayContent.map(item => {
                        const Icon = platformIcons[item.platform as keyof typeof platformIcons] || CalendarIcon;
                        const client = clients.find(c => c.id === item.clientId);
                        
                        return (
                          <div 
                            key={item.id}
                            onClick={() => toast.info(`Viewing details for: ${item.title}`)}
                            className={cn(
                              "p-1.5 rounded-md text-[10px] font-medium border flex items-center gap-1.5 cursor-pointer hover:shadow-sm transition-all",
                              item.status === 'approved' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-amber-50 border-amber-100 text-amber-700"
                            )}
                          >
                            <Icon size={10} />
                            <span className="truncate flex-1">{item.title}</span>
                            {!activeClient && (
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: client?.color }} />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setView('schedule');
                        toast.info(`Scheduling post for ${format(day, 'MMM d')}...`); 
                      }}
                      className="absolute bottom-2 right-2 p-1 bg-white rounded-md shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity text-primary"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="schedule"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('calendar')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Schedule New Post</h1>
              <p className="text-slate-500 mt-1">Create and schedule content for your social channels</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="card bg-white space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Post Caption</label>
                  <textarea 
                    placeholder="What would you like to share?"
                    className="w-full h-32 p-4 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => toast.success('AI generating caption...')}
                      className="flex items-center gap-2 text-xs font-bold text-primary hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Sparkles size={14} />
                      AI Generate Caption
                    </button>
                    <span className="text-xs text-slate-400">0 / 2200 characters</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Media</label>
                  <div className="grid grid-cols-3 gap-4">
                    <button className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-primary hover:text-primary transition-all">
                      <ImageIcon size={24} />
                      <span className="text-[10px] font-bold">Add Image/Video</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Schedule Date</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="date" 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Schedule Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="time" 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setView('calendar')}
                  className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
                >
                  Save Draft
                </button>
                <button 
                  onClick={() => {
                    toast.success('Post scheduled successfully!');
                    setView('calendar');
                  }}
                  className="btn-primary px-8 py-2.5 flex items-center gap-2"
                >
                  <Send size={18} />
                  Schedule Post
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card bg-white">
                <h3 className="font-bold text-sm mb-4">Post Preview</h3>
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <div className="p-3 flex items-center gap-2 border-b border-slate-50">
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                    <div className="flex-1">
                      <div className="h-2 w-20 bg-slate-100 rounded mb-1" />
                      <div className="h-1.5 w-12 bg-slate-50 rounded" />
                    </div>
                  </div>
                  <div className="aspect-square bg-slate-50 flex items-center justify-center text-slate-300">
                    <ImageIcon size={48} />
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="h-2 w-full bg-slate-100 rounded" />
                    <div className="h-2 w-2/3 bg-slate-100 rounded" />
                  </div>
                </div>
              </div>

              <div className="card bg-slate-900 text-white">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" />
                  Best Time to Post
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Based on your audience activity, the best time to post tomorrow is <span className="text-white font-bold">6:45 PM</span>.
                </p>
                <button 
                  onClick={() => toast.success('Time optimized!')}
                  className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors"
                >
                  Apply Optimal Time
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
