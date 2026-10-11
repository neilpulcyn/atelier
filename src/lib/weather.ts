export interface WeatherSummary {
  place: string;
  source: 'geolocation' | 'city' | 'offline';
  lat: number;
  lon: number;
  temp: number;
  feels: number;
  min: number;
  max: number;
  rainChance: number; // % today
  precipNow: number; // mm
  wind: number; // km/h
  windMax: number;
  humidity: number;
  uv: number;
  code: number;
  isDay: boolean;
  condition: string;
  icon: string;
  tomorrow?: { min: number; max: number; rainChance: number; code: number; condition: string; icon: string };
  fetchedAt: string;
}

const WMO: Record<number, [string, string]> = {
  0: ['Clear sky', '☀️'], 1: ['Mainly clear', '🌤️'], 2: ['Partly cloudy', '⛅'], 3: ['Overcast', '☁️'],
  45: ['Fog', '🌫️'], 48: ['Freezing fog', '🌫️'],
  51: ['Light drizzle', '🌦️'], 53: ['Drizzle', '🌦️'], 55: ['Heavy drizzle', '🌧️'], 56: ['Freezing drizzle', '🌧️'], 57: ['Freezing drizzle', '🌧️'],
  61: ['Light rain', '🌦️'], 63: ['Rain', '🌧️'], 65: ['Heavy rain', '🌧️'], 66: ['Freezing rain', '🌧️'], 67: ['Freezing rain', '🌧️'],
  71: ['Light snow', '🌨️'], 73: ['Snow', '🌨️'], 75: ['Heavy snow', '❄️'], 77: ['Snow grains', '🌨️'],
  80: ['Light showers', '🌦️'], 81: ['Showers', '🌧️'], 82: ['Violent showers', '⛈️'], 85: ['Snow showers', '🌨️'], 86: ['Heavy snow showers', '❄️'],
  95: ['Thunderstorm', '⛈️'], 96: ['Thunderstorm & hail', '⛈️'], 99: ['Thunderstorm & hail', '⛈️'],
};
export const describe = (code: number, isDay = true): [string, string] => {
  const d = WMO[code] || ['Mixed', '🌥️'];
  if (!isDay && (code === 0 || code === 1)) return [d[0], '🌙'];
  return d;
};
export const isWet = (code: number) => (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95;
export const isSnow = (code: number) => (code >= 71 && code <= 77) || code === 85 || code === 86;

const CACHE_KEY = 'atelier:weather';

async function geocode(city: string): Promise<{ lat: number; lon: number; name: string } | null> {
  const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
  if (!r.ok) return null;
  const j = await r.json();
  const g = j.results?.[0];
  return g ? { lat: g.latitude, lon: g.longitude, name: g.name } : null;
}

function getPosition(timeoutMs = 6000): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) return resolve(null);
    const t = window.setTimeout(() => resolve(null), timeoutMs);
    navigator.geolocation.getCurrentPosition(
      (p) => { window.clearTimeout(t); resolve({ lat: p.coords.latitude, lon: p.coords.longitude }); },
      () => { window.clearTimeout(t); resolve(null); },
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 30 * 60 * 1000 },
    );
  });
}

const km = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) => {
  const R = 6371, dLat = ((b.lat - a.lat) * Math.PI) / 180, dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

export async function getWeather(city: string, opts: { force?: boolean; useLocation?: boolean } = {}): Promise<WeatherSummary> {
  const fallbackCity = city || 'London';
  if (!opts.force) {
    try {
      const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null') as WeatherSummary | null;
      if (c && Date.now() - new Date(c.fetchedAt).getTime() < 30 * 60 * 1000 && (c.source === 'geolocation' || c.place.toLowerCase() === fallbackCity.toLowerCase())) return c;
    } catch { /* ignore */ }
  }
  try {
    let lat: number, lon: number, place: string, source: WeatherSummary['source'];
    const pos = opts.useLocation === false ? null : await getPosition();
    const home = await geocode(fallbackCity).catch(() => null);
    if (pos) {
      lat = pos.lat; lon = pos.lon; source = 'geolocation';
      place = home && km(pos, home) < 40 ? home.name : 'Your location';
    } else {
      const g = home || { lat: 51.5072, lon: -0.1276, name: 'London' };
      lat = g.lat; lon = g.lon; place = g.name; source = 'city';
    }
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,relative_humidity_2m,is_day&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,uv_index_max,wind_speed_10m_max&timezone=auto&forecast_days=2`;
    const r = await fetch(url);
    if (!r.ok) throw new Error('weather ' + r.status);
    const j = await r.json();
    const c = j.current, d = j.daily;
    const [condition, icon] = describe(c.weather_code, c.is_day === 1);
    const [tc, ti] = describe(d.weather_code[1]);
    const w: WeatherSummary = {
      place, source, lat, lon,
      temp: Math.round(c.temperature_2m), feels: Math.round(c.apparent_temperature),
      min: Math.round(d.temperature_2m_min[0]), max: Math.round(d.temperature_2m_max[0]),
      rainChance: d.precipitation_probability_max[0] ?? 0, precipNow: c.precipitation ?? 0,
      wind: Math.round(c.wind_speed_10m), windMax: Math.round(d.wind_speed_10m_max[0] ?? c.wind_speed_10m),
      humidity: c.relative_humidity_2m, uv: Math.round(d.uv_index_max[0] ?? 0),
      code: c.weather_code, isDay: c.is_day === 1, condition, icon,
      tomorrow: { min: Math.round(d.temperature_2m_min[1]), max: Math.round(d.temperature_2m_max[1]), rainChance: d.precipitation_probability_max[1] ?? 0, code: d.weather_code[1], condition: tc, icon: ti },
      fetchedAt: new Date().toISOString(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(w));
    return w;
  } catch {
    // Offline fallback: a plausible seasonal default so the stylist still works.
    const m = new Date().getMonth();
    const t = [5, 6, 9, 12, 15, 18, 21, 20, 17, 13, 9, 6][m];
    return {
      place: fallbackCity, source: 'offline', lat: 0, lon: 0, temp: t, feels: t - 1, min: t - 4, max: t + 3,
      rainChance: 40, precipNow: 0, wind: 15, windMax: 22, humidity: 70, uv: 2, code: 3, isDay: true,
      condition: 'Typical for the season (offline)', icon: '🌥️', fetchedAt: new Date().toISOString(),
    };
  }
}
