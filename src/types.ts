export type PersonaType = 'burnout' | 'jobseeker' | 'miracle';

export interface PersonaInfo {
  id: PersonaType;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  themeColor: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  youtubeId: string;
  genre: string;
  duration: string;
  description: string;
}

export interface DailyQuote {
  id: string;
  persona: PersonaType;
  quote: string;
  author: string;
  takeaway: string;
}

export interface RitualLog {
  id: string;
  date: string; // YYYY-MM-DD
  persona: PersonaType;
  trackId: string;
  trackTitle: string;
  youtubeId: string;
  quote: string;
  quoteAuthor: string;
  note: string;
  mood: string;
  createdAt: number;
}
