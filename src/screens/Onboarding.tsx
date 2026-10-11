import { useState } from 'react';
import { Back, Check, Pin } from '../components/Icons';
import { Wordmark } from '../components/ui';
import { QUIZ, type QuizOption } from '../data/quiz';
import { buildProfile, type Answers } from '../lib/profile';
import type { StyleProfile } from '../types';
import { StyleResult } from './StyleResult';

export function Onboarding({ onDone, initial, onCancel }: { onDone: (p: StyleProfile) => void; initial?: StyleProfile | null; onCancel?: () => void }) {
  const [stage, setStage] = useState<'welcome' | 'quiz' | 'result'>(initial ? 'quiz' : 'welcome');
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState(initial?.name && initial.name !== 'You' ? initial.name : '');
  const [city, setCity] = useState(initial?.city || 'London');
  const [result, setResult] = useState<StyleProfile | null>(null);

  if (stage === 'welcome') {
    return (
      <div className="relative h-full overflow-hidden bg-ink text-paper">
        <img src="/img/p97.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />
        <div className="pt-safe relative flex h-full flex-col px-7 pb-10">
          <div className="mt-8 flex items-center justify-between">
            <Wordmark className="text-3xl" />
            <span className="eyebrow !text-paper/70">Issue 01 · AW26</span>
          </div>
          <div className="mt-auto">
            <p className="eyebrow mb-3 !text-accent">Fashion, personalised</p>
            <h1 className="font-serif text-[44px] leading-[1.02]">Where style<br /><em>finds its people.</em></h1>
            <p className="mt-4 max-w-[300px] text-[15px] leading-relaxed text-paper/80">Looks from creators you love, the shows worth going to, and a stylist who knows your taste and today&rsquo;s weather.</p>
            <button className="btn mt-8 w-full bg-paper py-4 text-ink" onClick={() => setStage('quiz')}>Discover my style</button>
            <p className="mt-3 text-center text-xs text-paper/60">11 quick questions · about 2 minutes</p>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'result' && result) {
    return <StyleResult profile={result} onContinue={() => onDone(result)} onRetake={() => { setStage('quiz'); setI(0); }} cta="Enter Atelier" />;
  }

  const step = QUIZ[i];
  const picked = answers[step.id] || [];
  const singleLike = step.kind === 'single' || step.kind === 'intro' || step.kind === 'location';
  const toggle = (o: QuizOption) => {
    setAnswers((a) => {
      const cur = a[step.id] || [];
      if (singleLike) return { ...a, [step.id]: [o.id] };
      if (cur.includes(o.id)) return { ...a, [step.id]: cur.filter((x) => x !== o.id) };
      if (step.max && cur.length >= step.max) return { ...a, [step.id]: [...cur.slice(1), o.id] };
      return { ...a, [step.id]: [...cur, o.id] };
    });
  };
  const canNext = step.kind === 'intro' ? picked.length > 0 : step.kind === 'location' ? city.trim().length > 1 && picked.length > 0 : step.min ? picked.length >= step.min : singleLike ? picked.length > 0 : true;
  const next = () => {
    if (i < QUIZ.length - 1) { setI(i + 1); document.getElementById('quiz-scroll')?.scrollTo(0, 0); }
    else { setResult(buildProfile(answers, name, city)); setStage('result'); }
  };
  const back = () => (i === 0 ? (initial ? onCancel?.() : setStage('welcome')) : setI(i - 1));

  return (
    <div className="flex h-full flex-col bg-paper">
      <div className="pt-safe px-5">
        <div className="flex h-14 items-center gap-3">
          <button onClick={back} aria-label="Back" className="-ml-2 rounded-full p-2 active:bg-ink/5"><Back size={22} /></button>
          <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full rounded-full bg-ink transition-all duration-500" style={{ width: `${((i + 1) / QUIZ.length) * 100}%` }} />
          </div>
          <span className="w-10 text-right text-xs font-semibold tabular-nums text-muted">{i + 1}/{QUIZ.length}</span>
        </div>
      </div>
      <div id="quiz-scroll" className="scroll flex-1 px-5 pb-6">
        <div key={step.id} className="animate-fadeUp">
          <p className="eyebrow mt-3">Style quiz · {step.eyebrow}</p>
          <h2 className="mt-2 font-serif text-[30px] leading-[1.1]">{step.title}</h2>
          {step.hint && <p className="mt-2 text-sm text-muted">{step.hint}</p>}

          {step.kind === 'intro' && (
            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Your first name</span>
                <input className="input mt-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Neil" autoComplete="given-name" />
              </label>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">I mostly shop</span>
                <div className="mt-2 grid gap-2">
                  {step.options!.map((o) => (
                    <OptionRow key={o.id} o={o} on={picked.includes(o.id)} onClick={() => toggle(o)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step.kind === 'images' && (
            <div className="mt-5 grid grid-cols-3 gap-2">
              {step.options!.map((o) => {
                const on = picked.includes(o.id);
                return (
                  <button key={o.id} onClick={() => toggle(o)} className={`relative aspect-[3/4] overflow-hidden rounded-xl transition ${on ? 'ring-[3px] ring-ink ring-offset-2 ring-offset-paper' : ''}`}>
                    <img src={o.image} alt={o.label} className={`h-full w-full object-cover transition duration-300 ${on ? 'scale-105' : ''}`} />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6 text-left text-[11px] font-semibold text-white">{o.label}</div>
                    {on && <div className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-ink"><Check size={14} strokeWidth={3} /></div>}
                  </button>
                );
              })}
            </div>
          )}

          {step.kind === 'single' && (
            <div className="mt-5 grid gap-2">
              {step.options!.map((o) => <OptionRow key={o.id} o={o} on={picked.includes(o.id)} onClick={() => toggle(o)} />)}
            </div>
          )}

          {step.kind === 'chips' && (
            <div className="mt-6 flex flex-wrap gap-2">
              {step.options!.map((o) => (
                <button key={o.id} onClick={() => toggle(o)} className={`chip !py-2.5 !text-sm ${picked.includes(o.id) ? 'chip-on' : ''}`}>
                  {picked.includes(o.id) && <Check size={14} strokeWidth={2.6} />}{o.label}
                </button>
              ))}
            </div>
          )}

          {step.kind === 'multi' && (
            <div className="mt-5 grid grid-cols-2 gap-2">
              {step.options!.map((o) => {
                const on = picked.includes(o.id);
                return (
                  <button key={o.id} onClick={() => toggle(o)} className={`flex items-center gap-3 rounded-2xl border bg-white p-3 text-left transition ${on ? 'border-ink ring-1 ring-ink' : 'border-ink/10'}`}>
                    <div className="flex -space-x-2">
                      {o.swatch!.map((c) => <span key={c} className="h-7 w-7 rounded-full border-2 border-white shadow-sm" style={{ background: c }} />)}
                    </div>
                    <span className="flex-1 text-[13px] font-semibold leading-tight">{o.label}</span>
                    {on && <Check size={16} strokeWidth={2.6} />}
                  </button>
                );
              })}
            </div>
          )}

          {step.kind === 'location' && (
            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Home city</span>
                <div className="relative mt-2">
                  <Pin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input className="input !pl-11" value={city} onChange={(e) => setCity(e.target.value)} placeholder="London" />
                </div>
                <p className="mt-2 text-xs text-muted">We&rsquo;ll use your device location for weather when you allow it, and fall back to this city.</p>
              </label>
              <div className="grid gap-2">
                {step.options!.map((o) => <OptionRow key={o.id} o={o} on={picked.includes(o.id)} onClick={() => toggle(o)} />)}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="pb-safe border-t border-ink/5 bg-paper px-5 pt-3">
        <button className="btn-dark mb-4 w-full py-4" disabled={!canNext} onClick={next}>
          {i === QUIZ.length - 1 ? 'Reveal my style' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

function OptionRow({ o, on, onClick }: { o: QuizOption; on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 text-left transition active:scale-[0.99] ${on ? 'border-ink ring-1 ring-ink' : 'border-ink/10'}`}>
      {o.emoji && <span className="text-xl">{o.emoji}</span>}
      <span className="flex-1">
        <span className="block text-[15px] font-medium leading-snug">{o.label}</span>
        {o.sub && <span className="block text-xs text-muted">{o.sub}</span>}
      </span>
      <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${on ? 'border-ink bg-ink text-paper' : 'border-ink/25'}`}>{on && <Check size={12} strokeWidth={3} />}</span>
    </button>
  );
}
