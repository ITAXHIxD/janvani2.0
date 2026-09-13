import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Phone, AlertTriangle, Shield, HeartPulse, Flame } from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const { isEmergencyModalOpen, setIsEmergencyModalOpen, t } = useApp();

  if (!isEmergencyModalOpen) return null;

  const helplines = [
    { number: '112', title: t('emergency.h112Title', 'National Emergency Helpline'), desc: t('emergency.h112Desc', 'All-in-one Police, Fire & Medical support'), icon: Shield, color: 'text-red-600 bg-red-50' },
    { number: '101', title: t('emergency.h101Title', 'Fire & Rescue Service'), desc: t('emergency.h101Desc', 'Urban local body emergency response'), icon: Flame, color: 'text-amber-600 bg-amber-50' },
    { number: '102', title: t('emergency.h102Title', 'Government Ambulance (EMS)'), desc: t('emergency.h102Desc', 'Medical casualty and pregnancy transit'), icon: HeartPulse, color: 'text-emerald-600 bg-emerald-50' },
    { number: '1091', title: t('emergency.h1091Title', 'Women Safety Helpline'), desc: t('emergency.h1091Desc', 'Immediate police intervention and distress assistance'), icon: Phone, color: 'text-purple-600 bg-purple-50' },
    { number: '1076', title: t('emergency.h1076Title', 'CM Helpline (Madhya Pradesh)'), desc: t('emergency.h1076Desc', 'Direct state grievance portal escalation'), icon: Phone, color: 'text-blue-600 bg-blue-50' },
    { number: '1916', title: t('emergency.h1916Title', 'National Water & Pipeline Emergency'), desc: t('emergency.h1916Desc', 'Jal Jeevan and drinking water contamination hotline'), icon: Phone, color: 'text-cyan-600 bg-cyan-50' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 shadow-2xl p-6 sm:p-7">
        <button
          onClick={() => setIsEmergencyModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-slate-200 hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 dark:text-red-400">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white">
              {t('emergency.title', '24x7 Statutory Emergency Helplines')}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-slate-400">
              {t('emergency.subtitle', 'Immediate direct dispatch for life, safety, or critical infrastructure failure')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {helplines.map((item, i) => {
            const Icon = item.icon;
            return (
              <a
                key={i}
                href={`tel:${item.number}`}
                className="p-3 rounded-2xl border border-zinc-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-800 bg-zinc-50 dark:bg-slate-800/60 hover:bg-red-50/40 transition-all flex items-center gap-3 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-black text-red-600 dark:text-red-400">{item.number}</span>
                  </div>
                  <p className="text-xs font-bold text-zinc-800 dark:text-white line-clamp-1">{item.title}</p>
                  <p className="text-[10px] text-zinc-500 dark:text-slate-400 line-clamp-1">{item.desc}</p>
                </div>
              </a>
            );
          })}
        </div>

        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-center">
          <p className="text-xs font-semibold text-red-800 dark:text-red-300">
            {t('emergency.footerNotice', 'For standard non-emergency municipal maintenance, use the + File Grievance flow with 48h SLA guarantee.')}
          </p>
        </div>
      </div>
    </div>
  );
};
