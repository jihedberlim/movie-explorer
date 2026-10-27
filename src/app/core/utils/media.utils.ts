import {
  DiscoverFilters,
  DiscoverSort,
  MediaDetails,
  MediaItem,
  MediaType,
  Video,
} from '../models/media.model';

export type RatingLevel = 'high' | 'medium' | 'low' | 'none';

// Movies have "title" and TV shows have "name"
export function getTitle(item: MediaItem): string {
  return item.title ?? item.name ?? 'Untitled';
}

// "2014-11-05" -> "2014". TMDB sometimes sends an empty string when the date is unknown.
export function getYear(item: MediaItem): string | null {
  const date = item.release_date || item.first_air_date;
  return date ? date.slice(0, 4) : null;
}

// Lists like top rated and upcoming don't send media_type, so we guess from the fields:
// only movies have "title"
export function getMediaType(item: MediaItem): MediaType {
  if (item.media_type === 'movie' || item.media_type === 'tv') {
    return item.media_type;
  }
  return item.title !== undefined ? 'movie' : 'tv';
}

// Trending and search can also return people (actors, directors), which we don't show
export function onlyMoviesAndTv(items: MediaItem[]): MediaItem[] {
  return items.filter((item) => item.media_type !== 'person');
}

// Adds the next page to the current list, skipping titles that are already there.
// TMDB sometimes repeats a title on two pages. A movie and a TV show can share the
// same id, so the type is part of the check.
export function appendUnique(current: MediaItem[], next: MediaItem[]): MediaItem[] {
  const keys = new Set(current.map((item) => `${getMediaType(item)}-${item.id}`));
  const newItems = next.filter((item) => !keys.has(`${getMediaType(item)}-${item.id}`));
  return [...current, ...newItems];
}

// Movies have "runtime"; TV shows have "episode_run_time" (minutes of one episode).
// TMDB sends 0 or an empty list when it doesn't know.
export function getRuntime(details: MediaDetails): number | null {
  return details.runtime || details.episode_run_time?.[0] || null;
}

// TMDB sends many videos (trailers, clips, behind the scenes...).
// We want a YouTube trailer, or a teaser when there is no trailer.
export function findTrailer(videos: Video[]): Video | null {
  const youtubeVideos = videos.filter((video) => video.site === 'YouTube');
  return (
    youtubeVideos.find((video) => video.type === 'Trailer') ??
    youtubeVideos.find((video) => video.type === 'Teaser') ??
    null
  );
}

// A rating of 0 means nobody voted yet (common for upcoming movies)
export function getRatingLevel(rating: number): RatingLevel {
  if (rating === 0) {
    return 'none';
  }
  if (rating >= 7) {
    return 'high';
  }
  if (rating >= 5) {
    return 'medium';
  }
  return 'low';
}

export const DISCOVER_SORTS: DiscoverSort[] = ['popular', 'top_rated', 'newest'];

// The Discover filters as they come from the URL: always text, and maybe missing
export interface DiscoverQueryParams {
  type?: string;
  genre?: string;
  year?: string;
  sort?: string;
}

// Anyone can type anything in the URL (e.g. ?year=banana), so we only keep valid values
// and use the defaults for the rest
export function parseDiscoverFilters(params: DiscoverQueryParams): DiscoverFilters {
  const type: MediaType = params.type === 'tv' ? 'tv' : 'movie';

  const genreId = Number(params.genre);
  const year = Number(params.year);
  const isValidYear = Number.isInteger(year) && year >= 1900 && year <= 2100;

  const sortBy = DISCOVER_SORTS.find((sort) => sort === params.sort) ?? 'popular';

  return {
    type,
    genreId: Number.isInteger(genreId) && genreId > 0 ? genreId : undefined,
    year: isValidYear ? year : undefined,
    sortBy,
  };
}
