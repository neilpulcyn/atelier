export type StyleId =
  | 'minimalist'
  | 'streetwear'
  | 'classic'
  | 'bohemian'
  | 'avantgarde'
  | 'romantic'
  | 'sporty'
  | 'vintage';

export type Wardrobe = 'womenswear' | 'menswear' | 'both';

export interface StyleProfile {
  name: string;
  wardrobe: Wardrobe;
  primary: StyleId;
  secondary: StyleId;
  scores: Record<StyleId, number>; // percentages, sum ~100
  colours: string[];
  fit: string;
  occasions: string[];
  budget: string;
  comfort: string[];
  runs: 'cold' | 'neutral' | 'warm';
  city: string;
  completedAt: string;
}

export interface Creator {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  city: string;
  style: StyleId;
  bio: string;
  followers: number;
  role: string;
  verified?: boolean;
}

export interface Comment {
  id: string;
  author: string; // handle
  text: string;
  at: string; // ISO
}

export interface Post {
  id: string;
  creatorId: string; // 'me' for own posts
  image: string;
  caption: string;
  style: StyleId;
  tags: string[];
  colours: string[];
  likes: number;
  comments: Comment[];
  at: string;
  location?: string;
}

export interface FashionEvent {
  id: string;
  title: string;
  type: 'Runway show' | 'Pop-up' | 'Launch' | 'Talk' | 'Market' | 'Party' | 'Workshop' | 'Sample sale';
  hostId: string;
  cover: string;
  start: string; // ISO local time
  end: string;
  city: string;
  venue: string;
  address: string;
  description: string;
  styles: StyleId[];
  interested: number;
  price: string;
}

export interface Look {
  id: string;
  title: string;
  image: string;
  style: StyleId;
  pieces: string[];
  temp: 'cold' | 'mild' | 'warm' | 'any';
  occasion: string;
  price: '£' | '££' | '£££' | 'Thrift';
}
