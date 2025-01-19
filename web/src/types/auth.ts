export interface User {
  id: string;
  username: string;
  artistPreferences: Record<string, string>;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// src/types/artist.ts
export interface Artist {
  id: string;
  name: string;
  imageURL: string | null;
  genre: string;
  stage: Stage;
}

export type Stage = 'coachella' | 'outdoor' | 'sahara' | 'mojave' | 'gobi' | 'yuma' | 'sonora' | 'quasar';
