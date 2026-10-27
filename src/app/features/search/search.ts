import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, of, startWith, switchMap, tap } from 'rxjs';
import { MediaItem, PagedResponse } from '../../core/models/media.model';
import { TmdbService } from '../../core/services/tmdb.service';
import { appendUnique, onlyMoviesAndTv } from '../../core/utils/media.utils';
import { InfiniteScroll } from '../../shared/infinite-scroll/infinite-scroll';
import { MovieCard } from '../../shared/movie-card/movie-card';

// What we show when the search box is empty: no results and no more pages
const EMPTY_PAGE: PagedResponse<MediaItem> = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, MovieCard, InfiniteScroll],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  private readonly tmdb = inject(TmdbService);
  private readonly router = inject(Router);

  // Starts with the text from the URL (/search?q=...), so reloading keeps the search
  protected readonly queryControl = new FormControl(
    inject(ActivatedRoute).snapshot.queryParamMap.get('q') ?? '',
    { nonNullable: true },
  );

  protected readonly results = signal<MediaItem[]>([]);
  protected readonly loading = signal(false);
  private readonly page = signal(1);
  private readonly totalPages = signal(0);
  protected readonly hasMore = computed(() => this.page() < this.totalPages());

  // The text of the search that is on the screen now
  private query = '';

  constructor() {
    this.queryControl.valueChanges
      .pipe(
        startWith(this.queryControl.value), // also search the text that came from the URL
        debounceTime(400), // wait until the user stops typing for 400 ms
        map((text) => text.trim()),
        distinctUntilChanged(), // skip if the text is the same as the last search
        tap((query) => {
          this.query = query;
          this.updateUrl(query);
          this.loading.set(query !== '');
        }),
        // switchMap cancels the previous request when a new search starts
        switchMap((query) => (query ? this.tmdb.search(query) : of(EMPTY_PAGE))),
        takeUntilDestroyed(), // stop listening when the user leaves the page
      )
      .subscribe((response) => {
        this.page.set(response.page);
        this.totalPages.set(response.total_pages);
        this.results.set(onlyMoviesAndTv(response.results));
        this.loading.set(false);
      });
  }

  // Called by the infinite scroll when the user reaches the end of the grid
  loadMore(): void {
    if (this.loading() || !this.hasMore()) {
      return;
    }

    const query = this.query;
    this.loading.set(true);
    this.tmdb.search(query, this.page() + 1).subscribe((response) => {
      // The user typed a new search while this page was loading: ignore it
      if (query !== this.query) {
        return;
      }
      this.page.set(response.page);
      this.results.update((current) => appendUnique(current, onlyMoviesAndTv(response.results)));
      this.loading.set(false);
    });
  }

  private updateUrl(query: string): void {
    // replaceUrl: don't add one history entry per search to the back button
    this.router.navigate(['/search'], {
      queryParams: { q: query || null },
      replaceUrl: true,
    });
  }
}
