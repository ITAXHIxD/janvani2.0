import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Grievance } from '../types';
import {
  Search,
  Filter,
  Grid,
  List,
  Film,
  Heart,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Building,
  Share2,
  Eye,
  PlusCircle,
  X,
  MessageSquare
} from 'lucide-react';
import { categoriesList, indianStates } from '../data/mockData';

export default function GrievanceFeedPage() {
  const {
    t,
    translateCategory,
    translateStatus,
    translateUrgency,
    grievances,
    toggleSupportGrievance,
    addAuditComment,
    setIsFileModalOpen,
    user
  } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Issues');
  const [selectedState, setSelectedState] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'In Progress' | 'Resolved' | 'My Reports'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [newComment, setNewComment] = useState('');

  // Metrics
  const inProgressCount = grievances.filter(g => g.status === 'In Progress').length;
  const resolvedCount = grievances.filter(g => g.status === 'Resolved').length;
  const successRate = 94.8;

  const filteredGrievances = useMemo(() => {
    return grievances.filter((g) => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        g.token.toLowerCase().includes(q) ||
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.locationName.toLowerCase().includes(q) ||
        g.district.toLowerCase().includes(q) ||
        g.state.toLowerCase().includes(q);

      // Category
      let matchCat = true;
      if (selectedCategory !== 'All Issues') {
        if (selectedCategory === 'Potholes & Roads') matchCat = g.category.includes('Roads');
        else if (selectedCategory === 'Cleanliness & Waste') matchCat = g.category.includes('Garbage');
        else if (selectedCategory === 'Water Supply') matchCat = g.category.includes('Water');
        else if (selectedCategory === 'Electricity') matchCat = g.category.includes('Electricity');
        else if (selectedCategory === 'Drain & Sewage') matchCat = g.category.includes('Drain');
        else if (selectedCategory === 'Streetlights') matchCat = g.category.includes('Streetlight');
        else if (selectedCategory === 'Health & Fogging') matchCat = g.category.includes('Health');
        else matchCat = g.category === selectedCategory;
      }

      // State
      const matchState = selectedState === 'All' || g.state === selectedState;

      // Status
      let matchStatus = true;
      if (statusFilter === 'In Progress') matchStatus = g.status === 'In Progress';
      else if (statusFilter === 'Resolved') matchStatus = g.status === 'Resolved';
      else if (statusFilter === 'My Reports') matchStatus = g.citizenName === user.name;

      return matchSearch && matchCat && matchState && matchStatus;
    });
  }, [grievances, searchQuery, selectedCategory, selectedState, statusFilter, user.name]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedGrievance) return;
    addAuditComment(selectedGrievance.id, newComment);
    // update local modal view
    const updated = grievances.find(g => g.id === selectedGrievance.id);
    if (updated) {
      setSelectedGrievance({ ...updated });
    }
    setNewComment('');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
              {t('feed.title', 'Grievance Feed')}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
              {t('feed.wardWatch', 'Live Ward Watch')}
            </span>
            <button
              onClick={() => navigate('/reels')}
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200 flex items-center gap-1"
            >
              <Film className="w-3 h-3" />
              <span>{t('feed.scrollMedia', 'Scroll Media Reel')}</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-slate-400">
            {t('feed.subtitle', 'Real-time citizen grievances sealed with 48h statutory SLAs and dual field audits.')}
          </p>
        </div>

        {/* Right Stats Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/30 text-xs font-bold text-amber-800 dark:text-amber-300">
            {t('feed.inProgress', 'In Progress')}: {inProgressCount}
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/70 dark:bg-emerald-950/30 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            {t('feed.resolved', 'Resolved')}: {resolvedCount}
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-sky-200 dark:border-sky-900/50 bg-sky-50/70 dark:bg-sky-950/30 text-xs font-bold text-sky-800 dark:text-sky-300">
            {t('feed.successRate', 'Success Rate')}: {successRate}%
          </div>
          <button
            onClick={() => setIsFileModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ {t('nav.fileGrievance', 'Report')}</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          'All Issues',
          'Potholes & Roads',
          'Cleanliness & Waste',
          'Water Supply',
          'Electricity',
          'Drain & Sewage',
          'Streetlights',
          'Health & Fogging'
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-[#eee7db] dark:border-slate-700 text-zinc-600 dark:text-slate-300 hover:border-orange-300'
            }`}
          >
            {cat === 'All Issues' ? t('common.all', 'All Issues') : translateCategory(cat)}
          </button>
        ))}
      </div>

      {/* Search & Dropdown Filters Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#eee7db] dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-96 flex items-center">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3" />
          <input
            type="text"
            placeholder={t('feed.searchPlaceholder', 'Search by token (e.g. #2026-8941), state, district, or keyword...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-slate-700 bg-zinc-50/50 dark:bg-slate-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* State Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-slate-700 bg-zinc-50 dark:bg-slate-800 text-zinc-800 dark:text-white"
          >
            <option value="All">{t('feed.allStates', 'All 36 States & UTs')}</option>
            {indianStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* View Mode Buttons */}
          <div className="inline-flex rounded-xl p-0.5 bg-zinc-100 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-orange-600 shadow-xs' : 'text-zinc-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-orange-600 shadow-xs' : 'text-zinc-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Filters: Status pills */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'All'
                ? 'bg-orange-600 text-white'
                : 'bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-300'
            }`}
          >
            {t('common.all', 'All')} ({grievances.length})
          </button>
          <button
            onClick={() => setStatusFilter('In Progress')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'In Progress'
                ? 'bg-amber-500 text-white'
                : 'bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            {t('feed.inProgress', 'In Progress')} ({inProgressCount})
          </button>
          <button
            onClick={() => setStatusFilter('Resolved')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'Resolved'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {t('feed.resolved', 'Resolved')} ({resolvedCount})
          </button>
          <button
            onClick={() => setStatusFilter('My Reports')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'My Reports'
                ? 'bg-orange-600 text-white'
                : 'bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-300'
            }`}
          >
            {t('feed.myReports', 'My Reports')}
          </button>
        </div>

        <span className="text-xs font-semibold text-zinc-400">
          {t('feed.showing', 'Showing')} {filteredGrievances.length} {t('feed.issues', 'issues')}
        </span>
      </div>

      {/* Grievance Grid */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col gap-3'}>
        {filteredGrievances.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-[#eee7db] dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-500/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Top Image / Video Thumbnail */}
            <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-slate-800">
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-black/20" />

              {/* Badges on Thumbnail */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                  {translateCategory(item.category)}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                    item.urgency === 'Urgent' ? 'bg-red-600' : 'bg-amber-600'
                  }`}
                >
                  {translateUrgency(item.urgency)}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${
                    item.status === 'Resolved'
                      ? 'bg-emerald-500/90 text-white border-emerald-400'
                      : 'bg-amber-500/90 text-white border-amber-400'
                  }`}
                >
                  {translateStatus(item.status)}
                </span>
              </div>

              {/* Token & Location overlay at bottom of thumbnail */}
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-1 font-mono font-bold bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  <span>{item.token}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-200 line-clamp-1 max-w-[65%]">
                  <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                  <span className="truncate">{item.locationName}</span>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3
                  onClick={() => setSelectedGrievance(item)}
                  className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white line-clamp-2 hover:text-orange-600 cursor-pointer transition-colors"
                >
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Jurisdiction & Target footer */}
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-zinc-600 dark:text-slate-400 truncate max-w-[60%]">
                    <Building className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{item.department}</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold">
                    <Clock className="w-3 h-3" />
                    <span>{t('feed.targetSla', 'Target')}: {item.targetHours}h</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => toggleSupportGrievance(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      item.isSupportedByMe
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-zinc-50 dark:bg-slate-800 text-zinc-600 dark:text-slate-300 hover:bg-zinc-100'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${item.isSupportedByMe ? 'fill-rose-600 text-rose-600' : ''}`} />
                    <span>{item.supportsCount}</span>
                  </button>

                  <button
                    onClick={() => setSelectedGrievance(item)}
                    className="px-3 py-1 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t('feed.trackSla', 'Track SLA')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail & Audit Trail Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-[#eee7db] dark:border-slate-800 shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setSelectedGrievance(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-slate-200 hover:bg-zinc-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-100 text-orange-800 border border-orange-200">
                {selectedGrievance.token}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-slate-300">
                {translateCategory(selectedGrievance.category)}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold text-white ${
                  selectedGrievance.status === 'Resolved' ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
              >
                {translateStatus(selectedGrievance.status)}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
              {selectedGrievance.title}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-slate-300 mt-2 leading-relaxed">
              {selectedGrievance.description}
            </p>

            {/* Meta details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 p-4 rounded-2xl bg-zinc-50 dark:bg-slate-800/60 border border-zinc-200 dark:border-slate-700 text-xs">
              <div>
                <p className="text-zinc-400 font-bold uppercase text-[10px]">{t('feed.jurisdiction', 'JURISDICTION & LOCALITY')}</p>
                <p className="font-semibold text-zinc-800 dark:text-slate-200 mt-0.5">
                  {selectedGrievance.locationName}, {selectedGrievance.ward}, {selectedGrievance.district}, {selectedGrievance.state}
                </p>
              </div>
              <div>
                <p className="text-zinc-400 font-bold uppercase text-[10px]">{t('feed.assignedDepartment', 'ASSIGNED ULB DEPARTMENT')}</p>
                <p className="font-semibold text-zinc-800 dark:text-slate-200 mt-0.5">
                  {selectedGrievance.department}
                </p>
              </div>
              <div>
                <p className="text-zinc-400 font-bold uppercase text-[10px]">{t('feed.statutorySla', 'STATUTORY RESOLUTION SLA')}</p>
                <p className="font-bold text-orange-600 mt-0.5">
                  {selectedGrievance.targetHours} Hours Window ({selectedGrievance.hoursLeft}h left)
                </p>
              </div>
              <div>
                <p className="text-zinc-400 font-bold uppercase text-[10px]">{t('feed.reportedBy', 'REPORTED BY')}</p>
                <p className="font-semibold text-zinc-800 dark:text-slate-200 mt-0.5">
                  {selectedGrievance.citizenName} ({selectedGrievance.citizenRole}) • {selectedGrievance.reportedAt}
                </p>
              </div>
            </div>

            {/* Audit Trail Timeline */}
            <div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-3 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-orange-600" />
                <span>{t('feed.auditTrail', 'Certified Audit Trail')} ({selectedGrievance.auditTrail.length})</span>
              </h4>

              <div className="space-y-3 pl-2 border-l-2 border-orange-200 dark:border-orange-900/50">
                {selectedGrievance.auditTrail.map((aud) => (
                  <div key={aud.id} className="relative pl-4">
                    <span className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-orange-600 border-2 border-white dark:border-slate-900" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-800 dark:text-slate-200">
                        {aud.author}
                      </span>
                      <span className="text-[10px] text-zinc-400">{aud.date}</span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-slate-300 mt-0.5">{aud.text}</p>
                    {aud.statusBadge && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-sm bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 text-[9px] font-extrabold uppercase">
                        {aud.statusBadge}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder={t('feed.addAuditComment', 'Post citizen update / field observation...')}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-zinc-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs disabled:opacity-40"
                >
                  {t('feed.postUpdate', 'Post')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
