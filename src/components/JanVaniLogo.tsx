import React from 'react';

interface JanVaniLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'horizontal' | 'compact' | 'icon';
  className?: string;
}

export const JanVaniLogo: React.FC<JanVaniLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = ''
}) => {
  const emblemDim = size === 'sm' ? 34 : size === 'lg' ? 48 : 40;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official State Emblem of India Ashoka Lion Capital + Chakra Silhouette */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-xl bg-linear-to-b from-amber-500 via-orange-600 to-emerald-700 p-[1.5px] shadow-sm transition-transform hover:scale-105"
        style={{ width: emblemDim, height: emblemDim }}
      >
        <div className="w-full h-full rounded-[10px] bg-white dark:bg-slate-950 flex items-center justify-center relative overflow-hidden">
          {/* Subtle national tricolor ambient tint */}
          <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 via-transparent to-emerald-600/10 pointer-events-none" />

          {/* Crisp, vector Ashoka Chakra & Lion silhouette medallion */}
          <svg
            viewBox="0 0 48 48"
            className="w-7 h-7 text-[#000080] dark:text-blue-400"
            fill="none"
            stroke="currentColor"
          >
            {/* Outer ring */}
            <circle cx="24" cy="24" r="20" strokeWidth="2.2" />
            <circle cx="24" cy="24" r="17.5" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
            {/* 24 spokes */}
            {Array.from({ length: 24 }).map((_, i) => {
              const rad = (i * 15 * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={24 + 5 * Math.cos(rad)}
                  y1={24 + 5 * Math.sin(rad)}
                  x2={24 + 17 * Math.cos(rad)}
                  y2={24 + 17 * Math.sin(rad)}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              );
            })}
            {/* Center hub */}
            <circle cx="24" cy="24" r="4.5" fill="currentColor" />
            <circle cx="24" cy="24" r="1.8" fill="white" className="dark:fill-slate-950" />
          </svg>
        </div>

        {/* Live operational status bead */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
        </span>
      </div>

      {/* Typography Block */}
      {variant !== 'icon' && (
        <div className="flex flex-col min-w-0 justify-center">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-extrabold tracking-tight text-slate-900 dark:text-white flex items-baseline ${
                size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'
              }`}
            >
              <span className="text-orange-600 dark:text-orange-500">Jan</span>
              <span className="text-slate-900 dark:text-white">Vani</span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 ml-1 px-1 py-0.2 rounded-sm bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                2026
              </span>
            </span>

            <span className="px-1.5 py-0.5 rounded-sm bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 font-semibold text-[10px] tracking-wide">
              जनवाणी
            </span>
          </div>

          {(variant === 'full' || size === 'lg') && (
            <p className="text-[9.5px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">
              National Civic Redressal • MoHUA
            </p>
          )}
        </div>
      )}
    </div>
  );
};
