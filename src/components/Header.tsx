import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, Phone, Globe, Sun, Moon, Sparkles, AudioLines } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = () => {
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    t,
    user,
    setIsEmergencyModalOpen,
    setIsCopilotOpen,
    setIsLoginModalOpen
  } = useApp();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors duration-200">
      {/* Left: Statutory SLA and District tags */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-900/50 bg-orange-50/80 dark:bg-orange-950/30 text-[11px] font-semibold text-orange-800 dark:text-orange-300">
          <Shield className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
          <span>{t('nav.slaStatus', 'Statutory 48h Citizen SLA Redressal')}</span>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-[11px] font-medium text-slate-600 dark:text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{user.ward} • {user.district} • MP (2026)</span>
        </div>
      </div>

      {/* Right: Quick actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language selector */}
        <div className="relative flex items-center">
          <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute left-2.5 pointer-events-none" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="pl-7 pr-3 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
          >
            <option value="EN">English</option>
            <option value="HI">हिन्दी (Hindi)</option>
            <option value="MR">मराठी (Marathi)</option>
            <option value="TA">தமிழ் (Tamil)</option>
            <option value="TE">తెలుగు (Telugu)</option>
            <option value="BN">বাংলা (Bengali)</option>
          </select>
        </div>

        {/* Theme toggle: Bright by default */}
        <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setTheme('light')}
            title="Switch to Bright/White Mode (Default)"
            className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
              theme === 'light'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-black/5 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">{t('header.bright', 'Bright')}</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            title="Switch to Dark Mode"
            className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
              theme === 'dark'
                ? 'bg-slate-900 text-white shadow-xs ring-1 ring-white/10 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">{t('header.dark', 'Dark')}</span>
          </button>
        </div>

        {/* 112 Emergency Button */}
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-100 text-xs font-bold transition-all shadow-xs"
        >
          <Phone className="w-3.5 h-3.5 text-red-600 animate-bounce" />
          <span>{t('header.emergency112', '112')}</span>
        </button>

        {/* Transcribe Audio shortcut */}
        <Link
          to="/transcribe"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-900/60 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 text-xs font-bold transition-all shadow-xs"
          title="Transcribe Audio with Microphone (gemini-3.5-transcribe)"
        >
          <AudioLines className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span className="hidden sm:inline">{t('header.transcribe', 'Transcribe')}</span>
        </Link>

        {/* AI Copilot shortcut */}
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-xs transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('header.askAi', 'Ask AI')}</span>
        </button>

        {/* Citizen Profile Avatar button */}
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500/50 bg-white dark:bg-slate-800 text-xs font-medium transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] font-bold">
            {user.avatarInitials}
          </div>
          <span className="hidden lg:inline text-slate-800 dark:text-slate-200 font-semibold">{user.name.split(' ')[0]}</span>
        </button>
      </div>
    </header>
  );
};
