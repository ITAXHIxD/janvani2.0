import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Layers,
  Flame,
  AlertTriangle,
  Clock,
  CheckCircle,
  Eye,
  Navigation,
  ZoomIn,
  ZoomOut,
  Crosshair
} from 'lucide-react';
import { initialGISSpots } from '../data/mockData';
import { GISSpot } from '../types';

export const GISMapPage: React.FC = () => {
  const { t, translateCategory, setIsFileModalOpen } = useApp();
  const [spots] = useState<GISSpot[]>(initialGISSpots);
  const [selectedSpot, setSelectedSpot] = useState<GISSpot | null>(initialGISSpots[0]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [zoomLevel, setZoomLevel] = useState(1);

  const categories = ['All', 'Roads', 'Industrial', 'Corridor', 'Hospital'];

  const filteredSpots = activeFilter === 'All'
    ? spots
    : spots.filter(s => s.category.toLowerCase().includes(activeFilter.toLowerCase()) || s.title.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
              {t('nav.gisHotspots', 'Ward GIS Hotspots Map')}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
              {t('gis.liveGeospatial', 'Live Geospatial Audit')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-slate-400 mt-1">
            {t('gis.subtitle', 'Real-time heat density and hazard coordinates across Ward 14, Dhar (MP).')}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActiveFilter(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === c
                  ? 'bg-orange-600 text-white'
                  : 'bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-zinc-600 dark:text-slate-300'
              }`}
            >
              {c === 'All' ? t('common.all', 'All') : translateCategory(c)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Container & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Simulated Map Canvas */}
        <div className="lg:col-span-8 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl relative h-[540px] flex flex-col justify-between">
          {/* Map Top Bar */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-bold border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ward 14 • Dhar Central Grid</span>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
            <button
              onClick={() => setZoomLevel(z => Math.min(z + 0.2, 1.8))}
              className="w-8 h-8 rounded-xl bg-black/70 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 border border-white/10"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(z => Math.max(z - 0.2, 0.8))}
              className="w-8 h-8 rounded-xl bg-black/70 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 border border-white/10"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Vector Map Surface */}
          <div
            className="w-full h-full relative overflow-hidden flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Grid Pattern Background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
                backgroundSize: '32px 32px'
              }}
            />

            {/* Simulated Road Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="#475569" strokeWidth="6" />
              <line x1="20%" y1="90%" x2="80%" y2="10%" stroke="#475569" strokeWidth="6" />
              <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#f97316" strokeWidth="3" strokeDasharray="6 6" />
              <circle cx="50%" cy="50%" r="90" fill="none" stroke="#334155" strokeWidth="4" />
            </svg>

            {/* Render Hotspot Pins */}
            {filteredSpots.map((spot, i) => {
              const positions = [
                { top: '35%', left: '42%' },
                { top: '65%', left: '60%' },
                { top: '25%', left: '72%' },
                { top: '75%', left: '30%' },
                { top: '48%', left: '50%' }
              ];
              const pos = positions[i % positions.length];
              const isSelected = selectedSpot?.id === spot.id;

              return (
                <div
                  key={spot.id}
                  onClick={() => setSelectedSpot(spot)}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 z-20 group"
                >
                  <div className="relative flex items-center justify-center">
                    {spot.severityScore >= 8.5 && (
                      <span className="absolute w-12 h-12 rounded-full bg-red-500/30 animate-ping" />
                    )}

                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg transition-transform ${
                        isSelected
                          ? 'scale-125 bg-orange-600 text-white ring-4 ring-orange-400/50'
                          : spot.severityScore >= 8.5
                          ? 'bg-red-600 text-white hover:scale-110'
                          : 'bg-amber-500 text-white hover:scale-110'
                      }`}
                    >
                      <MapPin className="w-5 h-5" />
                    </div>

                    <div className="absolute bottom-11 whitespace-nowrap hidden group-hover:block px-2.5 py-1 rounded-lg bg-black text-white text-[11px] font-bold shadow-md z-30">
                      {spot.title} ({spot.severityScore}/10)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Map Legend */}
          <div className="p-3 bg-black/70 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-xs text-zinc-300">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-600" />
                <span>Critical (&gt; 8.5 Severity)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Priority (6.0 - 8.4)</span>
              </div>
            </div>
            <span className="font-mono text-[11px] text-zinc-400">GPS: 22.5975° N, 75.3039° E</span>
          </div>
        </div>

        {/* Selected Spot Details Inspector */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {selectedSpot && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
                  {translateCategory(selectedSpot.category)}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-700">
                  {t('gis.severity', 'Severity')} {selectedSpot.severityScore}/10
                </span>
              </div>

              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {selectedSpot.title}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <span>{selectedSpot.location}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                {selectedSpot.details}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('gis.slaWindow', 'Statutory SLA Window')}:</span>
                  <span className="font-bold text-orange-600">{selectedSpot.sla}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('gis.reportedInflow', 'Reported Inflow')}:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedSpot.reportsCount} {t('gis.citizens', 'Citizens')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('feed.assignedDepartment', 'Assigned Department')}:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedSpot.department}</span>
                </div>
              </div>

              <button
                onClick={() => setIsFileModalOpen(true)}
                className="w-full mt-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <span>{t('gis.reportEvidence', 'Report Additional Evidence Here')}</span>
              </button>
            </div>
          )}

          {/* Quick List of All Hotspots */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              {t('gis.monitoredHotspots', 'Monitored Hotspots')} ({filteredSpots.length})
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredSpots.map(s => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSpot(s)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                    selectedSpot?.id === s.id
                      ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/30 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{s.title}</span>
                  <span className="font-bold text-orange-600 shrink-0 ml-2">{s.severityScore}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GISMapPage;
