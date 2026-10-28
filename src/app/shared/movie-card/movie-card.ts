import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MediaItem } from '../../core/models/media.model';
import { TmdbService } from '../../core/services/tmdb.service';
import { getMediaType, getTitle, getYear } from '../../core/utils/media.utils';
import { RatingBadge } from '../rating-badge/rating-badge';

@Component({
  selector: 'app-movie-card',
  imports: [RouterLink, RatingBadge],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
})
export class MovieCard {
  private readonly tmdb = inject(TmdbService);

  readonly item = input.required<MediaItem>();

  protected readonly title = computed(() => getTitle(this.item()));
  protected readonly year = computed(() => getYear(this.item()));
  protected readonly link = computed(() => ['/', getMediaType(this.item()), this.item().id]);
  protected readonly posterUrl = computed(() =>
    this.tmdb.getImageUrl(this.item().poster_path, 'w342'),
  );
}
