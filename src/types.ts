export type PersonaType = 'burnout' | 'jobseeker' | 'miracle';

export interface PersonaInfo {
  id: PersonaType;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  themeColor: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  genre: string;
  audioUrl: string;
  youtubeId: string;
  description: string;
}

// 호환성 유지용 별칭
export type MusicTrack = AudioTrack;

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
