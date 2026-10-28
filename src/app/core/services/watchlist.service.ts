import { Injectable, computed, signal } from '@angular/core';
import { MediaItem, MediaType } from '../models/media.model';
import { WatchlistItem } from '../models/watchlist.model';
import { getMediaType, getTitle, getYear } from '../utils/media.utils';

export const WATCHLIST_STORAGE_KEY = 'movie-explorer.watchlist';

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private readonly itemsSignal = signal<WatchlistItem[]>(this.load());

  readonly items = this.itemsSignal.asReadonly();
  readonly count = computed(() => this.items().length);

  has(mediaType: MediaType, id: number): boolean {
    return this.items().some((item) => item.mediaType === mediaType && item.id === id);
  }

  add(media: MediaItem): void {
    const mediaType = getMediaType(media);
    if (this.has(mediaType, media.id)) {
      return;
    }

    const newItem: WatchlistItem = {
      id: media.id,
      mediaType,
      title: getTitle(media),
      posterPath: media.poster_path,
      voteAverage: media.vote_average,
      year: getYear(media),
      watched: false,
    };
    this.save([newItem, ...this.items()]);
  }

  remove(mediaType: MediaType, id: number): void {
    this.save(this.items().filter((item) => !(item.mediaType === mediaType && item.id === id)));
  }

  toggleWatched(mediaType: MediaType, id: number): void {
    this.save(
      this.items().map((item) =>
        item.mediaType === mediaType && item.id === id ? { ...item, watched: !item.watched } : item,
      ),
    );
  }

  private save(items: WatchlistItem[]): void {
    this.itemsSignal.set(items);
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(items));
  }

  // The saved data may be missing or broken (e.g. edited by hand in DevTools)
  private load(): WatchlistItem[] {
    try {
      const saved = JSON.parse(localStorage.getItem(WATCHLIST_STORAGE_KEY) ?? '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }
}
