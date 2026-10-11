import { useCallback, useMemo, useState } from 'react';
import { Compass, Home, Plus, Sparkle, User } from './components/Icons';
import { NavCtx, type Nav, type Overlay, type Tab } from './lib/nav';
import { useStore } from './lib/store';
import { Create } from './screens/Create';
import { Discover } from './screens/Discover';
import { Feed } from './screens/Feed';
import { Onboarding } from './screens/Onboarding';
import { CommentsSheet, CreatorScreen, EventScreen } from './screens/Overlays';
import { Profile } from './screens/Profile';
import { StyleResult } from './screens/StyleResult';
import { Stylist } from './screens/Stylist';

export default function App() {
  const { state, update, toastMsg } = useStore();
  const [tab, setTabState] = useState<Tab>('feed');
  const [stack, setStack] = useState<Overlay[]>([]);
  const [pending, setPending] = useState<string | null>(null);

  const setTab = useCallback((t: Tab) => { setStack([]); setTabState(t); }, []);
  const nav: Nav = useMemo(() => ({
    tab,
    setTab,
    open: (o) => setStack((s) => [...s, o]),
    close: () => setStack((s) => s.slice(0, -1)),
    askStylist: (q) => { setPending(q); setStack([]); setTabState('stylist'); },
  }), [tab, setTab]);

  if (!state.profile) {
    return (
      <div className="app-shell">
        <Onboarding onDone={(p) => { update((s) => ({ ...s, profile: p })); setTabState('feed'); }} />
        <Toast msg={toastMsg} />
      </div>
    );
  }

  const top = stack[stack.length - 1];
  const tabs: { id: Tab; label: string; icon: (on: boolean) => JSX.Element }[] = [
    { id: 'feed', label: 'Feed', icon: (on) => <Home size={25} filled={on} /> },
    { id: 'discover', label: 'Discover', icon: (on) => <Compass size={25} filled={on} /> },
    { id: 'create', label: 'Create', icon: () => <span className="flex h-9 w-12 items-center justify-center rounded-2xl bg-ink text-paper"><Plus size={22} strokeWidth={2.2} /></span> },
    { id: 'stylist', label: 'Stylist', icon: (on) => <Sparkle size={25} filled={on} /> },
    { id: 'profile', label: 'Profile', icon: (on) => <User size={25} filled={on} /> },
  ];

  return (
    <NavCtx.Provider value={nav}>
      <div className="app-shell">
        <main className="h-full">
          {tab === 'feed' && <Feed />}
          {tab === 'discover' && <Discover />}
          {tab === 'create' && <Create />}
          {tab === 'stylist' && <Stylist pending={pending} clearPending={() => setPending(null)} />}
          {tab === 'profile' && <Profile />}
        </main>

        {stack.map((o, i) => {
          const isTop = i === stack.length - 1;
          if (o.type === 'comments') return isTop ? <CommentsSheet key={i} id={o.id} /> : null;
          return (
            <div key={i} className={`absolute inset-0 z-40 bg-paper ${isTop ? '' : 'hidden'}`}>
              {o.type === 'creator' && <CreatorScreen id={o.id} />}
              {o.type === 'event' && <EventScreen id={o.id} />}
              {o.type === 'result' && <StyleResult profile={state.profile!} cta="Ask Edie for today’s outfit" onBack={nav.close} onContinue={() => nav.askStylist('What should I wear today?')} onRetake={() => nav.open({ type: 'quiz' })} />}
              {o.type === 'quiz' && <Onboarding initial={state.profile} onCancel={nav.close} onDone={(p) => { update((s) => ({ ...s, profile: p, chat: [] })); setStack([]); setTabState('feed'); }} />}
            </div>
          );
        })}

        {(!top || (top.type !== 'quiz' && top.type !== 'result')) && (
          <nav className="pb-safe absolute inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-paper/95 backdrop-blur-md">
            <div className="flex h-[64px] items-stretch">
              {tabs.map((t) => {
                const on = tab === t.id && !top;
                return (
                  <button key={t.id} onClick={() => setTab(t.id)} aria-label={t.label} className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition ${on ? 'text-ink' : 'text-ink/45'}`}>
                    {t.icon(on)}
                    {t.id !== 'create' && <span className={`text-[10px] font-semibold ${on ? '' : 'opacity-80'}`}>{t.label}</span>}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
        <Toast msg={toastMsg} />
      </div>
    </NavCtx.Provider>
  );
}

function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 top-16 z-[60] flex justify-center px-6">
      <div className="animate-fadeUp rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-paper shadow-xl">{msg}</div>
    </div>
  );
}
