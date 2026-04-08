import React from 'react';
import { Search, Bell, HelpCircle, Command } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export function Header() {
  return (
    <header className="h-16 border-b border-slate-100 bg-white sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search anything (Cmd + K)" 
            onChange={(e) => e.target.value && toast.info(`Searching for: ${e.target.value}`)}
            className="w-full pl-10 pr-12 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 shadow-sm">
            <Command size={10} />
            K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => toast.info('Opening notifications center...')}
          className="p-2 text-slate-400 hover:text-primary hover:bg-purple-50 rounded-lg transition-all relative"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>
        <button 
          onClick={() => toast.info('Opening help & support...')}
          className="p-2 text-slate-400 hover:text-primary hover:bg-purple-50 rounded-lg transition-all"
        >
          <HelpCircle size={20} />
        </button>
        <div className="h-8 w-px bg-slate-100 mx-2" />
        <div 
          onClick={() => toast.info('Viewing account details...')}
          className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-xl transition-colors"
        >
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold">Alex Operator</div>
            <div className="text-[10px] font-bold text-primary uppercase tracking-wider">Pro Plan</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
            AO
          </div>
        </div>
      </div>
    </header>
  );
}
