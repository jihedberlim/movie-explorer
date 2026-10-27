import { Component, computed, inject, input, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { MediaItem } from '../../core/models/media.model';
import { TmdbService } from '../../core/services/tmdb.service';
import { appendUnique, parseDiscoverFilters } from '../../core/utils/media.utils';
import { InfiniteScroll } from '../../shared/infinite-scroll/infinite-scroll';
import { MovieCard } from '../../shared/movie-card/movie-card';

// Years for the year filter: from next year back to 1950
const FIRST_YEAR = 1950;
const NEXT_YEAR = new Date().getFullYear() + 1;
const YEARS = Array.from({ length: NEXT_YEAR - FIRST_YEAR + 1 }, (_, index) => NEXT_YEAR - index);

@Component({
  selector: 'app-discover',
  imports: [MovieCard, InfiniteScroll],
  templateUrl: './discover.html',
  styleUrl: './discover.css',
})
export class Discover {
  private readonly tmdb = inject(TmdbService);
  private readonly router = inject(Router);

  // The filters come from the URL (/discover?type=tv&genre=18&year=2008&sort=top_rated).
  // The URL is the only place where filters live: changing a filter means changing the URL.
  readonly type = input<string>();
  readonly genre = input<string>();
  readonly year = input<string>();
  readonly sort = input<string>();

  protected readonly filters = computed(() =>
    parseDiscoverFilters({
      type: this.type(),
      genre: this.genre(),
      year: this.year(),
      sort: this.sort(),
    }),
  );

  // Movies and TV shows have different genre lists, so they reload when the type changes
  protected readonly genres = rxResource({
    params: () => this.filters().type,
    stream: ({ params: type }) => this.tmdb.getGenres(type),
  });

  protected readonly years = YEARS;
  protected readonly results = signal<MediaItem[]>([]);
  protected readonly loading = signal(false);
  private readonly page = signal(1);
  private readonly totalPages = signal(0);
  protected readonly hasMore = computed(() => this.page() < this.totalPages());

  constructor() {
    // Every time the filters change, load the first page again
    toObservable(this.filters)
      .pipe(
        tap(() => this.loading.set(true)),
        // switchMap cancels the old request if the user changes a filter before it finishes
        switchMap((filters) => this.tmdb.discover(filters)),
        takeUntilDestroyed(),
      )
      .subscribe((response) => {
        this.page.set(response.page);
        this.totalPages.set(response.total_pages);
        this.results.set(response.results);
        this.loading.set(false);
      });
  }

  // Called by the infinite scroll when the user reaches the end of the grid
  loadMore(): void {
    if (this.loading() || !this.hasMore()) {
      return;
    }

    const filters = this.filters();
    this.loading.set(true);
    this.tmdb.discover({ ...filters, page: this.page() + 1 }).subscribe((response) => {
      // The user changed a filter while this page was loading: ignore it
      if (filters !== this.filters()) {
        return;
      }
      this.page.set(response.page);
      this.results.update((current) => appendUnique(current, response.results));
      this.loading.set(false);
    });
  }

  setType(type: string): void {
    // Genres are different for movies and TV shows, so the genre filter is cleared
    this.updateUrl({ type, genre: null });
  }

  setGenre(genre: string): void {
    this.updateUrl({ genre: genre || null });
  }

  setYear(year: string): void {
    this.updateUrl({ year: year || null });
  }

  setSort(sort: string): void {
    this.updateUrl({ sort });
  }

  private updateUrl(changes: Record<string, string | null>): void {
    // "merge" keeps the other filters; null removes a filter from the URL
    this.router.navigate(['/discover'], {
      queryParams: changes,
      queryParamsHandling: 'merge',
    });
  }
}
