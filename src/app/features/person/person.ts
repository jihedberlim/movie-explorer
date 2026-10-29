import { Component, computed, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { TmdbService } from '../../core/services/tmdb.service';
import { formatDate, getAge, getBiography, getFilmography } from '../../core/utils/person.utils';
import { MovieCard } from '../../shared/movie-card/movie-card';

// Longer biographies start cut, with a "Read more" button
const SHORT_BIOGRAPHY_LENGTH = 600;

@Component({
  selector: 'app-person',
  imports: [MovieCard, RouterLink],
  templateUrl: './person.html',
})
export class Person {
  protected readonly tmdb = inject(TmdbService);
  protected readonly i18n = inject(LanguageService);

  readonly id = input.required<string>();

  protected readonly person = rxResource({
    params: () => Number(this.id()),
    stream: ({ params: id }) => this.tmdb.getPerson(id),
  });

  protected readonly showFullBiography = signal(false);

  protected readonly view = computed(() => {
    // value() throws when the request failed, so check first
    if (!this.person.hasValue()) {
      return null;
    }
    const person = this.person.value();
    const language = this.i18n.current;
    const biography = getBiography(person);

    return {
      person,
      biography,
      isLongBiography: biography.length > SHORT_BIOGRAPHY_LENGTH,
      age: getAge(person.birthday, person.deathday),
      birthday: person.birthday ? formatDate(person.birthday, language) : null,
      deathday: person.deathday ? formatDate(person.deathday, language) : null,
      filmography: getFilmography(person.combined_credits.cast),
    };
  });
}
