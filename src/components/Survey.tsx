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
  HelpCircle,
  Copy,
  Share2,
  Check,
  GripVertical,
  Type,
  AlignLeft,
  List,
  CheckSquare,
  ChevronDown
} from 'lucide-react';
import { Client } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence, Reorder } from 'motion/react';

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
  const [view, setView] = useState<'list' | 'create' | 'send' | 'details'>('list');
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [surveyTitle, setSurveyTitle] = useState('');
  const [questions, setQuestions] = useState<any[]>([
    { id: '1', text: 'How satisfied were you with your recent appointment?', type: 'rating', options: [] }
  ]);
  const [copied, setCopied] = useState(false);

  const handleAddQuestion = () => {
    const newId = Math.random().toString(36).substring(7);
    setQuestions([...questions, { id: newId, text: '', type: 'text', options: ['Option 1'] }]);
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    } else {
      toast.error('Survey must have at least one question');
    }
  };

  const handleQuestionChange = (id: string, updates: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const handleAddOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`] };
      }
      return q;
    }));
  };

  const handleOptionChange = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...(q.options || [])];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleDeleteOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = q.options.filter((_: any, i: number) => i !== optionIndex);
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleSaveSurvey = () => {
    if (!surveyTitle.trim()) {
      toast.error('Please enter a survey title');
      return;
    }
    setShowSaveModal(true);
  };

  const copyToClipboard = () => {
    const link = `https://outreach.ai/s/${Math.random().toString(36).substring(7)}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSurvey = (survey: any) => {
    setSelectedSurvey(survey);
    setShowSendModal(true);
  };

  const confirmSend = (eventId: string) => {
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    toast.success(`Survey request scheduled for event: ${event?.title}`);
    setShowSendModal(false);
  };

  const handleViewDetails = (survey: any) => {
    setSelectedSurvey(survey);
    setView('details');
  };

  const renderDetails = () => {
    if (!selectedSurvey) return null;

    const responseData = [
      { name: 'Mon', count: 12 },
      { name: 'Tue', count: 18 },
      { name: 'Wed', count: 15 },
      { name: 'Thu', count: 25 },
      { name: 'Fri', count: 22 },
      { name: 'Sat', count: 30 },
      { name: 'Sun', count: 28 },
    ];

    const ratingData = [
      { name: '5 Stars', value: 65, color: '#10b981' },
      { name: '4 Stars', value: 20, color: '#3b82f6' },
      { name: '3 Stars', value: 10, color: '#f59e0b' },
      { name: '2 Stars', value: 3, color: '#ef4444' },
      { name: '1 Star', value: 2, color: '#7f1d1d' },
    ];

    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setView('list')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
          >
            <ArrowRight size={18} className="rotate-180" />
            Back to Surveys
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold hover:bg-primary hover:text-white transition-all">
              Edit Survey
            </button>
            <button 
              onClick={() => handleSendSurvey(selectedSurvey)}
              className="btn-primary px-6 flex items-center gap-2"
            >
              <Send size={18} />
              Send Request
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Survey Info & Questions */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card bg-white p-8 border border-slate-100 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedSurvey.title}</h2>
                  <p className="text-slate-500 mt-1">Created on April 5, 2026 • Status: <span className="text-emerald-600 font-bold uppercase text-[10px]">{selectedSurvey.status}</span></p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg font-bold">
                  <Star size={16} className="fill-amber-400" />
                  {selectedSurvey.rating || '4.5'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Responses</p>
                  <p className="text-xl font-bold text-slate-900">{selectedSurvey.responses}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion Rate</p>
                  <p className="text-xl font-bold text-slate-900">{selectedSurvey.completionRate}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg. Time</p>
                  <p className="text-xl font-bold text-slate-900">2m 45s</p>
                </div>
              </div>
            </div>

            <div className="card bg-white p-8 border border-slate-100 space-y-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList size={20} className="text-primary" />
                Survey Questions & Responses
              </h3>
              <div className="space-y-6">
                {[
                  { q: 'How satisfied were you with your recent appointment?', type: 'rating', responses: 45 },
                  { q: 'What could we improve in our service?', type: 'text', responses: 32 },
                  { q: 'Would you recommend us to a friend?', type: 'multiple_choice', responses: 45 },
                ].map((q, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-slate-900">{q.q}</p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{q.type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Users size={12} /> {q.responses} responses</span>
                      <button className="text-primary font-bold hover:underline bg-primary/5 px-3 py-1 rounded-lg transition-colors">View Individual Responses</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics Sidebar */}
          <div className="space-y-8">
            <div className="card bg-primary p-6 border-none text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h4 className="font-bold mb-6 relative z-10">Response Trend</h4>
              <div className="h-48 w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={responseData}>
                    <defs>
                      <linearGradient id="colorResponsesWhite" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', color: '#1e293b' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#ffffff" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorResponsesWhite)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card bg-white p-6 border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-6">Rating Distribution</h4>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ratingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {ratingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {ratingData.map((item, i) => (
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
          </div>
        </div>
      </div>
    );
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
          <button 
            onClick={handleSaveSurvey}
            className="btn-primary px-6"
          >
            Save Survey
          </button>
        </div>

        <div className="card bg-white p-8 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Create New Survey</h2>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Survey Title</label>
              <input 
                type="text" 
                value={surveyTitle}
                onChange={(e) => setSurveyTitle(e.target.value)}
                placeholder="e.g., Customer Satisfaction 2026"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-primary" />
                Survey Questions
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Drag to reorder</span>
            </h3>
            
            <Reorder.Group axis="y" values={questions} onReorder={setQuestions} className="space-y-4">
              {questions.map((q, index) => (
                <Reorder.Item 
                  key={q.id} 
                  value={q}
                  className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 cursor-default relative group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-slate-300 hover:text-slate-500 transition-colors">
                        <GripVertical size={18} />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question {index + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={q.type}
                        onChange={(e) => handleQuestionChange(q.id, { type: e.target.value })}
                        className="text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      >
                        <option value="rating">Rating Scale</option>
                        <option value="text">Short Answer</option>
                        <option value="textarea">Long Answer</option>
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="checkbox">Checkboxes</option>
                      </select>
                      <button 
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <input 
                    type="text" 
                    value={q.text}
                    onChange={(e) => handleQuestionChange(q.id, { text: e.target.value })}
                    placeholder="Enter your question here..."
                    className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                  />

                  {/* Question Type Specific UI */}
                  <div className="pt-2">
                    {q.type === 'rating' && (
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white/50 p-3 rounded-xl border border-slate-100">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        Rating Scale (1-5 Stars)
                      </div>
                    )}

                    {(q.type === 'text' || q.type === 'textarea') && (
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white/50 p-3 rounded-xl border border-slate-100 italic">
                        {q.type === 'text' ? <Type size={14} /> : <AlignLeft size={14} />}
                        User will provide a {q.type === 'text' ? 'short' : 'long'} text response
                      </div>
                    )}

                    {(q.type === 'multiple_choice' || q.type === 'checkbox') && (
                      <div className="space-y-3">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Options</div>
                        {q.options?.map((option: string, optIndex: number) => (
                          <div key={optIndex} className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                            <div className={cn(
                              "w-4 h-4 border border-slate-300 bg-white shrink-0",
                              q.type === 'multiple_choice' ? "rounded-full" : "rounded"
                            )} />
                            <input 
                              type="text" 
                              value={option}
                              onChange={(e) => handleOptionChange(q.id, optIndex, e.target.value)}
                              className="flex-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                            />
                            <button 
                              onClick={() => handleDeleteOption(q.id, optIndex)}
                              className="text-slate-300 hover:text-red-400 transition-colors"
                            >
                              <Plus size={14} className="rotate-45" />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => handleAddOption(q.id)}
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 mt-2"
                        >
                          <Plus size={14} />
                          Add Option
                        </button>
                      </div>
                    )}
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <button 
              onClick={handleAddQuestion}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add Question
            </button>
          </div>
        </div>

        {/* Save Confirmation Modal */}
        <AnimatePresence>
          {showSaveModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200"
              >
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Survey Saved!</h2>
                  <p className="text-sm text-slate-500 mt-1">Your survey is now live and ready to be shared.</p>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shareable Link</label>
                    <div className="flex gap-2">
                      <div className="flex-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-sm text-slate-600 truncate">
                        https://outreach.ai/s/survey-{Math.random().toString(36).substring(7)}
                      </div>
                      <button 
                        onClick={copyToClipboard}
                        className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center"
                      >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        setShowSaveModal(false);
                        setView('list');
                      }}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                    >
                      Done
                    </button>
                    <button className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                      <Share2 size={18} />
                      Share
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

  if (view === 'details') {
    return renderDetails();
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
            <div 
              key={survey.id} 
              onClick={() => handleViewDetails(survey)}
              className="card bg-white p-6 border border-slate-100 hover:shadow-md transition-all group cursor-pointer"
            >
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendSurvey(survey);
                    }}
                    className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                    title="Send Survey Request"
                  >
                    <Send size={18} />
                  </button>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"
                  >
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
