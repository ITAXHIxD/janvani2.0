import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  Plus,
  Film,
  Grid,
  Mic,
  MapPin,
  Landmark,
  Trophy,
  Scale,
  Sparkles,
  Phone,
  Sun,
  Moon,
  AudioLines,
  Award,
  X,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    setIsFileModalOpen,
    setIsVoiceModalOpen,
    setIsCopilotOpen,
    setIsEmergencyModalOpen,
    setIsCertificateModalOpen,
    theme,
    setTheme,
    grievances,
    t
  } = useApp();

  const [isServicesDrawerOpen, setIsServicesDrawerOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activeReportsCount = grievances.length;

  return (
    <>
      {/* Instagram-style Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-navigation"
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 safe-area-bottom shadow-lg"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* 1. Home / Dashboard */}
          <NavLink
            to="/dashboard"
            id="mobile-nav-dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-orange-600 dark:text-orange-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] tracking-tight mt-0.5 font-semibold">Home</span>
          </NavLink>

          {/* 2. Grievance Feed */}
          <NavLink
            to="/feed"
            id="mobile-nav-feed"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl relative transition-all cursor-pointer ${
                isActive
                  ? 'text-orange-600 dark:text-orange-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <div className="relative">
              <FileText className="w-5 h-5 stroke-[2.2]" />
              {activeReportsCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-black bg-orange-600 text-white min-w-[14px] text-center shadow-xs">
                  {activeReportsCount > 99 ? '99+' : activeReportsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-semibold">Feed</span>
          </NavLink>

          {/* 3. Instagram-style Raised Center Create / File Action Button */}
          <div className="relative -top-3">
            <button
              type="button"
              id="mobile-nav-create-btn"
              onClick={() => setIsCreateMenuOpen(true)}
              className="w-12 h-12 rounded-full bg-linear-to-tr from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white shadow-lg shadow-orange-600/40 flex items-center justify-center transform active:scale-90 transition-transform cursor-pointer border-2 border-white dark:border-slate-900"
              title="File Grievance or Speak with Voice Seva"
            >
              <Plus className="w-6 h-6 stroke-[2.8]" />
            </button>
          </div>

          {/* 4. Civic Reels (Instagram Reels equivalent) */}
          <NavLink
            to="/reels"
            id="mobile-nav-reels"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-orange-600 dark:text-orange-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <div className="relative">
              <Film className="w-5 h-5 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-500" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-semibold">Reels</span>
          </NavLink>

          {/* 5. Services Hub (All sidebar elements accessible on mobile) */}
          <button
            type="button"
            id="mobile-nav-services-btn"
            onClick={() => setIsServicesDrawerOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
              isServicesDrawerOpen || ['/map', '/schemes', '/leaderboard', '/transparency', '/transcribe'].includes(location.pathname)
                ? 'text-orange-600 dark:text-orange-400 font-bold scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Grid className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] tracking-tight mt-0.5 font-semibold">Services</span>
          </button>
        </div>
      </nav>

      {/* Instagram-style Quick Create Popover / Bottom Sheet */}
      {isCreateMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCreateMenuOpen(false)}
          />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 shadow-2xl space-y-3 pb-8">
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mb-2" />
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                File Municipal Grievance
              </h3>
              <button
                onClick={() => setIsCreateMenuOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  setIsVoiceModalOpen(true);
                }}
                className="p-4 rounded-2xl border border-orange-200 dark:border-orange-900/60 bg-linear-to-br from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/30 text-left flex flex-col gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
                  <Mic className="w-5 h-5 stroke-[2.4]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Voice Complaint Seva</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Speak in Hindi, Tamil, Telugu, etc.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  setIsFileModalOpen(true);
                }}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-left flex flex-col gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center shadow-xs">
                  <Plus className="w-5 h-5 stroke-[2.4]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Standard Form</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Attach photo/video proof</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Services Bottom Sheet (Translating all Sidebar elements into main mobile screen) */}
      {isServicesDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsServicesDrawerOpen(false)}
          />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 pb-12">
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mb-1" />
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  JanVani Portal Services
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Direct access to all civic systems & statutory tools
                </p>
              </div>
              <button
                onClick={() => setIsServicesDrawerOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Primary Actions */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsServicesDrawerOpen(false);
                  setIsFileModalOpen(true);
                }}
                className="py-3 px-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs shadow-orange-600/30"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ File Grievance</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsServicesDrawerOpen(false);
                  setIsVoiceModalOpen(true);
                }}
                className="py-3 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs shadow-amber-500/30"
              >
                <Mic className="w-4 h-4 stroke-[2.5]" />
                <span>Voice Complaint</span>
              </button>
            </div>

            {/* All Sidebar Navigation Items */}
            <div className="space-y-1 pt-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 mb-1">
                Core Municipal Portals
              </p>

              <div className="grid grid-cols-1 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/dashboard');
                    setIsServicesDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">Citizen Dashboard</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Ward statistics & active redressals</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/feed');
                    setIsServicesDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">Grievance Feed</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Public complaints & audit timeline</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {activeReportsCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/transcribe');
                    setIsServicesDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <AudioLines className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">Transcribe Audio</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Gemini 3.5 voice-to-text studio</p>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    AI
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/reels');
                    setIsServicesDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                      <Film className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">Civic Media Reels</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Video audits & proof verification</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/map');
                    setIsServicesDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">3-Tier GIS Maps</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Geospatial municipal heatmaps</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/schemes');
                    setIsServicesDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">Welfare Schemes & DBT</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Check subsidy eligibility & benefits</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/leaderboard');
                    setIsServicesDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">Nagrik Karma Board</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Citizen points & community leaderboard</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/transparency');
                    setIsServicesDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">Statutory 48h SLA</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">MOHUA citizen charter transparency</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Emergency & AI Copilot */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                Emergency & Intelligent AI
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsServicesDrawerOpen(false);
                    setIsCopilotOpen(true);
                  }}
                  className="p-3 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/30 text-left flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                      24x7
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">AI Copilot</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Ask civic questions</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsServicesDrawerOpen(false);
                    setIsEmergencyModalOpen(true);
                  }}
                  className="p-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-left flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <Phone className="w-4 h-4 text-red-600 animate-pulse" />
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200">
                      SOS
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-700 dark:text-red-400">112 Emergency</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Ambulance & Fire</p>
                  </div>
                </button>
              </div>

              {/* Theme & Certificate row */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Theme</span>
                <div className="inline-flex rounded-lg p-0.5 bg-slate-200/80 dark:bg-slate-700">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                      theme === 'light'
                        ? 'bg-white text-slate-900 shadow-xs ring-1 ring-black/5'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Bright</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-900 text-white shadow-xs ring-1 ring-white/10'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-blue-400" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
