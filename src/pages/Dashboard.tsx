import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Mic,
  AudioLines,
  MapPin,
  Sparkles,
  TrendingUp,
  FileText,
  Flame,
  ArrowRight,
  BarChart3,
  Calendar,
  Activity,
  Layers
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export default function Dashboard() {
  const {
    t,
    translateCategory,
    grievances,
    setIsFileModalOpen,
    setIsVoiceModalOpen,
    setIsCopilotOpen,
    user
  } = useApp();
  const navigate = useNavigate();

  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');

  // Compute metrics dynamically from state
  const totalRegistered = grievances.length;
  const inProgress = grievances.filter((g) => g.status === 'In Progress' || g.status === 'Field Dispatched').length;
  const resolved = grievances.filter((g) => g.status === 'Resolved').length;
  const highSeverity = grievances.filter((g) => g.severityScore >= 8.0).length;

  const resolutionRate = totalRegistered > 0 ? Math.round((resolved / totalRegistered) * 100) : 33;

  // Chart data for daily inflow vs resolutions
  const weeklyData = [
    { day: 'Mon', reported: 4, resolved: 3 },
    { day: 'Tue', reported: 6, resolved: 5 },
    { day: 'Wed', reported: 8, resolved: 6 },
    { day: 'Thu', reported: 5, resolved: 4 },
    { day: 'Fri', reported: 7, resolved: 7 },
    { day: 'Sat', reported: 3, resolved: 4 },
    { day: 'Sun', reported: 4, resolved: 3 }
  ];

  const monthlyData = [
    { day: 'Week 1', reported: 24, resolved: 20 },
    { day: 'Week 2', reported: 32, resolved: 28 },
    { day: 'Week 3', reported: 29, resolved: 27 },
    { day: 'Week 4', reported: 18, resolved: 16 }
  ];

  const chartData = timeframe === 'week' ? weeklyData : monthlyData;

  // Categories breakdown
  const categoryCounts = grievances.reduce((acc: Record<string, number>, g) => {
    acc[g.category] = (acc[g.category] || 0) + 1;
    return acc;
  }, {});

  const categoryEntries = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative rounded-3xl border border-[#eee7db] dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm p-6 sm:p-8 overflow-hidden">
        {/* Soft background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Hero Text */}
          <div className="max-w-2xl">
            {/* Top Badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300">
                <Shield className="w-3.5 h-3.5 text-orange-600" />
                {t('dash.statutoryBadge', 'Statutory Citizen SLA Redressal')}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border border-zinc-200 dark:border-slate-700 bg-zinc-50 dark:bg-slate-800 text-zinc-600 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {user.ward} • {user.district} • {user.state} (2026)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
              {t('dash.heroTitle', 'Track, Report & Audit Municipal Grievances in Real-Time')}
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-slate-300 mt-2.5 leading-relaxed">
              {t('dash.heroSubtitle', 'Every complaint is sealed with an automated token, AI-triaged for severity, and tied to legally binding 48-hour SLA resolution mandates.')}
            </p>

            {/* Hero Quick Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 mt-6 flex-wrap">
              <button
                onClick={() => setIsFileModalOpen(true)}
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ {t('dash.fileGrievance', 'File Grievance')}</span>
              </button>

              <button
                onClick={() => setIsVoiceModalOpen(true)}
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Mic className="w-4 h-4 text-orange-400" />
                <span>{t('dash.voiceSeva', 'Voice Seva (बोलकर शिकायत)')}</span>
              </button>

              <button
                onClick={() => navigate('/transcribe')}
                className="px-4 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors hover:bg-purple-100 dark:hover:bg-purple-900/50"
              >
                <AudioLines className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>{t('dash.transcribeAudio', 'Transcribe Audio (Gemini 3.5)')}</span>
              </button>

              <button
                onClick={() => navigate('/map')}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-zinc-700 dark:text-slate-200 hover:bg-zinc-50 dark:hover:bg-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors"
              >
                <MapPin className="w-4 h-4 text-zinc-500" />
                <span>{t('dash.exploreMap', 'Explore Ward GIS Map')}</span>
              </button>

              <button
                onClick={() => setIsCopilotOpen(true)}
                className="px-3.5 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('dash.askAi', 'Ask AI Copilot')}</span>
              </button>
            </div>
          </div>

          {/* Right Hero Card: WARD STATUS */}
          <div className="w-full lg:w-72 shrink-0 p-5 rounded-2xl bg-linear-to-br from-orange-50/70 via-white to-amber-50/50 dark:from-slate-800/80 dark:via-slate-800 dark:to-orange-950/20 border border-orange-200/80 dark:border-orange-900/40 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-zinc-500 dark:text-slate-400">
                {t('dash.wardStatus', 'WARD STATUS')}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {t('dash.liveActive', 'Live & Active')}
              </span>
            </div>

            <div className="my-3">
              <div className="text-4xl font-black text-zinc-900 dark:text-white">
                {resolutionRate}%
              </div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-slate-400 mt-0.5">
                {t('dash.redressalRate', 'District Statutory Redressal Rate')}
              </p>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-zinc-200/80 dark:border-slate-700 text-xs">
              <div className="flex justify-between text-zinc-600 dark:text-slate-300">
                <span className="font-medium">{t('dash.avgResolution', 'Avg. Resolution:')}</span>
                <span className="font-bold text-zinc-900 dark:text-white">21.2h</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-slate-300">
                <span className="font-medium">{t('dash.activeUnits', 'Active Field Units:')}</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">{t('dash.unitsDispatched', '14 Dispatched')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#eee7db] dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-slate-500">
              {t('dash.totalRegistered', 'TOTAL REGISTERED')}
            </p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-1">
              {totalRegistered}
            </h3>
            <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% this week</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#eee7db] dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-slate-500">
              {t('dash.inProgress', 'IN ACTIVE PROGRESS')}
            </p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-1">
              {inProgress}
            </h3>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>SLA: 48h max</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#eee7db] dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-slate-500">
              {t('dash.resolvedSla', 'CERTIFIED RESOLVED')}
            </p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-1">
              {resolved}
            </h3>
            <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>AI Dual-Certified</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#eee7db] dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-slate-500">
              {t('common.urgent', 'HIGH SEVERITY ALERTS')}
            </p>
            <h3 className="text-3xl font-black text-red-600 dark:text-red-400 mt-1">
              {highSeverity} Priority
            </h3>
            <p className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Score &gt; 8.0</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Resolution Velocity Chart (2 Columns) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#eee7db] dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">
                {t('dash.resolutionVelocity', 'Resolution Velocity & Daily Inflow')}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-slate-400">
                {t('dash.resolutionSub', 'Comparison of daily reported civic issues vs certified field remediations')}
              </p>
            </div>

            <div className="inline-flex rounded-xl p-1 bg-zinc-100 dark:bg-slate-800">
              <button
                onClick={() => setTimeframe('week')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  timeframe === 'week'
                    ? 'bg-white dark:bg-slate-900 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {t('dash.thisWeek', 'This Week')}
              </button>
              <button
                onClick={() => setTimeframe('month')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  timeframe === 'month'
                    ? 'bg-white dark:bg-slate-900 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {t('dash.thisMonth', 'This Month')}
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="reported" fill="#ea580c" radius={[6, 6, 0, 0]} name="Reported Issues" />
                <Bar dataKey="resolved" fill="#10b981" radius={[6, 6, 0, 0]} name="Certified Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-zinc-100 dark:border-slate-800 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-orange-600"></span>
              <span className="text-zinc-700 dark:text-slate-300">{t('dash.dailyInflow', 'Daily Reported Inflow')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-emerald-500"></span>
              <span className="text-zinc-700 dark:text-slate-300">{t('dash.certifiedRemediation', 'Certified Field Remediation')}</span>
            </div>
          </div>
        </div>

        {/* Right: Grievance Breakdown by Municipal Category */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#eee7db] dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">
                {t('dash.grievanceBreakdown', 'Grievance Breakdown')}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400">
                {t('dash.liveMix', 'Live Mix')}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-slate-400 mb-4">
              {t('dash.distributionServices', 'Distribution across municipal services')}
            </p>

            <div className="space-y-3.5">
              {categoryEntries.map(([cat, count]) => {
                const pct = Math.round((count / totalRegistered) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-zinc-700 dark:text-slate-200 line-clamp-1">{translateCategory(cat)}</span>
                      <span className="text-zinc-500 dark:text-slate-400 font-mono font-bold">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full rounded-full bg-linear-to-r from-orange-500 to-amber-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => navigate('/feed')}
            className="w-full mt-6 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500/50 text-xs font-bold text-zinc-700 dark:text-slate-200 hover:bg-zinc-50 dark:hover:bg-slate-800/80 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>{t('dash.exploreFeed', 'Explore Grievance Feed')} ({totalRegistered})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
