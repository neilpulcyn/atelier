import type { StyleId } from '../types';

export type Weights = Partial<Record<StyleId, number>>;

export interface QuizOption {
  id: string;
  label: string;
  sub?: string;
  image?: string;
  swatch?: string[];
  emoji?: string;
  w?: Weights;
}

export interface QuizStep {
  id: string;
  kind: 'intro' | 'images' | 'single' | 'multi' | 'chips' | 'location';
  eyebrow: string;
  title: string;
  hint?: string;
  options?: QuizOption[];
  max?: number;
  min?: number;
}

export const QUIZ: QuizStep[] = [
  {
    id: 'intro', kind: 'intro', eyebrow: 'Step 1', title: 'First, the basics',
    hint: 'So your stylist knows who they\u2019re dressing.',
    options: [
      { id: 'womenswear', label: 'Womenswear' },
      { id: 'menswear', label: 'Menswear' },
      { id: 'both', label: 'Both / no preference' },
    ],
  },
  {
    id: 'looks', kind: 'images', eyebrow: 'Step 2', title: 'Tap the looks you\u2019d actually wear', hint: 'Pick as many as you like (at least two).', min: 2,
    options: [
      { id: 'lk-min', label: 'Tonal camel', image: '/img/p96.jpg', w: { minimalist: 3, classic: 1 } },
      { id: 'lk-street', label: 'Bold tracksuit', image: '/img/p2.jpg', w: { streetwear: 3, sporty: 1 } },
      { id: 'lk-classic', label: 'Sharp tailoring', image: '/img/p14.jpg', w: { classic: 3, minimalist: 1 } },
      { id: 'lk-boho', label: 'Prairie florals', image: '/img/p47.jpg', w: { bohemian: 3, romantic: 1 } },
      { id: 'lk-avant', label: 'Sculptural', image: '/img/p86.jpg', w: { avantgarde: 3, minimalist: 1 } },
      { id: 'lk-rom', label: 'Red & twirly', image: '/img/p49.jpg', w: { romantic: 3 } },
      { id: 'lk-vint', label: 'Thrifted 70s', image: '/img/p13.jpg', w: { vintage: 3, streetwear: 1 } },
      { id: 'lk-sport', label: 'Athleisure', image: '/img/p65.jpg', w: { sporty: 3, streetwear: 1 } },
      { id: 'lk-stripe', label: 'Graphic stripes', image: '/img/p3.jpg', w: { avantgarde: 2, streetwear: 1 } },
    ],
  },
  {
    id: 'saturday', kind: 'single', eyebrow: 'Step 3', title: 'Your ideal Saturday outfit is\u2026',
    options: [
      { id: 's1', label: 'A perfect knit, straight trousers, loafers', emoji: '🤍', w: { minimalist: 3, classic: 1 } },
      { id: 's2', label: 'Hoodie, cargos and the newest trainers', emoji: '🧢', w: { streetwear: 3, sporty: 1 } },
      { id: 's3', label: 'Oxford shirt, chinos, a good blazer', emoji: '🧥', w: { classic: 3 } },
      { id: 's4', label: 'A floaty maxi dress and layered jewellery', emoji: '🌾', w: { bohemian: 3, romantic: 1 } },
      { id: 's5', label: 'Something nobody else in the room is wearing', emoji: '🖤', w: { avantgarde: 3 } },
      { id: 's6', label: 'Leggings, a crisp half-zip, ready to move', emoji: '🏃', w: { sporty: 3 } },
      { id: 's7', label: 'A charity-shop find with a story', emoji: '🪡', w: { vintage: 3, bohemian: 1 } },
      { id: 's8', label: 'Ruffles, puff sleeves, a little lipstick', emoji: '🌹', w: { romantic: 3 } },
    ],
  },
  {
    id: 'words', kind: 'chips', eyebrow: 'Step 4', title: 'Three words for how you want to look', hint: 'Choose up to three.', max: 3,
    options: [
      { id: 'w1', label: 'Effortless', w: { minimalist: 2, bohemian: 1 } },
      { id: 'w2', label: 'Polished', w: { classic: 2, minimalist: 1 } },
      { id: 'w3', label: 'Bold', w: { streetwear: 1, avantgarde: 2 } },
      { id: 'w4', label: 'Edgy', w: { streetwear: 2, avantgarde: 1 } },
      { id: 'w5', label: 'Soft', w: { romantic: 2, bohemian: 1 } },
      { id: 'w6', label: 'Free-spirited', w: { bohemian: 2 } },
      { id: 'w7', label: 'Sharp', w: { classic: 2 } },
      { id: 'w8', label: 'Artistic', w: { avantgarde: 2, vintage: 1 } },
      { id: 'w9', label: 'Sporty', w: { sporty: 2 } },
      { id: 'w10', label: 'Nostalgic', w: { vintage: 2 } },
      { id: 'w11', label: 'Glamorous', w: { romantic: 2, classic: 1 } },
      { id: 'w12', label: 'Understated', w: { minimalist: 2 } },
    ],
  },
  {
    id: 'shoes', kind: 'single', eyebrow: 'Step 5', title: 'Pick a pair', hint: 'Shoes say everything.',
    options: [
      { id: 'sh1', label: 'Leather loafers', emoji: '🥿', w: { minimalist: 2, classic: 2 } },
      { id: 'sh2', label: 'Limited-edition trainers', emoji: '👟', w: { streetwear: 3, sporty: 1 } },
      { id: 'sh3', label: 'Western or suede boots', emoji: '🤠', w: { bohemian: 2, vintage: 2 } },
      { id: 'sh4', label: 'Chunky platform boots', emoji: '🥾', w: { avantgarde: 3, streetwear: 1 } },
      { id: 'sh5', label: 'Mary Janes or strappy heels', emoji: '👠', w: { romantic: 3 } },
      { id: 'sh6', label: 'Running shoes, always', emoji: '🏃', w: { sporty: 3 } },
    ],
  },
  {
    id: 'colours', kind: 'multi', eyebrow: 'Step 6', title: 'Colours you love wearing', hint: 'Pick any that feel like you.',
    options: [
      { id: 'neutrals', label: 'Neutrals', swatch: ['#ece7df', '#c19a6b', '#a8a29a'], w: { minimalist: 1, classic: 1 } },
      { id: 'monochrome', label: 'Black & white', swatch: ['#0b0b0b', '#ffffff', '#777777'], w: { minimalist: 1, avantgarde: 1 } },
      { id: 'earth', label: 'Earth tones', swatch: ['#9c4a1a', '#6b6b3a', '#dcc7a1'], w: { bohemian: 1, vintage: 1 } },
      { id: 'pastels', label: 'Pastels', swatch: ['#e9c4c0', '#b9a3c9', '#bfe0d6'], w: { romantic: 1 } },
      { id: 'brights', label: 'Bold brights', swatch: ['#ff6a13', '#d4ff3a', '#1f4fd8'], w: { streetwear: 1, sporty: 1 } },
      { id: 'jewel', label: 'Jewel tones', swatch: ['#6b1f4a', '#0f6b6b', '#2a2f7a'], w: { romantic: 1, avantgarde: 1 } },
      { id: 'navy', label: 'Navy & classics', swatch: ['#1d2a44', '#f4efe4', '#6b1f2a'], w: { classic: 1 } },
      { id: 'denim', label: 'Denim blues', swatch: ['#3e5a7a', '#6f8fb3', '#c7d3e0'], w: { vintage: 1, streetwear: 1 } },
    ],
  },
  {
    id: 'fit', kind: 'single', eyebrow: 'Step 7', title: 'How do you like things to fit?',
    options: [
      { id: 'relaxed', label: 'Relaxed & oversized', sub: 'Room to breathe', w: { streetwear: 1, minimalist: 1 } },
      { id: 'tailored', label: 'Tailored & structured', sub: 'Clean lines', w: { classic: 2 } },
      { id: 'fitted', label: 'Fitted & body-skimming', sub: 'Show the shape', w: { romantic: 1, sporty: 1 } },
      { id: 'flowy', label: 'Flowy & draped', sub: 'Movement first', w: { bohemian: 2, avantgarde: 1 } },
    ],
  },
  {
    id: 'occasions', kind: 'chips', eyebrow: 'Step 8', title: 'What do you mostly dress for?', hint: 'Choose all that apply.',
    options: [
      { id: 'work', label: 'Office / work' },
      { id: 'creative', label: 'Creative studio' },
      { id: 'weekend', label: 'Weekend casual' },
      { id: 'nights', label: 'Nights out' },
      { id: 'events', label: 'Shows & events' },
      { id: 'travel', label: 'Travel' },
      { id: 'gym', label: 'Gym & active' },
      { id: 'dates', label: 'Dates' },
    ],
  },
  {
    id: 'budget', kind: 'single', eyebrow: 'Step 9', title: 'Your usual budget per piece',
    options: [
      { id: '£', label: '£ High street', sub: 'Under £50' },
      { id: '££', label: '££ Mid-range', sub: '£50–£200' },
      { id: '£££', label: '£££ Designer', sub: '£200+' },
      { id: 'Thrift', label: 'Second-hand first', sub: 'Vintage, resale, swaps', w: { vintage: 2 } },
    ],
  },
  {
    id: 'comfort', kind: 'chips', eyebrow: 'Step 10', title: 'Comfort non-negotiables', hint: 'We\u2019ll never suggest things you hate wearing.',
    options: [
      { id: 'flats', label: 'Flat shoes only' },
      { id: 'heels', label: 'Love a heel' },
      { id: 'waist', label: 'No tight waistbands' },
      { id: 'arms', label: 'Prefer covered arms' },
      { id: 'breathable', label: 'Natural, breathable fabrics' },
      { id: 'layers', label: 'Layers I can take off' },
      { id: 'pockets', label: 'Must have pockets' },
      { id: 'nowool', label: 'Wool feels itchy' },
    ],
  },
  {
    id: 'location', kind: 'location', eyebrow: 'Step 11', title: 'Where do you get dressed?', hint: 'Your stylist uses real local weather.',
    options: [
      { id: 'cold', label: 'I always run cold 🥶' },
      { id: 'neutral', label: 'Somewhere in between' },
      { id: 'warm', label: 'I always run warm 🥵' },
    ],
  },
];
