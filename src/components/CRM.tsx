import React, { useState, useRef, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  MoreHorizontal,
  ChevronRight,
  Tag,
  Calendar,
  ListFilter,
  Layers,
  CheckSquare,
  Building2,
  Download,
  Trash2,
  UserPlus,
  Upload,
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Clock,
  UserCheck,
  UserMinus,
  Settings2,
  Users
} from 'lucide-react';
import { MOCK_LEADS, MOCK_SEGMENTS } from '../mockData';
import { cn } from '../lib/utils';
import { Client, Lead, Segment } from '../types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface CRMProps {
  clients: Client[];
  activeClient: Client | null;
  setActiveTab: (tab: string) => void;
  setActiveClient: (client: Client | null) => void;
  setCampaignView: (view: 'list' | 'create') => void;
}

export function CRM({ clients, activeClient, setActiveTab, setActiveClient, setCampaignView }: CRMProps) {
  const [view, setView] = useState<'smart-list' | 'bulk-actions' | 'tasks' | 'companies'>('smart-list');
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStep, setImportStep] = useState<'upload' | 'mapping' | 'processing' | 'complete'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const segments = useMemo(() => {
    return activeClient 
      ? MOCK_SEGMENTS.filter(s => s.clientId === activeClient.id)
      : MOCK_SEGMENTS;
  }, [activeClient]);

  const leads = useMemo(() => {
    let filteredLeads = activeClient 
      ? MOCK_LEADS.filter(l => l.clientId === activeClient.id)
      : MOCK_LEADS;

    if (activeSegmentId) {
      filteredLeads = filteredLeads.filter(l => l.segments.includes(activeSegmentId));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredLeads = filteredLeads.filter(l => 
        l.name.toLowerCase().includes(query) || 
        l.email.toLowerCase().includes(query) ||
        l.location?.toLowerCase().includes(query)
      );
    }

    return filteredLeads;
  }, [activeClient, activeSegmentId, searchQuery]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
        setSelectedFile(file);
        setImportStep('mapping');
      } else {
        toast.error('Please upload a CSV or Excel file');
      }
    }
  };

  const handleImportSubmit = () => {
    setImportStep('processing');
    setTimeout(() => {
      setImportStep('complete');
      toast.success('Contacts imported successfully!');
    }, 2000);
  };

  const resetImport = () => {
    setShowImportModal(false);
    setTimeout(() => {
      setImportStep('upload');
      setSelectedFile(null);
    }, 300);
  };

  const renderContent = () => {
    switch (view) {
      case 'smart-list':
        return (
          <div className="flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Segments Sidebar */}
            <div className="w-64 shrink-0 space-y-6">
              <div className="card bg-white p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Smart Lists</h3>
                  <button 
                    onClick={() => toast.info('Creating new segment...')}
                    className="p-1 hover:bg-slate-100 rounded-lg text-primary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-1">
                  <button 
                    onClick={() => setActiveSegmentId(null)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all text-left",
                      !activeSegmentId ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Layers size={16} />
                      <span>All Contacts</span>
                    </div>
                    <span className="text-xs font-bold opacity-60">{MOCK_LEADS.filter(l => !activeClient || l.clientId === activeClient.id).length}</span>
                  </button>
                  {segments.map(segment => (
                    <button 
                      key={segment.id}
                      onClick={() => setActiveSegmentId(segment.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all text-left",
                        activeSegmentId === segment.id ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Tag size={16} />
                        <span className="truncate">{segment.name}</span>
                      </div>
                      <span className="text-xs font-bold opacity-60">{segment.contactCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card bg-purple-50 border-purple-100 p-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Dynamic Filters</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <MapPin size={14} className="text-primary" />
                    <span>Location-based</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <Clock size={14} className="text-primary" />
                    <span>Engagement status</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <UserCheck size={14} className="text-primary" />
                    <span>Converted leads</span>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 bg-white border border-purple-200 rounded-lg text-[10px] font-bold text-primary hover:bg-purple-100 transition-all">
                  Apply AI Filters
                </button>
              </div>
            </div>

            {/* Contacts Table */}
            <div className="flex-1 card bg-white p-0 overflow-hidden border-slate-100 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-bold">Contact Info</th>
                      <th className="px-6 py-4 font-bold">Location</th>
                      <th className="px-6 py-4 font-bold">Segments</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold">Last Engaged</th>
                      <th className="px-6 py-4 font-bold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.length > 0 ? leads.map(lead => (
                      <tr 
                        key={lead.id} 
                        onClick={() => toast.info(`Viewing details for ${lead.name}`)}
                        className="hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-primary flex items-center justify-center font-bold shadow-sm">
                              {lead.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{lead.name}</div>
                              <div className="text-xs text-slate-500">{lead.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <MapPin size={12} className="text-slate-400" />
                            {lead.location || 'Unknown'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {lead.segments.length > 0 ? lead.segments.map(sid => {
                              const s = MOCK_SEGMENTS.find(seg => seg.id === sid);
                              return s ? (
                                <span key={sid} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">
                                  {s.name}
                                </span>
                              ) : null;
                            }) : (
                              <span className="text-[10px] text-slate-400 italic">No segments</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-1 text-[10px] font-bold rounded-full capitalize tracking-wider",
                            lead.status === 'new' ? "bg-blue-100 text-blue-700" :
                            lead.status === 'qualified' ? "bg-emerald-100 text-emerald-700" :
                            "bg-slate-100 text-slate-700"
                          )}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {lead.lastEngagedAt ? new Date(lead.lastEngagedAt).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => { e.stopPropagation(); toast.info(`Drafting email to ${lead.name}`); }}
                              className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-500 hover:text-primary transition-all"
                            >
                              <Mail size={16} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); toast.info(`Calling ${lead.name}`); }}
                              className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-500 hover:text-primary transition-all"
                            >
                              <Phone size={16} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); toast.info(`More options for ${lead.name}`); }}
                              className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-500 hover:text-primary transition-all"
                            >
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300">
                              <Users size={32} />
                            </div>
                            <p className="font-bold text-slate-500">No contacts found</p>
                            <p className="text-sm text-slate-400">Try adjusting your filters or search query.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'bulk-actions':
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-400 mb-6 border border-slate-100 shadow-sm">
              <Layers size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Bulk Actions</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">Perform actions on multiple contacts at once, like sending mass emails or updating statuses.</p>
            <div className="flex gap-3">
              <button className="btn-primary px-8 flex items-center gap-2">
                <Plus size={18} />
                New Bulk Action
              </button>
              <button className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">View History</button>
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Pending Tasks', value: '12', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Due Today', value: '4', color: 'text-rose-600', bg: 'bg-rose-50' },
                { label: 'Completed', value: '45', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map((stat, i) => (
                <div key={i} className="card bg-white p-6">
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <h4 className={cn("text-3xl font-bold mt-1", stat.color)}>{stat.value}</h4>
                </div>
              ))}
            </div>
            <div className="card bg-white p-0 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold">Upcoming Tasks</h3>
                <button className="text-primary text-sm font-bold hover:underline">View All</button>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { title: 'Follow up with Alex Rivera', due: 'Today, 2:00 PM', priority: 'High' },
                  { title: 'Send proposal to TechNova', due: 'Tomorrow, 10:00 AM', priority: 'Medium' },
                  { title: 'Review campaign assets', due: 'Apr 5, 2026', priority: 'Low' },
                ].map((task, i) => (
                  <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-6 h-6 rounded border-2 border-slate-200 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <CheckSquare size={14} className="text-transparent hover:text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <p className="text-xs text-slate-500">{task.due}</p>
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      task.priority === 'High' ? "bg-rose-100 text-rose-700" :
                      task.priority === 'Medium' ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    )}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'companies':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {[
              { name: 'EcoStride', industry: 'Sustainable Fashion', contacts: 8, revenue: '$45k' },
              { name: 'TechNova', industry: 'SaaS', contacts: 12, revenue: '$120k' },
              { name: 'LuxeLiving', industry: 'Real Estate', contacts: 5, revenue: '$850k' },
            ].map((company, i) => (
              <div key={i} className="card bg-white hover:shadow-md transition-all group cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{company.name}</h3>
                    <p className="text-xs text-slate-500">{company.industry}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Contacts</p>
                    <p className="text-sm font-bold text-slate-700">{company.contacts}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Revenue</p>
                    <p className="text-sm font-bold text-slate-700">{company.revenue}</p>
                  </div>
                </div>
              </div>
            ))}
            <button className="card border-dashed border-2 border-slate-200 bg-transparent flex flex-col items-center justify-center gap-3 group hover:border-primary hover:bg-purple-50 transition-all min-h-[160px]">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                <Plus size={20} />
              </div>
              <span className="font-bold text-slate-700 group-hover:text-primary">Add Company</span>
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {activeClient ? `${activeClient.name} CRM` : 'Global CRM'}
          </h1>
          <p className="text-slate-500 mt-1">Track leads, deals, and customer relationships</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center gap-2 transition-all shadow-sm"
          >
            <Upload size={18} />
            Import
          </button>
          <button 
            onClick={() => {
              toast.info('Opening CRM settings...');
            }}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center gap-2 transition-all shadow-sm"
          >
            <Download size={18} />
            Export
          </button>
          <button 
            onClick={() => {
              setCampaignView('create');
              setActiveTab('campaigns');
              toast.info('Transitioning to campaign creation for new contact...');
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Contact
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {[
            { id: 'smart-list', label: 'Smart List', icon: ListFilter },
            { id: 'bulk-actions', label: 'Bulk Action', icon: Layers },
            { id: 'tasks', label: 'Tasks', icon: CheckSquare },
            { id: 'companies', label: 'Companies', icon: Building2 },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                view === tab.id ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search CRM..." 
              onChange={(e) => e.target.value && toast.info(`Searching for: ${e.target.value}`)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none w-64 shadow-sm"
            />
          </div>
          <button 
            onClick={() => toast.info('Opening CRM filters...')}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 shadow-sm"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="min-h-[400px]">
        {renderContent()}
      </div>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                    <Upload size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Import Contacts</h2>
                    <p className="text-sm text-slate-500">Upload CSV or Excel files to bulk add contacts</p>
                  </div>
                </div>
                <button 
                  onClick={resetImport}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8">
                {importStep === 'upload' && (
                  <div className="space-y-6">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-purple-50 transition-all cursor-pointer group"
                    >
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        <FileText size={32} />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-lg text-slate-700">Click to upload or drag and drop</p>
                        <p className="text-sm text-slate-400 mt-1">CSV or XLSX files only (max 10MB)</p>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden" 
                        accept=".csv,.xlsx"
                      />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 items-start">
                      <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Make sure your file includes headers like <strong>Name</strong>, <strong>Email</strong>, and <strong>Phone</strong> for better mapping accuracy.
                      </p>
                    </div>
                  </div>
                )}

                {importStep === 'mapping' && selectedFile && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <FileText size={20} className="text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{selectedFile.name}</p>
                        <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button onClick={() => setImportStep('upload')} className="text-xs font-bold text-primary hover:underline">Change</button>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm font-bold text-slate-700">Map your columns</p>
                      <div className="space-y-3">
                        {[
                          { field: 'Full Name', mapped: 'name' },
                          { field: 'Email Address', mapped: 'email' },
                          { field: 'Phone Number', mapped: 'phone' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-xl">
                            <span className="text-sm font-medium text-slate-600 flex-1">{item.field}</span>
                            <ChevronRight size={14} className="text-slate-300" />
                            <select className="bg-slate-50 border-none text-xs rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary/20 outline-none">
                              <option value={item.mapped}>{item.mapped.charAt(0).toUpperCase() + item.mapped.slice(1)}</option>
                              <option>Ignore</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={handleImportSubmit}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                      Start Import
                    </button>
                  </div>
                )}

                {importStep === 'processing' && (
                  <div className="py-12 flex flex-col items-center justify-center gap-6 text-center">
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                      <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Processing Contacts</h3>
                      <p className="text-sm text-slate-500 mt-1">We're analyzing and importing your data...</p>
                    </div>
                  </div>
                )}

                {importStep === 'complete' && (
                  <div className="py-12 flex flex-col items-center justify-center gap-6 text-center animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={40} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Import Complete!</h3>
                      <p className="text-sm text-slate-500 mt-1">Successfully imported 124 contacts to your CRM.</p>
                    </div>
                    <button 
                      onClick={resetImport}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
