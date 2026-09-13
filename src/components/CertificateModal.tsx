import React from 'react';
import { useApp } from '../context/AppContext';
import { JanVaniLogo } from './JanVaniLogo';
import { X, Award, Printer, CheckCircle, QrCode } from 'lucide-react';

export const CertificateModal: React.FC = () => {
  const { isCertificateModalOpen, setIsCertificateModalOpen, user, t } = useApp();

  if (!isCertificateModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 shadow-2xl p-6 sm:p-8">
        <button
          onClick={() => setIsCertificateModalOpen(false)}
          aria-label={t('common.close', 'Close modal')}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action buttons at top */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
              {t('cert.title', 'Official Digital Civic Certificate')}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('cert.print', 'Print / Save PDF')}</span>
            </button>
          </div>
        </div>

        {/* Certificate Container */}
        <div className="p-6 sm:p-8 rounded-2xl border-4 border-double border-amber-400/80 bg-linear-to-b from-amber-50/40 via-white to-orange-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 text-center relative overflow-hidden shadow-inner">
          {/* Top Emblem / Header with JanVaniLogo */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <JanVaniLogo size="md" variant="full" />
          </div>

          <p className="text-[10px] font-bold text-orange-600 tracking-wider uppercase mt-1">
            {t('cert.govHeader', 'GOVERNMENT OF INDIA • MOHUA STATUTORY 48-HOUR SLA RECOGNITION')}
          </p>

          <h2 className="text-2xl sm:text-3xl font-serif font-black text-amber-900 dark:text-amber-400 mt-4 tracking-wide">
            {t('cert.awardHindi', 'नागरिक सम्मान प्रमाण-पत्र')}
          </h2>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1">
            {t('cert.awardEnglish', 'CERTIFICATE OF CIVIC MERIT & STATUTORY AUDIT')}
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-6 max-w-lg mx-auto leading-relaxed">
            {t('cert.conferredUpon', 'This digital certificate is officially conferred upon')}
          </p>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 border-b-2 border-amber-300 inline-block px-4 pb-0.5">
            {user.name}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 max-w-lg mx-auto leading-relaxed">
            {t('cert.recognitionBody', 'In recognition of dedicated citizen vigilance, proactive reporting of municipal infrastructure hazards, and active field verification under Ward 14, Dhar (Madhya Pradesh).')}
          </p>

          {/* Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-6 max-w-md mx-auto">
            <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/40 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400">{t('cert.wardStanding', 'WARD STANDING')}</p>
              <p className="text-sm font-black text-orange-600">Rank #1</p>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/40 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400">{t('cert.districtStanding', 'DISTRICT STANDING')}</p>
              <p className="text-sm font-black text-slate-800 dark:text-white">Rank #9</p>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/40 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400">{t('cert.civicKarma', 'CIVIC KARMA')}</p>
              <p className="text-sm font-black text-amber-600">{user.karmaPoints} pts</p>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/40 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400">{t('cert.aadhaar', 'AADHAAR')}</p>
              <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{user.aadhaarMasked}</p>
            </div>
          </div>

          {/* Footer signature & QR code */}
          <div className="pt-4 border-t border-amber-200/80 dark:border-slate-800 flex items-center justify-between text-left text-xs">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <QrCode className="w-8 h-8 text-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-slate-500">TOKEN: JV-NAGRIK-2026-480</p>
                <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> {t('cert.verified', 'Digitally Cryptographically Verified')}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{t('cert.magistrate', 'Collector & District Magistrate')}</p>
              <p className="text-[10px] text-slate-500">{t('cert.magistratePlace', 'District Dhar • Madhya Pradesh')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
