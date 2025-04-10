export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyPlaylistItem {
  collaborative: boolean;
  description: string;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: {
    display_name: string;
    href: string;
    id: string;
  };
  public: boolean;
  tracks: {
    href: string;
    total: number;
  };
}

export interface User {
  display_name: string;
  email: string;
  followers: {
    total: number;
  };
  id: string;
  product: 'free' | 'premium' | 'family' | 'student';
  images: Image[] | [];
  dateReceived?: Date;
  token?: string;
  topData?: TopData | undefined;
  allowSharedPlaylist: boolean;
}

export interface Track {
  album: {
    artists: {
      name: string;
      id: string;
    }[];
    id: string;
    images: Image[] | [];
    name: string;
    release_date: string;
  };
  artists: {
    name: string;
    id: string;
  }[];
  duration_ms: number;
  explicit: boolean;
  id: string;
  name: string;
  popularity: number;
}

export interface Artist {
  followers: {
    total: number;
  };
  genres: string[] | [];
  href: string;
  id: string;
  images: Image[] | [];
  name: string;
  popularity: number;
}

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';
export type TimeTerms = 'the past month' | 'the past 6 months' | 'of all time';

export type TopTracks = {
  [key in TimeRange]: Track[];
};

export type TopArtists = {
  [key in TimeRange]: Artist[];
};

export type TopGenres = {
  [key in TimeRange]: {
    string: number;
  };
};

export type RecentlyPlayedTrack = {
  played_at: Date;
  track: Track;
  since: string;
};

export type RecentlyPlayed = {
  [key in string]: RecentlyPlayedTrack[];
};

export interface TopData {
  top_tracks: TopTracks;
  top_artists: TopArtists;
  top_genres: TopGenres;
  recentlyPlayed: RecentlyPlayed;
}

export type AppState = 'home' | 'artists' | 'tracks' | 'genres';

export interface ComparisonResults {
  artists: {
    sharedArtists: Artist[];
    percentageOverlap: number;
    scoreByRanking: number;
  };
  explicit: {
    userA: number;
    userB: number;
  };
  genres: {
    sharedGenres: string[];
    percentageOverlap: number;
    scoreByRanking: number;
  };
  merged: TopTracks;
  popularity: {
    userA: number;
    userB: number;
  };
  timeTravel: {
    userA: { averageReleaseYear: number; yearsBehind: number };
    userB: { averageReleaseYear: number; yearsBehind: number };
  };
  tracks: {
    sharedTracks: Track[];
    percentageOverlap: number;
    scoreByRanking: number;
  };
  userB: User;
}
