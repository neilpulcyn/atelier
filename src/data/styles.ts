import type { StyleId } from '../types';

export interface StyleMeta {
  id: StyleId;
  label: string;
  tagline: string;
  description: string;
  keyPieces: string[];
  palette: { name: string; hex: string }[];
  muses: string[];
  cover: string;
}

export const STYLES: Record<StyleId, StyleMeta> = {
  minimalist: {
    id: 'minimalist',
    label: 'Minimalist',
    tagline: 'Less, but better.',
    description: 'Clean lines, considered fabrics and a quiet palette. You invest in pieces that last and let cut and texture do the talking.',
    keyPieces: ['Crisp white shirt', 'Camel wool coat', 'Straight-leg trousers', 'Fine-knit merino', 'Leather loafers'],
    palette: [ { name: 'Bone', hex: '#ece7df' }, { name: 'Camel', hex: '#c19a6b' }, { name: 'Stone', hex: '#a8a29a' }, { name: 'Black', hex: '#111111' }, { name: 'White', hex: '#fafafa' } ],
    muses: ['The Row', 'COS', 'Jil Sander'],
    cover: '/img/p96.jpg',
  },
  streetwear: {
    id: 'streetwear',
    label: 'Streetwear',
    tagline: 'Culture first, rules second.',
    description: 'Graphic tees, statement trainers and confident layering. You mix hype with thrift and wear it like a uniform.',
    keyPieces: ['Boxy graphic tee', 'Heavyweight hoodie', 'Cargo trousers', 'Box-fresh trainers', 'Bomber jacket'],
    palette: [ { name: 'Black', hex: '#141414' }, { name: 'Safety orange', hex: '#ff6a13' }, { name: 'Grey marl', hex: '#9a9a9a' }, { name: 'Acid', hex: '#d4ff3a' }, { name: 'Washed blue', hex: '#6f8fb3' } ],
    muses: ['Corteiz', 'Stüssy', 'Martine Rose'],
    cover: '/img/p2.jpg',
  },
  classic: {
    id: 'classic',
    label: 'Classic / Preppy',
    tagline: 'Timeless, tailored, polished.',
    description: 'Sharp tailoring, heritage fabrics and good shoes. You dress for the occasion and always look put-together.',
    keyPieces: ['Navy blazer', 'Trench coat', 'Oxford shirt', 'Pleated trousers', 'Polished brogues'],
    palette: [ { name: 'Navy', hex: '#1d2a44' }, { name: 'Ivory', hex: '#f4efe4' }, { name: 'Camel', hex: '#b88a57' }, { name: 'Burgundy', hex: '#6b1f2a' }, { name: 'Forest', hex: '#2f4a3a' } ],
    muses: ['Ralph Lauren', 'Max Mara', 'Drake\u2019s'],
    cover: '/img/p14.jpg',
  },
  bohemian: {
    id: 'bohemian',
    label: 'Bohemian',
    tagline: 'Free-spirited and sun-warmed.',
    description: 'Flowing silhouettes, crochet, prints and earthy tones. Your wardrobe feels collected, textured and relaxed.',
    keyPieces: ['Tiered maxi dress', 'Suede fringe jacket', 'Crochet knit', 'Wide-leg linen', 'Western boots'],
    palette: [ { name: 'Terracotta', hex: '#c4673f' }, { name: 'Sand', hex: '#dcc7a1' }, { name: 'Olive', hex: '#6b6b3a' }, { name: 'Rust', hex: '#9c4a1a' }, { name: 'Cream', hex: '#f3ead8' } ],
    muses: ['Chloé', 'Ulla Johnson', 'Free People'],
    cover: '/img/p47.jpg',
  },
  avantgarde: {
    id: 'avantgarde',
    label: 'Avant-garde',
    tagline: 'Fashion as art.',
    description: 'Sculptural shapes, unexpected proportions and conceptual design. You dress to provoke a reaction — and a conversation.',
    keyPieces: ['Asymmetric draped top', 'Sculptural coat', 'Wide-brim hat', 'Exaggerated trousers', 'Chunky platform boots'],
    palette: [ { name: 'Black', hex: '#0b0b0b' }, { name: 'Lacquer red', hex: '#c1121f' }, { name: 'Chrome', hex: '#c9cdd2' }, { name: 'Teal', hex: '#0f6b6b' }, { name: 'White', hex: '#ffffff' } ],
    muses: ['Comme des Garçons', 'Rick Owens', 'Iris van Herpen'],
    cover: '/img/p86.jpg',
  },
  romantic: {
    id: 'romantic',
    label: 'Romantic',
    tagline: 'Soft, feminine, a little dramatic.',
    description: 'Ruffles, florals, delicate fabrics and pretty details. You love a twirl-worthy dress and a touch of glamour.',
    keyPieces: ['Off-shoulder dress', 'Silk slip skirt', 'Puff-sleeve blouse', 'Mary Jane heels', 'Pearl accents'],
    palette: [ { name: 'Blush', hex: '#e9c4c0' }, { name: 'Claret', hex: '#8e1b2c' }, { name: 'Ivory', hex: '#f8f1e7' }, { name: 'Lilac', hex: '#b9a3c9' }, { name: 'Rose red', hex: '#c8102e' } ],
    muses: ['Zimmermann', 'Simone Rocha', 'Self-Portrait'],
    cover: '/img/p49.jpg',
  },
  sporty: {
    id: 'sporty',
    label: 'Sporty / Athleisure',
    tagline: 'Built to move, styled to impress.',
    description: 'Technical fabrics, clean trainers and smart athletic layers. Comfort is non-negotiable — but so is looking sharp.',
    keyPieces: ['Performance trainers', 'Tailored joggers', 'Zip-up track top', 'Technical shell', 'Cap & crossbody'],
    palette: [ { name: 'White', hex: '#fafafa' }, { name: 'Volt', hex: '#d4ff3a' }, { name: 'Cobalt', hex: '#1f4fd8' }, { name: 'Charcoal', hex: '#333333' }, { name: 'Coral', hex: '#ff7262' } ],
    muses: ['Nike', 'Arc\u2019teryx', 'Adanola'],
    cover: '/img/p41.jpg',
  },
  vintage: {
    id: 'vintage',
    label: 'Vintage',
    tagline: 'Old soul, new stories.',
    description: 'Thrifted finds, heritage denim and retro silhouettes. Every piece has a past and you love the hunt.',
    keyPieces: ['501-style jeans', 'Corduroy blazer', 'Suede jacket', 'Breton top', 'Chelsea boots'],
    palette: [ { name: 'Mustard', hex: '#d1a12c' }, { name: 'Tan', hex: '#a9764b' }, { name: 'Denim', hex: '#3e5a7a' }, { name: 'Brick', hex: '#9b3d2b' }, { name: 'Cream', hex: '#efe4cc' } ],
    muses: ['Levi\u2019s', 'Wales Bonner', 'Rokit'],
    cover: '/img/p13.jpg',
  },
};

export const STYLE_IDS = Object.keys(STYLES) as StyleId[];
