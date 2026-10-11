import { useCreator, fmtCount } from '../lib/data';
import { useNav } from '../lib/nav';
import { useStore } from '../lib/store';
import type { FashionEvent } from '../types';
import { Check, Pin, Star } from './Icons';

export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions) => new Date(iso).toLocaleString('en-GB', opts);

export function EventCard({ e, featured = false }: { e: FashionEvent; featured?: boolean }) {
  const { state, setRsvp, toast } = useStore();
  const nav = useNav();
  const host = useCreator(e.hostId);
  const r = state.rsvp[e.id];
  const count = e.interested + (r ? 1 : 0);
  const rsvpBtn = (
    <button
      onClick={(ev) => { ev.stopPropagation(); setRsvp(e.id, r ? null : 'interested'); if (!r) toast('Marked as interested'); }}
      className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition active:scale-95 ${r ? 'bg-accent text-ink' : featured ? 'bg-paper text-ink' : 'bg-ink text-paper'}`}
    >
      {r ? <Check size={14} strokeWidth={2.6} /> : <Star size={14} />} {r === 'going' ? 'Going' : r ? 'Interested' : 'Interested?'}
    </button>
  );

  if (featured) {
    return (
      <div onClick={() => nav.open({ type: 'event', id: e.id })} className="relative mx-4 h-[340px] cursor-pointer overflow-hidden rounded-3xl bg-ink text-paper">
        <img src={e.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink">Featured</span>
          <span className="rounded-full bg-paper/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur">{e.type}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-accent">{fmtDate(e.start, { weekday: 'short', day: 'numeric', month: 'short' })} · {fmtDate(e.start, { hour: '2-digit', minute: '2-digit' })}</p>
          <h3 className="mt-1.5 font-serif text-[26px] leading-[1.1]">{e.title}</h3>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="flex min-w-0 items-center gap-1 truncate text-[12px] text-paper/75"><Pin size={14} />{e.venue}, {e.city}</p>
            {rsvpBtn}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => nav.open({ type: 'event', id: e.id })} className="flex cursor-pointer gap-3.5 rounded-3xl bg-white p-3 active:scale-[0.99]">
      <div className="relative h-[112px] w-[96px] shrink-0 overflow-hidden rounded-2xl bg-bone">
        <img src={e.cover} alt="" loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute left-1.5 top-1.5 rounded-xl bg-paper px-2 py-1 text-center leading-none">
          <p className="text-[9px] font-bold uppercase text-[#c1121f]">{fmtDate(e.start, { month: 'short' })}</p>
          <p className="font-serif text-[18px] font-bold">{fmtDate(e.start, { day: 'numeric' })}</p>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{e.type} · {e.city}</p>
        <h3 className="mt-1 line-clamp-2 font-serif text-[17px] leading-tight">{e.title}</h3>
        <p className="mt-1 truncate text-[12px] text-muted">by {host?.handle} · {e.price}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-[11px] text-ink/50">{fmtCount(count)} interested</span>
          {rsvpBtn}
        </div>
      </div>
    </div>
  );
}
