import { useCallback, useEffect, useRef, useState } from 'react';
import { Refresh, Send, Sparkle } from '../components/Icons';
import { OutfitCard } from '../components/OutfitCard';
import { llmAvailable, llmReply } from '../lib/llm';
import { useNav } from '../lib/nav';
import { uid, useStore, type ChatMsg } from '../lib/store';
import { greeting, respond, type StylistRequest } from '../lib/stylist';
import { getWeather, type WeatherSummary } from '../lib/weather';

export function Stylist({ pending, clearPending }: { pending: string | null; clearPending: () => void }) {
  const { state, update } = useStore();
  const nav = useNav();
  const p = state.profile!;
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [loadingW, setLoadingW] = useState(true);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const [llm, setLlm] = useState<{ available: boolean; provider?: string }>({ available: false });
  const lastReq = useRef<StylistRequest | undefined>(undefined);
  const bottom = useRef<HTMLDivElement>(null);
  const chat = state.chat;

  const loadWeather = useCallback(async (force = false) => {
    setLoadingW(true);
    const w = await getWeather(p.city, { force });
    setWeather(w);
    setLoadingW(false);
    return w;
  }, [p.city]);

  useEffect(() => { loadWeather(); llmAvailable().then(setLlm); }, [loadWeather]);

  useEffect(() => {
    if (weather && state.chat.length === 0) {
      const g = greeting(p, weather);
      update((s) => (s.chat.some((m) => m.role === 'bot') ? s : { ...s, chat: [{ id: uid(), role: 'bot', text: g.text, chips: g.chips, at: new Date().toISOString(), weather }, ...s.chat] }));
    }
  }, [weather]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [chat.length, typing]);

  const send = useCallback(async (q: string) => {
    const msg = q.trim();
    if (!msg || !weather) return;
    if (/^retake quiz$/i.test(msg)) { nav.open({ type: 'quiz' }); return; }
    const userMsg: ChatMsg = { id: uid(), role: 'user', text: msg, at: new Date().toISOString() };
    update((s) => ({ ...s, chat: [...s.chat, userMsg] }));
    setText('');
    setTyping(true);
    const reply = respond(msg, p, weather, lastReq.current);
    if (reply.request) lastReq.current = reply.request;
    let textOut = reply.text;
    let source: ChatMsg['source'] = 'rules';
    if (state.llmMode && llm.available) {
      const history = [...state.chat, userMsg].slice(-8).map((m) => ({ role: m.role === 'user' ? 'user' as const : 'assistant' as const, content: m.text }));
      const t = await llmReply(history, p, weather, reply.outfit);
      if (t) { textOut = t; source = 'llm'; }
    } else {
      await new Promise((r) => setTimeout(r, 650 + Math.random() * 500));
    }
    setTyping(false);
    update((s) => ({ ...s, chat: [...s.chat, { id: uid(), role: 'bot', text: textOut, outfit: reply.outfit, chips: reply.chips, at: new Date().toISOString(), source }] }));
  }, [weather, p, update, state.llmMode, state.chat, llm.available, nav]);

  useEffect(() => {
    if (pending && weather && !typing) { clearPending(); send(pending); }
  }, [pending, weather]); // eslint-disable-line react-hooks/exhaustive-deps

  const lastBot = [...chat].reverse().find((m) => m.role === 'bot');
  const chips = lastBot?.chips || [];

  return (
    <div className="flex h-full flex-col bg-paper">
      <div className="pt-safe z-20 border-b border-ink/5 bg-paper/95 backdrop-blur">
        <div className="flex h-16 items-center gap-3 px-4">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-ink text-accent">
            <Sparkle size={20} filled />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-paper bg-[#22c55e]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-[19px] leading-none">Edie <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-muted">· AI stylist</span></p>
            <p className="mt-1 truncate text-[11px] text-muted">{state.llmMode && llm.available ? `LLM mode (${llm.provider})` : 'Knows your style & today\u2019s weather'}</p>
          </div>
          <button onClick={() => loadWeather(true)} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold shadow-sm" aria-label="Refresh weather">
            {loadingW ? <Refresh size={14} className="animate-spin" /> : <span>{weather?.icon}</span>}
            {weather ? `${weather.temp}° ${weather.place.split(',')[0]}` : 'Weather…'}
          </button>
        </div>
        {weather && (
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2.5 text-[11px] text-muted">
            <span className="shrink-0">{weather.condition}</span>
            <span className="shrink-0">H {weather.max}° · L {weather.min}°</span>
            <span className="shrink-0">Feels {weather.feels}°</span>
            <span className="shrink-0">☔ {weather.rainChance}%</span>
            <span className="shrink-0">💨 {weather.wind} km/h</span>
            <span className="shrink-0">UV {weather.uv}</span>
            <span className="shrink-0">{weather.source === 'geolocation' ? '📍 Live location' : weather.source === 'city' ? '🏙️ Home city' : '⚠️ Offline estimate'}</span>
          </div>
        )}
      </div>

      <div className="scroll flex-1 px-4 py-4">
        <div className="space-y-3">
          {chat.map((m) => (
            <div key={m.id} className={`flex animate-fadeUp ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] space-y-2 ${m.role === 'user' ? 'items-end' : ''}`}>
                <div className={`rounded-[22px] px-4 py-2.5 text-[14.5px] leading-relaxed ${m.role === 'user' ? 'rounded-br-md bg-ink text-paper' : 'rounded-bl-md bg-white text-ink shadow-sm'}`}>
                  {m.text}
                </div>
                {m.outfit && <OutfitCard o={m.outfit} />}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex">
              <div className="flex gap-1 rounded-[22px] rounded-bl-md bg-white px-4 py-3.5 shadow-sm">
                {[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 animate-blink rounded-full bg-ink" style={{ animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </div>
          )}
          {!weather && <p className="py-10 text-center text-sm text-muted">Checking the weather in {p.city}…</p>}
          <div ref={bottom} className="h-1" />
        </div>
      </div>

      <div className="border-t border-ink/5 bg-paper pb-[84px]">
        {chips.length > 0 && !typing && (
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pt-3">
            {chips.map((c) => <button key={c} onClick={() => send(c)} className="chip !py-1.5 !text-[12.5px]">{c}</button>)}
          </div>
        )}
        <form className="flex items-center gap-2 px-4 pt-3" onSubmit={(e) => { e.preventDefault(); send(text); }}>
          <input className="input !rounded-full !py-3" placeholder="Ask Edie what to wear…" value={text} onChange={(e) => setText(e.target.value)} aria-label="Message" />
          <button type="submit" disabled={!text.trim() || typing} className="rounded-full bg-ink p-3 text-paper disabled:opacity-30" aria-label="Send"><Send size={20} /></button>
        </form>
        <div className="flex items-center justify-between px-5 pt-2 text-[10px] text-muted">
          <button onClick={() => { lastReq.current = undefined; update((s) => ({ ...s, chat: [] })); }}>Clear chat</button>
          {llm.available ? (
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={state.llmMode} onChange={(e) => update((s) => ({ ...s, llmMode: e.target.checked }))} /> Use LLM</label>
          ) : (
            <span>Built-in stylist engine · works offline</span>
          )}
        </div>
      </div>
    </div>
  );
}
