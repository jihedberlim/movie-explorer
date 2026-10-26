import { Component, computed, input } from '@angular/core';
import { getRatingLevel } from '../../core/utils/media.utils';

@Component({
  selector: 'app-rating-badge',
  imports: [],
  templateUrl: './rating-badge.html',
  styleUrl: './rating-badge.css',
})
export class RatingBadge {
  readonly rating = input.required<number>();

  protected readonly level = computed(() => getRatingLevel(this.rating()));
  // 7.856 -> "7.9"
  protected readonly label = computed(() =>
    this.level() === 'none' ? 'N/A' : this.rating().toFixed(1),
  );
}
