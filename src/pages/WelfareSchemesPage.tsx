import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ShieldCheck,
  Search,
  CheckCircle,
  ExternalLink,
  Coins,
  Building,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  FileText
} from 'lucide-react';
import { welfareSchemes } from '../data/mockData';
import { WelfareScheme } from '../types';

export const WelfareSchemesPage: React.FC = () => {
  const { t, translateCategory, user } = useApp();
  const [schemes] = useState<WelfareScheme[]>(welfareSchemes);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedScheme, setSelectedScheme] = useState<WelfareScheme | null>(null);

  // Eligibility Calculator Inputs
  const [calcIncome, setCalcIncome] = useState('Below ₹2.5 Lakh');
  const [calcOccupation, setCalcOccupation] = useState('Vendor / Small Merchant');
  const [calcArea, setCalcArea] = useState('Urban Local Body (Ward)');
  const [calcResult, setCalcResult] = useState<string | null>(null);

  const categories = ['All', 'Sanitation', 'Water', 'Housing', 'Street Vendors', 'Livelihoods'];

  const filteredSchemes = schemes.filter((s) => {
    const matchSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.tagline.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      categoryFilter === 'All' ||
      s.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchSearch && matchCat;
  });

  const runEligibilityCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setCalcResult(
      t('schemes.eligibleResultPrefix', 'Based on your inputs for ') +
        user.ward +
        t('schemes.eligibleResultSuffix', ', you are directly eligible for PM SVANidhi (₹10,000 Micro-Credit with 7% interest subsidy) and Swachh Bharat 2.0 IHHL Subsidy (₹10,000 Direct DBT).')
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
              {t('nav.welfareSchemes', 'Civic Welfare & DBT Schemes')}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {t('schemes.dbtBadge', 'Direct Benefit Transfer')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-slate-400 mt-1">
            {t('schemes.subtitle', 'Official central and municipal subsidies with AI-guided Aadhaar eligibility matching.')}
          </p>
        </div>
      </div>

      {/* AI Eligibility Calculator Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-200 dark:border-orange-900/40 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-orange-600" />
          <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">
            {t('schemes.calcTitle', '1-Minute AI Scheme Eligibility Check')}
          </h3>
        </div>
        <p className="text-xs text-zinc-600 dark:text-slate-300 mb-4 max-w-xl">
          {t('schemes.calcSubtitle', 'Instantly find out which direct subsidies, housing benefits, and sanitation grants you can claim in ')}{user.ward}, {user.district}.
        </p>

        <form onSubmit={runEligibilityCheck} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-zinc-700 dark:text-slate-300 mb-1">
              {t('schemes.incomeLabel', 'Annual Family Income')}
            </label>
            <select
              value={calcIncome}
              onChange={(e) => setCalcIncome(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-zinc-900 dark:text-white"
            >
              <option>{t('schemes.below2_5', 'Below ₹2.5 Lakh')}</option>
              <option>{t('schemes.between2_5_5', '₹2.5 Lakh - ₹5 Lakh')}</option>
              <option>{t('schemes.above5', 'Above ₹5 Lakh')}</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-700 dark:text-slate-300 mb-1">
              {t('schemes.occupationLabel', 'Occupation / Profile')}
            </label>
            <select
              value={calcOccupation}
              onChange={(e) => setCalcOccupation(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-zinc-900 dark:text-white"
            >
              <option>{t('schemes.vendor', 'Vendor / Small Merchant')}</option>
              <option>{t('schemes.dailyWage', 'Daily Wage / Worker')}</option>
              <option>{t('schemes.salaried', 'Salaried / Professional')}</option>
              <option>{t('schemes.studentSenior', 'Student / Senior Citizen')}</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('schemes.checkEligibility', 'Analyze My Eligibility')}</span>
            </button>
          </div>
        </form>

        {calcResult && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{calcResult}</span>
          </div>
        )}
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                categoryFilter === c
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-zinc-600 dark:text-slate-300'
              }`}
            >
              {c === 'All' ? t('common.all', 'All') : translateCategory(c)}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t('schemes.searchPlaceholder', 'Search welfare scheme...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-zinc-900 dark:text-white"
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSchemes.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#eee7db] dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-500/40 shadow-xs flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
                  {translateCategory(item.category)}
                </span>
                {item.dbtBenefit && (
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-900/40">
                    {item.dbtBenefit}
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white mt-1">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                {item.tagline}
              </p>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  {t('schemes.primaryEntitlements', 'PRIMARY ENTITLEMENTS')}
                </p>
                <ul className="mt-1 space-y-1 text-xs text-zinc-600 dark:text-slate-300 list-disc list-inside">
                  {item.entitlements.slice(0, 2).map((ent, idx) => (
                    <li key={idx} className="line-clamp-2">
                      {ent}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 truncate max-w-[60%]">{item.ministry}</span>
              <a
                href={item.applyLink}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950 text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <span>{t('schemes.applyPortal', 'Apply Portal')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default WelfareSchemesPage;
