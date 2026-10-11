import { useMemo, useState } from 'react';
import { EventCard } from '../components/EventCard';
import { Search } from '../components/Icons';
import { Avatar, Name, Segmented, StyleTag, TopBar } from '../components/ui';
import { CREATORS } from '../data/creators';
import { fmtCount, useAllEvents, useAllPosts } from '../lib/data';
import { useNav } from '../lib/nav';
import { rankEvents } from '../lib/profile';
import { useStore } from '../lib/store';

const CITIES = ['All', 'London', 'Paris', 'Milan', 'New York'];

export function Discover() {
  const { state, toggleFollow } = useStore();
  const nav = useNav();
  const events = useAllEvents();
  const posts = useAllPosts();
  const [seg, setSeg] = useState<'events' | 'creators'>('events');
  const [city, setCity] = useState('All');
  const [q, setQ] = useState('');
  const [mine, setMine] = useState(false);

  const ranked = useMemo(() => rankEvents(events, state.profile), [events, state.profile]);
  const featured = ranked[0];
  const list = events
    .filter((e) => city === 'All' || e.city === city)
    .filter((e) => !mine || state.rsvp[e.id])
    .filter((e) => e.id !== featured?.id || city !== 'All' || mine);

  const creators = CREATORS.filter((c) => !q || (c.name + c.handle + c.city + c.style).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (state.profile ? state.profile.scores[b.style] - state.profile.scores[a.style] : 0));

  return (
    <div className="scroll">
      <TopBar title="Discover" right={<span className="eyebrow">AW26 · Season</span>} />
      <div className="px-4 py-3">
        <Segmented value={seg} onChange={setSeg} options={[{ id: 'events', label: 'Events & shows' }, { id: 'creators', label: 'Creators' }]} />
      </div>

      {seg === 'events' && (
        <div className="pb-28">
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-4">
            {CITIES.map((c) => (
              <button key={c} onClick={() => setCity(c)} className={`chip ${city === c ? 'chip-on' : ''}`}>{c}</button>
            ))}
            <button onClick={() => setMine(!mine)} className={`chip ${mine ? 'chip-on' : ''}`}>★ My RSVPs</button>
          </div>
          {city === 'All' && !mine && featured && (
            <>
              <p className="eyebrow mb-2 px-4">Picked for your style</p>
              <EventCard e={featured} featured />
            </>
          )}
          <div className="mt-6 flex items-baseline justify-between px-4">
            <h3 className="font-serif text-[22px]">Upcoming</h3>
            <span className="text-[12px] text-muted">{list.length} events</span>
          </div>
          <div className="mt-3 space-y-3 px-4">
            {list.map((e) => <EventCard key={e.id} e={e} />)}
            {list.length === 0 && <p className="py-10 text-center text-sm text-muted">No events here yet.</p>}
          </div>
          <button onClick={() => nav.setTab('create')} className="mx-4 mt-5 block w-[calc(100%-2rem)] rounded-3xl border border-dashed border-ink/25 p-5 text-center">
            <p className="font-serif text-lg">Hosting a show or pop-up?</p>
            <p className="mt-1 text-[13px] text-muted">Promote it to fashion lovers who match its style →</p>
          </button>
        </div>
      )}

      {seg === 'creators' && (
        <div className="px-4 pb-28">
          <div className="relative mb-4">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input !rounded-full !py-3 !pl-11" placeholder="Search creators, cities, styles" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="space-y-2">
            {creators.map((c) => {
              const f = state.follows.includes(c.id);
              const thumbs = posts.filter((p) => p.creatorId === c.id).slice(0, 3);
              return (
                <div key={c.id} className="rounded-3xl bg-white p-3.5">
                  <div className="flex items-center gap-3">
                    <button onClick={() => nav.open({ type: 'creator', id: c.id })} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                      <Avatar c={c} size={46} />
                      <div className="min-w-0">
                        <Name c={c} className="text-[14px] font-semibold" />
                        <p className="truncate text-[12px] text-muted">{c.role} · {c.city} · {fmtCount(c.followers + (f ? 1 : 0))}</p>
                      </div>
                    </button>
                    <button onClick={() => toggleFollow(c.id)} className={`rounded-full px-4 py-2 text-[12px] font-semibold ${f ? 'border border-ink/20' : 'bg-ink text-paper'}`}>{f ? 'Following' : 'Follow'}</button>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {thumbs.map((p) => <img key={p.id} src={p.image} alt="" loading="lazy" className="aspect-square w-full rounded-xl object-cover" />)}
                  </div>
                  <div className="mt-2.5"><StyleTag s={c.style} /></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
