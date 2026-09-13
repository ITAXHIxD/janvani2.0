import { Link, useLocation } from 'react-router-dom';
import { BarChart3, ClipboardList, Home, Map, Menu, Network, X } from 'lucide-react';
import { useState } from 'react';

const items = [
  ['/dashboard', 'Overview', Home],
  ['/dashboard/map', 'Hotspots', Map],
  ['/dashboard/recommendations', 'Priorities', ClipboardList],
  ['/dashboard/investments', 'Investments', Network],
  ['/dashboard/analytics', 'Analytics', BarChart3]
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r line bg-[#090e16]/90 backdrop-blur-2xl lg:flex">
        <div className="px-6 pt-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#6f96ff] to-[#63d7ff] text-[#07101a] font-black shadow-[0_0_30px_rgba(99,215,255,.16)]">
              J
            </span>
            <div>
              <div className="font-black tracking-tight text-white">JanVaani</div>
              <div className="text-[10px] uppercase tracking-[.18em] text-[#718097]">Civic intelligence</div>
            </div>
          </Link>
        </div>
        <nav className="mt-10 px-4">
          {items.map(([to, label, I]: any) => {
            const a = loc.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`group mb-1 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                  a
                    ? 'bg-white/[.07] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)]'
                    : 'text-[#8290a2] hover:bg-white/[.035] hover:text-white'
                }`}
              >
                <I size={17} strokeWidth={1.8} />
                <span className="flex-1">{label}</span>
                {a && <span className="h-1.5 w-1.5 rounded-full bg-[#63d7ff] shadow-[0_0_10px_#63d7ff]" />}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-5">
          <div className="glass rounded-3xl p-4">
            <div className="flex items-center justify-between">
              <span className="label">System</span>
              <span className="text-[10px] text-[#54d49a]">ONLINE</span>
            </div>
            <div className="mt-3 text-sm font-semibold text-white">Decision workspace</div>
            <div className="mt-1 text-xs leading-5 text-[#7d8a9d]">Demo environment · 5,000 synthetic reports</div>
          </div>
        </div>
      </aside>
      <header className="fixed inset-x-0 top-0 z-30 border-b line bg-[#080b11]/75 backdrop-blur-2xl lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="font-black text-white">JanVaani</Link>
          <button onClick={() => setOpen(!open)} className="rounded-xl border border-white/10 bg-white/[.03] p-2 text-white">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open && (
          <div className="border-t line bg-[#0b1018] p-3">
            {items.map(([to, label, I]: any) => (
              <Link
                onClick={() => setOpen(false)}
                key={to}
                to={to}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#a4afbd]"
              >
                <I size={17} />
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
