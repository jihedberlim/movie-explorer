import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { TmdbService } from '../../core/services/tmdb.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import { RatingBadge } from '../../shared/rating-badge/rating-badge';

type WatchlistFilter = 'all' | 'to-watch' | 'watched';

@Component({
  selector: 'app-watchlist',
  imports: [RouterLink, RatingBadge],
  templateUrl: './watchlist.html',
  styleUrl: './watchlist.css',
})
export class Watchlist {
  protected readonly i18n = inject(LanguageService);

  protected readonly watchlist = inject(WatchlistService);
  protected readonly tmdb = inject(TmdbService);

  protected readonly filter = signal<WatchlistFilter>('all');

  protected readonly toWatchCount = computed(
    () => this.watchlist.items().filter((item) => !item.watched).length,
  );
  protected readonly watchedCount = computed(
    () => this.watchlist.items().filter((item) => item.watched).length,
  );
  protected readonly visibleItems = computed(() => {
    const items = this.watchlist.items();
    if (this.filter() === 'to-watch') {
      return items.filter((item) => !item.watched);
    }
    if (this.filter() === 'watched') {
      return items.filter((item) => item.watched);
    }
    return items;
  });
}
