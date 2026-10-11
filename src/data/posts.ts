import type { Post, StyleId } from '../types';

// [id, creator, image#, style, caption, tags, colours, likes, daysAgo, location]
type Row = [string, string, number, StyleId, string, string[], string[], number, number, string?];

const rows: Row[] = [
  ['p1', 'c2', 96, 'minimalist', 'Camel on camel. The only autumn uniform you need.', ['coat', 'tonal', 'autumn'], ['neutrals', 'earth'], 4821, 0.2, 'Le Marais, Paris'],
  ['p2', 'c3', 2, 'streetwear', 'Highlighter tracksuit for a grey Monday. Drop 07 out Friday.', ['tracksuit', 'colour', 'drop'], ['brights'], 3902, 0.4, 'Dalston, London'],
  ['p3', 'c1', 86, 'avantgarde', 'SS27 preview: the Bell coat. 14 metres of wool crepe.', ['sculptural', 'hat', 'lfw'], ['monochrome'], 6233, 0.6, 'Peckham, London'],
  ['p4', 'c7', 49, 'romantic', 'Red, twirling, unbothered.', ['gown', 'red', 'golden hour'], ['brights', 'jewel'], 8120, 0.9, 'Central Park, NY'],
  ['p5', 'c6', 14, 'classic', 'Navy two-piece, open collar. Smart without trying too hard.', ['suit', 'tailoring', 'navy'], ['navy', 'neutrals'], 2710, 1.1, 'Saint-Germain, Paris'],
  ['p6', 'c5', 47, 'bohemian', 'Hand-smocked prairie blouse in our new ditsy floral.', ['floral', 'handmade', 'prairie'], ['pastels', 'earth'], 1980, 1.3, 'South Downs'],
  ['p7', 'c8', 41, 'sporty', 'Tempo day. These are the lightest pair I\u2019ve tested this year.', ['trainers', 'running', 'review'], ['brights'], 2240, 1.5, 'Brooklyn, NY'],
  ['p8', 'c9', 36, 'vintage', 'Found: 1970s blush wool coat, £45. Sunday at the stall.', ['thrifted', '70s', 'coat'], ['pastels'], 3104, 1.8, 'Brick Lane, London'],
  ['p9', 'c10', 11, 'streetwear', 'Ripped denim + beanie season has officially begun.', ['denim', 'beanie', 'layers'], ['denim', 'neutrals'], 1622, 2.0, 'Northern Quarter, Manchester'],
  ['p10', 'c4', 8, 'classic', 'Blackwatch tartan, cut close. Autumn in Milan.', ['tartan', 'coat', 'heritage'], ['jewel', 'navy'], 2981, 2.2, 'Brera, Milan'],
  ['p11', 'c11', 46, 'romantic', 'Sequins before sunset. Backstage at the resort show.', ['sequins', 'party', 'backstage'], ['jewel', 'brights'], 5402, 2.5, 'Milan'],
  ['p12', 'c12', 13, 'vintage', 'Tan corduroy blazer, 1978. Paired with Chucks, obviously.', ['corduroy', '70s', 'menswear'], ['earth'], 1450, 2.8, 'Shoreditch, London'],
  ['p13', 'c2', 6, 'minimalist', 'Sheer black. One piece, no noise.', ['black', 'sheer', 'evening'], ['monochrome'], 3876, 3.0, 'Paris'],
  ['p14', 'c1', 3, 'avantgarde', 'Stripes, scaled up. Trousers from the archive collection.', ['stripes', 'proportion', 'archive'], ['monochrome'], 4410, 3.3, 'London'],
  ['p15', 'c3', 5, 'streetwear', 'Logo red under an oversized leather. Shades stay on.', ['graphic tee', 'leather', 'sunglasses'], ['brights', 'monochrome'], 2877, 3.6, 'Soho, London'],
  ['p16', 'c5', 89, 'bohemian', 'Powder-blue wrap dress, salt in the hair.', ['maxi', 'beach', 'flowy'], ['pastels'], 2655, 3.9, 'Brighton Beach'],
  ['p17', 'c6', 81, 'classic', 'Waistcoat, no jacket. The most underrated layer in menswear.', ['waistcoat', 'tailoring'], ['navy', 'neutrals'], 1730, 4.2, 'Paris'],
  ['p18', 'c7', 39, 'romantic', 'White off-shoulder for the first warm day in weeks.', ['white', 'off-shoulder', 'summer'], ['neutrals'], 3330, 4.5, 'Brooklyn, NY'],
  ['p19', 'c8', 65, 'sporty', 'Blush joggers + strappy heels. Athleisure, dressed up.', ['joggers', 'heels', 'athleisure'], ['pastels'], 1212, 4.8, 'SoHo, NY'],
  ['p20', 'c9', 85, 'vintage', 'Braces, high-waisted denim and a Peter Pan collar.', ['denim', 'braces', 'retro'], ['denim', 'neutrals'], 2109, 5.1, 'London'],
  ['p21', 'c11', 97, 'avantgarde', 'Lacquer-red column with a puddle train. Couture week favourite.', ['red', 'couture', 'train'], ['brights'], 7210, 5.4, 'Paris'],
  ['p22', 'c10', 12, 'streetwear', 'Black leather, brick walls, Northern light.', ['leather', 'black', 'rooftop'], ['monochrome'], 1904, 5.8, 'Manchester'],
  ['p23', 'c2', 82, 'minimalist', 'Grey knit dress. Wide brim. That\u2019s the whole look.', ['knit dress', 'hat', 'tonal'], ['neutrals'], 2768, 6.1, 'Antibes'],
  ['p24', 'c4', 93, 'classic', 'Tonal check suit and a velvet bow. Made-to-measure for a client\u2019s wedding.', ['bespoke', 'wedding', 'suit'], ['navy', 'neutrals'], 2260, 6.5, 'Milan'],
  ['p25', 'c5', 31, 'bohemian', 'Chevron knit, suede over-the-knee boots, wild coastline.', ['knit', 'boots', 'earthy'], ['earth'], 1588, 6.9, 'Cornwall'],
  ['p26', 'c7', 48, 'romantic', 'Plum velvet off-shoulder. Jewel tones only, from now until March.', ['velvet', 'jewel tones', 'evening'], ['jewel'], 4012, 7.3, 'New York'],
  ['p27', 'c12', 83, 'vintage', 'Raw denim chore jacket with a cord collar. Archive piece of the week.', ['denim', 'workwear', 'archive'], ['denim', 'earth'], 1340, 7.8, 'London'],
  ['p28', 'c1', 74, 'avantgarde', 'Teal plunge jumpsuit in liquid satin. Fittings for the show.', ['jumpsuit', 'teal', 'fitting'], ['jewel'], 3511, 8.2, 'London'],
  ['p29', 'c3', 66, 'streetwear', 'Fedora, shorts, tall socks. Rules are for other people.', ['hat', 'socks', 'colour'], ['brights'], 2033, 8.7, 'Peckham, London'],
  ['p30', 'c8', 42, 'sporty', 'Tan suede low-tops. The only trainer that goes with tailoring.', ['trainers', 'suede', 'neutral'], ['earth'], 1705, 9.1, 'New York'],
  ['p31', 'c11', 50, 'romantic', 'Cherry-red tea dress, cinched. Pure joy.', ['dress', 'red', 'print'], ['brights'], 3622, 9.6, 'Milan'],
  ['p32', 'c6', 78, 'classic', 'Dark suit, burgundy tie, pocket square. Gala ready.', ['suit', 'evening', 'tie'], ['monochrome', 'jewel'], 2488, 10.2, 'Paris'],
  ['p33', 'c10', 26, 'streetwear', 'Denim jacket over a grey hoodie — the uniform.', ['denim', 'hoodie', 'layers'], ['denim', 'neutrals'], 1377, 10.8, 'Manchester'],
  ['p34', 'c2', 94, 'minimalist', 'Long camel coat, olive slip, city shadows.', ['coat', 'slip dress', 'neutral'], ['earth', 'neutrals'], 3299, 11.4, 'Paris'],
];

const commentPool = [
  ['lea.minimal', 'The proportions here 👌'],
  ['kofi.streets', 'Need this in my life'],
  ['ivy.vintage', 'Where is this from?!'],
  ['mei.romance', 'Obsessed with the colour'],
  ['sofia.edit', 'Saving for my next shoot'],
  ['theo.tailored', 'Impeccable. The fit is everything.'],
  ['rosie.wildflower', 'This is so dreamy'],
  ['jay.runclub', 'Clean 🔥'],
  ['amara.studio', 'Love the silhouette'],
  ['noah.layers', 'Fit of the week easily'],
  ['giulia.atelier', 'Bellissimo ✨'],
  ['rami.archive', 'Proper. Respect.'],
];

const now = Date.now();
export const SEED_POSTS: Post[] = rows.map(([id, creatorId, img, style, caption, tags, colours, likes, daysAgo, location], i) => ({
  id,
  creatorId,
  image: `img/p${img}.jpg`,
  caption,
  style,
  tags,
  colours,
  likes,
  location,
  at: new Date(now - daysAgo * 86400000).toISOString(),
  comments: [0, 1, 2].slice(0, (i % 3) + 1).map((k) => {
    const [author, text] = commentPool[(i * 3 + k * 5) % commentPool.length];
    return { id: `${id}-c${k}`, author, text, at: new Date(now - daysAgo * 86400000 + (k + 1) * 3600000).toISOString() };
  }),
}));
