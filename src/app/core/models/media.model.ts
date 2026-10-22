// Shapes of the data returned by the TMDB API.
// Field names use snake_case because that is how TMDB sends them.

export type MediaType = 'movie' | 'tv';

// A movie or a TV show in a list (home carousels, search, discover).
// Movies use "title" and "release_date"; TV shows use "name" and "first_air_date".
export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  // Only sent by endpoints that mix types, like trending and search
  media_type?: MediaType | 'person';
}

// TMDB splits long lists into pages
export interface PagedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  key: string;
  name: string;
  site: string;
  type: string;
}

// Full details of one movie or TV show, with cast, videos and similar titles
// fetched in the same request (append_to_response)
export interface MediaDetails extends MediaItem {
  genres: Genre[];
  runtime?: number;
  episode_run_time?: number[];
  credits: { cast: CastMember[] };
  videos: { results: Video[] };
  similar: PagedResponse<MediaItem>;
}

// Filters used by the Discover page
export interface DiscoverFilters {
  type: MediaType;
  genreId?: number;
  year?: number;
  sortBy?: string;
  page?: number;
}
