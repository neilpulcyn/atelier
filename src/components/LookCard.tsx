import { STYLES } from '../data/styles';
import type { Look } from '../types';

export function LookCard({ look, onClick, wide = false }: { look: Look; onClick: () => void; wide?: boolean }) {
  return (
    <button onClick={onClick} className={`group relative shrink-0 overflow-hidden rounded-2xl bg-bone text-left ${wide ? 'aspect-[3/4] w-full' : 'h-[220px] w-[150px]'}`}>
      <img src={look.image} alt={look.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-active:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-accent">{STYLES[look.style].label.split(' /')[0]} · {look.price}</p>
        <p className="mt-1 font-serif text-[16px] leading-tight">{look.title}</p>
        <p className="mt-1 text-[11px] text-white/70">{look.pieces.length} pieces · {look.occasion}</p>
      </div>
    </button>
  );
}
