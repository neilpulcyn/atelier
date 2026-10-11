import { respond } from '../src/lib/stylist';
const p:any = { name:'Neil', wardrobe:'menswear', primary:'minimalist', secondary:'classic', scores:{minimalist:30,classic:22,streetwear:10,bohemian:5,avantgarde:8,romantic:5,sporty:10,vintage:10}, colours:['neutrals','navy'], fit:'tailored', occasions:['work','weekend'], budget:'££', comfort:['pockets','layers'], runs:'cold', city:'London', completedAt:'' };
const w:any = { place:'London', source:'geolocation', lat:51.5, lon:-0.1, temp:14, feels:11, min:9, max:15, rainChance:60, precipNow:0, wind:12, windMax:22, humidity:70, uv:2, code:3, isDay:true, condition:'Overcast', icon:'☁️', tomorrow:{min:10,max:17,rainChance:20,code:2,condition:'Partly cloudy',icon:'⛅'}, fetchedAt:'' };
let last:any;
for (const q of ['What should I wear today?','Another option','Dress it up','What to wear to a wedding?','What goes with my white trainers?','what colour goes with navy','gym','hello','what is the weather','Outfit for tomorrow','Date night look']) {
  const r = respond(q,p,w,last); if (r.request) last=r.request;
  console.log('\n> '+q+'\n'+r.text); if (r.outfit) { r.outfit.items.forEach(i=>console.log('  '+i.label+': '+i.value)); console.log('  ~ '+r.outfit.reasoning); r.outfit.tips.forEach(t=>console.log('  • '+t)); }
}
const p2 = {...p, wardrobe:'womenswear', primary:'romantic', secondary:'bohemian', comfort:['flats','arms'], colours:['pastels','jewel'], runs:'neutral'};
for (const q of ['What should I wear today?','What to wear to a fashion show?','What if it rains?']) { const r=respond(q,p2,w); console.log('\n> '+q+'\n'+r.text); r.outfit?.items.forEach(i=>console.log('  '+i.label+': '+i.value)); }
