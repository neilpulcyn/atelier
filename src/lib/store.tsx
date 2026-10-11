import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Comment, FashionEvent, Post, StyleProfile } from '../types';
import type { Outfit } from './stylist';
import type { WeatherSummary } from './weather';

export interface ChatMsg {
  id: string;
  role: 'user' | 'bot';
  text: string;
  outfit?: Outfit;
  weather?: WeatherSummary;
  chips?: string[];
  source?: 'rules' | 'llm';
  at: string;
}

export interface AppState {
  profile: StyleProfile | null;
  likes: string[];
  saved: string[];
  follows: string[];
  rsvp: Record<string, 'interested' | 'going'>;
  myPosts: Post[];
  myEvents: FashionEvent[];
  extraComments: Record<string, Comment[]>;
  chat: ChatMsg[];
  llmMode: boolean;
}

const KEY = 'atelier:v1';
const initial: AppState = {
  profile: null,
  likes: [],
  saved: [],
  follows: ['c2', 'c1'],
  rsvp: {},
  myPosts: [],
  myEvents: [],
  extraComments: {},
  chat: [],
  llmMode: false,
};

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}

interface Ctx {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
  toggleFollow: (id: string) => void;
  setRsvp: (id: string, v: 'interested' | 'going' | null) => void;
  toast: (msg: string) => void;
  toastMsg: string | null;
  reset: () => void;
}

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load);
  const [toastMsg, setToast] = useState<string | null>(null);
  const timer = useRef<number>();

  const toast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      toast('Storage is full — try a smaller image');
    }
  }, [state, toast]);

  const update = useCallback((fn: (s: AppState) => AppState) => setState(fn), []);
  const toggleIn = (arr: string[], id: string) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  const value = useMemo<Ctx>(() => ({
    state,
    update,
    toast,
    toastMsg,
    toggleLike: (id) => setState((s) => ({ ...s, likes: toggleIn(s.likes, id) })),
    toggleSave: (id) => setState((s) => ({ ...s, saved: toggleIn(s.saved, id) })),
    toggleFollow: (id) => setState((s) => ({ ...s, follows: toggleIn(s.follows, id) })),
    setRsvp: (id, v) => setState((s) => {
      const rsvp = { ...s.rsvp };
      if (v) rsvp[id] = v; else delete rsvp[id];
      return { ...s, rsvp };
    }),
    reset: () => { localStorage.removeItem(KEY); localStorage.removeItem('atelier:weather'); setState(initial); },
  }), [state, update, toast, toastMsg]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error('StoreProvider missing');
  return c;
}

export const uid = () => Math.random().toString(36).slice(2, 10);
