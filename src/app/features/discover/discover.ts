import { Component, computed, inject, input, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { catchError, of, switchMap, tap } from 'rxjs';
import { MediaItem, PagedResponse } from '../../core/models/media.model';
import { TmdbService } from '../../core/services/tmdb.service';
import { appendUnique, parseDiscoverFilters } from '../../core/utils/media.utils';
import { InfiniteScroll } from '../../shared/infinite-scroll/infinite-scroll';
import { MovieCard } from '../../shared/movie-card/movie-card';
import { SKELETON_COUNT, SkeletonCard } from '../../shared/skeleton-card/skeleton-card';

const EMPTY_PAGE: PagedResponse<MediaItem> = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};

const FIRST_YEAR = 1950;
const NEXT_YEAR = new Date().getFullYear() + 1;
const YEARS = Array.from({ length: NEXT_YEAR - FIRST_YEAR + 1 }, (_, index) => NEXT_YEAR - index);

@Component({
  selector: 'app-discover',
  imports: [MovieCard, InfiniteScroll, SkeletonCard],
  templateUrl: './discover.html',
  styleUrl: './discover.css',
})
export class Discover {
  private readonly tmdb = inject(TmdbService);
  private readonly router = inject(Router);

  // The URL is the single source of truth for the filters, so links and the back button just work
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

  protected readonly genres = rxResource({
    params: () => this.filters().type,
    stream: ({ params: type }) => this.tmdb.getGenres(type),
  });

  protected readonly years = YEARS;
  protected readonly results = signal<MediaItem[]>([]);
  protected readonly loading = signal(true);
  private readonly page = signal(1);
  private readonly totalPages = signal(0);
  protected readonly hasMore = computed(() => this.page() < this.totalPages());
  protected readonly skeletons = Array.from({ length: SKELETON_COUNT });

  constructor() {
    toObservable(this.filters)
      .pipe(
        tap(() => {
          this.results.set([]);
          this.loading.set(true);
        }),
        switchMap((filters) =>
          // catchError inside switchMap: a failed request must not stop the next filter changes
          this.tmdb.discover(filters).pipe(catchError(() => of(EMPTY_PAGE))),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((response) => {
        this.page.set(response.page);
        this.totalPages.set(response.total_pages);
        this.results.set(response.results);
        this.loading.set(false);
      });
  }

  loadMore(): void {
    if (this.loading() || !this.hasMore()) {
      return;
    }

    const filters = this.filters();
    this.loading.set(true);
    this.tmdb.discover({ ...filters, page: this.page() + 1 }).subscribe({
      next: (response) => {
        // The filters changed while this page was loading, so it belongs to an old list
        if (filters !== this.filters()) {
          return;
        }
        this.page.set(response.page);
        this.results.update((current) => appendUnique(current, response.results));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  clearFilters(): void {
    this.router.navigate(['/discover']);
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
    // "merge" keeps the other filters, and null removes a filter from the URL
    this.router.navigate(['/discover'], {
      queryParams: changes,
      queryParamsHandling: 'merge',
    });
  }
}
