import { Back } from '../components/Icons';
import { STYLES, STYLE_IDS } from '../data/styles';
import { QUIZ } from '../data/quiz';
import { COLOUR_FAMILIES } from '../lib/wardrobe';
import type { StyleProfile } from '../types';

const label = (stepId: string, id: string) => QUIZ.find((s) => s.id === stepId)?.options?.find((o) => o.id === id)?.label || id;

export function StyleResult({ profile: p, onContinue, onRetake, cta, onBack }: { profile: StyleProfile; onContinue: () => void; onRetake: () => void; cta: string; onBack?: () => void }) {
  const s = STYLES[p.primary];
  const s2 = STYLES[p.secondary];
  const ranked = [...STYLE_IDS].sort((a, b) => p.scores[b] - p.scores[a]);
  const swatches = (p.colours.length ? p.colours.flatMap((c) => COLOUR_FAMILIES[c]) : s.palette.map((c) => ({ name: c.name, hex: c.hex }))).slice(0, 8);
  return (
    <div className="scroll bg-paper">
      <div className="relative h-[430px] overflow-hidden bg-ink">
        <img src={s.cover} alt={s.label} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/85" />
        {onBack && (
          <button onClick={onBack} className="pt-safe absolute left-3 top-3 rounded-full bg-paper/90 p-2" aria-label="Back"><Back size={20} /></button>
        )}
        <div className="absolute inset-x-0 bottom-0 p-6 text-paper">
          <p className="eyebrow !text-accent">{p.name !== 'You' ? `${p.name}, your style is` : 'Your style is'}</p>
          <h1 className="mt-2 font-serif text-[46px] leading-none">{s.label.split(' /')[0]}</h1>
          <p className="mt-2 font-serif text-lg italic text-paper/85">&ldquo;{s.tagline}&rdquo;</p>
        </div>
      </div>

      <div className="space-y-7 px-5 py-6">
        <p className="text-[15px] leading-relaxed text-ink/80">
          {s.description} With a <strong className="font-semibold text-ink">{s2.label}</strong> streak, you&rsquo;re not afraid to borrow {s2.tagline.toLowerCase().replace(/\.$/, '')}.
        </p>

        <section>
          <p className="eyebrow mb-3">Your style DNA</p>
          <div className="space-y-2.5">
            {ranked.slice(0, 5).map((id, idx) => (
              <div key={id} className="flex items-center gap-3">
                <span className={`w-28 text-[13px] ${idx === 0 ? 'font-semibold' : 'text-ink/70'}`}>{STYLES[id].label.split(' /')[0]}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
                  <div className={`h-full rounded-full ${idx === 0 ? 'bg-ink' : idx === 1 ? 'bg-ink/60' : 'bg-ink/30'}`} style={{ width: `${Math.min(100, p.scores[id] * 2.2)}%` }} />
                </div>
                <span className="w-9 text-right text-xs font-semibold tabular-nums">{p.scores[id]}%</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="eyebrow mb-3">Your palette</p>
          <div className="flex flex-wrap gap-3">
            {swatches.map((c) => (
              <div key={c.name + c.hex} className="flex flex-col items-center gap-1.5">
                <span className="h-11 w-11 rounded-full border border-ink/10 shadow-sm" style={{ background: c.hex }} />
                <span className="text-[10px] capitalize text-muted">{c.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="eyebrow mb-3">Signature pieces</p>
          <div className="flex flex-wrap gap-2">
            {s.keyPieces.map((k) => <span key={k} className="rounded-full bg-bone px-3 py-1.5 text-[13px]">{k}</span>)}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-2">
          {[
            ['Fit', label('fit', p.fit)],
            ['Budget', label('budget', p.budget)],
            ['Dresses for', p.occasions.map((o) => label('occasions', o)).slice(0, 3).join(', ') || 'Everything'],
            ['Weather', `${p.city} · ${p.runs === 'neutral' ? 'runs neutral' : 'runs ' + p.runs}`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-white p-3.5">
              <p className="eyebrow !text-[9px]">{k}</p>
              <p className="mt-1 text-[13px] font-medium leading-snug">{v}</p>
            </div>
          ))}
        </section>

        {p.comfort.length > 0 && (
          <section>
            <p className="eyebrow mb-2">Your stylist will respect</p>
            <p className="text-[13px] text-ink/75">{p.comfort.map((c) => label('comfort', c)).join(' · ')}</p>
          </section>
        )}

        <section>
          <p className="eyebrow mb-2">Style muses</p>
          <p className="font-serif text-xl italic">{s.muses.join(' · ')}</p>
        </section>

        <div className="space-y-2 pb-6">
          <button className="btn-dark w-full py-4" onClick={onContinue}>{cta}</button>
          <button className="btn w-full text-ink/60" onClick={onRetake}>Retake the quiz</button>
        </div>
      </div>
    </div>
  );
}
