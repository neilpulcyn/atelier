import type { Creator } from '../types';

export const CREATORS: Creator[] = [
  { id: 'c1', handle: 'amara.studio', name: 'Amara Okafor', avatar: 'img/a/a24.jpg', city: 'London', style: 'avantgarde', role: 'Designer · CSM grad', bio: 'Sculptural womenswear from my Peckham studio. SS27 show at LFW — RSVP below.', followers: 48200, verified: true },
  { id: 'c2', handle: 'lea.minimal', name: 'Léa Moreau', avatar: 'img/a/a20.jpg', city: 'Paris', style: 'minimalist', role: 'Stylist', bio: 'Quiet luxury, loud opinions. Capsule wardrobes & Paris street style.', followers: 91300, verified: true },
  { id: 'c3', handle: 'kofi.streets', name: 'Kofi Mensah', avatar: 'img/a/a79.jpg', city: 'London', style: 'streetwear', role: 'Creative director', bio: 'Running drops out of Dalston. Graphic tees, heavy cotton, community first.', followers: 63800 },
  { id: 'c4', handle: 'giulia.atelier', name: 'Giulia Ricci', avatar: 'img/a/a19.jpg', city: 'Milan', style: 'classic', role: 'Tailor & designer', bio: 'Third-generation tailor. Made-to-measure for women who mean business.', followers: 37400, verified: true },
  { id: 'c5', handle: 'rosie.wildflower', name: 'Rosie Hart', avatar: 'img/a/a25.jpg', city: 'Brighton', style: 'bohemian', role: 'Slow-fashion maker', bio: 'Hand-dyed, hand-made, sun-faded. Crochet drops monthly.', followers: 22100 },
  { id: 'c6', handle: 'theo.tailored', name: 'Theo Laurent', avatar: 'img/a/a22.jpg', city: 'Paris', style: 'classic', role: 'Menswear writer', bio: 'Suits, shoes and the art of a good knot. Weekly fit notes.', followers: 54600 },
  { id: 'c7', handle: 'mei.romance', name: 'Mei Tanaka', avatar: 'img/a/a67.jpg', city: 'New York', style: 'romantic', role: 'Photographer', bio: 'Shooting ruffles in golden hour. NYC ↔ Tokyo.', followers: 71200, verified: true },
  { id: 'c8', handle: 'jay.runclub', name: 'Jay Carter', avatar: 'img/a/a76.jpg', city: 'New York', style: 'sporty', role: 'Run-club founder', bio: 'Brooklyn Run Club. Trainers, tech fabrics, Saturday 8am.', followers: 29800 },
  { id: 'c9', handle: 'ivy.vintage', name: 'Ivy Collins', avatar: 'img/a/a21.jpg', city: 'London', style: 'vintage', role: 'Vintage dealer', bio: 'Brick Lane stall, Sundays. 60s–90s, hand-picked, never fast.', followers: 33500 },
  { id: 'c10', handle: 'noah.layers', name: 'Noah Brooks', avatar: 'img/a/a18.jpg', city: 'Manchester', style: 'streetwear', role: 'Model', bio: 'Layering season is my season. Northern Quarter based.', followers: 18900 },
  { id: 'c11', handle: 'sofia.edit', name: 'Sofia Alvarez', avatar: 'img/a/a75.jpg', city: 'Milan', style: 'romantic', role: 'Editor', bio: 'Fashion editor. Runway reports from Milan & Paris.', followers: 102400, verified: true },
  { id: 'c12', handle: 'rami.archive', name: 'Rami Haddad', avatar: 'img/a/a80.jpg', city: 'London', style: 'vintage', role: 'Archivist', bio: 'Menswear archive: workwear, denim, 70s tailoring.', followers: 26700 },
];

export const creatorById = (id: string) => CREATORS.find((c) => c.id === id);
export const creatorByHandle = (h: string) => CREATORS.find((c) => c.handle === h);
