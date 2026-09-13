import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  Mic,
  Film,
  MapPin,
  Landmark,
  Trophy,
  Scale,
  PlusCircle,
  AudioLines,
  Sparkles,
  Phone
} from 'lucide-react';

export const MobileTopServicesBar: React.FC = () => {
  const {
    setIsFileModalOpen,
    setIsVoiceModalOpen,
    setIsCopilotOpen,
    setIsEmergencyModalOpen,
    grievances
  } = useApp();

  const location = useLocation();

  const activeReportsCount = grievances.length;

  return (
    <div
      id="mobile-top-services-bar"
      className="lg:hidden w-full overflow-x-auto no-scrollbar py-2 px-3 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 sticky top-[53px] z-30 shadow-xs"
    >
      <div className="flex items-center gap-1.5 min-w-max">
        {/* + File Grievance Quick Pill */}
        <button
          type="button"
          onClick={() => setIsFileModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>+ File Grievance</span>
        </button>

        {/* Voice Seva Quick Pill */}
        <button
          type="button"
          onClick={() => setIsVoiceModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Mic className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Voice Seva</span>
        </button>

        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              isActive
                ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`
          }
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
          <span>Dashboard</span>
        </NavLink>

        {/* Grievance Feed */}
        <NavLink
          to="/feed"
          className={({ isActive }) =>
            `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              isActive
                ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`
          }
        >
          <FileText className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
          <span>Feed</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
            {activeReportsCount}
          </span>
        </NavLink>

        {/* Transcribe Audio */}
        <NavLink
          to="/transcribe"
          className={({ isActive }) =>
            `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              isActive
                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`
          }
        >
          <AudioLines className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Transcribe</span>
        </NavLink>

        {/* Civic Reels */}
        <NavLink
          to="/reels"
          className={({ isActive }) =>
            `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              isActive
                ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`
          }
        >
          <Film className="w-3.5 h-3.5 text-rose-500" />
          <span>Reels</span>
        </NavLink>

        {/* 3-Tier GIS Maps */}
        <NavLink
          to="/map"
          className={({ isActive }) =>
            `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              isActive
                ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`
          }
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>GIS Maps</span>
        </NavLink>

        {/* Welfare Schemes */}
        <NavLink
          to="/schemes"
          className={({ isActive }) =>
            `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              isActive
                ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`
          }
        >
          <Landmark className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>Govt Schemes</span>
        </NavLink>

        {/* Karma Board */}
        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              isActive
                ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`
          }
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>Karma Board</span>
        </NavLink>

        {/* 48h SLA */}
        <NavLink
          to="/transparency"
          className={({ isActive }) =>
            `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              isActive
                ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`
          }
        >
          <Scale className="w-3.5 h-3.5 text-indigo-500" />
          <span>48h SLA</span>
        </NavLink>

        {/* AI Copilot */}
        <button
          type="button"
          onClick={() => setIsCopilotOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-200 dark:hover:bg-purple-900 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>AI Copilot</span>
        </button>

        {/* 112 Emergency */}
        <button
          type="button"
          onClick={() => setIsEmergencyModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 text-xs font-bold hover:bg-red-200 dark:hover:bg-red-900 shrink-0 cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5 text-red-600 animate-pulse" />
          <span>112 SOS</span>
        </button>
      </div>
    </div>
  );
};
