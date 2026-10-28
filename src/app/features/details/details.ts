import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaType, Video } from '../../core/models/media.model';
import { TmdbService } from '../../core/services/tmdb.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import { findTrailer, getRuntime, getTitle, getYear } from '../../core/utils/media.utils';
import { DurationPipe } from '../../shared/duration/duration-pipe';
import { MediaCarousel } from '../../shared/media-carousel/media-carousel';
import { RatingBadge } from '../../shared/rating-badge/rating-badge';

@Component({
  selector: 'app-details',
  imports: [DurationPipe, MediaCarousel, RatingBadge],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  protected readonly tmdb = inject(TmdbService);
  private readonly watchlist = inject(WatchlistService);
  private readonly sanitizer = inject(DomSanitizer);

  // Both come from the route: "type" from the route data, "id" from the URL (/movie/:id)
  readonly type = input.required<MediaType>();
  readonly id = input.required<string>();

  // Fetches the details again every time type or id change
  // (e.g. when the user clicks a similar title, this same page is reused with a new id)
  protected readonly details = rxResource({
    params: () => ({ type: this.type(), id: Number(this.id()) }),
    stream: ({ params }) => this.tmdb.getDetails(params.type, params.id),
  });

  // Updates by itself when the watchlist changes, because it reads the watchlist signal
  protected readonly inWatchlist = computed(() =>
    this.watchlist.has(this.type(), Number(this.id())),
  );

  toggleWatchlist(): void {
    const media = this.details.value();
    if (!media) {
      return;
    }

    if (this.inWatchlist()) {
      this.watchlist.remove(this.type(), media.id);
    } else {
      this.watchlist.add(media);
    }
  }

  // Everything the template shows, ready to use. null while there is no data yet.
  protected readonly view = computed(() => {
    const media = this.details.value();
    if (!media) {
      return null;
    }

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
