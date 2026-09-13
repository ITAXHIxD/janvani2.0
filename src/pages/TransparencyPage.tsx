import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  FileText,
  Download,
  Building,
  Scale
} from 'lucide-react';

export const TransparencyPage: React.FC = () => {
  const { t, translateStatus, grievances } = useApp();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
              {t('nav.slaTransparency', 'Statutory 48-Hour SLA Mandate')}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
              {t('transparency.legallyBinding', 'Legally Binding')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-slate-400 mt-1">
            {t('transparency.subtitle', 'Right to Public Service Guarantee & Urban Municipal Redressal Act, 2026.')}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t('transparency.exportGazette', 'Export Gazette Summary')}</span>
        </button>
      </div>

      {/* Legal Overview Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-200 dark:border-orange-900/40 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-orange-600" />
          <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">
            {t('transparency.frameworkTitle', 'Statutory Escalation & Penalty Framework')}
          </h3>
        </div>
        <p className="text-xs text-zinc-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {t('transparency.frameworkDesc', 'Under Section 14-B of the State Municipal Grievance Mandate, any public hazard, burst water pipeline, or severe road crater reported via JanVani must be inspected within 12 hours and permanently remediated within 48 hours. Officers failing this mandate face statutory service penalties.')}
        </p>

        {/* 3 Step Escalation Tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700">
            <span className="text-[10px] font-black uppercase text-orange-600">{t('transparency.tier1', 'TIER 1 (0-24 HOURS)')}</span>
            <h4 className="font-bold text-xs text-zinc-900 dark:text-white mt-1">{t('transparency.tier1Officer', 'Ward Junior Engineer')}</h4>
            <p className="text-[11px] text-zinc-500 dark:text-slate-400 mt-1">
              {t('transparency.tier1Desc', 'Field inspection, barrier deployment, and work order creation.')}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700">
            <span className="text-[10px] font-black uppercase text-amber-600">{t('transparency.tier2', 'TIER 2 (24-48 HOURS)')}</span>
            <h4 className="font-bold text-xs text-zinc-900 dark:text-white mt-1">{t('transparency.tier2Officer', 'Executive Officer / ULB')}</h4>
            <p className="text-[11px] text-zinc-500 dark:text-slate-400 mt-1">
              {t('transparency.tier2Desc', 'Direct intervention, contractor machinery requisition & remediation.')}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700">
            <span className="text-[10px] font-black uppercase text-red-600">{t('transparency.tier3', 'TIER 3 (> 48 HOURS)')}</span>
            <h4 className="font-bold text-xs text-zinc-900 dark:text-white mt-1">{t('transparency.tier3Officer', 'District Magistrate (DM)')}</h4>
            <p className="text-[11px] text-zinc-500 dark:text-slate-400 mt-1">
              {t('transparency.tier3Desc', 'Automatic escalation to Collectorate and statutory fine imposition.')}
            </p>
          </div>
        </div>
      </div>

      {/* Live Active Grievance SLA Audit Table */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#eee7db] dark:border-slate-800 shadow-xs">
        <h3 className="font-extrabold text-base text-zinc-900 dark:text-white mb-1">
          {t('transparency.auditLogTitle', 'Ward 14 Real-Time SLA Audit Log')}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-slate-400 mb-4">
          {t('transparency.auditLogSub', 'Public ledger of pending complaints and countdown timer to legal escalation')}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-slate-800 text-zinc-400 font-bold uppercase text-[10px]">
                <th className="pb-3">{t('transparency.token', 'Token')}</th>
                <th className="pb-3">{t('transparency.civicIssue', 'Civic Issue')}</th>
                <th className="pb-3">{t('feed.assignedDepartment', 'Assigned Department')}</th>
                <th className="pb-3">{t('transparency.slaStatus', 'SLA Status')}</th>
                <th className="pb-3">{t('transparency.hoursLeft', 'Hours Left')}</th>
                <th className="pb-3">{t('transparency.riskLevel', 'Risk Level')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-slate-800/60 font-medium text-zinc-800 dark:text-slate-200">
              {grievances.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-orange-600">{item.token}</td>
                  <td className="py-3 max-w-xs truncate">{item.title}</td>
                  <td className="py-3 text-zinc-500 dark:text-slate-400">{item.department}</td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {translateStatus(item.status)}
                    </span>
                  </td>
                  <td className="py-3 font-bold font-mono">
                    {item.status === 'Resolved' ? t('transparency.completed', 'Completed') : `${item.hoursLeft} Hours`}
                  </td>
                  <td className="py-3">
                    {item.status === 'Resolved' ? (
                      <span className="text-emerald-600 font-bold">{t('transparency.compliant', 'Compliant')}</span>
                    ) : item.hoursLeft <= 12 ? (
                      <span className="text-red-600 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {t('transparency.highBreachRisk', 'High Breach Risk')}
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold">{t('transparency.withinLimit', 'Within Limit')}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default TransparencyPage;
