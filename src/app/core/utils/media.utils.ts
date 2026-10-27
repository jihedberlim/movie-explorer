import { MediaItem, MediaType } from '../models/media.model';

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
