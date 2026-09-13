import React from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  X,
  Edit3,
  Mic,
  FileText,
  ShieldAlert,
  HelpCircle,
  ArrowRight,
  Droplets,
  Zap,
  Trash2,
  Construction
} from 'lucide-react';

export interface InvalidReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
  transcription?: string;
  onEdit?: () => void;
  onReRecord?: () => void;
  onUseSample?: () => void;
}

export const InvalidReportModal: React.FC<InvalidReportModalProps> = ({
  isOpen,
  onClose,
  reason,
  transcription,
  onEdit,
  onReRecord,
  onUseSample
}) => {
  const { t } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 shadow-2xl shadow-red-950/20 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invalid-report-title"
      >
        {/* Top Warning Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-5 py-4 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 shrink-0">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 id="invalid-report-title" className="font-black text-sm sm:text-base leading-tight">
                {t('invalidModal.title', 'Invalid Grievance Report')}
              </h3>
              <p className="text-[11px] text-red-100 font-medium">
                {t('invalidModal.subtitle', 'AI Statutory Verification Gate • Submission Halted')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white/90 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Submission Halted Notice */}
          <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-800 dark:text-red-300">
                {t('invalidModal.notSubmitted', 'Submission Halted: Not a Valid Civic Problem')}
              </p>
              <p className="text-[11px] text-red-700 dark:text-red-400 mt-1 leading-relaxed">
                {reason || t('invalidModal.statutoryNote', 'Under the Government of India statutory 48-hour SLA framework, only genuine public municipal defects and community hazards can be dispatched to nodal officers.')}
              </p>
            </div>
          </div>

          {/* Captured Statement Quote */}
          {transcription && transcription.trim() && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                {t('invalidModal.whatWeHeard', 'What AI captured:')}
              </span>
              <p className="text-xs text-slate-800 dark:text-slate-200 italic font-serif leading-relaxed border-l-2 border-red-400 dark:border-red-500 pl-2.5 py-0.5">
                "{transcription.trim()}"
              </p>
            </div>
          )}

          {/* Educational Guide: What IS a valid civic problem? */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
            <div className="flex items-center gap-2 mb-2.5">
              <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300">
                {t('invalidModal.validExamplesTitle', 'Valid civic issues you can file:')}
              </h4>
            </div>

            <ul className="space-y-2 text-[11px] text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <Construction className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                <span><strong>Roads & Potholes:</strong> Deep potholes, broken footpaths, road caving</span>
              </li>
              <li className="flex items-start gap-2">
                <Droplets className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span><strong>Drinking Water:</strong> Burst pipelines, contaminated tap water, zero supply</span>
              </li>
              <li className="flex items-start gap-2">
                <Trash2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Garbage & Sanitation:</strong> Uncleaned trash heaps, open garbage dumping, blocked sewers</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Streetlights & Power:</strong> Broken lamp poles, dark streets, loose live electric wires</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-2.5">
          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('invalidModal.editBtn', 'Edit & Describe Problem')}</span>
            </button>
          )}

          {onReRecord && (
            <button
              onClick={() => {
                onClose();
                onReRecord();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-red-500" />
              <span>{t('invalidModal.reRecordBtn', 'Speak Again')}</span>
            </button>
          )}

          {onUseSample && (
            <button
              onClick={() => {
                onClose();
                onUseSample();
              }}
              className="py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('invalidModal.sampleBtn', 'Use Sample')}</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            {t('invalidModal.closeBtn', 'Cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};
