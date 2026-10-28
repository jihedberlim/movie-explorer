import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, map, of } from 'rxjs';
import { MediaItem, PagedResponse } from '../../core/models/media.model';
import { TmdbService } from '../../core/services/tmdb.service';
import { onlyMoviesAndTv } from '../../core/utils/media.utils';
import { MediaCarousel } from '../../shared/media-carousel/media-carousel';

@Component({
  selector: 'app-home',
  imports: [MediaCarousel],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly tmdb = inject(TmdbService);

  // Each signal is undefined while loading, so the carousel shows skeletons
  protected readonly trending = this.toItems(this.tmdb.getTrending());
  protected readonly topRated = this.toItems(this.tmdb.getTopRated());
  protected readonly upcoming = this.toItems(this.tmdb.getUpcoming());

  private toItems(request: Observable<PagedResponse<MediaItem>>) {
    return toSignal(
      request.pipe(
        map((response) => onlyMoviesAndTv(response.results)),
        // The error toast already told the user; an empty carousel is better than a broken page
        catchError(() => of([])),
      ),
    );
  }
}
