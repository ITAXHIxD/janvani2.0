import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Shell from '../components/Shell';

const A = '/api';

function Meter({ label, val }: { label: string; val: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-[#718096]">{label}</span>
        <b className="text-white">{Math.round(val)}</b>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[.05]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#6f96ff] to-[#63d7ff]"
          style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
        />
      </div>
    </div>
  );
}

export default function RecommendationDetail() {
  const { id } = useParams();
  const [x, setX] = useState<any>();

  useEffect(() => {
    fetch(A + `/recommendations/${id}`)
      .then((r) => r.json())
      .then(setX)
      .catch((err) => console.error('Error loading detail', err));
  }, [id]);

  if (!x) {
    return (
      <Shell>
        <div className="text-[#718096]">Loading brief…</div>
      </Shell>
    );
  }

  const r = x.recommendation;
  const h = x.hotspot;

  return (
    <Shell>
      <Link to="/dashboard/recommendations" className="text-sm font-bold text-[#7ea2ff] hover:underline">
        ← Back to priorities
      </Link>
      <div className="glass mt-5 rounded-[30px] p-7">
        <div className="label text-[#7ea2ff]">DECISION BRIEF</div>
        <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">{r.title}</h1>
            <p className="mt-2 text-[#718096]">{r.category} · {h?.district || 'General'}</p>
          </div>
          <div className="rounded-2xl border border-[#6f96ff]/15 bg-[#6f96ff]/[.06] px-5 py-4 text-right">
            <div className="label text-[#7ea2ff]">PRIORITY SIGNAL</div>
            <div className="mt-1 text-4xl font-black text-white">
              {Math.round(r.priority_score)}
              <span className="text-base text-[#6b7b90]">/100</span>
            </div>
          </div>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {[
            ['Impact', r.estimated_population_impact + ' people'],
            ['Budget', '₹' + (r.estimated_budget / 1e7).toFixed(2) + ' Cr'],
            ['Confidence', Math.round(r.confidence * 100) + '%']
          ].map(([a, b]) => (
            <div className="rounded-2xl border border-white/6 bg-white/[.025] p-4" key={a as string}>
              <div className="label">{a}</div>
              <div className="mt-1 font-bold text-white">{b}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="glass rounded-[30px] p-6">
          <div className="text-base font-bold text-white">Evidence behind the signal</div>
          <p className="mt-3 text-sm leading-6 text-[#7d8b9f]">{r.explanation}</p>
          {h && (
            <div className="mt-7 space-y-5">
              <Meter label="Citizen demand" val={h.demand_score} />
              <Meter label="Urgency" val={h.average_urgency} />
              <Meter label="Population impact" val={Math.min(100, h.population_impact / 250)} />
              <Meter label="Infrastructure gap" val={h.infrastructure_gap} />
              <Meter label="Investment gap" val={h.investment_gap} />
            </div>
          )}
        </section>

        <section className="space-y-4">
          {[
            ['Why now?', r.why_now],
            ['Why here?', r.why_here],
            ['Why this intervention?', r.why_intervention]
          ].map(([a, b]) => (
            <div className="glass rounded-[30px] p-6" key={a as string}>
              <div className="font-bold text-white">{a}</div>
              <p className="mt-2 text-sm leading-6 text-[#7d8b9f]">{b}</p>
            </div>
          ))}
        </section>
      </div>
    </Shell>
  );
}
