// Tiny zero-dependency server: serves the production build (dist/) and an OPTIONAL LLM proxy.
// The API key never reaches the browser. With no key set, /api/health reports llm:false and the
// app uses its built-in rule-based stylist.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');
const PORT = Number(process.env.PORT || 4173);

const provider = process.env.OPENAI_API_KEY ? 'openai' : process.env.XAI_API_KEY ? 'xai' : process.env.ANTHROPIC_API_KEY ? 'anthropic' : null;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon' };

function systemPrompt({ profile, weather, draft }) {
  return [
    'You are Edie, the warm, concise personal stylist inside the Atelier fashion app (UK English).',
    `User style profile: ${JSON.stringify(profile)}`,
    `Live weather: ${JSON.stringify(weather)}`,
    draft ? `A rule-based engine proposed this outfit (use it as the basis unless the user asks otherwise): ${JSON.stringify(draft)}` : '',
    'Always reference the actual weather and their style. Respect comfort preferences (e.g. no heels if they want flats). Keep replies under 120 words; no markdown headings.',
  ].join('\n');
}

async function callLLM(body) {
  const sys = systemPrompt(body);
  const history = (body.history || []).filter((m) => m && typeof m.content === 'string').slice(-10);
  if (provider === 'anthropic') {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: process.env.LLM_MODEL || 'claude-3-5-haiku-latest', max_tokens: 400, system: sys, messages: history }),
    });
    const j = await r.json();
    return j.content?.[0]?.text;
  }
  const base = provider === 'xai' ? 'https://api.x.ai/v1' : 'https://api.openai.com/v1';
  const key = provider === 'xai' ? process.env.XAI_API_KEY : process.env.OPENAI_API_KEY;
  const model = process.env.LLM_MODEL || (provider === 'xai' ? 'grok-3-mini' : 'gpt-4o-mini');
  const r = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, max_tokens: 400, messages: [{ role: 'system', content: sys }, ...history] }),
  });
  const j = await r.json();
  return j.choices?.[0]?.message?.content;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, llm: !!provider, provider }));
  }
  if (url.pathname === '/api/chat' && req.method === 'POST') {
    if (!provider) { res.writeHead(404, { 'content-type': 'application/json' }); return res.end('{"error":"no llm configured"}'); }
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > 200_000) req.destroy(); });
    req.on('end', async () => {
      try {
        const text = await callLLM(JSON.parse(raw));
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ text: text || '' }));
      } catch (e) {
        res.writeHead(502, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: 'llm failed' }));
      }
    });
    return;
  }
  // static
  let file = path.normalize(path.join(DIST, decodeURIComponent(url.pathname)));
  if (!file.startsWith(DIST)) { res.writeHead(403); return res.end(); }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, 'index.html');
  const ext = path.extname(file);
  const headers = { 'content-type': MIME[ext] || 'application/octet-stream' };
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/img/')) headers['cache-control'] = 'public, max-age=31536000, immutable';
  res.writeHead(200, headers);
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => console.log(`Atelier running on http://localhost:${PORT} (LLM: ${provider || 'off — rule-based stylist'})`));
