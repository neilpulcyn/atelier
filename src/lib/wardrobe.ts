import type { StyleId } from '../types';

export type Cat = 'top' | 'bottom' | 'dress' | 'outer' | 'shoes' | 'acc';
export interface Piece {
  name: string;
  cat: Cat;
  min: number; // feels-like °C this piece is comfortable from
  max: number; // ...up to
  f: number[]; // formality levels it suits: 0 casual, 1 smart-casual, 2 smart, 3 formal
  flags: string; // w=womenswear only, m=menswear only, r=rain-ready, h=heel, t=tight waist, s=sleeveless, o=wool, p=pockets, l=breathable, a=active
  style: StyleId;
}

// "name|cat|min|max|formality digits|flags"
const RAW: Record<StyleId, string[]> = {
  minimalist: [
    'Fine merino crew-neck in {c}|top|-5|17|123|o', 'Crisp poplin shirt in {c}|top|8|26|123|l', 'Heavyweight cotton tee in {c}|top|14|35|01|l',
    'Ribbed roll-neck in {c}|top|-5|14|12|o', 'Silk shell top in {c}|top|16|32|123|ws', 'Oversized cashmere jumper in {c}|top|-5|12|01|o', 'Linen camp-collar shirt in {c}|top|20|35|01|l',
    'Straight-leg wool trousers in {c}|bottom|-5|18|123|op', 'Wide-leg pleated trousers in {c}|bottom|5|24|123|p', 'Raw-denim straight jeans|bottom|-5|20|01|p',
    'Drawstring linen trousers in {c}|bottom|18|35|01|lp', 'Column midi skirt in {c}|bottom|10|26|12|w',
    'Knitted midi dress in {c}|dress|4|16|12|wo', 'Bias-cut slip dress in {c}|dress|18|32|123|ws', 'Belted shirt dress in {c}|dress|14|28|12|wp',
    'Double-faced camel wool coat|outer|-10|11|123|o', 'Clean-lined trench coat|outer|7|17|123|rp', 'Boxy wool overshirt in {c}|outer|9|17|01|op',
    'Technical mac in black|outer|4|18|012|rp', 'Unstructured linen blazer|outer|17|24|12|l', 'Soft-shouldered wool blazer in {c}|outer|6|22|123|op', 'Tailored suit jacket in {c}|outer|5|26|23|p',
    'Leather penny loafers|shoes|3|28|123|', 'Minimal white leather trainers|shoes|5|32|01|', 'Black leather Chelsea boots|shoes|-10|16|012|r',
    'Square-toe slingback heels|shoes|12|30|23|wh', 'Leather slides|shoes|20|35|01|',
    'Slim black leather belt|acc|-10|35|123|', 'Structured leather tote|acc|-10|35|0123|', 'Thin gold hoops|acc|-10|35|0123|w', 'Steel watch on a leather strap|acc|-10|35|0123|', 'Cashmere scarf in {c}|acc|-10|10|0123|o',
  ],
  streetwear: [
    'Boxy graphic tee|top|14|35|01|l', 'Heavyweight hoodie in {c}|top|0|16|01|p', 'Oversized crewneck sweatshirt in {c}|top|2|16|01|', 'Layered long-sleeve tee|top|10|20|01|',
    'Vintage football shirt|top|14|30|01|', 'Knitted polo in {c}|top|12|24|12|',
    'Wide cargo trousers in {c}|bottom|0|24|01|p', 'Baggy light-wash jeans|bottom|-5|22|01|p', 'Nylon parachute pants|bottom|8|25|01|p', 'Mesh basketball shorts|bottom|22|35|0|p',
    'Pleated wide trousers in black|bottom|5|22|12|p', 'Denim mini skirt|bottom|16|30|01|w',
    'Oversized rugby-shirt dress|dress|10|20|01|w', 'Jersey T-shirt dress|dress|18|30|0|w',
    'Puffer jacket in {c}|outer|-10|8|01|rp', 'Nylon bomber in {c}|outer|7|16|01|p', 'Black leather jacket|outer|8|17|012|', 'Waterproof shell anorak|outer|4|18|01|rp',
    'Varsity jacket|outer|8|16|01|p', 'Fleece zip-through|outer|5|14|0|p',
    'Retro runners in grey and volt|shoes|0|30|01|', 'Chunky skate shoes|shoes|5|28|0|', 'High-top trainers|shoes|-5|22|01|', 'GORE-TEX trail trainers|shoes|-5|20|01|r',
    'Black leather derbies|shoes|0|25|12|', 'Slides with sports socks|shoes|22|35|0|',
    'Ribbed beanie in {c}|acc|-10|10|01|', 'Nylon crossbody bag|acc|-10|35|012|', 'Five-panel cap|acc|12|35|0|', 'Fine silver chain|acc|-10|35|012|', 'Tinted sunglasses|acc|16|35|01|',
  ],
  classic: [
    'Oxford button-down in pale blue|top|6|24|123|', 'Cable-knit jumper in {c}|top|-5|13|012|o', 'Fine-gauge roll-neck in {c}|top|-5|14|123|o', 'Silk pussy-bow blouse|top|10|26|23|w',
    'Breton striped top|top|12|24|01|', 'Piqué polo shirt in {c}|top|18|30|01|l', 'Crisp white dress shirt|top|5|28|23|',
    'Pleated wool trousers in {c}|bottom|-5|20|123|op', 'Tailored chinos in stone|bottom|10|26|12|p', 'Dark-wash straight jeans|bottom|-5|22|01|p',
    'Pleated midi skirt in {c}|bottom|8|26|12|w', 'Ecru linen trousers|bottom|19|32|12|lp', 'Tartan wool kilt skirt|bottom|2|16|12|wo',
    'Navy wrap dress|dress|12|26|123|w', 'Tweed shift dress|dress|4|14|23|wo', 'Belted shirt dress in {c}|dress|14|28|12|w',
    'Camel trench coat|outer|7|17|123|rp', 'Navy double-breasted blazer|outer|12|21|123|p', 'Wool overcoat in {c}|outer|-10|9|123|op', 'Waxed field jacket|outer|4|15|01|rp',
    'Quilted gilet|outer|8|15|01|p', 'Herringbone tweed blazer|outer|5|15|12|op', 'Velvet dinner jacket|outer|5|25|3|',
    'Polished brogues|shoes|-5|24|123|', 'Burgundy penny loafers|shoes|5|28|12|', 'Leather riding boots|shoes|-10|14|12|wr', 'Pointed court heels|shoes|8|28|23|wh',
    'Suede chukka boots|shoes|0|18|01|', 'Leather ballet flats|shoes|14|28|12|w', 'Patent oxfords|shoes|0|30|3|',
    'Leather-strap watch|acc|-10|35|0123|', 'Structured top-handle bag|acc|-10|35|123|w', 'Wool-cashmere scarf in {c}|acc|-10|10|0123|o', 'Silk pocket square|acc|-10|35|23|m', 'Pearl studs|acc|-10|35|123|w', 'Silk twill scarf|acc|5|25|12|w',
  ],
  bohemian: [
    'Crochet knit top in {c}|top|16|30|01|l', 'Embroidered peasant blouse|top|14|28|012|l', 'Chunky fisherman jumper|top|-5|13|01|o', 'Fringe-trim cardigan in {c}|top|6|17|01|o',
    'Linen tie-front shirt in {c}|top|18|32|01|l', 'Brushed flannel shirt in {c}|top|4|16|01|',
    'Wide-leg linen trousers in {c}|bottom|17|34|01|lp', 'Flared corduroy jeans|bottom|-5|18|01|p', 'Tiered midi skirt in {c}|bottom|12|30|01|w', 'Patchwork flares|bottom|6|22|01|', 'Paisley wrap skirt|bottom|17|32|01|w',
    'Tiered floral maxi dress|dress|17|34|012|wl', 'Long-sleeve prairie midi dress|dress|8|20|012|w', 'Embroidered kaftan dress|dress|20|35|01|wl', 'Knitted maxi dress in {c}|dress|2|14|01|wo',
    'Suede fringe jacket|outer|9|18|01|', 'Shearling-collar afghan coat|outer|-10|10|01|o', 'Oversized knit cardigan-coat|outer|6|15|01|o', 'Waxed cotton poncho|outer|6|18|01|r', 'Faded denim jacket|outer|12|20|01|p',
    'Tan western boots|shoes|-5|22|01|', 'Suede knee boots|shoes|-5|15|012|w', 'Leather gladiator sandals|shoes|20|35|01|', 'Woven espadrilles|shoes|17|32|01|', 'Waterproof tan Chelsea boots|shoes|-5|18|01|r',
    'Stacked turquoise rings|acc|-10|35|012|', 'Woven straw tote|acc|16|35|01|', 'Wide-brim felt hat|acc|5|22|01|', 'Layered pendant necklaces|acc|-10|35|012|', 'Fringed suede crossbody|acc|-10|35|01|', 'Wool blanket scarf in {c}|acc|-10|11|01|o',
  ],
  avantgarde: [
    'Asymmetric draped top in {c}|top|12|28|123|', 'Sculptural-sleeve shirt in white|top|10|26|123|', 'Distressed oversized knit|top|-5|14|012|o', 'Sheer mesh long-sleeve layer|top|12|26|12|', 'Cropped boxy shirt in {c}|top|16|30|12|',
    'Exaggerated wide trousers in {c}|bottom|0|26|123|p', 'Drop-crotch trousers in black|bottom|5|24|01|p', 'Pleated asymmetric skirt|bottom|10|28|123|w', 'Leather wide-leg trousers|bottom|-5|16|12|', 'Barrel-leg jeans|bottom|0|22|01|p',
    'Sculpted column dress in {c}|dress|14|30|23|w', 'Draped jersey maxi in black|dress|8|24|123|w', 'Deconstructed shirt dress|dress|14|28|12|w',
    'Cocoon wool coat in black|outer|-10|11|123|o', 'Oversized sculpted blazer|outer|10|20|123|', 'Technical cape|outer|5|18|012|r', 'Padded asymmetric gilet|outer|4|14|01|', 'Black vinyl trench|outer|6|18|12|r',
    'Chunky platform boots|shoes|-10|20|0123|r', 'Tabi split-toe boots|shoes|0|22|123|', 'Sculptural-heel mules|shoes|14|30|23|wh', 'Square-toe leather derbies|shoes|0|25|12|', 'Thick-soled sandals|shoes|20|35|01|',
    'Wide-brim black hat|acc|5|24|0123|', 'Statement silver cuff|acc|-10|35|0123|', 'Shield sunglasses|acc|14|35|012|', 'Geometric leather bag|acc|-10|35|123|', 'Oversized knit snood|acc|-10|10|01|o',
  ],
  romantic: [
    'Puff-sleeve blouse in {c}|top|14|28|123|w', 'Lace-trim camisole in {c}|top|20|34|12|ws', 'Fluffy mohair cardigan in {c}|top|-3|15|012|wo', 'Ruffle-collar shirt in ivory|top|10|24|12|',
    'Pointelle knit in {c}|top|4|16|012|', 'Silk shirt in {c}|top|12|28|23|',
    'Satin slip skirt in {c}|bottom|10|28|123|w', 'Tiered tulle midi skirt|bottom|12|26|23|w', 'High-waist wide trousers in {c}|bottom|5|24|12|p', 'Floral midi skirt|bottom|14|30|012|w', 'Velvet trousers in {c}|bottom|-3|14|23|',
    'Off-shoulder midi dress in {c}|dress|18|32|123|ws', 'Long-sleeve floral tea dress|dress|10|22|012|w', 'Velvet wrap dress in {c}|dress|2|16|23|w', 'Ruffled maxi gown in {c}|dress|8|30|3|w', 'Polka-dot sundress|dress|20|34|01|ws',
    'Belted wool coat in {c}|outer|-10|11|123|wo', 'Cropped tweed jacket with pearl buttons|outer|8|17|12|w', 'Pastel trench coat|outer|7|18|12|r', 'Faux-fur collar coat|outer|-10|8|23|w',
    'Cropped velvet jacket|outer|8|18|12|', 'Soft tailored blazer in {c}|outer|12|22|12|',
    'Mary Jane flats|shoes|5|28|012|w', 'Satin bow heels|shoes|10|30|23|wh', 'Lace-up heeled ankle boots|shoes|-5|15|12|wh', 'Blush ballet flats|shoes|12|30|01|w', 'Suede loafers|shoes|5|26|12|', 'Patent knee boots|shoes|-5|14|123|wr',
    'Pearl drop earrings|acc|-10|35|123|w', 'Velvet hair bow|acc|-10|35|012|w', 'Mini top-handle bag|acc|-10|35|123|w', 'Silk neckerchief|acc|5|25|012|', 'Delicate gold locket|acc|-10|35|0123|', 'Cashmere wrap in {c}|acc|-10|12|0123|o',
  ],
  sporty: [
    'Technical half-zip in {c}|top|2|16|01|p', 'Seamless performance tee|top|14|35|0|la', 'Cropped track top in {c}|top|10|20|01|', 'Merino base layer|top|-5|12|01|o',
    'Oversized logo sweatshirt|top|2|16|01|', 'Piqué knit polo|top|16|28|12|l',
    'Tailored joggers in {c}|bottom|0|20|01|p', 'High-rise leggings|bottom|0|20|0|wa', 'Pleated tennis skirt|bottom|18|30|01|w', 'Technical cargo trousers|bottom|-5|20|01|rp',
    'Running shorts|bottom|20|35|0|a', 'Wide-leg track pants|bottom|8|24|01|p',
    'Ribbed tank dress|dress|20|34|01|ws', 'Knit polo dress|dress|14|26|12|w',
    'Packable windbreaker in {c}|outer|8|18|01|rp', 'Lightweight puffer|outer|-10|10|01|p', 'Waterproof shell jacket|outer|2|18|01|rp', 'Fleece half-zip|outer|4|13|0|', 'Bonded technical blazer|outer|10|22|12|p',
    'Performance running trainers|shoes|-5|35|01|a', 'Clean white court trainers|shoes|5|32|01|', 'GORE-TEX trail runners|shoes|-10|20|01|r', 'Suede low-top trainers|shoes|5|26|12|', 'Sport sandals|shoes|20|35|0|',
    'Baseball cap|acc|10|35|0|', 'Sling bag|acc|-10|35|01|', 'Sports watch|acc|-10|35|012|', 'Thermal headband|acc|-10|8|0|', 'Wraparound sunglasses|acc|14|35|01|',
  ],
  vintage: [
    'Breton striped top|top|12|24|01|', '70s-collar shirt in {c}|top|14|28|012|', 'Fair Isle jumper|top|-5|12|01|o', 'Ringer tee|top|16|32|0|l', 'Skinny-rib polo neck in {c}|top|0|16|012|', 'Western snap shirt|top|10|24|01|',
    'Vintage straight-leg 501s|bottom|-5|24|01|p', 'Wide corduroy trousers in {c}|bottom|-5|16|01|p', 'High-waist pleated trousers|bottom|5|22|12|p', 'A-line suede skirt|bottom|6|20|01|w',
    'Flared jeans|bottom|0|22|01|p', 'Pleated midi skirt in {c}|bottom|10|26|12|w',
    '70s print midi dress|dress|14|28|012|w', 'Corduroy pinafore dress|dress|5|16|01|wp', 'Gingham sundress|dress|20|34|01|ws',
    'Suede trucker jacket|outer|9|18|01|', 'Tan corduroy blazer|outer|8|18|12|p', 'Waxed country jacket|outer|2|15|01|rp', 'Shearling aviator jacket|outer|-10|8|01|', 'Denim chore jacket|outer|10|20|01|p', 'Thrifted wool car coat|outer|-6|11|12|o',
    'Leather Chelsea boots|shoes|-5|18|012|r', 'Canvas high-tops|shoes|8|28|0|', 'Penny loafers with white socks|shoes|8|26|12|', 'Lace-up work boots|shoes|-10|16|01|r', 'Leather T-bar sandals|shoes|20|34|01|', 'Block-heel knee boots|shoes|-5|15|12|wh',
    'Tortoiseshell sunglasses|acc|14|35|012|', 'Silk headscarf|acc|5|25|01|w', 'Leather satchel|acc|-10|35|012|', 'Vintage gold Casio|acc|-10|35|012|', 'Brass-buckle leather belt|acc|-10|35|012|', 'Wool flat cap|acc|-5|12|01|m', 'Chunky knit scarf in {c}|acc|-10|10|01|o',
  ],
};

export const WARDROBE: Piece[] = (Object.keys(RAW) as StyleId[]).flatMap((style) =>
  RAW[style].map((row) => {
    const [name, cat, min, max, f, flags] = row.split('|');
    return { name, cat: cat as Cat, min: +min, max: +max, f: f.split('').map(Number), flags: flags || '', style };
  }),
);

export const COLOUR_FAMILIES: Record<string, { name: string; hex: string }[]> = {
  neutrals: [ { name: 'oat', hex: '#e6dccb' }, { name: 'camel', hex: '#c19a6b' }, { name: 'stone', hex: '#a8a29a' } ],
  monochrome: [ { name: 'black', hex: '#111111' }, { name: 'white', hex: '#fafafa' }, { name: 'charcoal', hex: '#3a3a3a' } ],
  earth: [ { name: 'rust', hex: '#9c4a1a' }, { name: 'olive', hex: '#6b6b3a' }, { name: 'sand', hex: '#dcc7a1' } ],
  pastels: [ { name: 'blush', hex: '#e9c4c0' }, { name: 'lilac', hex: '#b9a3c9' }, { name: 'mint', hex: '#bfe0d6' } ],
  brights: [ { name: 'cobalt', hex: '#1f4fd8' }, { name: 'tangerine', hex: '#ff6a13' }, { name: 'volt', hex: '#d4ff3a' } ],
  jewel: [ { name: 'emerald', hex: '#0f5e4a' }, { name: 'sapphire', hex: '#23367a' }, { name: 'plum', hex: '#5b1f4a' } ],
  navy: [ { name: 'navy', hex: '#1d2a44' }, { name: 'ivory', hex: '#f4efe4' }, { name: 'burgundy', hex: '#6b1f2a' } ],
  denim: [ { name: 'indigo', hex: '#2e3f63' }, { name: 'mid-wash blue', hex: '#6f8fb3' }, { name: 'chambray', hex: '#c7d3e0' } ],
};

export const SHOPS: Record<StyleId, Record<string, string>> = {
  minimalist: { '£': 'Uniqlo U, Arket basics, M&S Autograph', '££': 'COS, Arket, Massimo Dutti', '£££': 'Toteme, The Row, Jil Sander', Thrift: 'Vestiaire Collective, Vinted (search "COS")' },
  streetwear: { '£': 'Primark x collabs, Weekday, ASOS Design', '££': 'Carhartt WIP, Stüssy, Corteiz drops', '£££': 'Martine Rose, Aries, Stone Island', Thrift: 'Depop, Grailed, Rokit' },
  classic: { '£': 'M&S, Uniqlo, Next Tailoring', '££': 'Reiss, Hobbs, Charles Tyrwhitt', '£££': 'Max Mara, Ralph Lauren, Drake\u2019s', Thrift: 'Oxfam Online, eBay vintage tailoring' },
  bohemian: { '£': 'Monki, H&M Studio, ASOS Design', '££': 'Free People, Sézane, Rixo', '£££': 'Chloé, Ulla Johnson, Isabel Marant', Thrift: 'Beyond Retro, Depop, car-boot sales' },
  avantgarde: { '£': 'Weekday, COS sculptural pieces', '££': 'Our Legacy, Rains, & Other Stories', '£££': 'Comme des Garçons, Rick Owens, Simone Rocha', Thrift: 'Grailed, Vestiaire archive' },
  romantic: { '£': '& Other Stories, Mango, H&M', '££': 'Rixo, Sézane, Ghost', '£££': 'Zimmermann, Self-Portrait, Simone Rocha', Thrift: 'Vinted, Hewi, The RealReal' },
  sporty: { '£': 'Decathlon, Uniqlo Sport, Gymshark', '££': 'Adanola, On, Nike', '£££': 'Arc\u2019teryx Veilance, Lululemon, Satisfy', Thrift: 'Depop sportswear, Vinted' },
  vintage: { '£': 'Charity shops, Beyond Retro', '££': 'Rokit, Levi\u2019s Vintage Clothing, Sézane', '£££': 'Wales Bonner, Bode, Drake\u2019s', Thrift: 'Brick Lane, Portobello Road, Depop' },
};
