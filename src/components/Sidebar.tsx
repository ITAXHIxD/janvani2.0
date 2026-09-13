import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { JanVaniLogo } from './JanVaniLogo';
import {
  LayoutDashboard,
  FileText,
  Mic,
  AudioLines,
  Film,
  MapPin,
  Landmark,
  Trophy,
  PlusCircle,
  Sun,
  Moon,
  Phone,
  Scale,
  LogOut,
  Sparkles,
  Award
} from 'lucide-react';

interface SidebarProps {
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const {
    theme,
    toggleTheme,
    setTheme,
    user,
    t,
    setIsFileModalOpen,
    setIsVoiceModalOpen,
    setIsCopilotOpen,
    setIsEmergencyModalOpen,
    setIsCertificateModalOpen,
    setIsLoginModalOpen,
    grievances
  } = useApp();

  const activeReportsCount = grievances.length;

  const handleLinkClick = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top branding and primary action */}
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Official Brand Logo */}
        <NavLink to="/dashboard" onClick={handleLinkClick} className="block">
          <JanVaniLogo size="md" variant="full" />
        </NavLink>

        {/* Primary CTA: + File Grievance */}
        <button
          onClick={() => {
            setIsFileModalOpen(true);
            if (onNavigate) onNavigate();
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs shadow-orange-600/30 transition-all hover:scale-[1.01] cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>+ {t('nav.fileGrievance', 'File Grievance')}</span>
        </button>

        {/* Core Portal Navigation */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2">
            {t('nav.corePortal', 'CORE PORTAL')}
          </p>
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/dashboard"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold border border-orange-200/60 dark:border-orange-900/50'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>{t('nav.dashboard', 'Dashboard')}</span>
              </div>
            </NavLink>

            <NavLink
              to="/feed"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold border border-orange-200/60 dark:border-orange-900/50'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>{t('nav.grievances', 'Grievance Feed')}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {activeReportsCount}
              </span>
            </NavLink>

            <NavLink
              to="/transcribe"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold border border-orange-200/60 dark:border-orange-900/50'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <AudioLines className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>{t('nav.transcribe', 'Transcribe Audio')}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                GEMINI 3.5
              </span>
            </NavLink>

            <button
              onClick={() => {
                setIsVoiceModalOpen(true);
                if (onNavigate) onNavigate();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Mic className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>{t('nav.voiceSeva', 'Voice Complaint Seva')}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
                AI MIC
              </span>
            </button>

            <NavLink
              to="/reels"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold border border-orange-200/60 dark:border-orange-900/50'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Film className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>{t('nav.civicReels', 'Civic Media Reels')}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                AUDIT
              </span>
            </NavLink>

            <NavLink
              to="/map"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold border border-orange-200/60 dark:border-orange-900/50'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>{t('nav.gisMap', '3-Tier GIS Maps')}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                GIS
              </span>
            </NavLink>

            <NavLink
              to="/schemes"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold border border-orange-200/60 dark:border-orange-900/50'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Landmark className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>{t('nav.schemes', 'Govt Welfare Schemes')}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                DBT
              </span>
            </NavLink>

            <NavLink
              to="/leaderboard"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold border border-orange-200/60 dark:border-orange-900/50'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Trophy className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>{t('nav.karmaBoard', 'Nagrik Karma Board')}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                #1
              </span>
            </NavLink>

            <NavLink
              to="/transparency"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold border border-orange-200/60 dark:border-orange-900/50'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Scale className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>{t('nav.slaStatus', 'Statutory 48h SLA')}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                MOHUA
              </span>
            </NavLink>
          </nav>
        </div>

        {/* Section: Intelligent Services */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 px-2">
            {t('nav.civicTools', 'INTELLIGENT SERVICES')}
          </p>
          <button
            onClick={() => {
              setIsCopilotOpen(true);
              if (onNavigate) onNavigate();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100/60 dark:hover:bg-purple-950/40 transition-all text-left group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-linear-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">24x7 AI Copilot</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Ask SLA & Subsidies</p>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded-sm bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-[9px] font-extrabold">
              AI
            </span>
          </button>
        </div>

        {/* Section: Citizen Tools */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 px-2">
            APPEARANCE & EMERGENCY
          </p>
          <div className="flex flex-col gap-1">
            {/* Direct Theme Switch Buttons */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <span className="font-semibold text-[11px]">Theme</span>
              <div className="inline-flex rounded-lg p-0.5 bg-slate-200/80 dark:bg-slate-700">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                    theme === 'light'
                      ? 'bg-white text-slate-900 shadow-xs ring-1 ring-black/5'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span>{t('header.bright', 'Bright')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-900 text-white shadow-xs ring-1 ring-white/10'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  <Moon className="w-3 h-3 text-blue-400" />
                  <span>{t('header.dark', 'Dark')}</span>
                </button>
              </div>
            </div>

            {/* Emergency 112 trigger */}
            <button
              onClick={() => {
                setIsEmergencyModalOpen(true);
                if (onNavigate) onNavigate();
              }}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors font-semibold"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 animate-pulse" />
                <span>{t('emergency.call112', 'Emergency 112 Help')}</span>
              </div>
              <span className="text-[10px] font-bold text-red-500">24x7</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Profile and Golden Samman Badge */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5 bg-slate-50/50 dark:bg-slate-900/50">
        {/* Golden Rank card */}
        <div
          onClick={() => {
            setIsCertificateModalOpen(true);
            if (onNavigate) onNavigate();
          }}
          className="cursor-pointer p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 hover:border-amber-300 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Award className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-amber-900 dark:text-amber-200">Nagrik Samman</p>
              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">Ward #1 • {user.karmaPoints} pts</p>
            </div>
          </div>
          <span className="text-[10px] text-amber-700 dark:text-amber-300 group-hover:underline font-bold">
            View →
          </span>
        </div>

        {/* Citizen info & logout/role toggle */}
        <div className="flex items-center justify-between pt-1">
          <div
            onClick={() => {
              setIsLoginModalOpen(true);
              if (onNavigate) onNavigate();
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user.avatarInitials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize truncate">
                {user.role} • {user.ward}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsLoginModalOpen(true);
              if (onNavigate) onNavigate();
            }}
            title="Switch User / Officer Mode"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
