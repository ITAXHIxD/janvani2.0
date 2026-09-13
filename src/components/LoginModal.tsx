import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { JanVaniLogo } from './JanVaniLogo';
import {
  X,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building,
  ArrowRight
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, user, setUser, t } = useApp();

  const [role, setRole] = useState<'citizen' | 'officer'>(user.role);
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState(user.email || 'praneet.dubey@gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState(user.name);
  const [ward, setWard] = useState(user.ward);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setUser({
        ...user,
        name: role === 'officer' ? 'Er. Rajesh Soni (Junior Engineer)' : name || 'Praneet Dubey',
        role,
        email,
        ward: ward || user.ward,
        avatarInitials: role === 'officer' ? 'RS' : 'PD',
        badge: role === 'officer' ? 'ULB Verification Officer' : 'Karmat Nagrik'
      });
      setIsSubmitting(false);
      setIsLoginModalOpen(false);
    }, 450);
  };

  const handleGoogleFastLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setUser({
        ...user,
        role: 'citizen',
        email: 'praneet.dubey@gmail.com',
        name: 'Praneet Dubey',
        avatarInitials: 'PD',
        badge: 'Karmat Nagrik'
      });
      setIsSubmitting(false);
      setIsLoginModalOpen(false);
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
        {/* Close */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          aria-label={t('common.close', 'Close modal')}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Official Brand Logo */}
        <div className="flex flex-col items-center justify-center mb-4">
          <JanVaniLogo size="md" variant="full" />
        </div>

        {/* Top Badges */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300">
            <Shield className="w-3 h-3 text-orange-600" />
            {t('login.statutoryRedressal', 'Statutory Citizen Redressal')}
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {t('login.govtConnected', 'Govt Triage Connected')}
          </span>
        </div>

        {/* Title */}
        <div className="text-center mb-5">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {tab === 'signin' ? t('login.portalLogin', 'Citizen Portal Login') : t('login.createAccount', 'Create Citizen Account')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('login.subtitle', 'Access your ward dashboard, live grievance tracking, and statutory audits.')}
          </p>
        </div>

        {/* Role Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-5">
          <button
            type="button"
            onClick={() => setRole('citizen')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              role === 'citizen'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t('login.citizenRole', 'Citizen / Nagrik')}</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('officer')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              role === 'officer'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>{t('login.officerRole', 'Nodal Officer')}</span>
          </button>
        </div>

        {/* Sign In / Register Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4">
          <button
            type="button"
            onClick={() => setTab('signin')}
            className={`flex-1 pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              tab === 'signin'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {t('header.signIn', 'Sign In')}
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              tab === 'register'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {t('login.registerTab', 'Register Ward Citizen')}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          {tab === 'register' && (
            <>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('profile.fullName', 'Full Name')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Praneet Dubey"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('fileModal.ward', 'Municipal Ward / Area')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ward 14 - Civil Lines"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('login.emailLabel', 'Email Address / Citizen ID')}
            </label>
            <div className="relative flex items-center">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
              <input
                type="email"
                placeholder="citizen@gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('login.passwordLabel', 'Password')}
            </label>
            <div className="relative flex items-center">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('login.passwordPlaceholder', 'Enter password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-9 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-600/30 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span>{t('login.authenticating', 'Authenticating...')}</span>
            ) : (
              <>
                <span>{t('header.signIn', 'Sign In')} ({role === 'officer' ? t('login.officerRole', 'Nodal Officer') : t('login.citizenRole', 'Citizen')})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
            <span className="bg-white dark:bg-slate-900 px-3">{t('login.orContinue', 'OR CONTINUE WITH')}</span>
          </div>
        </div>

        {/* 1-Tap Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleFastLogin}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{t('login.googleSignIn', 'Sign in with Google (1-Tap)')}</span>
        </button>
      </div>
    </div>
  );
};
