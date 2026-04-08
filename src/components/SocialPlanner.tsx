import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Sparkles, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Clock, 
  MoreHorizontal, 
  Image as ImageIcon, 
  Send, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Copy, 
  Edit3, 
  ChevronLeft, 
  ChevronRight,
  X,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { Client, SocialPost, PostingPlan } from '../types';
import { MOCK_SOCIAL_POSTS, MOCK_POSTING_PLANS } from '../mockData';
import { toast } from 'sonner';

interface SocialPlannerProps {
  client: Client;
}

export function SocialPlanner({ client }: SocialPlannerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [posts, setPosts] = useState<SocialPost[]>(MOCK_SOCIAL_POSTS.filter(p => p.clientId === client.id));
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedCaption, setGeneratedCaption] = useState('');
  
  const postingPlan = MOCK_POSTING_PLANS.find(p => p.clientId === client.id);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [planDays, setPlanDays] = useState(postingPlan?.days || []);

  // Form State
  const [newPost, setNewPost] = useState<Partial<SocialPost>>({
    caption: '',
    platforms: ['instagram'],
    status: 'draft',
    scheduledAt: new Date().toISOString()
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    setNewPost(prev => ({ ...prev, scheduledAt: day.toISOString() }));
    setShowCreateModal(true);
  };

  const handleCreatePost = () => {
    if (!newPost.caption) {
      toast.error('Please add a caption');
      return;
    }
    const post: SocialPost = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: client.id,
      caption: newPost.caption || '',
      platforms: (newPost.platforms as any) || ['instagram'],
      scheduledAt: newPost.scheduledAt || new Date().toISOString(),
      status: newPost.status as any || 'scheduled',
      mediaUrl: newPost.mediaUrl
    };
    setPosts([...posts, post]);
    setShowCreateModal(false);
    setNewPost({
      caption: '',
      platforms: ['instagram'],
      status: 'draft',
      scheduledAt: new Date().toISOString()
    });
    toast.success('Post scheduled successfully!');
  };

  const handleAiGenerate = () => {
    if (!aiPrompt) {
      toast.error('Please enter what you want to promote');
      return;
    }
    setIsAiGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const variations = [
        `✨ Big news! We're launching our new collection today. Get ready to elevate your style with our latest designs. Shop now! 🛍️\n\n#NewArrivals #StyleInspo #Fashion`,
        `🌿 Sustainability meets style. Discover our newest eco-friendly pieces designed for the conscious shopper. 🌎\n\n#EcoFriendly #SustainableFashion #GreenLiving`,
        `Ready for a refresh? Our latest drop is here to help you look and feel your best. Limited stock available! ⚡\n\n#StyleRefresh #MustHave #LimitedEdition`
      ];
      setGeneratedCaption(variations[Math.floor(Math.random() * variations.length)]);
      setIsAiGenerating(false);
    }, 1500);
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button onClick={prevMonth} className="p-1 hover:bg-white rounded-md transition-all text-slate-600">
              <ChevronLeft size={18} />
            </button>
            <button onClick={nextMonth} className="p-1 hover:bg-white rounded-md transition-all text-slate-600">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4 mr-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-slate-300" />
              <span>Draft</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Scheduled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Published</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return (
      <div className="grid grid-cols-7 border-t border-l border-slate-100 rounded-xl overflow-hidden shadow-sm bg-white">
        {calendarDays.map((day, i) => {
          const dayPosts = posts.filter(p => isSameDay(parseISO(p.scheduledAt), day));
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <div
              key={i}
              onClick={() => onDateClick(day)}
              className={`min-h-[120px] p-2 border-r border-b border-slate-100 transition-all cursor-pointer hover:bg-slate-50 group ${
                !isCurrentMonth ? 'bg-slate-50/50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-medium ${
                  isSameDay(day, new Date()) 
                    ? 'bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full' 
                    : isCurrentMonth ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  {format(day, 'd')}
                </span>
                {isSameDay(day, new Date()) && (
                  <span className="text-[10px] font-bold text-primary uppercase">Today</span>
                )}
              </div>
              
              <div className="space-y-1">
                {dayPosts.map(post => (
                  <div 
                    key={post.id}
                    className={`p-1.5 rounded-lg text-[10px] font-medium flex items-center gap-1.5 border shadow-sm ${
                      post.status === 'published' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                        : post.status === 'scheduled'
                        ? 'bg-purple-50 border-purple-100 text-primary'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex -space-x-1">
                      {post.platforms.map(p => (
                        <div key={p} className="bg-white rounded-full p-0.5 shadow-sm">
                          {p === 'instagram' && <Instagram size={8} />}
                          {p === 'facebook' && <Facebook size={8} />}
                          {p === 'x' && <Twitter size={8} />}
                          {p === 'linkedin' && <Linkedin size={8} />}
                        </div>
                      ))}
                    </div>
                    <span className="truncate flex-1">{post.caption}</span>
                  </div>
                ))}
                {isCurrentMonth && dayPosts.length === 0 && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-center py-4">
                    <Plus size={16} className="text-slate-300" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Planner</h1>
          <p className="text-slate-500 mt-1">Plan and schedule posts for {client.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white border border-slate-200 text-sm rounded-full px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none">
            <option>All Platforms</option>
            <option>Instagram</option>
            <option>Facebook</option>
            <option>X (Twitter)</option>
            <option>LinkedIn</option>
          </select>
          <button 
            onClick={() => {
              setNewPost({ ...newPost, status: 'draft' });
              setShowCreateModal(true);
            }}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Sparkles size={18} className="text-primary" />
            Generate with AI
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            Create Post
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Calendar Section */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </div>
        </div>

        {/* Right Panel: Queue & Plan */}
        <div className="space-y-6">
          {/* Client Context Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <img src={client.logo} alt={client.name} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <h3 className="font-bold text-slate-800">{client.name}</h3>
                <p className="text-xs text-slate-500">{client.servicePlan?.socialPostingSchedule || '2 posts per week'}</p>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
              <div className="flex items-center justify-between text-primary font-bold text-xs mb-1">
                <div className="flex items-center gap-2">
                  <Layout size={14} />
                  Posting Plan
                </div>
                <button 
                  onClick={() => setIsEditingPlan(!isEditingPlan)}
                  className="p-1 hover:bg-white rounded transition-colors"
                >
                  <Edit3 size={12} />
                </button>
              </div>
              <div className="space-y-2 mt-2">
                {planDays.map((d, i) => (
                  <div key={i} className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-600">{d.day}</span>
                    {isEditingPlan ? (
                      <input 
                        type="text"
                        value={d.theme}
                        onChange={(e) => {
                          const newDays = [...planDays];
                          newDays[i].theme = e.target.value;
                          setPlanDays(newDays);
                        }}
                        className="bg-white border border-purple-200 rounded px-1 w-24 outline-none focus:ring-1 focus:ring-primary/20"
                      />
                    ) : (
                      <span className="text-slate-500">{d.theme}</span>
                    )}
                  </div>
                ))}
                {isEditingPlan && (
                  <button 
                    onClick={() => setIsEditingPlan(false)}
                    className="w-full mt-2 py-1 bg-primary text-white text-[10px] font-bold rounded hover:bg-primary/90 transition-all"
                  >
                    Save Plan
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content Queue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Upcoming Queue</h3>
              <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-full text-slate-500">
                {posts.filter(p => p.status === 'scheduled').length} Posts
              </span>
            </div>
            <div className="space-y-3">
              {posts
                .filter(p => p.status !== 'published')
                .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                .slice(0, 4)
                .map(post => (
                  <div key={post.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-1">
                        {post.platforms.map(p => (
                          <div key={p} className="text-slate-400">
                            {p === 'instagram' && <Instagram size={12} />}
                            {p === 'facebook' && <Facebook size={12} />}
                            {p === 'x' && <Twitter size={12} />}
                            {p === 'linkedin' && <Linkedin size={12} />}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <Clock size={10} />
                        {format(parseISO(post.scheduledAt), 'MMM d, h:mm a')}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-2">{post.caption}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        post.status === 'scheduled' ? 'bg-purple-100 text-primary' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {post.status}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-white rounded text-slate-400 hover:text-primary transition-colors">
                          <Edit3 size={12} />
                        </button>
                        <button className="p-1 hover:bg-white rounded text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              {posts.filter(p => p.status !== 'published').length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CalendarIcon size={20} className="text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-400">No posts in queue</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Creation Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* Left Side: Editor */}
              <div className="flex-1 p-8 border-r border-slate-100 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Create Social Post</h2>
                  <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* AI Section */}
                  <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
                      <Sparkles size={18} />
                      Generate Caption with AI
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500">What do you want to promote?</p>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="e.g. New spring collection sneakers..."
                          className="flex-1 px-4 py-2 bg-white border border-purple-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                        <button 
                          onClick={handleAiGenerate}
                          disabled={isAiGenerating}
                          className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                        >
                          {isAiGenerating ? 'Generating...' : 'Generate'}
                        </button>
                      </div>
                      
                      {generatedCaption && (
                        <div className="mt-4 p-4 bg-white rounded-xl border border-purple-100 animate-in slide-in-from-top-2">
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">{generatedCaption}</p>
                          <div className="flex justify-end gap-2 mt-3">
                            <button 
                              onClick={handleAiGenerate}
                              className="text-[10px] font-bold text-slate-400 hover:text-primary flex items-center gap-1"
                            >
                              <Copy size={12} /> Regenerate
                            </button>
                            <button 
                              onClick={() => {
                                setNewPost({ ...newPost, caption: generatedCaption });
                                setGeneratedCaption('');
                              }}
                              className="text-[10px] font-bold text-primary flex items-center gap-1"
                            >
                              <CheckCircle2 size={12} /> Use this
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Caption</label>
                    <textarea 
                      value={newPost.caption}
                      onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                      placeholder="Write your caption here..."
                      className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    />
                  </div>

                  {/* Platforms */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Select Platforms</label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { id: 'instagram', icon: Instagram, label: 'Instagram' },
                        { id: 'facebook', icon: Facebook, label: 'Facebook' },
                        { id: 'x', icon: Twitter, label: 'X (Twitter)' },
                        { id: 'linkedin', icon: Linkedin, label: 'LinkedIn' }
                      ].map(platform => (
                        <button
                          key={platform.id}
                          onClick={() => {
                            const current = newPost.platforms || [];
                            if (current.includes(platform.id as any)) {
                              setNewPost({ ...newPost, platforms: current.filter(p => p !== platform.id) });
                            } else {
                              setNewPost({ ...newPost, platforms: [...current, platform.id as any] });
                            }
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            newPost.platforms?.includes(platform.id as any)
                              ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <platform.icon size={14} />
                          {platform.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Media & Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Media</label>
                      <button className="w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-primary hover:bg-purple-50 transition-all group">
                        <ImageIcon size={24} className="group-hover:text-primary" />
                        <span className="text-xs font-medium">Upload Image or Video</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Schedule Date & Time</label>
                      <div className="space-y-3">
                        <div className="relative">
                          <CalendarIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="date" 
                            value={newPost.scheduledAt?.split('T')[0]}
                            onChange={(e) => {
                              const time = newPost.scheduledAt?.split('T')[1] || '10:00:00.000Z';
                              setNewPost({ ...newPost, scheduledAt: `${e.target.value}T${time}` });
                            }}
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>
                        <div className="relative">
                          <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="time" 
                            value={newPost.scheduledAt?.split('T')[1]?.substring(0, 5) || '10:00'}
                            onChange={(e) => {
                              const date = newPost.scheduledAt?.split('T')[0] || format(new Date(), 'yyyy-MM-dd');
                              setNewPost({ ...newPost, scheduledAt: `${date}T${e.target.value}:00.000Z` });
                            }}
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Preview */}
              <div className="w-full md:w-80 bg-slate-50 p-8 flex flex-col">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Post Preview</h3>
                
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-full max-w-[280px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="p-3 flex items-center gap-2 border-b border-slate-50">
                      <img src={client.logo} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-[10px] font-bold text-slate-800">{client.name}</span>
                    </div>
                    <div className="aspect-square bg-slate-100 flex items-center justify-center">
                      {newPost.mediaUrl ? (
                        <img src={newPost.mediaUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={32} className="text-slate-300" />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex gap-3 mb-3">
                        <Instagram size={16} className="text-slate-400" />
                        <Facebook size={16} className="text-slate-400" />
                        <Twitter size={16} className="text-slate-400" />
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                        {newPost.caption || 'Your caption will appear here...'}
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-4 text-center">
                    Previewing Instagram layout.<br/>Other platforms may vary slightly.
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  <button 
                    onClick={() => {
                      setNewPost({ ...newPost, status: 'draft' });
                      handleCreatePost();
                    }}
                    className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
                  >
                    Save as Draft
                  </button>
                  <button 
                    onClick={() => {
                      setNewPost({ ...newPost, status: 'scheduled' });
                      handleCreatePost();
                    }}
                    className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    Schedule Post
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
