import { Component, inject, input } from '@angular/core';
import { MediaItem } from '../../core/models/media.model';
import { LanguageService } from '../../core/services/language.service';
import { MovieCard } from '../movie-card/movie-card';
import { SKELETON_COUNT, SkeletonCard } from '../skeleton-card/skeleton-card';

@Component({
  selector: 'app-media-carousel',
  imports: [MovieCard, SkeletonCard],
  templateUrl: './media-carousel.html',
  styleUrl: './media-carousel.css',
})
export class MediaCarousel {
  protected readonly i18n = inject(LanguageService);

  readonly title = input.required<string>();
  // undefined means "still loading"
  readonly items = input.required<MediaItem[] | undefined>();

  protected readonly skeletons = Array.from({ length: SKELETON_COUNT });
}
