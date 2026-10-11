import { useState } from 'react';
import { EventCard, fmtDate } from '../components/EventCard';
import { Calendar, Check, Pin, Send, Star } from '../components/Icons';
import { Avatar, Name, Sheet, StyleTag, TopBar } from '../components/ui';
import { creatorByHandle } from '../data/creators';
import { STYLES } from '../data/styles';
import { fmtCount, timeAgo, useAllEvents, useAllPosts, useCreator, useMe } from '../lib/data';
import { useNav } from '../lib/nav';
import { uid, useStore } from '../lib/store';
import type { FashionEvent } from '../types';

export function CreatorScreen({ id }: { id: string }) {
  const c = useCreator(id);
  const nav = useNav();
  const { state, toggleFollow } = useStore();
  const posts = useAllPosts().filter((p) => p.creatorId === id);
  const events = useAllEvents().filter((e) => e.hostId === id);
  if (!c) return null;
  const f = state.follows.includes(id);
  return (
    <div className="scroll animate-slideIn bg-paper">
      <TopBar title={<Name c={c} />} serif={false} onBack={nav.close} />
      <div className="px-5 pt-5">
        <div className="flex items-center gap-5">
          <Avatar c={c} size={84} ring />
          <div className="grid flex-1 grid-cols-3 text-center">
            {[[posts.length, 'Posts'], [fmtCount(c.followers + (f ? 1 : 0)), 'Followers'], [events.length, 'Events']].map(([v, l]) => (
              <div key={l}><p className="text-[17px] font-semibold">{v}</p><p className="text-[11px] text-muted">{l}</p></div>
            ))}
          </div>
        </div>
        <h2 className="mt-4 font-serif text-[24px]">{c.name}</h2>
        <p className="text-[12px] font-semibold uppercase tracking-wider text-muted">{c.role} · {c.city}</p>
        <p className="mt-2 text-[14px] leading-relaxed">{c.bio}</p>
        <div className="mt-3"><StyleTag s={c.style} dark /></div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => toggleFollow(id)} className={`flex-1 ${f ? 'btn-light' : 'btn-dark'}`}>{f ? 'Following' : 'Follow'}</button>
          <button onClick={() => nav.askStylist(`How can I get a look like ${c.name}'s ${STYLES[c.style].label.toLowerCase()} style?`)} className="btn-light flex-1">Get the look</button>
        </div>
      </div>
      {events.length > 0 && (
        <div className="mt-6 space-y-3 px-4">
          <p className="eyebrow px-1">Upcoming events</p>
          {events.map((e) => <EventCard key={e.id} e={e} />)}
        </div>
      )}
      <div className="mt-6 grid grid-cols-3 gap-0.5 pb-24">
        {posts.map((p) => (
          <button key={p.id} onClick={() => nav.open({ type: 'comments', id: p.id })} className="aspect-[4/5] overflow-hidden bg-bone">
            <img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function icsFor(e: FashionEvent) {
  const d = (s: string) => s.replace(/[-:]/g, '') + '00';
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Atelier//EN', 'BEGIN:VEVENT', `UID:${e.id}@atelier.app`, `DTSTART:${d(e.start)}`, `DTEND:${d(e.end)}`, `SUMMARY:${e.title}`, `LOCATION:${e.venue}, ${e.address}`, `DESCRIPTION:${e.description.replace(/\n/g, ' ')}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
  a.download = `${e.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`;
  a.click();
}

export function EventScreen({ id }: { id: string }) {
  const e = useAllEvents().find((x) => x.id === id);
  const host = useCreator(e?.hostId || '');
  const nav = useNav();
  const { state, setRsvp, toast } = useStore();
  if (!e) return null;
  const r = state.rsvp[e.id];
  return (
    <div className="scroll animate-slideIn bg-paper">
      <div className="relative h-[380px] bg-ink">
        <img src={e.cover} alt="" className="h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
        <button onClick={nav.close} className="pt-safe absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-2 text-sm font-semibold">← Back</button>
        <div className="absolute inset-x-0 bottom-0 p-5 text-paper">
          <p className="eyebrow !text-accent">{e.type} · {e.price}</p>
          <h1 className="mt-2 font-serif text-[30px] leading-[1.08]">{e.title}</h1>
        </div>
      </div>
      <div className="space-y-5 px-5 py-5 pb-28">
        <div className="grid gap-3 rounded-3xl bg-white p-4">
          <div className="flex gap-3"><Calendar size={20} className="mt-0.5 shrink-0" /><div><p className="text-[14px] font-semibold">{fmtDate(e.start, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p><p className="text-[13px] text-muted">{fmtDate(e.start, { hour: '2-digit', minute: '2-digit' })} – {fmtDate(e.end, { hour: '2-digit', minute: '2-digit' })} local time</p></div></div>
          <div className="flex gap-3"><Pin size={20} className="mt-0.5 shrink-0" /><div><p className="text-[14px] font-semibold">{e.venue}</p><a className="text-[13px] text-muted underline" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.venue + ', ' + e.address)}`} target="_blank" rel="noreferrer">{e.address}</a></div></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => { setRsvp(e.id, r === 'interested' ? null : 'interested'); }} className={`btn ${r === 'interested' ? 'bg-accent text-ink' : 'btn-light'}`}><Star size={16} filled={r === 'interested'} /> Interested</button>
          <button onClick={() => { setRsvp(e.id, r === 'going' ? null : 'going'); if (r !== 'going') toast("You're going! Added to your profile"); }} className={`btn ${r === 'going' ? 'bg-ink text-accent' : 'btn-dark'}`}><Check size={16} /> {r === 'going' ? 'Going ✓' : 'RSVP — Going'}</button>
        </div>
        <p className="text-center text-[12px] text-muted">{fmtCount(e.interested + (r ? 1 : 0))} people interested</p>
        <p className="text-[15px] leading-relaxed text-ink/85">{e.description}</p>
        <div className="flex flex-wrap gap-2">{e.styles.map((s) => <StyleTag key={s} s={s} />)}</div>
        {host && (
          <button onClick={() => nav.open({ type: 'creator', id: host.id })} className="flex w-full items-center gap-3 rounded-3xl bg-white p-3.5 text-left">
            <Avatar c={host} size={44} />
            <div className="flex-1"><p className="eyebrow !text-[9px]">Hosted by</p><Name c={host} className="text-[14px] font-semibold" /></div>
            <span className="text-muted">→</span>
          </button>
        )}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => icsFor(e)} className="btn-light">Add to calendar</button>
          <button onClick={() => nav.askStylist(`What should I wear to ${e.title} (a ${e.type.toLowerCase()} in ${e.city})?`)} className="btn-light">What to wear?</button>
        </div>
      </div>
    </div>
  );
}

export function CommentsSheet({ id }: { id: string }) {
  const post = useAllPosts().find((p) => p.id === id);
  const nav = useNav();
  const me = useMe();
  const { update } = useStore();
  const [text, setText] = useState('');
  if (!post) return null;
  const submit = () => {
    const t = text.trim();
    if (!t) return;
    update((s) => ({ ...s, extraComments: { ...s.extraComments, [id]: [...(s.extraComments[id] || []), { id: uid(), author: me.handle, text: t, at: new Date().toISOString() }] } }));
    setText('');
  };
  return (
    <Sheet onClose={nav.close} title="Comments">
      <div className="scroll max-h-[50vh] space-y-4 px-5 pb-4">
        <div className="flex gap-3 border-b border-ink/5 pb-4">
          <img src={post.image} alt="" className="h-16 w-14 rounded-lg object-cover" />
          <p className="text-[13px] leading-snug text-ink/80">{post.caption}</p>
        </div>
        {post.comments.map((c) => {
          const author = c.author === me.handle ? me : creatorByHandle(c.author);
          return (
            <div key={c.id} className="flex gap-3">
              <Avatar c={author} size={32} />
              <div className="text-[14px] leading-snug">
                <span className="mr-1.5 font-semibold">{c.author}</span>{c.text}
                <p className="mt-0.5 text-[11px] text-muted">{timeAgo(c.at)}</p>
              </div>
            </div>
          );
        })}
        {post.comments.length === 0 && <p className="py-6 text-center text-sm text-muted">Be the first to comment.</p>}
      </div>
      <div className="pb-safe flex items-center gap-2 border-t border-ink/5 px-4 py-3">
        <Avatar c={me} size={32} />
        <input className="input !rounded-full !py-2.5" placeholder="Add a comment…" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
        <button onClick={submit} disabled={!text.trim()} className="rounded-full bg-ink p-2.5 text-paper disabled:opacity-30" aria-label="Post comment"><Send size={18} /></button>
      </div>
    </Sheet>
  );
}
