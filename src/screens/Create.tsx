import { useRef, useState } from 'react';
import { Camera, Check } from '../components/Icons';
import { Segmented, TopBar } from '../components/ui';
import { STYLES, STYLE_IDS } from '../data/styles';
import { useNav } from '../lib/nav';
import { uid, useStore } from '../lib/store';
import type { FashionEvent, StyleId } from '../types';

const TAGS = ['ootd', 'streetstyle', 'thrifted', 'tailoring', 'knitwear', 'denim', 'accessories', 'trainers', 'evening', 'handmade', 'sustainable', 'aw26'];
const COLOURS = [['neutrals', 'Neutrals'], ['monochrome', 'Black & white'], ['earth', 'Earth'], ['pastels', 'Pastels'], ['brights', 'Brights'], ['jewel', 'Jewel'], ['navy', 'Navy'], ['denim', 'Denim']];
const TYPES: FashionEvent['type'][] = ['Runway show', 'Pop-up', 'Launch', 'Talk', 'Market', 'Party', 'Workshop', 'Sample sale'];

async function fileToDataUrl(file: File, max = 1080): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function Create() {
  const { state, update, toast } = useStore();
  const nav = useNav();
  const [mode, setMode] = useState<'post' | 'event'>('post');
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [style, setStyle] = useState<StyleId>(state.profile?.primary || 'minimalist');
  const [tags, setTags] = useState<string[]>([]);
  const [colours, setColours] = useState<string[]>([]);
  const [location, setLocation] = useState(state.profile?.city || '');
  const [ev, setEv] = useState({ title: '', type: 'Pop-up' as FashionEvent['type'], date: '2026-11-20', time: '19:00', city: state.profile?.city || 'London', venue: '', description: '', price: 'Free' });
  const [evStyles, setEvStyles] = useState<StyleId[]>([state.profile?.primary || 'minimalist']);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (f?: File) => {
    if (!f) return;
    try { setImage(await fileToDataUrl(f)); } catch { toast('Could not read that image'); }
  };
  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const reset = () => { setImage(null); setCaption(''); setTags([]); setColours([]); };

  const publishPost = () => {
    if (!image) return;
    update((s) => ({ ...s, myPosts: [{ id: 'm-' + uid(), creatorId: 'me', image, caption: caption.trim() || 'New look ✨', style, tags: [STYLES[style].label.split(' /')[0].toLowerCase(), ...tags], colours, likes: 0, comments: [], at: new Date().toISOString(), location: location.trim() || undefined }, ...s.myPosts] }));
    toast('Posted to your profile & feed');
    reset();
    nav.setTab('feed');
  };
  const publishEvent = () => {
    if (!ev.title.trim() || !ev.venue.trim()) return;
    const start = `${ev.date}T${ev.time}`;
    const endD = new Date(start); endD.setHours(endD.getHours() + 3);
    const pad = (n: number) => String(n).padStart(2, '0');
    const end = `${endD.getFullYear()}-${pad(endD.getMonth() + 1)}-${pad(endD.getDate())}T${pad(endD.getHours())}:${pad(endD.getMinutes())}`;
    update((s) => ({ ...s, myEvents: [{ id: 'me-' + uid(), title: ev.title.trim(), type: ev.type, hostId: 'me', cover: image || STYLES[evStyles[0] || 'minimalist'].cover, start, end, city: ev.city, venue: ev.venue, address: `${ev.venue}, ${ev.city}`, description: ev.description || 'Details coming soon.', styles: evStyles, interested: 0, price: ev.price || 'Free' }, ...s.myEvents] }));
    toast('Event published to Discover');
    reset();
    nav.setTab('discover');
  };

  return (
    <div className="scroll">
      <TopBar title="Create" />
      <div className="space-y-5 px-4 pb-32 pt-3">
        <Segmented value={mode} onChange={setMode} options={[{ id: 'post', label: 'Share a look' }, { id: 'event', label: 'Promote an event' }]} />

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} data-testid="file-input" />
        <button onClick={() => fileRef.current?.click()} className={`relative flex w-full items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-ink/20 bg-white ${mode === 'post' ? 'aspect-[4/5]' : 'aspect-[16/10]'}`}>
          {image ? (
            <>
              <img src={image} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute bottom-3 right-3 rounded-full bg-paper/90 px-3 py-1.5 text-xs font-semibold">Change photo</span>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper"><Camera size={26} /></div>
              <p className="mt-3 font-serif text-xl">{mode === 'post' ? 'Upload your look' : 'Add a cover image'}</p>
              <p className="mt-1 text-[13px] text-muted">From your camera roll · stays on this device</p>
            </div>
          )}
        </button>

        {mode === 'post' ? (
          <>
            <textarea className="input min-h-[90px] resize-none" placeholder="Write a caption… what are you wearing?" value={caption} onChange={(e) => setCaption(e.target.value)} />
            <div>
              <p className="eyebrow mb-2">Style</p>
              <div className="flex flex-wrap gap-2">
                {STYLE_IDS.map((s) => <button key={s} onClick={() => setStyle(s)} className={`chip ${style === s ? 'chip-on' : ''}`}>{STYLES[s].label.split(' /')[0]}</button>)}
              </div>
            </div>
            <div>
              <p className="eyebrow mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((t) => <button key={t} onClick={() => setTags(toggle(tags, t))} className={`chip ${tags.includes(t) ? 'chip-on' : ''}`}>#{t}</button>)}
              </div>
            </div>
            <div>
              <p className="eyebrow mb-2">Colours</p>
              <div className="flex flex-wrap gap-2">
                {COLOURS.map(([id, l]) => <button key={id} onClick={() => setColours(toggle(colours, id))} className={`chip ${colours.includes(id) ? 'chip-on' : ''}`}>{colours.includes(id) && <Check size={13} />}{l}</button>)}
              </div>
            </div>
            <input className="input" placeholder="Add location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <button className="btn-dark w-full py-4" disabled={!image} onClick={publishPost}>Share look</button>
            {!image && <p className="-mt-3 text-center text-xs text-muted">Add a photo to share</p>}
          </>
        ) : (
          <>
            <input className="input" placeholder="Event name" value={ev.title} onChange={(e) => setEv({ ...ev, title: e.target.value })} />
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {TYPES.map((t) => <button key={t} onClick={() => setEv({ ...ev, type: t })} className={`chip ${ev.type === t ? 'chip-on' : ''}`}>{t}</button>)}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" className="input" value={ev.date} min="2026-10-11" onChange={(e) => setEv({ ...ev, date: e.target.value })} />
              <input type="time" className="input" value={ev.time} onChange={(e) => setEv({ ...ev, time: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input className="input" placeholder="City" value={ev.city} onChange={(e) => setEv({ ...ev, city: e.target.value })} />
              <input className="input" placeholder="Price (e.g. Free)" value={ev.price} onChange={(e) => setEv({ ...ev, price: e.target.value })} />
            </div>
            <input className="input" placeholder="Venue" value={ev.venue} onChange={(e) => setEv({ ...ev, venue: e.target.value })} />
            <textarea className="input min-h-[90px] resize-none" placeholder="What's happening? Line-up, dress code, tickets…" value={ev.description} onChange={(e) => setEv({ ...ev, description: e.target.value })} />
            <div>
              <p className="eyebrow mb-2">Who should see it?</p>
              <div className="flex flex-wrap gap-2">
                {STYLE_IDS.map((s) => <button key={s} onClick={() => setEvStyles(toggle(evStyles, s))} className={`chip ${evStyles.includes(s) ? 'chip-on' : ''}`}>{STYLES[s].label.split(' /')[0]}</button>)}
              </div>
            </div>
            <button className="btn-dark w-full py-4" disabled={!ev.title.trim() || !ev.venue.trim()} onClick={publishEvent}>Publish event</button>
          </>
        )}
      </div>
    </div>
  );
}
