import { useEffect, useState } from 'react';
import Shell from '../components/Shell';

const A = '/api';

export default function Investments() {
  const [r, setR] = useState<any[]>([]);

  useEffect(() => {
    fetch(A + '/investments')
      .then((x) => x.json())
      .then(setR)
      .catch((err) => console.error('Error loading investments', err));
  }, []);

  return (
    <Shell>
      <div className="label text-[#7ea2ff]">PUBLIC INVESTMENT</div>
      <h1 className="mt-2 text-4xl font-black text-white">Investment alignment</h1>
      <p className="mt-3 text-[#8290a2]">
        See planned projects alongside the places where citizens are signaling demand.
      </p>

      <div className="mt-7 overflow-x-auto rounded-[28px] border line">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-white/[.025]">
            <tr>
              {['Project', 'District', 'Category', 'Budget', 'Status'].map((x) => (
                <th className="p-4 text-left label" key={x}>
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {r.map((x) => (
              <tr className="border-t line" key={x.id}>
                <td className="p-4 font-semibold text-white">{x.project_name}</td>
                <td className="p-4 text-[#8190a3]">{x.district}</td>
                <td className="p-4 text-[#8190a3]">{x.category}</td>
                <td className="p-4 text-white">₹{((x.budget || 0) / 100000).toFixed(1)} L</td>
                <td className="p-4">
                  <span className="rounded-full bg-white/[.05] px-2.5 py-1 text-xs text-[#a6b2c2]">
                    {x.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
