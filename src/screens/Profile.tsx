import { useState } from 'react';
import { EventCard } from '../components/EventCard';
import { Bookmark, Calendar, Grid, Settings, Sparkle } from '../components/Icons';
import { Avatar, Sheet, TopBar } from '../components/ui';
import { STYLES } from '../data/styles';
import { useAllEvents, useAllPosts, useMe } from '../lib/data';
import { useNav } from '../lib/nav';
import { useStore } from '../lib/store';
import { COLOUR_FAMILIES } from '../lib/wardrobe';

export function Profile() {
  const { state, update, reset, toast } = useStore();
  const nav = useNav();
  const me = useMe();
  const p = state.profile!;
  const posts = useAllPosts();
  const events = useAllEvents();
  const [tab, setTab] = useState<'posts' | 'saved' | 'events'>('posts');
  const [settings, setSettings] = useState(false);
  const [name, setName] = useState(p.name === 'You' ? '' : p.name);
  const [city, setCity] = useState(p.city);

  const mine = posts.filter((x) => x.creatorId === 'me');
  const saved = posts.filter((x) => state.saved.includes(x.id));
  const going = events.filter((e) => state.rsvp[e.id] || e.hostId === 'me');
  const s = STYLES[p.primary];
  const swatches = (p.colours.length ? p.colours.flatMap((c) => COLOUR_FAMILIES[c]) : s.palette).slice(0, 6);
  const grid = tab === 'posts' ? mine : saved;

  return (
    <div className="scroll">
      <TopBar title={me.handle} serif={false} right={<button onClick={() => setSettings(true)} className="rounded-full p-2 active:bg-ink/5" aria-label="Settings"><Settings size={22} /></button>} />
      <div className="px-5 pt-5">
        <div className="flex items-center gap-5">
          <Avatar c={me} size={84} ring />
          <div className="grid flex-1 grid-cols-3 text-center">
            {[[mine.length, 'Posts'], [me.followers, 'Followers'], [state.follows.length, 'Following']].map(([v, l]) => (
              <div key={l}><p className="text-[17px] font-semibold">{v}</p><p className="text-[11px] text-muted">{l}</p></div>
            ))}
          </div>
        </div>
        <h2 className="mt-4 font-serif text-[26px] leading-tight">{p.name === 'You' ? 'Your Atelier' : p.name}</h2>
        <p className="text-[12px] font-semibold uppercase tracking-wider text-muted">{s.label} · {p.city}</p>
      </div>

      <button onClick={() => nav.open({ type: 'result' })} className="mx-4 mt-4 flex w-[calc(100%-2rem)] items-center gap-4 overflow-hidden rounded-3xl bg-ink p-3 pr-4 text-left text-paper">
        <img src={s.cover} alt="" className="h-24 w-20 rounded-2xl object-cover" />
        <div className="min-w-0 flex-1">
          <p className="eyebrow !text-accent">Your style profile</p>
          <p className="mt-1 font-serif text-[20px] leading-tight">{s.label.split(' /')[0]} <span className="text-paper/50">+</span> {STYLES[p.secondary].label.split(' /')[0]}</p>
          <div className="mt-2 flex -space-x-1.5">
            {swatches.map((c) => <span key={c.hex} className="h-5 w-5 rounded-full border-2 border-ink" style={{ background: c.hex }} />)}
          </div>
        </div>
        <span className="text-paper/60">→</span>
      </button>

      <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
        <button className="btn-light !py-2.5 text-[13px]" onClick={() => nav.open({ type: 'quiz' })}>Retake quiz</button>
        <button className="btn-light !py-2.5 text-[13px]" onClick={() => nav.askStylist('What should I wear today?')}><Sparkle size={15} filled /> Today&rsquo;s outfit</button>
      </div>

      <div className="mt-5 flex border-b border-ink/10">
        {([['posts', <Grid size={20} key="g" />, 'Posts'], ['saved', <Bookmark size={20} key="b" />, 'Saved'], ['events', <Calendar size={20} key="c" />, 'Events']] as const).map(([id, icon, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-[12px] font-semibold ${tab === id ? 'border-ink text-ink' : 'border-transparent text-ink/40'}`}>
            {icon}{label}
          </button>
        ))}
      </div>

      <div className="pb-28">
        {tab !== 'events' && (
          grid.length ? (
            <div className="grid grid-cols-3 gap-0.5">
              {grid.map((x) => (
                <button key={x.id} onClick={() => nav.open({ type: 'comments', id: x.id })} className="aspect-[4/5] overflow-hidden bg-bone">
                  <img src={x.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : (
            <div className="px-10 py-14 text-center">
              <p className="font-serif text-xl">{tab === 'posts' ? 'Share your first look' : 'Nothing saved yet'}</p>
              <p className="mt-1 text-[13px] text-muted">{tab === 'posts' ? 'Upload an outfit and tag your style.' : 'Tap the bookmark on any post to save it here.'}</p>
              {tab === 'posts' && <button className="btn-dark mt-4" onClick={() => nav.setTab('create')}>Create a post</button>}
            </div>
          )
        )}
        {tab === 'events' && (
          <div className="space-y-3 px-4 pt-4">
            {going.length ? going.map((e) => <EventCard key={e.id} e={e} />) : (
              <div className="px-6 py-10 text-center">
                <p className="font-serif text-xl">No plans yet</p>
                <p className="mt-1 text-[13px] text-muted">Mark events as Interested or Going to see them here.</p>
                <button className="btn-dark mt-4" onClick={() => nav.setTab('discover')}>Browse events</button>
              </div>
            )}
          </div>
        )}
      </div>

      {settings && (
        <Sheet title="Settings" onClose={() => setSettings(false)}>
          <div className="space-y-4 px-5 pb-8">
            <label className="block"><span className="eyebrow">Name</span><input className="input mt-1.5" value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label className="block"><span className="eyebrow">Home city (weather fallback)</span><input className="input mt-1.5" value={city} onChange={(e) => setCity(e.target.value)} /></label>
            <div>
              <span className="eyebrow">Temperature</span>
              <div className="mt-1.5 flex gap-2">
                {(['cold', 'neutral', 'warm'] as const).map((r) => (
                  <button key={r} onClick={() => update((st) => ({ ...st, profile: { ...st.profile!, runs: r } }))} className={`chip flex-1 justify-center ${p.runs === r ? 'chip-on' : ''}`}>Run {r}</button>
                ))}
              </div>
            </div>
            <button className="btn-dark w-full" onClick={() => { update((st) => ({ ...st, profile: { ...st.profile!, name: name.trim() || 'You', city: city.trim() || 'London' } })); localStorage.removeItem('atelier:weather'); setSettings(false); toast('Saved'); }}>Save changes</button>
            <button className="btn w-full text-[#c1121f]" onClick={() => { if (confirm('Reset Atelier? This clears your quiz, posts, likes and chat on this device.')) reset(); }}>Reset app data</button>
            <p className="text-center text-[11px] text-muted">Atelier prototype · data stored only on this device</p>
          </div>
        </Sheet>
      )}
    </div>
  );
}
