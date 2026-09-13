import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  Volume2,
  ArrowRight
} from 'lucide-react';

export const AICopilotDrawer: React.FC = () => {
  const {
    isCopilotOpen,
    setIsCopilotOpen,
    copilotMessages,
    sendMessageToCopilot,
    isCopilotLoading,
    setIsFileModalOpen,
    t
  } = useApp();

  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages, isCopilotLoading]);

  if (!isCopilotOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isCopilotLoading) return;
    const text = input;
    setInput('');
    sendMessageToCopilot(text);
  };

  const handleQuickAction = (actionText: string) => {
    if (actionText.includes('+ File') || actionText.includes('+ फ़ाइल') || actionText.includes('File Grievance')) {
      setIsCopilotOpen(false);
      setIsFileModalOpen(true);
      return;
    }
    sendMessageToCopilot(actionText);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md sm:max-w-lg h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-purple-500 via-indigo-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {t('copilot.title', '24x7 JanVani Copilot')}
                </h3>
                <span className="px-1.5 py-0.5 rounded-sm bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[9px] font-extrabold border border-purple-200 dark:border-purple-800">
                  Gemini
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t('copilot.subtitle', 'Civic Triage, 48h SLA Tracking & Welfare Eligibility')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCopilotOpen(false)}
            aria-label={t('common.close', 'Close copilot')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
          {copilotMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-orange-600 text-white rounded-tr-xs'
                    : 'bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-xs shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.sender === 'assistant' && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    <button
                      type="button"
                      onClick={() => speakText(msg.text)}
                      className="hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t('copilot.listen', 'Listen')}</span>
                    </button>
                  </div>
                )}

                {/* Quick actions inside bubble */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="mt-3 flex flex-col gap-1.5">
                    {msg.quickActions.map((qa, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleQuickAction(qa)}
                        className="text-left text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <span>{qa}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-orange-700 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isCopilotLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">
                  {t('copilot.loading', 'Gemini analyzing statutory records...')}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={t('copilot.inputPlaceholder', 'Ask about your ward issues, 48h SLA, or DBT schemes...')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isCopilotLoading}
              aria-label={t('common.send', 'Send')}
              className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white font-bold transition-all shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            {t('copilot.footer', 'JanVani Statutory SLA Intelligence Engine • 2026 Mandate')}
          </p>
        </div>
      </div>
    </div>
  );
};
