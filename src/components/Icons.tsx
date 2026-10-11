import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number; filled?: boolean };
const base = (size = 24, p: P) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, ...p });

export const Home = ({ size, filled, ...p }: P) => <svg {...base(size, p)}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill={filled ? 'currentColor' : 'none'} /></svg>;
export const Compass = ({ size, filled, ...p }: P) => <svg {...base(size, p)}><circle cx="12" cy="12" r="9" fill={filled ? 'currentColor' : 'none'} /><path d="m15.5 8.5-2 5-5 2 2-5z" stroke={filled ? '#f7f4ef' : 'currentColor'} /></svg>;
export const Plus = ({ size, ...p }: P) => <svg {...base(size, p)}><path d="M12 5v14M5 12h14" /></svg>;
export const Sparkle = ({ size, filled, ...p }: P) => <svg {...base(size, p)}><path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z" fill={filled ? 'currentColor' : 'none'} /><path d="M19 15.5c.25 1.6 1 2.3 2.5 2.5-1.5.25-2.25 1-2.5 2.5-.25-1.5-1-2.25-2.5-2.5 1.5-.2 2.25-.9 2.5-2.5z" fill={filled ? 'currentColor' : 'none'} /></svg>;
export const User = ({ size, filled, ...p }: P) => <svg {...base(size, p)}><circle cx="12" cy="8" r="4" fill={filled ? 'currentColor' : 'none'} /><path d="M4 21c1.2-4 4.2-6 8-6s6.8 2 8 6" fill={filled ? 'currentColor' : 'none'} /></svg>;
export const Heart = ({ size, filled, ...p }: P) => <svg {...base(size, p)}><path d="M12 20s-7.5-4.6-9.2-9.3C1.7 7.5 3.8 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.2 0 5.3 3 4.2 6.2C19.5 15.4 12 20 12 20z" fill={filled ? 'currentColor' : 'none'} /></svg>;
export const Chat = ({ size, ...p }: P) => <svg {...base(size, p)}><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4A8 8 0 1 1 20 12z" /></svg>;
export const Bookmark = ({ size, filled, ...p }: P) => <svg {...base(size, p)}><path d="M6 3.5h12v17l-6-4-6 4z" fill={filled ? 'currentColor' : 'none'} /></svg>;
export const Send = ({ size, ...p }: P) => <svg {...base(size, p)}><path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" /></svg>;
export const Calendar = ({ size, ...p }: P) => <svg {...base(size, p)}><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>;
export const Pin = ({ size, ...p }: P) => <svg {...base(size, p)}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>;
export const Back = ({ size, ...p }: P) => <svg {...base(size, p)}><path d="M15 5 8 12l7 7" /></svg>;
export const Close = ({ size, ...p }: P) => <svg {...base(size, p)}><path d="M6 6l12 12M18 6 6 18" /></svg>;
export const Camera = ({ size, ...p }: P) => <svg {...base(size, p)}><path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" /><circle cx="12" cy="13.5" r="3.5" /></svg>;
export const Check = ({ size, ...p }: P) => <svg {...base(size, p)}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>;
export const Star = ({ size, filled, ...p }: P) => <svg {...base(size, p)}><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" fill={filled ? 'currentColor' : 'none'} /></svg>;
export const Search = ({ size, ...p }: P) => <svg {...base(size, p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
export const Settings = ({ size, ...p }: P) => <svg {...base(size, p)}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" /></svg>;
export const Grid = ({ size, ...p }: P) => <svg {...base(size, p)}><rect x="3.5" y="3.5" width="7" height="7" /><rect x="13.5" y="3.5" width="7" height="7" /><rect x="3.5" y="13.5" width="7" height="7" /><rect x="13.5" y="13.5" width="7" height="7" /></svg>;
export const Refresh = ({ size, ...p }: P) => <svg {...base(size, p)}><path d="M20 11a8 8 0 0 0-14.6-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5L20 16M20 20v-4h-4" /></svg>;
export const Verified = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path fill="#0b0b0b" d="m12 1.5 2.6 1.9 3.2-.2 1 3 2.7 1.8-.9 3.1.9 3.1-2.7 1.8-1 3-3.2-.2L12 22.5l-2.6-1.9-3.2.2-1-3-2.7-1.8.9-3.1-.9-3.1 2.7-1.8 1-3 3.2.2z" /><path d="m8 12.2 2.7 2.7L16.3 9" stroke="#d4ff3a" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
);
