import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Copy, 
  RefreshCw,
  Lightbulb,
  PenTool,
  BarChart
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Client } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface AIAssistantProps {
  activeClient: Client | null;
  setActiveTab: (tab: string) => void;
  setActiveClient: (client: Client | null) => void;
}

export function AIAssistant({ activeClient, setActiveTab, setActiveClient }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [mode, setMode] = useState<'copy' | 'ideas' | 'insights'>('copy');

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const context = activeClient 
        ? `Client: ${activeClient.name}, Industry: ${activeClient.industry}, Goals: ${activeClient.goals.join(', ')}.`
        : "General marketing context.";
      
      const systemPrompt = mode === 'copy' 
        ? "You are a world-class copywriter. Generate high-converting marketing copy."
        : mode === 'ideas'
        ? "You are a creative marketing strategist. Generate innovative campaign ideas."
        : "You are a data analyst. Provide marketing insights and optimization tips.";

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nContext: ${context}\n\nRequest: ${prompt}` }] }]
      });
      
      setResponse(result.text || '');
    } catch (error) {
      console.error("AI Generation failed:", error);
      setResponse("Failed to generate content. Please check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = {
    copy: ["Write 3 Instagram ad captions for a sale", "Draft a welcome email sequence", "Create a catchy SMS promo"],
    ideas: ["Campaign ideas for Q2 growth", "Viral contest concepts", "New channel expansion strategy"],
    insights: ["Analyze current campaign performance", "How to improve conversion rate", "Competitor gap analysis"]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-purple-100 text-primary rounded-2xl mb-2">
          <Sparkles size={32} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">AI Marketing Assistant</h1>
        <p className="text-slate-500">Generate copy, ideas, and insights for {activeClient?.name || 'all clients'}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button 
          onClick={() => {
            setMode('copy');
            toast.info('Switched to Ad Copy mode');
          }}
          className={cn(
            "card p-4 flex flex-col items-center gap-2 transition-all",
            mode === 'copy' ? "bg-primary text-white border-primary" : "bg-white hover:bg-slate-50"
          )}
        >
          <PenTool size={20} />
          <span className="font-bold">Ad Copy</span>
        </button>
        <button 
          onClick={() => {
            setMode('ideas');
            toast.info('Switched to Campaign Ideas mode');
          }}
          className={cn(
            "card p-4 flex flex-col items-center gap-2 transition-all",
            mode === 'ideas' ? "bg-primary text-white border-primary" : "bg-white hover:bg-slate-50"
          )}
        >
          <Lightbulb size={20} />
          <span className="font-bold">Campaign Ideas</span>
        </button>
        <button 
          onClick={() => {
            setMode('insights');
            toast.info('Switched to Insights mode');
          }}
          className={cn(
            "card p-4 flex flex-col items-center gap-2 transition-all",
            mode === 'insights' ? "bg-primary text-white border-primary" : "bg-white hover:bg-slate-50"
          )}
        >
          <BarChart size={20} />
          <span className="font-bold">Insights</span>
        </button>
      </div>

      <div className="card bg-white shadow-lg border-slate-200">
        <div className="space-y-4">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Describe what you need for ${activeClient?.name || 'the client'}...`}
            className="w-full h-32 p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 resize-none"
          />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {suggestions[mode].map((s, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setPrompt(s);
                    toast.info('Suggestion applied');
                  }}
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !prompt}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Generate
            </button>
          </div>
        </div>

        {response && (
          <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                AI Suggestion
              </h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(response);
                    toast.success('Copied to clipboard!');
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                >
                  <Copy size={18} />
                </button>
                <button 
                  onClick={() => {
                    handleGenerate();
                    toast.info('Regenerating response...');
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
            <div className="prose prose-slate max-w-none bg-slate-50 p-6 rounded-xl whitespace-pre-wrap text-slate-700 leading-relaxed">
              {response}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
