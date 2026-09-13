import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Film,
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Clock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Upload,
  Sparkles,
  ShieldCheck,
  Building
} from 'lucide-react';
import { initialReels } from '../data/mockData';
import { CivicReel } from '../types';

export const CivicReelsPage: React.FC = () => {
  const { t, translateCategory, toggleSupportGrievance, setIsFileModalOpen, user } = useApp();
  const [reels, setReels] = useState<CivicReel[]>(initialReels);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Roads & Potholes', 'Garbage & Sanitation', 'Drinking Water', 'Streetlights'];

  const filteredReels = activeCategory === 'All'
    ? reels
    : reels.filter(r => r.category.toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0]));

  const currentReel = filteredReels[activeReelIndex] || filteredReels[0];

  const handleToggleLike = (reelId: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId) {
          const isSupportedByMe = !r.isSupportedByMe;
          return {
            ...r,
            isSupportedByMe,
            supportsCount: isSupportedByMe ? r.supportsCount + 1 : r.supportsCount - 1
          };
        }
        return r;
      })
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
              {t('nav.reels', 'Civic Reels')}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {t('reels.liveFieldCamera', 'Live Field Camera')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-slate-400 mt-1">
            {t('reels.subtitle', 'Short, geotagged video evidence submitted by citizens to accelerate statutory municipal triage.')}
          </p>
        </div>

        <button
          onClick={() => setIsFileModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
        >
          <Upload className="w-4 h-4" />
          <span>{t('reels.uploadReel', 'Upload Civic Reel')}</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => {
              setActiveCategory(c);
              setActiveReelIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === c
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-[#eee7db] dark:border-slate-700 text-zinc-600 dark:text-slate-300'
            }`}
          >
            {c === 'All' ? t('common.all', 'All') : translateCategory(c)}
          </button>
        ))}
      </div>

      {/* Reel Viewer & Playlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Reel Frame */}
        <div className="lg:col-span-8 flex justify-center">
          <div className="relative w-full max-w-md h-[580px] rounded-3xl overflow-hidden shadow-2xl bg-black border border-zinc-800 flex flex-col justify-between">
            {/* Background Image / Video Mock */}
            <img
              src={currentReel?.thumbnailUrl || currentReel?.videoUrl}
              alt={currentReel?.title}
              className="absolute inset-0 w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

            {/* Top Bar Controls */}
            <div className="relative z-10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-600 text-white">
                  {translateCategory(currentReel?.category)}
                </span>
                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md text-white">
                  {currentReel?.token}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Right floating action icons */}
            <div className="relative z-10 self-end p-4 flex flex-col items-center gap-4 text-white">
              <button
                onClick={() => handleToggleLike(currentReel.id)}
                className="flex flex-col items-center gap-1 group"
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                    currentReel?.isSupportedByMe ? 'bg-rose-600 text-white' : 'bg-black/40 hover:bg-black/60'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${currentReel?.isSupportedByMe ? 'fill-white' : ''}`} />
                </div>
                <span className="text-[11px] font-bold">{currentReel?.supportsCount}</span>
              </button>

              <div className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold">{currentReel?.updates?.length || 2}</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold">{t('common.share', 'Share')}</span>
              </div>
            </div>

            {/* Bottom Info Overlay */}
            <div className="relative z-10 p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black">{currentReel?.creatorName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/80 font-bold">
                  {t('reels.verifiedNagrik', 'Verified Nagrik')}
                </span>
              </div>

              <h3 className="font-extrabold text-sm sm:text-base leading-snug">
                {currentReel?.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-zinc-300 mt-2">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="line-clamp-1">{currentReel?.locality}</span>
              </div>

              {/* Progress Line */}
              <div className="w-full h-1 bg-white/20 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full w-2/3 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Reel Playlist Thumbnails */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#eee7db] dark:border-slate-800 shadow-xs">
          <h3 className="font-black text-base text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            <Film className="w-4 h-4 text-orange-600" />
            <span>{t('reels.trendingReels', 'Trending Civic Reels')} ({filteredReels.length})</span>
          </h3>

          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredReels.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setActiveReelIndex(idx)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                  activeReelIndex === idx
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20'
                    : 'border-zinc-200 dark:border-slate-800 hover:border-zinc-300 dark:hover:border-slate-700 bg-zinc-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-zinc-200 dark:bg-slate-700">
                  <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="px-2 py-0.5 rounded-sm bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 font-bold text-[9px]">
                    {translateCategory(item.category)}
                  </span>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-white line-clamp-2 mt-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-1.5">
                    <span>{item.creatorName}</span>
                    <span>•</span>
                    <span>{item.supportsCount} {t('reels.votes', 'Votes')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CivicReelsPage;
