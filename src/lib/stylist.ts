import { STYLES } from '../data/styles';
import type { StyleId, StyleProfile } from '../types';
import { COLOUR_FAMILIES, SHOPS, WARDROBE, type Cat, type Piece } from './wardrobe';
import { isSnow, isWet, type WeatherSummary } from './weather';

export interface OutfitItem { label: string; value: string; icon: string }
export interface Outfit {
  title: string;
  occasion: string;
  items: OutfitItem[];
  palette: { name: string; hex: string }[];
  reasoning: string;
  tips: string[];
  effTemp: number;
  day: 'today' | 'tomorrow';
  used?: string[];
}

export interface StylistRequest {
  kind: 'outfit';
  occasion: Occasion;
  day: 'today' | 'tomorrow';
  formalityShift: number;
  focus?: FocusItem;
  weatherFocus?: 'rain' | 'cold' | 'hot';
  seed: number;
  avoid?: string[];
}

export interface StylistReply {
  text: string;
  outfit?: Outfit;
  chips: string[];
  request?: StylistRequest;
}

type Occasion = { key: string; label: string; formality: number; vibe?: string };

const OCCASIONS: { re: RegExp; o: Occasion }[] = [
  { re: /interview/, o: { key: 'interview', label: 'Job interview', formality: 3, vibe: 'polished and confident, nothing distracting' } },
  { re: /wedding|black tie|gala|ball\b/, o: { key: 'wedding', label: 'Wedding / formal', formality: 3, vibe: 'elegant and celebratory (and never white at a wedding)' } },
  { re: /\b(date|romantic dinner)\b/, o: { key: 'date', label: 'Date night', formality: 2, vibe: 'you, turned up a notch' } },
  { re: /dinner|restaurant|drinks/, o: { key: 'dinner', label: 'Dinner & drinks', formality: 2, vibe: 'relaxed but considered' } },
  { re: /party|night out|club|going out|birthday/, o: { key: 'party', label: 'Night out', formality: 2, vibe: 'a little statement, made to move in' } },
  { re: /fashion (show|week)|runway|show\b|gallery|exhibition|event|launch|pop-?up/, o: { key: 'show', label: 'Fashion show / event', formality: 2, vibe: 'a talking point — this crowd notices details' } },
  { re: /gym|run\b|running|workout|yoga|pilates|hike/, o: { key: 'gym', label: 'Active', formality: 0, vibe: 'technical, breathable, layered' } },
  { re: /office|\bwork\b|meeting|presentation|client/, o: { key: 'work', label: 'Work', formality: 2, vibe: 'sharp, comfortable for a long day' } },
  { re: /brunch|coffee|lunch|shopping/, o: { key: 'brunch', label: 'Brunch & errands', formality: 1, vibe: 'easy, put-together' } },
  { re: /travel|airport|flight|\btrain\b|pack|trip|holiday/, o: { key: 'travel', label: 'Travel day', formality: 1, vibe: 'comfortable layers that survive a long journey' } },
  { re: /festival|gig|concert/, o: { key: 'festival', label: 'Festival / gig', formality: 0, vibe: 'expressive, practical for standing all day' } },
  { re: /funeral|memorial/, o: { key: 'funeral', label: 'Funeral', formality: 3, vibe: 'respectful, dark and simple' } },
  { re: /studio|creative/, o: { key: 'creative', label: 'Creative studio', formality: 1, vibe: 'expressive but practical' } },
  { re: /weekend|casual|chill|relax|park|walk/, o: { key: 'weekend', label: 'Weekend', formality: 0, vibe: 'relaxed and effortless' } },
];

interface FocusItem { label: string; cat: Cat; pairs: string[] }
const ITEMS: { re: RegExp; label: string; cat: Cat; pairs: string[] }[] = [
  { re: /white (trainers|sneakers)/, label: 'Your white trainers', cat: 'shoes', pairs: ['straight-leg jeans and a crisp shirt', 'tailored trousers with a fine knit (the smart-casual cheat code)', 'a slip dress and a denim jacket'] },
  { re: /(black )?jeans|denim(?! jacket)/, label: 'Your jeans', cat: 'bottom', pairs: ['a fine merino knit and loafers', 'an oversized blazer and a white tee', 'a silk shirt half-tucked with boots'] },
  { re: /blazer/, label: 'Your blazer', cat: 'outer', pairs: ['a white tee and straight jeans', 'a slip dress for evening', 'matching trousers worn with trainers to dress it down'] },
  { re: /leather jacket/, label: 'Your leather jacket', cat: 'outer', pairs: ['a floaty midi dress (the contrast is the point)', 'a grey hoodie and black jeans', 'a roll-neck and tailored trousers'] },
  { re: /(little )?black dress|lbd/, label: 'Your black dress', cat: 'dress', pairs: ['chunky boots and a leather jacket by day', 'strappy heels and gold jewellery by night', 'a chunky knit over the top and loafers'] },
  { re: /trench/, label: 'Your trench coat', cat: 'outer', pairs: ['a Breton top and straight jeans', 'all-black underneath for contrast', 'a hoodie and trainers for a modern mix'] },
  { re: /midi skirt|slip skirt|skirt/, label: 'Your skirt', cat: 'bottom', pairs: ['a chunky jumper and boots', 'a fitted tee and white trainers', 'a tucked-in shirt and loafers'] },
  { re: /boots/, label: 'Your boots', cat: 'shoes', pairs: ['a midi dress and a long coat', 'straight jeans tucked or cropped just above', 'a knit dress and opaque tights'] },
  { re: /hoodie/, label: 'Your hoodie', cat: 'top', pairs: ['a wool overcoat (a high-low classic)', 'tailored trousers and leather trainers', 'a denim jacket layered over'] },
  { re: /cargo/, label: 'Your cargo trousers', cat: 'bottom', pairs: ['a fitted ribbed top to balance the volume', 'a cropped bomber and trainers', 'a crisp shirt and loafers for contrast'] },
  { re: /linen/, label: 'Your linen trousers', cat: 'bottom', pairs: ['a fitted tank and sandals', 'a matching linen shirt (co-ord season)', 'a striped tee and espadrilles'] },
  { re: /cardigan/, label: 'Your cardigan', cat: 'top', pairs: ['buttoned up as a top with wide trousers', 'over a slip dress', 'with jeans and loafers'] },
  { re: /slip dress/, label: 'Your slip dress', cat: 'dress', pairs: ['a fine roll-neck underneath', 'an oversized blazer and trainers', 'a chunky cardigan and boots'] },
  { re: /loafers/, label: 'Your loafers', cat: 'shoes', pairs: ['cropped straight trousers and white socks', 'a midi skirt and a knit', 'raw denim and an oxford shirt'] },
  { re: /denim jacket|jean jacket/, label: 'Your denim jacket', cat: 'outer', pairs: ['a floral midi dress', 'a grey hoodie underneath', 'black trousers (avoid matching denim unless it\u2019s deliberate)'] },
  { re: /white shirt|shirt/, label: 'Your shirt', cat: 'top', pairs: ['tucked into wide-leg trousers', 'open over a tank with jeans', 'under a knit, collar out'] },
  { re: /roll-?neck|turtle ?neck/, label: 'Your roll-neck', cat: 'top', pairs: ['under a blazer instead of a shirt', 'with a pleated skirt and boots', 'tucked into tailored trousers'] },
  { re: /puffer/, label: 'Your puffer', cat: 'outer', pairs: ['tailored trousers to keep it grown-up', 'a midi skirt and boots', 'all one colour for a sleek look'] },
  { re: /maxi dress/, label: 'Your maxi dress', cat: 'dress', pairs: ['a cropped denim jacket', 'western boots', 'a chunky knit tied at the shoulders'] },
  { re: /graphic tee|t-?shirt|tee\b/, label: 'Your tee', cat: 'top', pairs: ['tucked into a midi skirt', 'under a tailored blazer', 'with baggy jeans and a cap'] },
  { re: /heels/, label: 'Your heels', cat: 'shoes', pairs: ['straight jeans and a blazer', 'a slip dress', 'cropped tailored trousers'] },
];

const COLOUR_PAIRS: Record<string, string[]> = {
  navy: ['camel', 'cream', 'burgundy', 'pale blue', 'grey'],
  black: ['white', 'camel', 'red', 'silver', 'cobalt'],
  white: ['navy', 'black', 'tan', 'denim blue', 'any bright'],
  camel: ['navy', 'black', 'cream', 'chocolate', 'burgundy'],
  beige: ['white', 'navy', 'chocolate', 'olive', 'black'],
  brown: ['cream', 'blue', 'olive', 'rust', 'pink'],
  grey: ['navy', 'blush', 'burgundy', 'white', 'yellow'],
  green: ['cream', 'navy', 'tan', 'pink', 'burgundy'],
  olive: ['cream', 'rust', 'tan', 'navy', 'black'],
  red: ['navy', 'camel', 'pink (be brave)', 'black', 'denim'],
  burgundy: ['navy', 'camel', 'blush', 'olive', 'grey'],
  pink: ['red', 'olive', 'grey', 'brown', 'navy'],
  blue: ['white', 'tan', 'brown', 'orange', 'grey'],
  yellow: ['navy', 'grey', 'white', 'denim', 'lilac'],
  orange: ['navy', 'cream', 'olive', 'cobalt', 'brown'],
  purple: ['grey', 'olive', 'mustard', 'cream', 'black'],
  lilac: ['grey', 'cream', 'yellow', 'olive', 'denim'],
};

// ---------- utilities ----------
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
}
const pick = <T,>(arr: T[], r: () => number) => arr[Math.floor(r() * arr.length) % arr.length];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const styleName = (s: StyleId) => STYLES[s].label.split(' /')[0];

export function effectiveTemp(w: WeatherSummary, p: StyleProfile, day: 'today' | 'tomorrow') {
  let t = day === 'tomorrow' && w.tomorrow
    ? Math.round((w.tomorrow.min + w.tomorrow.max * 2) / 3) - 1
    : Math.round((w.feels + w.max) / 2);
  if (p.runs === 'cold') t -= 3;
  if (p.runs === 'warm') t += 3;
  return t;
}

function weatherFlags(w: WeatherSummary, day: 'today' | 'tomorrow') {
  const code = day === 'tomorrow' && w.tomorrow ? w.tomorrow.code : w.code;
  const rainChance = day === 'tomorrow' && w.tomorrow ? w.tomorrow.rainChance : w.rainChance;
  return {
    rain: rainChance >= 50 || isWet(code) || (day === 'today' && w.precipNow > 0.2),
    maybeRain: rainChance >= 25 && rainChance < 50,
    snow: isSnow(code),
    windy: (day === 'today' ? w.windMax : w.windMax) >= 30,
    sunny: code <= 1,
    rainChance,
  };
}

function paletteFor(p: StyleProfile, gloomy: boolean, r: () => number) {
  const fams = p.colours.length ? p.colours : [];
  const style = STYLES[p.primary].palette.map((c) => ({ name: c.name.toLowerCase(), hex: c.hex }));
  const base = fams.length ? COLOUR_FAMILIES[fams[0]] : style;
  const second = fams.length > 1 ? COLOUR_FAMILIES[fams[1]] : style;
  const out = [base[0], base[1 + Math.floor(r() * 2)]];
  let accent = second.find((c) => !out.some((o) => o.name === c.name)) || style[2];
  if (gloomy) {
    const pop = p.colours.find((c) => c === 'brights' || c === 'jewel' || c === 'pastels');
    if (pop) accent = pick(COLOUR_FAMILIES[pop], r);
  }
  out.push(accent);
  return out;
}

// ---------- the outfit builder ----------
export function buildOutfit(p: StyleProfile, w: WeatherSummary, req: StylistRequest): Outfit {
  const r = rng(req.seed);
  const day = req.day;
  let eff = effectiveTemp(w, p, day);
  const wf = weatherFlags(w, day);
  if (req.weatherFocus === 'cold') eff = Math.min(eff, 6);
  if (req.weatherFocus === 'hot') eff = Math.max(eff, 25);
  const rain = wf.rain || req.weatherFocus === 'rain';
  const formality = Math.max(0, Math.min(3, req.occasion.formality + req.formalityShift));
  const menswear = p.wardrobe === 'menswear';
  const womenswear = p.wardrobe === 'womenswear';
  const palette = paletteFor(p, rain || w.code === 3 || w.code === 45, r);
  const colourNames = [palette[1].name, palette[0].name, palette[2].name, palette[0].name, palette[1].name];
  let colourIdx = 0;
  const fill = (name: string) => name.replace('{c}', () => colourNames[colourIdx++ % colourNames.length]);

  const stylePool = (s: StyleId) => WARDROBE.filter((x) => x.style === s);
  const weights: [StyleId, number][] = req.occasion.key === 'gym'
    ? [['sporty', 1], [p.primary, 0.5]]
    : [[p.primary, 1], [p.secondary, 0.62]];
  const avoid = req.avoid || [];

  const allowed = (x: Piece) => {
    if (menswear && x.flags.includes('w')) return false;
    if (womenswear && x.flags.includes('m')) return false;
    if (p.comfort.includes('flats') && x.flags.includes('h')) return false;
    if (p.comfort.includes('arms') && x.flags.includes('s') && eff < 26) return false;
    if (req.occasion.key === 'gym' && x.cat !== 'acc' && x.cat !== 'outer' && !x.flags.includes('a') && x.style !== 'sporty') return false;
    if (req.occasion.key === 'funeral' && /graphic|volt|tangerine|floral|polka|sequin/i.test(x.name)) return false;
    return true;
  };

  const score = (x: Piece) => {
    let s = 0;
    if (eff >= x.min && eff <= x.max) s += 4; else s -= Math.min(Math.abs(eff - x.min), Math.abs(eff - x.max)) * 0.8;
    if (x.f.includes(formality)) s += 3; else if (x.f.some((f) => Math.abs(f - formality) === 1)) s += 0.5; else s -= 3;
    if (rain && (x.cat === 'shoes' || x.cat === 'outer')) s += x.flags.includes('r') ? (formality >= 3 ? 1 : 3.5) : (formality >= 3 ? 0 : -1);
    if (avoid.includes(x.name)) s -= 3.5;
    if (rain && /suede|satin|canvas|espadrille|sandal|slides/i.test(x.name)) s -= 4;
    if (wf.snow && x.cat === 'shoes' && /boot/i.test(x.name)) s += 3;
    if (p.comfort.includes('waist') && x.flags.includes('t')) s -= 3;
    if (p.comfort.includes('waist') && /drawstring|jogger|wrap|elastic/i.test(x.name)) s += 1;
    if (p.comfort.includes('nowool') && x.flags.includes('o')) s -= 3;
    if (p.comfort.includes('pockets') && x.flags.includes('p')) s += 1;
    if (p.comfort.includes('breathable') && x.flags.includes('l')) s += 1;
    if (p.comfort.includes('heels') && x.flags.includes('h') && formality >= 2) s += 2;
    if (p.fit === 'relaxed' && /oversized|wide|baggy|relaxed|boxy/i.test(x.name)) s += 1;
    if (p.fit === 'tailored' && /tailored|pleated|straight|crisp|structured/i.test(x.name)) s += 1;
    if (p.fit === 'flowy' && /maxi|draped|tiered|flowy|wide|slip/i.test(x.name)) s += 1;
    if (p.fit === 'fitted' && /fitted|ribbed|slim|wrap|seamless/i.test(x.name)) s += 1;
    if (req.occasion.key === 'show' && (x.style === 'avantgarde' || /statement|sculpt/i.test(x.name))) s += 1;
    if (req.occasion.key === 'gym' && x.flags.includes('a')) s += 4;
    if (req.occasion.key === 'travel' && /jogger|knit|trainer|crossbody|sling|overshirt/i.test(x.name)) s += 1.5;
    return s + r() * 3; // jitter for variety
  };

  const choose = (cat: Cat, exclude: string[] = []): Piece | null => {
    let best: Piece | null = null, bestS = -Infinity;
    for (const [style, wt] of weights) {
      for (const x of stylePool(style)) {
        if (x.cat !== cat || !allowed(x) || exclude.includes(x.name)) continue;
        const s = score(x) * wt + (wt === 1 ? 1 : 0);
        if (s > bestS) { bestS = s; best = x; }
      }
    }
    return best;
  };

  const items: OutfitItem[] = [];
  const used: string[] = [];
  const focus = req.focus;

  // Dress or separates?
  const dressLean: Partial<Record<StyleId, number>> = { romantic: 0.6, bohemian: 0.5, minimalist: 0.25, avantgarde: 0.3, vintage: 0.3, classic: 0.3, streetwear: 0.1, sporty: 0.08 };
  let wantDress = !menswear && req.occasion.key !== 'gym' && r() < (dressLean[p.primary] ?? 0.2) + (['wedding', 'date', 'party'].includes(req.occasion.key) ? 0.25 : 0);
  if (focus?.cat === 'dress') wantDress = true;
  if (focus && (focus.cat === 'top' || focus.cat === 'bottom')) wantDress = false;
  const dress = wantDress && focus?.cat !== 'dress' ? choose('dress') : null;
  if (wantDress && (dress || focus?.cat === 'dress')) {
    items.push({ label: 'Dress', icon: '👗', value: focus?.cat === 'dress' ? focus.label : fill(dress!.name) });
    if (dress) used.push(dress.name);
    if (eff < 12) {
      const knit = choose('top');
      if (knit && /knit|jumper|cardigan|roll-neck|polo neck|mohair/i.test(knit.name)) items.push({ label: 'Layer', icon: '🧶', value: `${fill(knit.name)} over the top` });
      if (eff < 9) items.push({ label: 'Legs', icon: '🧦', value: eff < 4 ? 'Thermal opaque tights' : 'Sheer black tights' });
    }
  } else {
    const top = focus?.cat === 'top' ? null : choose('top');
    const bottom = focus?.cat === 'bottom' ? null : choose('bottom');
    items.push({ label: 'Top', icon: '👕', value: focus?.cat === 'top' ? focus.label : top ? fill(top.name) : 'A fine knit in ' + palette[1].name });
    items.push({ label: 'Bottoms', icon: '👖', value: focus?.cat === 'bottom' ? focus.label : bottom ? fill(bottom.name) : 'Straight-leg trousers in ' + palette[0].name });
    if (top) used.push(top.name);
    if (bottom) used.push(bottom.name);
  }

  // Tailoring layer for smart occasions (worn indoors too)
  let jacket: Piece | null = null;
  if (!wantDress && formality >= 2 && ['work', 'interview', 'wedding', 'funeral', 'dinner', 'date'].includes(req.occasion.key) && focus?.cat !== 'outer') {
    const pool = weights.flatMap(([st]) => stylePool(st)).filter((x) => x.cat === 'outer' && /blazer|tailored|suit|dinner jacket|velvet jacket/i.test(x.name) && allowed(x) && x.f.includes(formality));
    jacket = pool.sort((a, b2) => score(b2) - score(a))[0] || null;
    if (jacket) { items.push({ label: 'Tailoring', icon: '🕴️', value: fill(jacket.name) }); used.push(jacket.name); }
  }

  // Outer layer
  const needOuter = (jacket ? eff < 13 || rain : eff < 18 || rain || wf.windy) || focus?.cat === 'outer';
  if (needOuter) {
    if (focus?.cat === 'outer') items.push({ label: 'Outerwear', icon: '🧥', value: focus.label });
    else {
      const outer = choose('outer', jacket ? [jacket.name, ...weights.flatMap(([st]) => stylePool(st)).filter((x) => /blazer|tailored|suit|dinner jacket|velvet jacket/i.test(x.name)).map((x) => x.name)] : []);
      if (outer) { used.push(outer.name); items.push({ label: 'Outerwear', icon: '🧥', value: fill(outer.name) + (rain && !outer.flags.includes('r') ? ' (or swap for a mac if it pours)' : '') }); }
    }
  }

  // Shoes
  if (focus?.cat === 'shoes') items.push({ label: 'Shoes', icon: '👞', value: focus.label });
  else { const shoes = choose('shoes'); if (shoes) { used.push(shoes.name); items.push({ label: 'Shoes', icon: '👞', value: fill(shoes.name) }); } }

  // Accessories: one from style + weather essentials
  const acc: string[] = [];
  const a1 = choose('acc');
  if (a1) { acc.push(fill(a1.name)); used.push(a1.name); }
  const a2 = choose('acc', a1 ? [a1.name] : []);
  if (a2 && r() > 0.4) acc.push(fill(a2.name));
  if (rain) acc.push('compact umbrella');
  if (eff < 6 && !acc.some((a) => /scarf|snood|wrap/i.test(a))) acc.push('warm scarf');
  if (eff < 3) acc.push('leather gloves');
  if ((w.uv >= 4 || (wf.sunny && eff > 16)) && day === 'today' && !acc.some((a) => /sunglasses/i.test(a))) acc.push('sunglasses');
  items.push({ label: 'Accessories', icon: '✨', value: acc.map((a, i) => (i === 0 ? cap(a) : a)).join(', ') });

  // Reasoning
  const tempTxt = day === 'tomorrow' && w.tomorrow
    ? `Tomorrow in ${w.place} looks like ${w.tomorrow.min}–${w.tomorrow.max}°C and ${w.tomorrow.condition.toLowerCase()}${w.tomorrow.rainChance >= 25 ? ` (${w.tomorrow.rainChance}% chance of rain)` : ''}`
    : `It\u2019s ${w.temp}°C in ${w.place} right now (feels like ${w.feels}°C), heading for ${w.max}°C, ${w.condition.toLowerCase()}${wf.rainChance >= 25 ? ` with a ${wf.rainChance}% chance of rain` : ''}${wf.windy ? ` and gusts up to ${w.windMax} km/h` : ''}`;
  const why: string[] = [];
  if (rain) why.push('kept everything rain-proof — no suede, water-resistant layers');
  else if (eff < 8) why.push('built in warmth with proper layers');
  else if (eff < 15) why.push('gone for light layers you can peel off as it warms up');
  else if (eff > 23) why.push('kept it light and breathable');
  if (wf.windy) why.push('avoided anything that\u2019ll blow about');
  if (p.runs === 'cold') why.push('added an extra layer because you run cold');
  if (p.runs === 'warm') why.push('kept it a touch lighter because you run warm');
  if (p.comfort.includes('flats')) why.push('stuck to flats');
  if (p.comfort.includes('arms')) why.push('kept arms covered');
  if (p.comfort.includes('waist')) why.push('chosen easy waistbands');
  const mix = `${styleName(p.primary)} with a ${styleName(p.secondary).toLowerCase()} edge`;
  const reasoning = `${tempTxt}. For ${req.occasion.label.charAt(0).toLowerCase() + req.occasion.label.slice(1)} — ${req.occasion.vibe || 'easy and put-together'}${req.formalityShift > 0 ? ', dressed up a notch' : req.formalityShift < 0 ? ', dressed down' : ''} — I\u2019ve styled your ${mix} in ${palette.map((c) => c.name).join(', ')}${why.length ? ', and ' + why.slice(0, 3).join(', ') : ''}.`;

  const tips: string[] = [];
  if (p.comfort.includes('layers') && needOuter) tips.push('Every layer here comes off easily if the Tube gets warm.');
  if (rain && w.code >= 61) tips.push('Tuck trousers into boots or go cropped so hems stay dry.');
  if (w.uv >= 5 && day === 'today') tips.push(`UV index ${w.uv} today — SPF before you leave.`);
  if (eff >= 8 && eff <= 14 && w.max - w.min >= 6) tips.push(`It swings from ${w.min}° to ${w.max}°, so the outer layer does the heavy lifting.`);
  if (formality >= 3 && req.occasion.key === 'wedding') tips.push('Check the invite for a dress code — this is pitched at smart/formal.');
  tips.push(`Shop the vibe (${p.budget}): ${SHOPS[p.primary][p.budget] || SHOPS[p.primary]['££']}.`);

  const titles: Record<string, string[]> = {
    rain: ['Rain-proof, still chic', 'Drizzle-ready edit', 'Puddle-proof polish'],
    cold: ['Layered & warm', 'Cold-snap uniform', 'Cosy, not frumpy'],
    mild: ['Transitional layers', 'Easy autumn edit', 'Light-layer formula'],
    hot: ['Light & breezy', 'Heatwave-proof', 'Barely-there layers'],
  };
  const band = rain ? 'rain' : eff < 9 ? 'cold' : eff < 19 ? 'mild' : 'hot';
  return {
    title: focus ? `Styling ${focus.label.replace(/^Your /, 'your ')}` : pick(titles[band], r),
    occasion: req.occasion.label,
    items,
    palette,
    reasoning,
    tips: tips.slice(0, 3),
    effTemp: eff,
    day,
    used,
  };
}

// ---------- intent handling ----------
const CHIPS_DEFAULT = ['What should I wear today?', 'Outfit for tomorrow', 'Date night look', 'What goes with jeans?'];

function defaultOccasion(p: StyleProfile, day: 'today' | 'tomorrow'): Occasion {
  const d = new Date(); if (day === 'tomorrow') d.setDate(d.getDate() + 1);
  const weekend = d.getDay() === 0 || d.getDay() === 6;
  if (!weekend && p.occasions.includes('work')) return { key: 'work', label: 'Work', formality: 2, vibe: 'sharp, comfortable for a long day' };
  if (!weekend && p.occasions.includes('creative')) return { key: 'creative', label: 'Creative studio', formality: 1, vibe: 'expressive but practical' };
  return { key: 'weekend', label: weekend ? (d.getDay() === 0 ? 'A Sunday' : 'A Saturday') : 'Everyday', formality: weekend ? 0 : 1, vibe: weekend ? 'relaxed and effortless' : 'easy, put-together' };
}

export function respond(message: string, p: StyleProfile, w: WeatherSummary, last?: StylistRequest): StylistReply {
  const m = message.toLowerCase().trim();
  const seed = Math.floor(Math.random() * 1e9);
  const first = p.name && p.name !== 'You' ? p.name.split(' ')[0] : '';

  const outfitReply = (req: StylistRequest, intro: string): StylistReply => {
    const outfit = buildOutfit(p, w, req);
    req = { ...req, avoid: outfit.used };
    const chips = [
      'Another option',
      req.formalityShift > 0 || req.occasion.formality >= 2 ? 'More casual' : 'Dress it up',
      req.day === 'today' ? 'Outfit for tomorrow' : 'Back to today',
      weatherFlags(w, req.day).rain ? 'What if it stays dry?' : 'What if it rains?',
      req.occasion.key === 'date' ? 'Night out look' : 'Date night look',
    ];
    return { text: intro, outfit, chips, request: req };
  };

  if (!m) return { text: 'Ask me anything about what to wear.', chips: CHIPS_DEFAULT };

  // Rerolls & modifiers on the previous request
  if (last && /another|different|something else|shuffle|other option|try again|don.?t like|not feeling/.test(m)) {
    return outfitReply({ ...last, avoid: last.avoid, seed }, pick(['Here\u2019s a fresh take:', 'Okay — switching it up:', 'How about this instead?'], Math.random));
  }
  if (last && /more casual|dress (it )?down|less formal|relaxed version|chill(er)? version/.test(m)) {
    return outfitReply({ ...last, avoid: [], formalityShift: last.formalityShift - 1, seed }, 'Toned down, still very you:');
  }
  if (last && /dress (it )?up|dressier|smarter|more formal|fancier|elevate/.test(m)) {
    return outfitReply({ ...last, avoid: [], formalityShift: last.formalityShift + 1, seed }, 'Turned up a notch:');
  }
  if (last && /stays dry|no rain|if it.?s dry/.test(m)) {
    return outfitReply({ ...last, weatherFocus: undefined, seed }, 'If the rain holds off, you can lose the waterproofs:');
  }
  if (/back to today/.test(m)) {
    return outfitReply({ ...(last || { kind: 'outfit', formalityShift: 0, seed }), occasion: defaultOccasion(p, 'today'), day: 'today', seed } as StylistRequest, 'Back to today:');
  }

  if (/^(hi|hey|hello|hiya|morning|good (morning|afternoon|evening)|yo)\b[!. ]*$/.test(m)) {
    return { text: `Hey${first ? ' ' + first : ''}! It\u2019s ${w.temp}°C and ${w.condition.toLowerCase()} in ${w.place}. Want me to put together today\u2019s outfit?`, chips: CHIPS_DEFAULT };
  }
  if (/thank|cheers|love it|perfect|amazing|great/.test(m)) {
    return { text: pick(['Any time — you\u2019re going to look great. 🖤', 'My pleasure! Tag #AtelierOOTD if you post it.', 'Love that. Shout if you want an alternative.'], Math.random), chips: ['Outfit for tomorrow', 'Date night look', 'What colours suit my style?'] };
  }
  if (/my style|style profile|who am i|what.?s my style|about me/.test(m)) {
    const s = STYLES[p.primary];
    return { text: `You\u2019re ${s.label} (${p.scores[p.primary]}%) with a ${STYLES[p.secondary].label} streak (${p.scores[p.secondary]}%). ${s.description} Your signature pieces: ${s.keyPieces.slice(0, 3).join(', ').toLowerCase()}. I also remember you prefer a ${p.fit} fit, ${p.budget} budget${p.comfort.length ? ' and ' + p.comfort.length + ' comfort rules' : ''}.`, chips: ['What should I wear today?', 'What colours suit my style?', 'Retake quiz'] };
  }

  const day: 'today' | 'tomorrow' = /tomorrow/.test(m) ? 'tomorrow' : 'today';

  // Colour advice
  if (/colou?r|palette|shade/.test(m)) {
    const named = Object.keys(COLOUR_PAIRS).find((c) => new RegExp(`\\b${c}\\b`).test(m));
    if (named) {
      return { text: `${cap(named)} works beautifully with ${COLOUR_PAIRS[named].slice(0, 4).join(', ')}. For your ${styleName(p.primary).toLowerCase()} style, I\u2019d keep it to ${named} plus one of those, and repeat a colour in your accessories so it looks intentional.`, chips: ['Build me an outfit with that', 'What should I wear today?', 'What colours suit my style?'] };
    }
    const fams = p.colours.length ? p.colours : ['neutrals'];
    const sw = fams.flatMap((f) => COLOUR_FAMILIES[f]).slice(0, 6).map((c) => c.name);
    const gloom = w.code >= 3;
    return { text: `Your core palette: ${sw.join(', ')}. ${STYLES[p.primary].label} looks sharpest in ${STYLES[p.primary].palette.slice(0, 3).map((c) => c.name.toLowerCase()).join(', ')}. ${gloom ? `It\u2019s ${w.condition.toLowerCase()} today, so one pop near your face (scarf, knit or lip) will lift the whole look.` : 'With today\u2019s light, tonal dressing will look really rich.'}`, chips: ['What should I wear today?', 'What goes with navy?', 'Another option'] };
  }

  // Pairing / styling a specific item
  const item = ITEMS.find((i) => i.re.test(m));
  if (item && /goes? with|go with|style|pair|wear with|match|team|how (do|should|can) i wear/.test(m)) {
    const req: StylistRequest = { kind: 'outfit', occasion: OCCASIONS.find((o) => o.re.test(m))?.o || defaultOccasion(p, day), day, formalityShift: 0, focus: { label: item.label, cat: item.cat, pairs: item.pairs }, seed };
    return outfitReply(req, `Three ways I\u2019d wear it: ${item.pairs.map((x, i) => `${i + 1}) ${x}`).join('; ')}. Here\u2019s the one I\u2019d pick for you today:`);
  }

  // Weather questions
  const weatherFocus: StylistRequest['weatherFocus'] = /rain|wet|umbrella|drizzle|storm|shower/.test(m) ? 'rain' : /\bcold\b|freezing|chilly|frost|snow|warm enough/.test(m) ? 'cold' : /\bhot\b|heat|heatwave|sweat|humid|scorch/.test(m) ? 'hot' : undefined;
  if (/weather|forecast|temperature/.test(m) && !/wear|outfit/.test(m)) {
    const t = w.tomorrow;
    return { text: `${w.icon} ${w.place}: ${w.temp}°C now (feels ${w.feels}°C), ${w.min}–${w.max}°C today, ${w.condition.toLowerCase()}, ${w.rainChance}% chance of rain, wind ${w.wind} km/h.${t ? ` Tomorrow: ${t.min}–${t.max}°C, ${t.condition.toLowerCase()}, ${t.rainChance}% rain.` : ''} Want an outfit for it?`, chips: ['What should I wear today?', 'Outfit for tomorrow'] };
  }

  const occ = OCCASIONS.find((o) => o.re.test(m))?.o;
  const asksOutfit = /wear|outfit|ootd|dress|look|style me|put together|fit check|what (do|should) i|suggest|recommend|pack/.test(m);

  if (occ || asksOutfit || weatherFocus) {
    const occasion = occ || defaultOccasion(p, day);
    const req: StylistRequest = { kind: 'outfit', occasion, day, formalityShift: 0, weatherFocus, seed };
    const wf = weatherFlags(w, day);
    let intro: string;
    if (weatherFocus === 'rain') intro = wf.rain ? `Good call — rain is likely (${wf.rainChance}%). Here\u2019s a rain-proof look:` : `Only a ${wf.rainChance}% chance of rain ${day}, but here\u2019s a back-up plan that copes with a downpour:`;
    else if (weatherFocus === 'cold') intro = `For a cold one, warmth first — without losing your ${styleName(p.primary).toLowerCase()} lines:`;
    else if (weatherFocus === 'hot') intro = 'For heat, breathable fabrics and loose shapes:';
    else if (occ) intro = `${occ.label}${day === 'tomorrow' ? ' tomorrow' : ''}? Love it. Here\u2019s what I\u2019d put you in:`;
    else intro = day === 'tomorrow' ? `Here\u2019s tomorrow\u2019s outfit${first ? ', ' + first : ''}:` : `Morning${first ? ' ' + first : ''}! Here\u2019s your outfit of the day:`;
    if (/pack|trip|holiday/.test(m)) intro += ' (For packing: pick a 3-colour palette like this one and everything mixes.)';
    return outfitReply(req, intro);
  }

  if (item) {
    return outfitReply({ kind: 'outfit', occasion: defaultOccasion(p, day), day, formalityShift: 0, focus: { label: item.label, cat: item.cat, pairs: item.pairs }, seed }, `Ah, ${item.label.replace(/^Your /, 'your ').toLowerCase()} — great piece. Try it with ${item.pairs[0]}, or here\u2019s a full look built around it:`);
  }

  return {
    text: `I\u2019m your stylist, so I\u2019m best at outfits! Try asking “What should I wear today?”, “What to wear to a wedding?”, “What goes with my leather jacket?” or “What colours suit me?”. I\u2019ll factor in your ${styleName(p.primary)} style and the weather in ${w.place}.`,
    chips: CHIPS_DEFAULT,
  };
}

export function greeting(p: StyleProfile, w: WeatherSummary): StylistReply {
  const first = p.name && p.name !== 'You' ? ' ' + p.name.split(' ')[0] : '';
  return {
    text: `Hi${first}, I\u2019m Edie, your Atelier stylist. I know you\u2019re ${STYLES[p.primary].label} with a ${STYLES[p.secondary].label.toLowerCase()} streak, and it\u2019s ${w.temp}°C and ${w.condition.toLowerCase()} in ${w.place} ${w.icon}. What are we dressing for?`,
    chips: ['What should I wear today?', 'Outfit for tomorrow', 'What to wear to a fashion show?', 'What if it rains?'],
  };
}
