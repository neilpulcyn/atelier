import type { Outfit } from '../lib/stylist';

export function OutfitCard({ o }: { o: Outfit }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-ink text-paper shadow-lg">
      <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent">{o.day === 'tomorrow' ? 'Tomorrow' : 'Today'} · {o.occasion}</p>
          <h4 className="mt-1 font-serif text-[21px] leading-tight">{o.title}</h4>
        </div>
        <div className="flex shrink-0 -space-x-1.5 pt-1">
          {o.palette.map((c) => <span key={c.name} title={c.name} className="h-6 w-6 rounded-full border-2 border-ink" style={{ background: c.hex }} />)}
        </div>
      </div>
      <ul className="divide-y divide-paper/10 border-y border-paper/10">
        {o.items.map((it) => (
          <li key={it.label} className="flex gap-3 px-4 py-2.5">
            <span className="w-6 text-center text-base leading-6">{it.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-paper/45">{it.label}</p>
              <p className="text-[14px] leading-snug">{it.value}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="space-y-2 px-4 py-3.5">
        <p className="text-[12.5px] leading-relaxed text-paper/75">{o.reasoning}</p>
        {o.tips.map((t) => <p key={t} className="text-[12px] leading-snug text-paper/55">• {t}</p>)}
        <p className="pt-1 text-[10px] uppercase tracking-[0.18em] text-paper/35">Palette: {o.palette.map((c) => c.name).join(' · ')}</p>
      </div>
    </div>
  );
}
