import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { MediaItem, PagedResponse } from '../../core/models/media.model';
import { LanguageService } from '../../core/services/language.service';
import { TmdbService } from '../../core/services/tmdb.service';
import { appendUnique, onlyMoviesAndTv } from '../../core/utils/media.utils';
import { InfiniteScroll } from '../../shared/infinite-scroll/infinite-scroll';
import { MovieCard } from '../../shared/movie-card/movie-card';
import { SKELETON_COUNT, SkeletonCard } from '../../shared/skeleton-card/skeleton-card';

const EMPTY_PAGE: PagedResponse<MediaItem> = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, MovieCard, InfiniteScroll, SkeletonCard],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  protected readonly i18n = inject(LanguageService);

  private readonly tmdb = inject(TmdbService);
  private readonly router = inject(Router);

  protected readonly queryControl = new FormControl(
    inject(ActivatedRoute).snapshot.queryParamMap.get('q') ?? '',
    { nonNullable: true },
  );

  // Start from the URL text, so a reload shows skeletons instead of the "type something" message
  protected readonly query = signal(this.queryControl.value.trim());
  protected readonly results = signal<MediaItem[]>([]);
  protected readonly loading = signal(this.query() !== '');
  private readonly page = signal(1);
  private readonly totalPages = signal(0);
  protected readonly hasMore = computed(() => this.page() < this.totalPages());
  protected readonly skeletons = Array.from({ length: SKELETON_COUNT });

  constructor() {
    this.queryControl.valueChanges
      .pipe(
        startWith(this.queryControl.value), // also search the text that came from the URL
        debounceTime(400),
        map((text) => text.trim()),
        distinctUntilChanged(),
        tap((query) => {
          this.query.set(query);
          this.updateUrl(query);
          this.results.set([]);
          this.loading.set(query !== '');
        }),
        switchMap((query) =>
          query
            ? // catchError inside switchMap: a failed search must not stop the next searches
              this.tmdb.search(query).pipe(catchError(() => of(EMPTY_PAGE)))
            : of(EMPTY_PAGE),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((response) => {
        this.page.set(response.page);
        this.totalPages.set(response.total_pages);
        this.results.set(onlyMoviesAndTv(response.results));
        this.loading.set(false);
      });
  }

  loadMore(): void {
    if (this.loading() || !this.hasMore()) {
      return;
    }

    const query = this.query();
    this.loading.set(true);
    this.tmdb.search(query, this.page() + 1).subscribe({
      next: (response) => {
        // The user typed a new search while this page was loading, so it belongs to an old list
        if (query !== this.query()) {
          return;
        }
        this.page.set(response.page);
        this.results.update((current) => appendUnique(current, onlyMoviesAndTv(response.results)));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private updateUrl(query: string): void {
    // replaceUrl avoids one back-button step per search
    this.router.navigate(['/search'], {
      queryParams: { q: query || null },
      replaceUrl: true,
    });
  }
}
