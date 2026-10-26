import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
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

  // toSignal turns each request into a signal: it starts as [] and updates when the data arrives
  protected readonly trending = toSignal(
    this.tmdb.getTrending().pipe(map((response) => onlyMoviesAndTv(response.results))),
    { initialValue: [] },
  );
  protected readonly topRated = toSignal(
    this.tmdb.getTopRated().pipe(map((response) => response.results)),
    { initialValue: [] },
  );
  protected readonly upcoming = toSignal(
    this.tmdb.getUpcoming().pipe(map((response) => response.results)),
    { initialValue: [] },
  );
}
