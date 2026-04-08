import React from 'react';
import { 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  MoreVertical,
  Clock,
  Mail,
  UserPlus,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { Client } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface AutomationProps {
  activeClient: Client | null;
  setActiveTab: (tab: string) => void;
  setActiveClient: (client: Client | null) => void;
}

const workflows = [
  { id: '1', name: 'Welcome Email Sequence', trigger: 'New Lead', status: 'active', steps: 4, icon: Mail, color: 'bg-blue-100 text-blue-600' },
  { id: '2', name: 'Lead Scoring', trigger: 'Lead Activity', status: 'active', steps: 2, icon: Zap, color: 'bg-amber-100 text-amber-600' },
  { id: '3', name: 'SMS Follow-up', trigger: 'Form Submission', status: 'paused', steps: 3, icon: MessageSquare, color: 'bg-emerald-100 text-emerald-600' },
  { id: '4', name: 'CRM Sync', trigger: 'New Contact', status: 'active', steps: 1, icon: UserPlus, color: 'bg-purple-100 text-purple-600' },
];

export function Automation({ activeClient, setActiveTab, setActiveClient }: AutomationProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {activeClient ? `${activeClient.name} Automation` : 'Global Automation'}
          </h1>
          <p className="text-slate-500 mt-1">Build and manage trigger-based marketing workflows</p>
        </div>
        <button 
          onClick={() => toast.info('Opening workflow builder...')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Create Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map(workflow => (
          <div key={workflow.id} className="card bg-white hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-xl", workflow.color)}>
                <workflow.icon size={24} />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => toast.info(`Workflow ${workflow.status === 'active' ? 'paused' : 'resumed'}`)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  {workflow.status === 'active' ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button 
                  onClick={() => toast.info('Opening workflow options...')}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
            
            <h3 className="font-bold text-lg mb-1">{workflow.name}</h3>
            <p className="text-sm text-slate-500 mb-6 flex items-center gap-1">
              Triggered by: <span className="font-medium text-slate-700">{workflow.trigger}</span>
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={14} />
                  {workflow.steps} steps
                </div>
                <div className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  workflow.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                )}>
                  {workflow.status}
                </div>
              </div>
              <button 
                onClick={() => toast.info(`Opening editor for ${workflow.name}`)}
                className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
              >
                Edit
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
        
        <button 
          onClick={() => toast.info('Opening workflow builder...')}
          className="card border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-3 p-8 hover:bg-slate-50 hover:border-primary/30 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shadow-sm">
            <Plus size={24} />
          </div>
          <div className="text-center">
            <div className="font-bold text-slate-600">New Workflow</div>
            <div className="text-xs text-slate-400">Start from scratch or a template</div>
          </div>
        </button>
      </div>
    </div>
  );
}
