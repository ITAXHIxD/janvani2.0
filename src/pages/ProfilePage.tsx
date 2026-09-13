import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Shield,
  CheckCircle2,
  FileText,
  Heart,
  PlusCircle,
  Clock,
  Sparkles,
  Printer,
  ChevronRight,
  MapPin
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, grievances, setIsFileModalOpen, setIsCertificateModalOpen } = useApp();

  const myGrievances = grievances.filter(g => g.citizenName === user.name);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#eee7db] dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-orange-500 to-amber-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              {user.avatarInitials}
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-zinc-900 dark:text-white">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                {user.badge}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Aadhaar Verified
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-slate-400 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                {user.ward}, {user.district} ({user.state})
              </span>
              <span>•</span>
              <span className="font-mono">Aadhaar: {user.aadhaarMasked}</span>
            </div>

            <p className="text-xs text-zinc-600 dark:text-slate-300 mt-2 font-semibold">
              🏆 Rank #1 in Ward 14 • Rank #9 in Dhar District
            </p>
          </div>
        </div>

        {/* Certificate CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setIsCertificateModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Award className="w-4 h-4" />
            <span>View Samman Certificate</span>
          </button>

          <button
            onClick={() => setIsFileModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-extrabold text-xs shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Report Grievance</span>
          </button>
        </div>
      </div>

      {/* Karma Points Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#eee7db] dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase text-zinc-400">TOTAL CIVIC KARMA</p>
            <h3 className="text-3xl font-black text-amber-600 mt-1">{user.karmaPoints} pts</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Top 1% citizen in Dhar</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#eee7db] dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase text-zinc-400">REPORTED GRIEVANCES</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-1">{myGrievances.length || 5}</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">3 Verified Remediated</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#eee7db] dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase text-zinc-400">COMMUNITY TRUST</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-1">16 Votes</h3>
            <p className="text-xs text-zinc-500 mt-0.5">From Ward 14 residents</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* My Filed Grievances Section */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#eee7db] dark:border-slate-800 shadow-xs">
        <h3 className="font-extrabold text-base text-zinc-900 dark:text-white mb-1">
          My Active & Resolved Reports
        </h3>
        <p className="text-xs text-zinc-500 dark:text-slate-400 mb-4">
          Statutory 48h SLA progress on your submitted complaints
        </p>

        <div className="space-y-3">
          {(myGrievances.length > 0 ? myGrievances : grievances.slice(0, 3)).map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-zinc-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-orange-300 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-orange-600">{item.token}</span>
                  <span className="px-2 py-0.5 rounded-sm bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-300 text-[10px] font-bold">
                    {item.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-sm text-[10px] font-bold text-white ${
                      item.status === 'Resolved' ? 'bg-emerald-600' : 'bg-amber-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{item.title}</h4>
                <p className="text-xs text-zinc-500 dark:text-slate-400 mt-0.5">{item.locationName}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-orange-600">
                  {item.status === 'Resolved' ? 'Resolved in 18 Hours' : `SLA: ${item.hoursLeft}h remaining`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
