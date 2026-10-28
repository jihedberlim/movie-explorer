import { MediaType } from './media.model';

// Just enough to show the card without calling TMDB again
export interface WatchlistItem {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  year: string | null;
  watched: boolean;
}
