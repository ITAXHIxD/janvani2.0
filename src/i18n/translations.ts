import { SupportedLanguage } from '../types';
export type { SupportedLanguage };
import { en } from './locales/en';
import { hi } from './locales/hi';
import { mr } from './locales/mr';
import { ta } from './locales/ta';
import { te } from './locales/te';
import { bn } from './locales/bn';

export const translations: Record<SupportedLanguage, Record<string, string>> = {
  EN: en,
  HI: hi,
  MR: mr,
  TA: ta,
  TE: te,
  BN: bn,
};

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  native: string;
  nativeName: string;
  speechCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'EN', name: 'English', native: 'English', nativeName: 'English', speechCode: 'en-IN' },
  { code: 'HI', name: 'Hindi', native: 'हिन्दी', nativeName: 'हिन्दी', speechCode: 'hi-IN' },
  { code: 'MR', name: 'Marathi', native: 'मराठी', nativeName: 'मराठी', speechCode: 'mr-IN' },
  { code: 'TA', name: 'Tamil', native: 'தமிழ்', nativeName: 'தமிழ்', speechCode: 'ta-IN' },
  { code: 'TE', name: 'Telugu', native: 'తెలుగు', nativeName: 'తెలుగు', speechCode: 'te-IN' },
  { code: 'BN', name: 'Bengali', native: 'বাংলা', nativeName: 'বাংলা', speechCode: 'bn-IN' },
];

export function normalizeLanguageCode(lang: SupportedLanguage | string | undefined | null): SupportedLanguage {
  if (!lang) return 'EN';
  const clean = lang.trim().toUpperCase();
  if (clean.startsWith('HI')) return 'HI';
  if (clean.startsWith('MR')) return 'MR';
  if (clean.startsWith('TA')) return 'TA';
  if (clean.startsWith('TE')) return 'TE';
  if (clean.startsWith('BN')) return 'BN';
  return 'EN';
}

export function getTranslation(
  lang: SupportedLanguage | string | undefined | null,
  key: string,
  fallback?: string
): string {
  const normLang = normalizeLanguageCode(lang);
  const langDict = translations[normLang] || translations.EN;
  return langDict[key] || translations.EN[key] || fallback || key;
}

// Category mapping helper
const CATEGORY_KEY_MAP: Record<string, string> = {
  'Roads & Potholes': 'cat.roads',
  'Drinking Water & Pipeline Leakage': 'cat.water',
  'Garbage & Sanitation': 'cat.garbage',
  'Streetlights & Electrical': 'cat.streetlights',
  'Sewage & Drainage': 'cat.sewage',
  'Public Health & Clinics': 'cat.health',
  'Government Schools': 'cat.schools',
  'Illegal Encroachment': 'cat.encroachment',
  'Other Civic Issue': 'cat.other',
};

export function translateCategory(
  category: string,
  lang: SupportedLanguage | string | undefined | null
): string {
  if (!category) return '';
  const key = CATEGORY_KEY_MAP[category];
  if (key) {
    return getTranslation(lang, key, category);
  }
  return category;
}

export function translateStatus(
  status: string,
  lang: SupportedLanguage | string | undefined | null
): string {
  if (!status) return '';
  const s = status.toLowerCase().trim();
  if (s === 'resolved') return getTranslation(lang, 'common.resolved', 'Resolved');
  if (s === 'in progress') return getTranslation(lang, 'common.inProgress', 'In Progress');
  if (s === 'pending') return getTranslation(lang, 'common.pending', 'Pending');
  if (s === 'verified') return getTranslation(lang, 'common.verified', 'Verified');
  if (s === 'all') return getTranslation(lang, 'common.all', 'All');
  if (s === 'my reports') return getTranslation(lang, 'common.myReports', 'My Reports');
  return status;
}

export function translateUrgency(
  urgency: string,
  lang: SupportedLanguage | string | undefined | null
): string {
  if (!urgency) return '';
  const u = urgency.toLowerCase().trim();
  if (u === 'urgent') return getTranslation(lang, 'common.urgent', 'Urgent');
  if (u === 'priority') return getTranslation(lang, 'common.priority', 'Priority');
  if (u === 'standard') return getTranslation(lang, 'common.standard', 'Standard');
  return urgency;
}
