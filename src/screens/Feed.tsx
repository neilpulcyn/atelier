import { useEffect, useMemo, useState } from 'react';
import { Heart, Sparkle } from '../components/Icons';
import { LookCard } from '../components/LookCard';
import { PostCard } from '../components/PostCard';
import { Avatar, Segmented, Sheet, Wordmark } from '../components/ui';
import { CREATORS } from '../data/creators';
import { LOOKS } from '../data/looks';
import { STYLES } from '../data/styles';
import { useAllPosts } from '../lib/data';
import { useNav } from '../lib/nav';
import { rankLooks, rankPosts } from '../lib/profile';
import { useStore } from '../lib/store';
import type { Look, StyleId } from '../types';
import type { WeatherSummary } from '../lib/weather';

export function Feed() {
  const { state } = useStore();
  const nav = useNav();
  const posts = useAllPosts();
  const p = state.profile;
  const [tab, setTab] = useState<'foryou' | 'following'>('foryou');
  const [filter, setFilter] = useState<StyleId | 'all' | 'mine'>('all');
  const [look, setLook] = useState<Look | null>(null);
  const [weather, setWeather] = useState<WeatherSummary | null>(null);

  useEffect(() => {
    try { setWeather(JSON.parse(localStorage.getItem('atelier:weather') || 'null')); } catch { /* ignore */ }
  }, []);
  const band = weather ? (weather.max < 11 ? 'cold' : weather.max < 20 ? 'mild' : 'warm') : undefined;

  const ranked = useMemo(() => rankPosts(posts, p, state.follows), [posts, p, state.follows]);
  const looks = useMemo(() => rankLooks(LOOKS, p, band).slice(0, 8), [p, band]);
  const visible = tab === 'following'
    ? [...posts].filter((x) => state.follows.includes(x.creatorId) || x.creatorId === 'me').sort((a, b) => b.at.localeCompare(a.at)).map((post) => ({ post, reason: null as string | null }))
    : ranked.filter(({ post }) => filter === 'all' || (filter === 'mine' ? p && (post.style === p.primary || post.style === p.secondary) : post.style === filter));

  const followed = CREATORS.filter((c) => state.follows.includes(c.id));
  const suggested = CREATORS.filter((c) => !state.follows.includes(c.id)).sort((a, b) => (p ? (p.scores[b.style] - p.scores[a.style]) : 0));
  const stories = [...followed, ...suggested].slice(0, 10);

  return (
    <div id="feed-scroll" className="scroll">
      <div className="pt-safe sticky top-0 z-20 bg-paper/90 backdrop-blur-md">
        <div className="flex h-14 items-center px-4">
          <Wordmark className="text-[28px]" />
          <div className="ml-auto flex items-center gap-1">
            <button className="rounded-full p-2 active:bg-ink/5" aria-label="Activity" onClick={() => nav.setTab('profile')}><Heart size={24} /></button>
          </div>
        </div>
        <div className="px-4 pb-3">
          <Segmented value={tab} onChange={setTab} options={[{ id: 'foryou', label: 'For You' }, { id: 'following', label: 'Following' }]} />
        </div>
      </div>

      {/* creators row */}
      <div className="no-scrollbar flex gap-3.5 overflow-x-auto px-4 pb-4 pt-1">
        {stories.map((c) => (
          <button key={c.id} onClick={() => nav.open({ type: 'creator', id: c.id })} className="flex w-[64px] shrink-0 flex-col items-center gap-1.5">
            <Avatar c={c} size={58} ring={state.follows.includes(c.id)} />
            <span className="w-full truncate text-center text-[11px] text-ink/70">{c.handle.split('.')[0]}</span>
          </button>
        ))}
      </div>

      {tab === 'foryou' && p && (
        <>
          <section className="mx-4 mb-4 overflow-hidden rounded-3xl bg-ink p-5 text-paper">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow !text-accent">Tuned to you</p>
                <h2 className="mt-1.5 font-serif text-[24px] leading-tight">{STYLES[p.primary].label.split(' /')[0]} <span className="italic text-paper/60">×</span> {STYLES[p.secondary].label.split(' /')[0]}</h2>
                <p className="mt-1 text-[12px] text-paper/60">Your feed is ranked by your style quiz, colours and who you follow.</p>
              </div>
              <button onClick={() => nav.open({ type: 'result' })} className="shrink-0 rounded-full border border-paper/25 px-3 py-1.5 text-[11px] font-semibold">Profile</button>
            </div>
            <button onClick={() => nav.askStylist('What should I wear today?')} className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-paper/10 px-4 py-3 text-left">
              <Sparkle size={20} className="text-accent" filled />
              <span className="flex-1 text-[13px]">{weather ? `${weather.icon} ${weather.temp}° in ${weather.place} — ` : ''}Get today&rsquo;s outfit from Edie</span>
              <span className="text-accent">→</span>
            </button>
          </section>

          <section className="mb-5">
            <div className="mb-3 flex items-baseline justify-between px-4">
              <h3 className="font-serif text-[22px]">Recommended outfits</h3>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">{band ? `For ${band} days` : 'For you'}</span>
            </div>
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
              {looks.map((l) => <LookCard key={l.id} look={l} onClick={() => setLook(l)} />)}
            </div>
          </section>

          <div className="no-scrollbar mb-1 flex gap-2 overflow-x-auto px-4 pb-2">
            {(['all', 'mine', ...Object.keys(STYLES)] as (StyleId | 'all' | 'mine')[]).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`chip !py-1.5 !text-[12px] ${filter === f ? 'chip-on' : ''}`}>
                {f === 'all' ? 'All' : f === 'mine' ? 'My styles' : STYLES[f].label.split(' /')[0]}
              </button>
            ))}
          </div>
        </>
      )}

      <div>
        {visible.length === 0 && (
          <div className="px-8 py-16 text-center text-sm text-muted">Nothing here yet — follow a few creators to fill your feed.</div>
        )}
        {visible.map(({ post, reason }) => <PostCard key={post.id} post={post} reason={tab === 'foryou' ? reason : null} />)}
        <p className="pb-28 pt-4 text-center font-serif text-sm italic text-muted">You&rsquo;re all caught up.</p>
      </div>

      {look && (
        <Sheet onClose={() => setLook(null)} title={look.title}>
          <div className="scroll px-5 pb-8">
            <div className="flex gap-4">
              <img src={look.image} alt="" className="h-44 w-32 shrink-0 rounded-2xl object-cover" />
              <div className="min-w-0">
                <p className="eyebrow">{STYLES[look.style].label} · {look.price}</p>
                <ul className="mt-2 space-y-1.5 text-[14px]">
                  {look.pieces.map((x) => <li key={x} className="flex gap-2"><span className="text-muted">—</span>{x}</li>)}
                </ul>
                <p className="mt-3 text-xs text-muted">Best for: {look.occasion} · {look.temp === 'any' ? 'any weather' : look.temp + ' days'}</p>
              </div>
            </div>
            <button className="btn-dark mt-5 w-full" onClick={() => { setLook(null); nav.askStylist(`How do I style the "${look.title}" look today? It has ${look.pieces.join(', ').toLowerCase()}.`); }}>
              <Sparkle size={18} filled className="text-accent" /> Ask Edie to adapt it for today
            </button>
          </div>
        </Sheet>
      )}
    </div>
  );
}
