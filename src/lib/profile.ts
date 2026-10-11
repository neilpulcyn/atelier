import { QUIZ, type Weights } from '../data/quiz';
import { STYLE_IDS } from '../data/styles';
import type { Post, StyleId, StyleProfile, Wardrobe, Look, FashionEvent } from '../types';

export type Answers = Record<string, string[]>;

export function scoreAnswers(a: Answers): Record<StyleId, number> {
  const raw = Object.fromEntries(STYLE_IDS.map((s) => [s, 1])) as Record<StyleId, number>;
  for (const step of QUIZ) {
    const picked = a[step.id] || [];
    for (const opt of step.options || []) {
      if (!picked.includes(opt.id) || !opt.w) continue;
      for (const [k, v] of Object.entries(opt.w as Weights)) raw[k as StyleId] += v as number;
    }
  }
  const total = Object.values(raw).reduce((x, y) => x + y, 0);
  const pct = Object.fromEntries(STYLE_IDS.map((s) => [s, Math.round((raw[s] / total) * 100)])) as Record<StyleId, number>;
  return pct;
}

export function buildProfile(a: Answers, name: string, city: string): StyleProfile {
  const scores = scoreAnswers(a);
  const ranked = [...STYLE_IDS].sort((x, y) => scores[y] - scores[x]);
  return {
    name: name.trim() || 'You',
    wardrobe: ((a.intro || [])[0] as Wardrobe) || 'both',
    primary: ranked[0],
    secondary: ranked[1],
    scores,
    colours: a.colours || [],
    fit: (a.fit || [])[0] || 'relaxed',
    occasions: a.occasions || [],
    budget: (a.budget || [])[0] || '££',
    comfort: a.comfort || [],
    runs: ((a.location || [])[0] as StyleProfile['runs']) || 'neutral',
    city: city.trim() || 'London',
    completedAt: new Date().toISOString(),
  };
}

/** Personalised ranking: style affinity + colour match + follows + freshness + popularity. */
export function rankPosts(posts: Post[], p: StyleProfile | null, follows: string[]): { post: Post; score: number; reason: string | null }[] {
  const now = Date.now();
  return posts
    .map((post) => {
      const affinity = p ? (p.scores[post.style] || 0) / 100 : 0.125;
      const colour = p ? post.colours.filter((c) => p.colours.includes(c)).length : 0;
      const followed = follows.includes(post.creatorId) ? 1 : 0;
      const ageDays = (now - new Date(post.at).getTime()) / 86400000;
      const fresh = Math.exp(-ageDays / 6);
      const pop = Math.log10(post.likes + 10) / 4;
      const mine = post.creatorId === 'me' ? 2 : 0;
      const score = affinity * 5 + colour * 0.35 + followed * 0.6 + fresh * 0.9 + pop * 0.4 + mine;
      let reason: string | null = null;
      if (p && post.style === p.primary) reason = 'Matches your style';
      else if (p && post.style === p.secondary) reason = 'Your secondary style';
      else if (colour > 0) reason = 'Your colours';
      else if (followed) reason = 'You follow';
      return { post, score, reason };
    })
    .sort((a, b) => b.score - a.score);
}

export function rankLooks(looks: Look[], p: StyleProfile | null, tempBand?: 'cold' | 'mild' | 'warm') {
  return looks
    .map((l) => {
      let s = p ? (p.scores[l.style] || 0) : 10;
      if (tempBand && (l.temp === tempBand || l.temp === 'any')) s += 12;
      if (p && l.price === p.budget) s += 6;
      return { l, s };
    })
    .sort((a, b) => b.s - a.s)
    .map((x) => x.l);
}

export function rankEvents(events: FashionEvent[], p: StyleProfile | null) {
  return [...events].sort((a, b) => {
    const sa = p ? a.styles.reduce((t, s) => t + (p.scores[s] || 0), 0) + (a.city === p.city ? 20 : 0) : 0;
    const sb = p ? b.styles.reduce((t, s) => t + (p.scores[s] || 0), 0) + (b.city === p.city ? 20 : 0) : 0;
    return sb - sa || a.start.localeCompare(b.start);
  });
}
