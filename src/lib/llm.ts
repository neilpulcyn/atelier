import type { StyleProfile } from '../types';
import type { Outfit } from './stylist';
import type { WeatherSummary } from './weather';

export async function llmAvailable(): Promise<{ available: boolean; provider?: string }> {
  try {
    const r = await fetch('/api/health', { cache: 'no-store' });
    if (!r.ok) return { available: false };
    const j = await r.json();
    return { available: !!j.llm, provider: j.provider };
  } catch {
    return { available: false };
  }
}

/** Ask the optional LLM proxy to phrase advice; the rule engine's outfit is passed as grounding. */
export async function llmReply(
  history: { role: 'user' | 'assistant'; content: string }[],
  profile: StyleProfile,
  weather: WeatherSummary,
  draft?: Outfit,
): Promise<string | null> {
  try {
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: history.slice(-10), profile, weather, draft }),
    });
    if (!r.ok) return null;
    const j = await r.json();
    return typeof j.text === 'string' && j.text.trim() ? j.text.trim() : null;
  } catch {
    return null;
  }
}
