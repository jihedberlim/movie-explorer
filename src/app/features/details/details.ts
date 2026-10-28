import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { MediaType, Video } from '../../core/models/media.model';
import { TmdbService } from '../../core/services/tmdb.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import { findTrailer, getRuntime, getTitle, getYear } from '../../core/utils/media.utils';
import { DurationPipe } from '../../shared/duration/duration-pipe';
import { MediaCarousel } from '../../shared/media-carousel/media-carousel';
import { RatingBadge } from '../../shared/rating-badge/rating-badge';

@Component({
  selector: 'app-details',
  imports: [DurationPipe, MediaCarousel, RatingBadge, RouterLink],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  protected readonly tmdb = inject(TmdbService);
  private readonly watchlist = inject(WatchlistService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly type = input.required<MediaType>();
  readonly id = input.required<string>();

  // Clicking a similar title reuses this page with a new id, so the data must reload
  protected readonly details = rxResource({
    params: () => ({ type: this.type(), id: Number(this.id()) }),
    stream: ({ params }) => this.tmdb.getDetails(params.type, params.id),
  });

  protected readonly inWatchlist = computed(() =>
    this.watchlist.has(this.type(), Number(this.id())),
  );

  toggleWatchlist(): void {
    if (!this.details.hasValue()) {
      return;
    }
    const media = this.details.value();

    if (this.inWatchlist()) {
      this.watchlist.remove(this.type(), media.id);
    } else {
      this.watchlist.add(media);
    }
  }

  protected readonly view = computed(() => {
    // value() throws when the request failed, so check first
    if (!this.details.hasValue()) {
      return null;
    }
    const media = this.details.value();

    return {
      media,
      title: getTitle(media),
      year: getYear(media),
      runtime: getRuntime(media),
      genres: media.genres.map((genre) => genre.name).join(', '),
      cast: media.credits.cast.slice(0, 12),
      similar: media.similar.results,
      trailerUrl: this.getTrailerUrl(media.videos.results),
    };
  });

  private getTrailerUrl(videos: Video[]) {
    const trailer = findTrailer(videos);
    if (!trailer) {
      return null;
    }
    // Angular blocks iframes with outside URLs by default. We built this URL ourselves
    // from a YouTube key, so we tell Angular it is safe.
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${trailer.key}`,
    );
  }
}
