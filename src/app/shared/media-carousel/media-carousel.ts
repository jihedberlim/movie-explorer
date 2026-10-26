import { Component, input } from '@angular/core';
import { MediaItem } from '../../core/models/media.model';
import { MovieCard } from '../movie-card/movie-card';

@Component({
  selector: 'app-media-carousel',
  imports: [MovieCard],
  templateUrl: './media-carousel.html',
  styleUrl: './media-carousel.css',
})
export class MediaCarousel {
  readonly title = input.required<string>();
  readonly items = input.required<MediaItem[]>();
}
