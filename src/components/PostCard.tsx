import { useRef, useState } from 'react';
import { useCreator, fmtCount, timeAgo } from '../lib/data';
import { useNav } from '../lib/nav';
import { useStore } from '../lib/store';
import type { Post } from '../types';
import { Bookmark, Chat, Heart, Send } from './Icons';
import { Avatar, Name, StyleTag } from './ui';

export function PostCard({ post, reason }: { post: Post; reason?: string | null }) {
  const c = useCreator(post.creatorId);
  const { state, toggleLike, toggleSave, toggleFollow, toast } = useStore();
  const nav = useNav();
  const liked = state.likes.includes(post.id);
  const saved = state.saved.includes(post.id);
  const following = state.follows.includes(post.creatorId);
  const [burst, setBurst] = useState(0);
  const lastTap = useRef(0);

  const onImageTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!liked) toggleLike(post.id);
      setBurst((b) => b + 1);
    }
    lastTap.current = now;
  };
  const share = async () => {
    const text = `${c?.name} on Atelier: ${post.caption}`;
    try {
      if (navigator.share) await navigator.share({ title: 'Atelier', text });
      else { await navigator.clipboard?.writeText(text); toast('Copied to clipboard'); }
    } catch { /* cancelled */ }
  };

  return (
    <article className="animate-fadeUp pb-5">
      <header className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => post.creatorId !== 'me' && nav.open({ type: 'creator', id: post.creatorId })} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <Avatar c={c} size={36} />
          <div className="min-w-0">
            <Name c={c} className="text-[14px] font-semibold" />
            <p className="truncate text-[12px] text-muted">{post.location || c?.city}</p>
          </div>
        </button>
        {post.creatorId !== 'me' && !following && (
          <button onClick={() => { toggleFollow(post.creatorId); toast(`Following ${c?.handle}`); }} className="rounded-full border border-ink/20 px-3.5 py-1.5 text-[12px] font-semibold active:bg-ink active:text-paper">Follow</button>
        )}
      </header>
      <div className="relative aspect-[4/5] select-none overflow-hidden bg-bone" onClick={onImageTap}>
        <img src={post.image} alt={post.caption} loading="lazy" className="h-full w-full object-cover" draggable={false} />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <StyleTag s={post.style} />
          {reason && <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">{reason}</span>}
        </div>
        {burst > 0 && (
          <div key={burst} className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Heart size={96} filled className="animate-pop text-white drop-shadow-xl" strokeWidth={0} />
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 px-4 pt-3">
        <button onClick={() => toggleLike(post.id)} aria-label="Like" className={`transition active:scale-90 ${liked ? 'text-[#e0245e]' : ''}`}><Heart size={26} filled={liked} /></button>
        <button onClick={() => nav.open({ type: 'comments', id: post.id })} aria-label="Comments"><Chat size={25} /></button>
        <button onClick={share} aria-label="Share"><Send size={24} /></button>
        <button onClick={() => { toggleSave(post.id); if (!saved) toast('Saved to your collection'); }} aria-label="Save" className="ml-auto transition active:scale-90"><Bookmark size={25} filled={saved} /></button>
      </div>
      <div className="space-y-1 px-4 pt-2 text-[14px] leading-snug">
        <p className="font-semibold">{fmtCount(post.likes + (liked ? 1 : 0))} likes</p>
        <p><span className="mr-1.5 font-semibold">{c?.handle}</span>{post.caption}</p>
        <p className="text-[13px] text-ink/50">{post.tags.map((t) => '#' + t.replace(/\s+/g, '')).join(' ')}</p>
        {post.comments.length > 0 && (
          <button onClick={() => nav.open({ type: 'comments', id: post.id })} className="text-[13px] text-muted">View all {post.comments.length} comments</button>
        )}
        <p className="text-[11px] uppercase tracking-wider text-ink/40">{timeAgo(post.at)}</p>
      </div>
    </article>
  );
}
