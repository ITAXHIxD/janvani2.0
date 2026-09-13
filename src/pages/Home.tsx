import { Link } from 'react-router-dom';
import { ArrowUpRight, AudioLines, ChevronRight, Globe2, MapPinned, MessageCircleMore, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import GlowOrb from '../components/GlowOrb';

const metrics = [
  ['12,847', 'citizen signals'],
  ['34', 'priority hotspots'],
  ['18', 'active project priorities'],
  ['₹8.4 Cr', 'tracked investment gap']
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#080b11]">
      <div className="relative mx-auto max-w-[1500px] px-5 pb-14 lg:px-8">
        <GlowOrb className="left-[4%] top-24 h-72 w-72 bg-[#4f6fff]/10" />
        <GlowOrb className="right-[8%] top-36 h-96 w-96 bg-[#55d9ff]/8" />
        
        <nav className="relative flex items-center justify-between py-5">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#7ea2ff] to-[#5ed6ff] text-[#07101a] font-black">
              J
            </span>
            <span>
              <span className="block font-black tracking-tight text-white">JanVaani</span>
              <span className="block text-[10px] uppercase tracking-[.2em] text-[#65748a]">Civic intelligence</span>
            </span>
          </Link>
          <div className="hidden gap-8 text-sm text-[#7f8da0] md:flex">
            <a href="#how" className="hover:text-white transition">How it works</a>
            <a href="#signals" className="hover:text-white transition">Signals</a>
            <a href="#impact" className="hover:text-white transition">Impact</a>
          </div>
          <Link to="/report" className="rounded-xl bg-[#edf3ff] px-4 py-2.5 text-xs font-bold text-[#0b1017] hover:bg-white transition">
            Report an issue
          </Link>
        </nav>

        <section className="relative grid min-h-[650px] items-center gap-14 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:pt-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#5d7fff]/20 bg-[#5776ff]/8 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.12em] text-[#91aeff]">
              <Sparkles size={13} /> Public-sector decision intelligence
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[.98] tracking-[-.055em] text-white sm:text-6xl lg:text-[76px]">
              A clearer view of<br />
              <span className="bg-gradient-to-r from-[#eef4ff] via-[#93afff] to-[#62d8ff] bg-clip-text text-transparent">
                what communities need next.
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-[#8997aa] sm:text-lg">
              JanVaani brings citizen voice, place-based demand, infrastructure and public investment into one calm, explainable workspace for development teams.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/report" className="inline-flex items-center gap-2 rounded-2xl bg-[#6f96ff] px-5 py-3.5 text-sm font-bold text-white shadow-[0_0_36px_rgba(111,150,255,.2)] hover:bg-[#5b85f7] transition">
                Share a community issue <ArrowUpRight size={17} />
              </Link>
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.025] px-5 py-3.5 text-sm font-semibold text-[#d8e2ef] hover:bg-white/[.05] transition">
                Open command center <ChevronRight size={16} />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-xs text-[#67758a]">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#54d49a]" /> Privacy-aware
              </span>
              <span className="inline-flex items-center gap-2">
                <Globe2 size={14} className="text-[#63d7ff]" /> Multilingual
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPinned size={14} className="text-[#8aa4ff]" /> Geospatial
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-[#4d7bff]/8 blur-3xl" />
            <div className="glass relative rounded-[32px] p-4 sm:p-5">
              <div className="grid-bg rounded-[24px] border border-white/6 bg-[#0c121c] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="label">District signal board</div>
                    <div className="mt-1 text-sm text-[#78879b]">Illustrative live view</div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-[#0c1f18] px-2.5 py-1.5 text-[10px] font-bold text-[#54d49a]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#54d49a] pulse" /> ONLINE
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {metrics.map(([v, l]) => (
                    <div className="shimmer rounded-2xl border border-white/6 bg-white/[.025] p-4" key={l}>
                      <div className="text-2xl font-black tracking-tight text-white">{v}</div>
                      <div className="mt-1 text-[11px] uppercase tracking-[.08em] text-[#65748a]">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-[#6f96ff]/16 bg-gradient-to-br from-[#151f33] to-[#0c121c] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="label text-[#7899ff]">Top priority</div>
                      <div className="mt-2 text-base font-bold text-white">Water storage & pipeline expansion</div>
                      <div className="mt-1 text-xs text-[#758398]">Demo District Alpha · Water</div>
                    </div>
                    <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[#6f96ff]/20 bg-[#6f96ff]/8 text-sm font-black text-[#a9beff]">
                      91
                    </div>
                  </div>
                  <div className="mt-5 h-2 rounded-full bg-white/5">
                    <div className="h-full w-[91%] rounded-full bg-gradient-to-r from-[#6f96ff] to-[#63d7ff]" />
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-[#68778b]">
                    <span>priority signal</span>
                    <span>high confidence</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[['+42%', 'demand growth'], ['34/100', 'infra score'], ['18k+', 'estimated impact']].map(([v, l]) => (
                    <div className="rounded-2xl border border-white/6 bg-black/10 p-3" key={l}>
                      <div className="font-black text-white">{v}</div>
                      <div className="mt-1 text-[10px] leading-4 text-[#69788b]">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="how" className="border-y border-white/6 bg-[#0b1119]">
        <div className="mx-auto max-w-[1500px] px-5 py-16 lg:px-8">
          <div className="max-w-2xl">
            <div className="label">From signal to decision</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              A workflow built around the questions policymakers actually ask.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              [MessageCircleMore, 'Capture', 'Voice, text and messaging inputs become one structured stream.'],
              [AudioLines, 'Understand', 'Language, category, urgency and location are interpreted.'],
              [MapPinned, 'Locate', 'Demand is aggregated into places, patterns and hotspots.'],
              [TrendingUp, 'Prioritize', 'Context from infrastructure and investment turns signals into ranked options.']
            ].map(([I, t, d]: any, i) => (
              <div className="glass rounded-3xl p-6" key={t as string}>
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/[.04] text-[#78a0ff]">
                    <I size={19} />
                  </div>
                  <div className="text-xs font-black text-[#4f5f73]">0{i + 1}</div>
                </div>
                <div className="mt-7 text-lg font-bold text-white">{t}</div>
                <p className="mt-2 text-sm leading-6 text-[#78879b]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="signals" className="mx-auto max-w-[1500px] px-5 py-16 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <div className="label">The decision view</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Not another complaint inbox.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#7f8da0]">
              The citizen report is the input. The product is the intelligence layer that connects scattered signals to places, gaps and practical development choices.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['WHERE', 'Hotspots', 'Map concentrated demand'],
              ['WHY', 'Evidence', 'Show the drivers behind a priority'],
              ['WHAT', 'Next step', 'Present a development option']
            ].map(([k, t, d]) => (
              <div className="rounded-3xl border border-white/6 bg-white/[.02] p-5" key={k}>
                <div className="text-[10px] font-black tracking-[.18em] text-[#6f96ff]">{k}</div>
                <div className="mt-3 font-bold text-white">{t}</div>
                <div className="mt-2 text-sm leading-6 text-[#78879b]">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/6">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-5 py-6 text-xs text-[#617086] sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>JanVaani · Civic development intelligence</div>
          <div>Demo environment · synthetic data · extensible architecture</div>
        </div>
      </footer>
    </div>
  );
}
