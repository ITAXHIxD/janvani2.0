import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import Shell from '../components/Shell';
import { MapPinned } from 'lucide-react';

const A = '/api';

export default function MapPage() {
  const [h, setH] = useState<any[]>([]);
  const [s, setS] = useState<any>();

  useEffect(() => {
    fetch(A + '/hotspots')
      .then((r) => r.json())
      .then(setH)
      .catch((err) => console.error('Error loading hotspots', err));
  }, []);

  return (
    <Shell>
      <div className="label text-[#7ea2ff]">GEOSPATIAL INTELLIGENCE</div>
      <h1 className="mt-2 text-4xl font-black text-white">Development hotspots</h1>
      <p className="mt-3 text-sm text-[#8290a2]">
        Explore where demand is concentrated and inspect the evidence behind each signal.
      </p>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_350px]">
        <div className="h-[650px] overflow-hidden rounded-[28px] border line relative">
          <MapContainer center={[23.2, 77.4]} zoom={5} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {h.map((x) => (
              <CircleMarker
                key={x.id}
                center={[x.latitude, x.longitude]}
                radius={Math.max(7, Math.min(22, x.hotspot_score / 5))}
                pathOptions={{
                  color: '#8fb0ff',
                  fillColor: '#5b8cff',
                  fillOpacity: 0.5,
                  weight: 1.5
                }}
                eventHandlers={{
                  click: () => setS(x)
                }}
              >
                <Popup>
                  <div className="text-xs">
                    <b>{x.district}</b><br />
                    {x.category}<br />
                    Signal: {Math.round(x.hotspot_score)}/100
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div className="glass rounded-[28px] p-6">
          {s ? (
            <>
              <div className="label text-[#7ea2ff]">SELECTED SIGNAL</div>
              <div className="mt-2 text-2xl font-black text-white">{s.district}</div>
              <div className="mt-1 text-sm text-[#8290a2]">{s.category}</div>
              <div className="mt-7 flex items-end gap-2">
                <div className="text-5xl font-black text-white">{Math.round(s.hotspot_score)}</div>
                <div className="pb-1 text-xs text-[#637188]">/100</div>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  ['Citizen reports', s.request_count],
                  ['Demand growth', '+' + Math.round(s.request_growth_rate) + '%'],
                  ['Average urgency', Math.round(s.average_urgency)],
                  ['Infrastructure gap', Math.round(s.infrastructure_gap)],
                  ['Investment gap', Math.round(s.investment_gap)]
                ].map(([a, b]) => (
                  <div className="flex justify-between border-b border-white/6 pb-3 text-sm" key={a as string}>
                    <span className="text-[#718096]">{a}</span>
                    <b className="text-white">{b}</b>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="grid h-full min-h-[600px] place-items-center text-center">
              <div>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/[.035] text-[#7ea2ff]">
                  <MapPinned size={21} />
                </div>
                <div className="mt-4 font-semibold text-white">Select a hotspot</div>
                <div className="mt-1 max-w-xs text-sm leading-6 text-[#718096]">
                  Click a point on the map to inspect its development signal.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
