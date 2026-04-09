import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, 
  Plus, 
  Mail, 
  UserPlus, 
  MessageSquare, 
  ChevronDown,
  Sparkles,
  Mic,
  Send,
  Layout,
  Clock,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  FormInput,
  FileJson,
  MousePointer2,
  Search,
  ArrowLeft,
  Settings,
  Play,
  Trash2,
  Save,
  ChevronRight
} from 'lucide-react';
import { Client } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface AutomationProps {
  activeClient: Client | null;
  setActiveTab: (tab: string) => void;
  setActiveClient: (client: Client | null) => void;
}

const templates = [
  { 
    id: '1', 
    name: 'Email Drip Sequence', 
    desc: 'Add contacts to this workflow to drip them a series of Emails over time.', 
    icon: Mail, 
    color: 'bg-amber-50 text-amber-600' 
  },
  { 
    id: '2', 
    name: 'Appointment Confirmation + Re...', 
    desc: 'For each new appointment, send a confirmation, send reminders, survey...', 
    icon: Clock, 
    color: 'bg-blue-50 text-blue-600' 
  },
  { 
    id: '3', 
    name: 'Fast 5 Lite', 
    desc: 'Great for nurturing new leads into hot leads by automating email, SMS, Call...', 
    icon: Zap, 
    color: 'bg-emerald-50 text-emerald-600' 
  },
  { 
    id: '4', 
    name: 'Long Term Nurture/Reactivatio...', 
    desc: 'A long-term monthly email sequence that consistently nurtures and...', 
    icon: MessageSquare, 
    color: 'bg-emerald-50 text-emerald-600' 
  },
  { 
    id: '5', 
    name: 'FAQ Auto Reply', 
    desc: 'Automate replies to frequently asked questions across SMS, FB, Instagram,...', 
    icon: HelpCircle, 
    color: 'bg-purple-50 text-purple-600' 
  },
];

export function Automation({ activeClient }: AutomationProps) {
  const [view, setView] = useState<'dashboard' | 'builder' | 'template-details'>('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [input, setInput] = useState('');
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCreateDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const createOptions = [
    { id: 'scratch', label: 'Start from Scratch', icon: MousePointer2, desc: 'Build your custom logic' },
    { id: 'ai', label: 'AI-Assisted Build', icon: Sparkles, desc: 'Describe and let AI build it' },
    { id: 'templates', label: 'Browse Templates', icon: Layout, desc: 'Choose from proven recipes' },
    { id: 'import', label: 'Import Workflow', icon: FileJson, desc: 'Upload a JSON configuration' },
  ];

  const handleOptionClick = (optionId: string) => {
    setShowCreateDropdown(false);
    if (optionId === 'scratch') {
      setView('builder');
      toast.success('Starting new workflow from scratch');
    } else if (optionId === 'ai') {
      // Scroll to AI section if on dashboard, or just toast
      if (view === 'dashboard') {
        window.scrollTo({ top: 200, behavior: 'smooth' });
      } else {
        setView('dashboard');
      }
      toast.info('Use the AI input to describe your workflow');
    } else if (optionId === 'templates') {
      if (view === 'dashboard') {
        window.scrollTo({ top: 800, behavior: 'smooth' });
      } else {
        setView('dashboard');
      }
    } else if (optionId === 'import') {
      toast.info('Import functionality coming soon');
    }
  };

  const handleTemplateClick = (template: any) => {
    setSelectedTemplate(template);
    setView('template-details');
  };

  if (view === 'builder') {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setView('dashboard')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Workflows
          </button>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              Save Draft
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2">
              <Play size={16} />
              Publish Workflow
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="card bg-white p-8 border-2 border-primary/10 shadow-xl shadow-primary/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Zap size={24} />
                </div>
                <div>
                  <input 
                    type="text" 
                    defaultValue="Untitled Workflow" 
                    className="text-2xl font-bold text-slate-900 bg-transparent border-none outline-none focus:ring-0 p-0"
                  />
                  <p className="text-sm text-slate-500">Define your triggers and actions</p>
                </div>
              </div>

              <div className="space-y-4 relative">
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-100" />
                
                {/* Trigger */}
                <div className="relative flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 z-10 shadow-sm border-4 border-white">
                    <Zap size={20} />
                  </div>
                  <div className="flex-1 p-6 bg-slate-50 rounded-2xl border border-slate-200 group-hover:border-amber-200 transition-all cursor-pointer">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Trigger</p>
                    <h4 className="font-bold text-slate-900">Choose a Trigger</h4>
                    <p className="text-sm text-slate-500">Select what event starts this workflow</p>
                  </div>
                </div>

                {/* Add Step */}
                <div className="relative flex items-center justify-center py-4">
                  <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm z-10">
                    <Plus size={20} />
                  </button>
                </div>

                {/* End */}
                <div className="relative flex items-start gap-6 opacity-50">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 z-10 shadow-sm border-4 border-white">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="flex-1 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">End</p>
                    <h4 className="font-bold text-slate-400">Workflow Ends</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="card bg-white p-6 space-y-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Settings size={18} className="text-slate-400" />
                Workflow Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Status</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="text-sm font-medium text-slate-600">Draft</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Allow Re-entry</label>
                  <button className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                    <span>No</span>
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition-all">
                <Trash2 size={16} />
                Delete Workflow
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'template-details' && selectedTemplate) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <button 
          onClick={() => setView('dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Templates
        </button>

        <div className="card bg-white p-10 border border-slate-100 shadow-xl">
          <div className="flex flex-col md:flex-row gap-8">
            <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0", selectedTemplate.color)}>
              <selectedTemplate.icon size={40} />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">{selectedTemplate.name}</h2>
                <p className="text-slate-500 mt-2 text-lg leading-relaxed">{selectedTemplate.desc}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Difficulty</p>
                  <p className="font-bold text-slate-700">Beginner Friendly</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Est. Setup Time</p>
                  <p className="font-bold text-slate-700">5-10 Minutes</p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="font-bold text-slate-900">What's included in this template:</h3>
                <ul className="space-y-3">
                  {[
                    'Pre-configured trigger logic',
                    'Optimized wait steps and delays',
                    'Sample email/SMS copy templates',
                    'Automated tagging and segmentation'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 size={12} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 flex gap-4">
                <button 
                  onClick={() => {
                    toast.success(`Creating workflow from ${selectedTemplate.name}`);
                    setView('builder');
                  }}
                  className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  Use This Template
                  <ArrowRight size={18} />
                </button>
                <button className="px-6 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all">
                  Preview Steps
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Workflows</h1>
          <p className="text-slate-500 mt-1">Automate your processes using simple triggers and actions.</p>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowCreateDropdown(!showCreateDropdown)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-primary hover:bg-slate-50 transition-all shadow-sm",
              showCreateDropdown && "ring-2 ring-primary/20 border-primary/30"
            )}
          >
            Create Workflow
            <ChevronDown size={16} className={cn("transition-transform duration-200", showCreateDropdown && "rotate-180")} />
          </button>

          <AnimatePresence>
            {showCreateDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50"
              >
                <div className="space-y-1">
                  {createOptions.map((option, i) => (
                    <button 
                      key={i}
                      onClick={() => handleOptionClick(option.id)}
                      className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                        <option.icon size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{option.label}</p>
                        <p className="text-[10px] text-slate-500 truncate">{option.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-50 px-3 pb-1">
                  <button className="w-full flex items-center justify-between text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors">
                    <span>Advanced Settings</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* AI Section */}
      <div className="relative py-12 flex flex-col items-center">
        {/* Background Glow */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-20 blur-[100px]">
          <div className="w-[500px] h-[300px] bg-gradient-to-r from-purple-400 to-blue-400 rounded-full" />
        </div>

        <div className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
              <Sparkles size={18} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">What do you want to automate?</h2>
            <span className="px-1.5 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded uppercase tracking-wider">Beta</span>
          </div>
          <p className="text-sm text-slate-500">Build workflows for free by chatting with AI</p>
        </div>

        <div className="w-full max-w-2xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <div className="relative bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="After sending a prop..."
              className="w-full h-32 px-8 py-6 text-lg text-slate-700 placeholder-slate-300 outline-none resize-none"
            />
            <div className="absolute bottom-4 right-6 flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Mic size={20} />
              </button>
              <button 
                onClick={() => {
                  if (input.trim()) {
                    toast.success('AI is building your workflow...');
                    setInput('');
                    setView('builder');
                  }
                }}
                className="p-2.5 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-all shadow-lg shadow-purple-200"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[
            { label: 'Lead Nurturing', icon: UserPlus },
            { label: 'Form Automation', icon: FormInput },
            { label: 'Email Campaigns', icon: Mail },
          ].map((chip, i) => (
            <button 
              key={i}
              onClick={() => setInput(chip.label)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-primary/30 hover:text-primary transition-all shadow-sm"
            >
              <chip.icon size={14} className="text-slate-400" />
              {chip.label}
            </button>
          ))}
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            more
          </button>
        </div>
      </div>

      {/* Separator */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-slate-50 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or</span>
        </div>
      </div>

      {/* Templates Section */}
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Start with a Template</h3>
          <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            View All Templates
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <motion.div 
              key={template.id}
              whileHover={{ y: -4 }}
              onClick={() => handleTemplateClick(template)}
              className="card bg-white p-6 flex gap-4 hover:shadow-lg transition-all cursor-pointer border border-slate-100"
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", template.color)}>
                <template.icon size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 leading-tight">{template.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{template.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-12 border-t border-slate-100">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          Understanding Workflows 
          <button className="text-primary hover:underline">(Learn more)</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-video bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer">
              <Layout size={24} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
