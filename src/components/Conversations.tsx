import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Mail, 
  MessageSquare, 
  Instagram, 
  Send, 
  Paperclip, 
  Smile,
  MoreVertical,
  CheckCheck,
  User,
  Inbox as InboxIcon,
  Phone,
  Video,
  Info,
  Clock,
  MapPin,
  Calendar,
  ChevronRight,
  Archive,
  Trash2,
  AlertCircle,
  Settings,
  Plus,
  MessageCircle,
  Twitter,
  Facebook,
  X as CloseIcon,
  UserPlus,
  StickyNote,
  Zap
} from 'lucide-react';
import { MOCK_MESSAGES, MOCK_LEADS } from '../mockData';
import { cn } from '../lib/utils';
import { Client, Message, Lead } from '../types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { Launchpad } from './Launchpad';

interface ConversationsProps {
  clients: Client[];
  activeClient: Client | null;
  setActiveTab: (tab: string) => void;
  setActiveClient: (client: Client | null) => void;
  onUpdateClient?: (clientId: string, updates: Partial<Client>) => void;
}

export function Conversations({ clients, activeClient, setActiveTab, setActiveClient, onUpdateClient }: ConversationsProps) {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'email' | 'sms' | 'social'>('all');
  const [showInfo, setShowInfo] = useState(true);
  const [showLaunchpadDrawer, setShowLaunchpadDrawer] = useState(false);
  const [replyChannel, setReplyChannel] = useState<Message['type']>('email');
  const [isInternalNote, setIsInternalNote] = useState(false);

  // Launchpad Readiness Logic
  const launchScore = activeClient?.launchpad?.score || 0;
  const isReady = launchScore >= 80;
  const isPartiallyReady = launchScore >= 40 && launchScore < 80;
  const isNotReady = activeClient ? launchScore < 40 : false;

  const connectedChannels = activeClient?.launchpad?.channels || {
    email: true, // Default to true for agency context
    sms: true,
    social: true,
    whatsapp: true
  };

  // Contact Identity Resolution
  const clientMessages = useMemo(() => {
    return activeClient 
      ? MOCK_MESSAGES.filter(m => m.clientId === activeClient.id)
      : MOCK_MESSAGES;
  }, [activeClient]);

  const contacts = useMemo(() => {
    const uniqueContactIds = Array.from(new Set(clientMessages.map(m => m.contactId)));
    return uniqueContactIds.map(id => {
      const contactLeads = MOCK_LEADS.find(l => l.id === id);
      const lastMessage = clientMessages
        .filter(m => m.contactId === id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      
      return {
        ...contactLeads,
        lastMessage,
        unreadCount: clientMessages.filter(m => m.contactId === id && m.status === 'unread').length
      };
    }).filter(c => c.id) as (Lead & { lastMessage: Message; unreadCount: number })[];
  }, [clientMessages]);

  const filteredContacts = contacts.filter(c => {
    if (activeFilter === 'unread') return c.unreadCount > 0;
    if (activeFilter === 'email') return c.lastMessage.type === 'email';
    if (activeFilter === 'sms') return c.lastMessage.type === 'sms';
    if (activeFilter === 'social') return ['instagram', 'facebook', 'x'].includes(c.lastMessage.type);
    return true;
  });

  const selectedContact = contacts.find(c => c.id === selectedContactId);
  const conversationThread = useMemo(() => {
    if (!selectedContactId) return [];
    return clientMessages
      .filter(m => m.contactId === selectedContactId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [selectedContactId, clientMessages]);

  const channelIcons = {
    email: Mail,
    sms: MessageSquare,
    whatsapp: MessageCircle,
    instagram: Instagram,
    facebook: Facebook,
    x: Twitter
  };

  const channelColors = {
    email: 'bg-blue-100 text-blue-600',
    sms: 'bg-emerald-100 text-emerald-600',
    whatsapp: 'bg-green-100 text-green-600',
    instagram: 'bg-pink-100 text-pink-600',
    facebook: 'bg-indigo-100 text-indigo-600',
    x: 'bg-slate-100 text-slate-900'
  };

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6 animate-in fade-in duration-500 relative">
      {/* Sidebar: Contact List */}
      <div className="w-96 flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-slate-900">Conversations</h3>
            <button className="p-2 hover:bg-slate-50 rounded-xl text-primary transition-all">
              <Plus size={20} />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search contacts..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: 'Unread' },
              { id: 'email', label: 'Email' },
              { id: 'sms', label: 'SMS' },
              { id: 'social', label: 'Social' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all",
                  activeFilter === f.id 
                    ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {isNotReady ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-500">
                <Zap size={32} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">Launchpad Incomplete</h4>
                <p className="text-xs text-slate-500">Connect your messaging channels in the Launchpad to start receiving messages.</p>
              </div>
              <button 
                onClick={() => setShowLaunchpadDrawer(true)}
                className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                Complete Setup
              </button>
            </div>
          ) : filteredContacts.length > 0 ? (
            filteredContacts.map(contact => {
              const Icon = channelIcons[contact.lastMessage.type as keyof typeof channelIcons] || MessageSquare;
              
              return (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContactId(contact.id)}
                  className={cn(
                    "w-full p-5 text-left transition-all flex gap-4 relative",
                    selectedContactId === contact.id ? "bg-primary/5" : "hover:bg-slate-50/80",
                    contact.unreadCount > 0 && "after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-primary"
                  )}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                      <img src={contact.avatar || `https://picsum.photos/seed/${contact.name}/100/100`} alt={contact.name} className="w-full h-full object-cover" />
                    </div>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-5 h-5 rounded-lg border-2 border-white flex items-center justify-center",
                      channelColors[contact.lastMessage.type as keyof typeof channelColors]
                    )}>
                      <Icon size={10} strokeWidth={3} />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className={cn("text-sm truncate", contact.unreadCount > 0 ? "font-black text-slate-900" : "font-bold text-slate-700")}>
                        {contact.name}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                        {new Date(contact.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={cn("text-xs truncate mb-2", contact.unreadCount > 0 ? "text-slate-900 font-medium" : "text-slate-500")}>
                      {contact.lastMessage.content}
                    </div>
                    <div className="flex items-center gap-2">
                       {contact.unreadCount > 0 && (
                         <span className="bg-primary text-white text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-[18px] text-center">
                           {contact.unreadCount}
                         </span>
                       )}
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{contact.source}</span>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 p-8 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle size={24} />
              </div>
              <p className="text-sm font-medium">No conversations yet — connect your channels to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Unified Thread View */}
      <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm relative">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                    <img src={selectedContact.avatar || `https://picsum.photos/seed/${selectedContact.name}/100/100`} alt={selectedContact.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                </div>
                <div>
                  <div className="font-black text-slate-900 text-lg leading-tight">{selectedContact.name}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span>{selectedContact.status}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span>Active 5m ago</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toast.success(`Assigned to you!`)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl text-slate-600 text-xs font-bold transition-colors"
                >
                  <UserPlus size={16} />
                  Assign
                </button>
                <div className="w-px h-6 bg-slate-100 mx-1" />
                <button 
                  onClick={() => setShowInfo(!showInfo)}
                  className={cn(
                    "p-2.5 rounded-xl transition-colors",
                    showInfo ? "bg-primary/10 text-primary" : "hover:bg-slate-50 text-slate-500"
                  )}
                >
                  <Info size={18} />
                </button>
                <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area: Unified Timeline */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
              <div className="flex justify-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-sm">
                  Unified Thread
                </span>
              </div>
              
              {conversationThread.map((msg, idx) => {
                const MsgIcon = channelIcons[msg.type as keyof typeof channelIcons] || MessageSquare;
                const isMe = msg.status === 'sent' || msg.status === 'replied';
                
                return (
                  <div key={msg.id} className={cn("flex gap-4 max-w-[80%]", isMe ? "ml-auto flex-row-reverse" : "")}>
                    {!isMe && (
                      <div className="w-10 h-10 rounded-2xl bg-slate-200 flex-shrink-0 overflow-hidden border border-slate-100">
                        <img src={selectedContact.avatar || `https://picsum.photos/seed/${selectedContact.name}/100/100`} alt="" />
                      </div>
                    )}
                    <div className={cn("space-y-2", isMe ? "text-right" : "")}>
                      <div className={cn(
                        "p-5 rounded-3xl shadow-sm border leading-relaxed text-sm relative group",
                        isMe 
                          ? "bg-slate-900 text-white border-slate-800 rounded-tr-none" 
                          : "bg-white text-slate-700 border-slate-100 rounded-tl-none"
                      )}>
                        {msg.content}
                        <div className={cn(
                          "absolute top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                          isMe ? "-left-12 flex-row-reverse" : "-right-12"
                        )}>
                          <div className={cn("p-1.5 rounded-lg", channelColors[msg.type as keyof typeof channelColors])}>
                            <MsgIcon size={12} />
                          </div>
                        </div>
                      </div>
                      <div className={cn("flex items-center gap-2 text-[10px] font-bold text-slate-400", isMe ? "justify-end mr-1" : "ml-1")}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMe && <CheckCheck size={14} className="text-primary" />}
                        <span className="uppercase tracking-tighter opacity-60">• {msg.type}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area: Multi-Channel Reply */}
            <div className="p-6 border-t border-slate-100 bg-white space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reply via:</span>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                      {(['email', 'sms', 'whatsapp', 'instagram'] as const).map(ch => {
                        const ChIcon = channelIcons[ch];
                        const isConnected = connectedChannels[ch === 'instagram' ? 'social' : ch];
                        
                        return (
                          <button
                            key={ch}
                            disabled={!isConnected}
                            onClick={() => setReplyChannel(ch)}
                            className={cn(
                              "p-2 rounded-lg transition-all relative",
                              replyChannel === ch ? "bg-white shadow-sm text-primary" : "text-slate-400 hover:text-slate-600",
                              !isConnected && "opacity-30 cursor-not-allowed"
                            )}
                          >
                            <ChIcon size={14} />
                            {replyChannel === ch && (
                              <motion.div layoutId="activeChannel" className="absolute inset-0 border-2 border-primary/20 rounded-lg" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsInternalNote(!isInternalNote)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      isInternalNote ? "bg-amber-100 text-amber-600" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                    )}
                  >
                    <StickyNote size={14} />
                    Internal Note
                  </button>
                </div>
                
                {isPartiallyReady && (
                  <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500 bg-amber-50 px-3 py-1.5 rounded-lg">
                    <AlertCircle size={12} />
                    Some channels disconnected
                  </div>
                )}
              </div>

              <div className={cn(
                "rounded-[2rem] p-3 flex items-end gap-3 border transition-all",
                isInternalNote 
                  ? "bg-amber-50/50 border-amber-200 focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-500/5"
                  : "bg-slate-50 border-slate-200 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5"
              )}>
                <button 
                  onClick={() => toast.info('Opening file attachment tool...')}
                  className="p-3 text-slate-400 hover:text-primary hover:bg-white rounded-2xl transition-all"
                >
                  <Paperclip size={20} />
                </button>
                <textarea 
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder={isInternalNote ? "Add a private note for the team..." : `Reply to ${selectedContact.name} via ${replyChannel}...`}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 resize-none max-h-32 min-h-[44px]"
                  rows={1}
                />
                <button 
                  onClick={() => toast.info('Opening emoji picker...')}
                  className="p-3 text-slate-400 hover:text-primary hover:bg-white rounded-2xl transition-all"
                >
                  <Smile size={20} />
                </button>
                <button 
                  onClick={() => {
                    toast.success(isInternalNote ? 'Internal note added' : `Message sent via ${replyChannel}!`);
                    setReply('');
                    setIsInternalNote(false);
                  }}
                  className={cn(
                    "p-3 rounded-2xl transition-all shadow-lg",
                    reply 
                      ? isInternalNote 
                        ? "bg-amber-500 text-white shadow-amber-200 scale-105"
                        : "bg-primary text-white shadow-primary/20 scale-105" 
                      : "bg-slate-200 text-slate-400"
                  )}
                  disabled={!reply}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-6">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center shadow-inner">
              <InboxIcon size={48} className="text-slate-200" />
            </div>
            <div className="text-center space-y-2">
              <div className="font-black text-slate-900 text-xl">Select a conversation</div>
              <div className="text-sm text-slate-500 max-w-xs">Choose a contact from the left to start responding across all channels.</div>
            </div>
          </div>
        )}

        {/* Contact Info Sidebar */}
        <AnimatePresence>
          {showInfo && selectedContact && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-slate-100 z-20 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-black text-slate-900">Contact Details</h4>
                <button onClick={() => setShowInfo(false)} className="p-2 hover:bg-slate-50 rounded-lg">
                  <ChevronRight size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-slate-100 mx-auto mb-4 overflow-hidden border-4 border-slate-50 shadow-lg">
                    <img src={selectedContact.avatar || `https://picsum.photos/seed/${selectedContact.name}/200/200`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <h5 className="font-black text-slate-900 text-lg">{selectedContact.name}</h5>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{selectedContact.status} • {selectedContact.source}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                      <Mail size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Email</div>
                      <div className="text-slate-700 font-medium truncate">{selectedContact.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                      <Phone size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Phone</div>
                      <div className="text-slate-700 font-medium">{selectedContact.phone || 'Not provided'}</div>
                    </div>
                  </div>
                  {selectedContact.socialHandles && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <Instagram size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Instagram</div>
                        <div className="text-slate-700 font-medium">{selectedContact.socialHandles.instagram || 'Not linked'}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recent Activity</h6>
                  <div className="space-y-4">
                    {[
                      { icon: Calendar, label: 'Lead Created', time: new Date(selectedContact.createdAt).toLocaleDateString() },
                      { icon: Clock, label: 'Last Interaction', time: '2h ago' },
                    ].map((act, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          <act.icon size={14} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{act.label}</div>
                          <div className="text-[10px] text-slate-400">{act.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">
                  <Archive size={14} />
                  Archive
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-red-500 hover:bg-red-50 transition-all">
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Launchpad Inline Setup Drawer */}
      <AnimatePresence>
        {showLaunchpadDrawer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLaunchpadDrawer(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-[600px] bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h3 className="font-black text-slate-900 text-xl">Channel Setup</h3>
                  <p className="text-xs text-slate-500 font-medium">Connect your messaging channels to enable the Conversations Hub.</p>
                </div>
                <button 
                  onClick={() => setShowLaunchpadDrawer(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all"
                >
                  <CloseIcon size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <Launchpad 
                  activeClient={activeClient} 
                  isInline={true}
                  onUpdateClient={onUpdateClient}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
