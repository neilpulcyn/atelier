import { useMemo } from 'react';
import { CREATORS } from '../data/creators';
import { SEED_EVENTS } from '../data/events';
import { SEED_POSTS } from '../data/posts';
import type { Creator, FashionEvent, Post } from '../types';
import { useStore } from './store';

export function useMe(): Creator {
  const { state } = useStore();
  const p = state.profile;
  return {
    id: 'me',
    handle: (p?.name && p.name !== 'You' ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '.') : 'you') + '.atelier',
    name: p?.name || 'You',
    avatar: '',
    city: p?.city || 'London',
    style: p?.primary || 'minimalist',
    bio: '',
    followers: 128 + state.myPosts.length * 17,
    role: 'Fashion lover',
  };
}

export function useAllPosts(): Post[] {
  const { state } = useStore();
  return useMemo(() => {
    const merge = (p: Post): Post => ({ ...p, comments: [...p.comments, ...(state.extraComments[p.id] || [])] });
    return [...state.myPosts, ...SEED_POSTS].map(merge);
  }, [state.myPosts, state.extraComments]);
}

export function useAllEvents(): FashionEvent[] {
  const { state } = useStore();
  return useMemo(() => [...state.myEvents, ...SEED_EVENTS].sort((a, b) => a.start.localeCompare(b.start)), [state.myEvents]);
}

export function useCreator(id: string): Creator | undefined {
  const me = useMe();
  return id === 'me' ? me : CREATORS.find((c) => c.id === id);
}

export const fmtCount = (n: number) => (n >= 1e6 ? (n / 1e6).toFixed(1) + 'm' : n >= 1e4 ? Math.round(n / 1e3) + 'k' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'k' : String(n));
export const timeAgo = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'now';
  if (s < 3600) return Math.floor(s / 60) + 'm';
  if (s < 86400) return Math.floor(s / 3600) + 'h';
  if (s < 86400 * 7) return Math.floor(s / 86400) + 'd';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};
