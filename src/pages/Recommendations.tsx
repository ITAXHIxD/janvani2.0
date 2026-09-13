import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Shell from '../components/Shell';

const A = '/api';

export default function Recommendations() {
  const [r, setR] = useState<any[]>([]);

  useEffect(() => {
    fetch(A + '/recommendations')
      .then((x) => x.json())
      .then(setR)
      .catch((err) => console.error('Error loading recommendations', err));
  }, []);

  return (
    <Shell>
      <div className="label text-[#7ea2ff]">DECISION SUPPORT</div>
      <h1 className="mt-2 text-4xl font-black text-white">Development priorities</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#8290a2]">
        Ranked options with visible evidence and context, designed to support—not replace—public decision making.
      </p>

      <div className="mt-8 space-y-3">
        {r.map((x, n) => (
          <Link
            to={`/dashboard/recommendations/${x.id}`}
            key={x.id}
            className="glass group block rounded-[28px] p-5 hover:border-white/10 transition"
          >
            <div className="flex gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[.035] text-xs font-black text-[#55657b]">
                {String(n + 1).padStart(2, '0')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="label text-[#7ea2ff]">{x.category}</div>
                <div className="mt-2 text-lg font-bold text-white">{x.title}</div>
                <div className="mt-2 text-sm leading-6 text-[#7b899d]">{x.explanation}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-3xl font-black text-white">{Math.round(x.priority_score)}</div>
                <div className="label">priority</div>
                <ArrowUpRight size={15} className="ml-auto mt-3 text-[#56657a] group-hover:text-[#7ea2ff] transition" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Shell>
  );
}
