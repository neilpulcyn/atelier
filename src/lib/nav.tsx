import { createContext, useContext } from 'react';

export type Tab = 'feed' | 'discover' | 'create' | 'stylist' | 'profile';
export type Overlay =
  | { type: 'creator'; id: string }
  | { type: 'event'; id: string }
  | { type: 'comments'; id: string }
  | { type: 'result' }
  | { type: 'quiz' };

export interface Nav {
  tab: Tab;
  setTab: (t: Tab) => void;
  open: (o: Overlay) => void;
  close: () => void;
  askStylist: (q: string) => void;
}

export const NavCtx = createContext<Nav | null>(null);
export const useNav = () => {
  const n = useContext(NavCtx);
  if (!n) throw new Error('nav missing');
  return n;
};
