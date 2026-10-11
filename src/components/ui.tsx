import type { ReactNode } from 'react';
import { STYLES } from '../data/styles';
import type { Creator, StyleId } from '../types';
import { Back, Close, Verified } from './Icons';

export function Avatar({ c, size = 36, ring = false }: { c?: Creator; size?: number; ring?: boolean }) {
  const style = { width: size, height: size };
  const inner = c?.avatar ? (
    <img src={c.avatar} alt={c.name} className="h-full w-full rounded-full object-cover" />
  ) : (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-ink font-serif italic text-paper" style={{ fontSize: size * 0.42 }}>
      {(c?.name || 'Y').charAt(0)}
    </div>
  );
  return ring ? (
    <div className="shrink-0 rounded-full bg-gradient-to-tr from-accent via-ink to-ink p-[2px]" style={{ width: size + 4, height: size + 4 }}>
      <div className="h-full w-full rounded-full bg-paper p-[2px]">{inner}</div>
    </div>
  ) : (
    <div className="shrink-0" style={style}>{inner}</div>
  );
}

export function Name({ c, className = '' }: { c?: Creator; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {c?.handle}
      {c?.verified && <Verified size={13} />}
    </span>
  );
}

export function StyleTag({ s, dark = false }: { s: StyleId; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${dark ? 'bg-ink text-paper' : 'bg-bone text-ink'}`}>
      {STYLES[s].label.split(' /')[0]}
    </span>
  );
}

export function TopBar({ title, onBack, right, serif = true }: { title: ReactNode; onBack?: () => void; right?: ReactNode; serif?: boolean }) {
  return (
    <div className="pt-safe sticky top-0 z-20 border-b border-ink/5 bg-paper/90 backdrop-blur-md">
      <div className="flex h-14 items-center gap-2 px-4">
        {onBack && (
          <button onClick={onBack} aria-label="Back" className="-ml-2 rounded-full p-2 active:bg-ink/5">
            <Back size={22} />
          </button>
        )}
        <div className={`flex-1 truncate ${serif ? 'font-serif text-[22px] italic' : 'text-[15px] font-semibold'}`}>{title}</div>
        {right}
      </div>
    </div>
  );
}

export function Sheet({ children, onClose, title }: { children: ReactNode; onClose: () => void; title?: string }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 animate-fadeUp bg-black/45" onClick={onClose} />
      <div className="relative flex max-h-[82%] animate-slideUp flex-col rounded-t-[28px] bg-paper">
        <div className="flex items-center justify-between px-5 pb-2 pt-3">
          <div className="mx-auto h-1 w-10 rounded-full bg-ink/15" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 pb-3">
            <h3 className="font-serif text-xl">{title}</h3>
            <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 active:bg-ink/5"><Close size={20} /></button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-full bg-bone p-1">
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)} className={`flex-1 rounded-full py-2 text-[13px] font-semibold transition ${value === o.id ? 'bg-ink text-paper shadow' : 'text-ink/60'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-serif italic tracking-tight ${className}`}>
      Atelier<span className="text-accent drop-shadow-[0_0_1px_rgba(0,0,0,0.6)]">.</span>
    </span>
  );
}
