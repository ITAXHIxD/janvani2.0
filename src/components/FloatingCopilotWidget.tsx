import React from 'react';
import { useApp } from '../context/AppContext';
import { Bot, Sparkles } from 'lucide-react';

export const FloatingCopilotWidget: React.FC = () => {
  const { setIsCopilotOpen, isCopilotOpen } = useApp();

  if (isCopilotOpen) return null;

  return (
    <button
      onClick={() => setIsCopilotOpen(true)}
      title="Ask 24x7 JanVani AI Copilot"
      className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-30 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-linear-to-br from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white shadow-xl shadow-orange-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all group cursor-pointer"
    >
      <div className="relative">
        <Bot className="w-6 h-6 lg:w-7 lg:h-7 transition-transform group-hover:rotate-12" />
        <span className="absolute -top-1 -right-1 w-3 h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse"></span>
      </div>
      <span className="sr-only">Open AI Copilot</span>
    </button>
  );
};
