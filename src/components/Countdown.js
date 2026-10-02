"use client";

import { useEffect, useState } from "react";

// Counts down to local midnight, when the daily offer window resets.
function remaining() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const s = Math.max(0, Math.floor((midnight - now) / 1000));
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60];
}

export default function Countdown() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const tick = () => setTime(remaining());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const parts = time ?? [0, 0, 0];
  return (
    <div className="flex items-center gap-2" aria-label="Offer ends tonight">
      {["Hours", "Minutes", "Seconds"].map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="w-16 rounded-lg bg-white py-2 text-center text-black sm:w-20">
            <div className="font-display text-3xl leading-none tabular-nums sm:text-4xl">
              {time ? String(parts[i]).padStart(2, "0") : "--"}
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
              {label}
            </div>
          </div>
          {i < 2 && <span className="font-display text-3xl text-gold">:</span>}
        </div>
      ))}
    </div>
  );
}
