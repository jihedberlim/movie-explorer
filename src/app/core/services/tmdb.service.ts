import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DiscoverFilters,
  Genre,
  MediaDetails,
  MediaItem,
  MediaType,
  PagedResponse,
} from '../models/media.model';
import { PersonDetails } from '../models/person.model';
import { LanguageService } from './language.service';

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private readonly http = inject(HttpClient);
  private readonly language = inject(LanguageService);
  private readonly apiUrl = environment.tmdbApiUrl;

  getTrending(): Observable<PagedResponse<MediaItem>> {
    return this.http.get<PagedResponse<MediaItem>>(`${this.apiUrl}/trending/all/week`);
  }

  getTopRated(): Observable<PagedResponse<MediaItem>> {
    return this.http.get<PagedResponse<MediaItem>>(`${this.apiUrl}/movie/top_rated`);
  }

  getUpcoming(): Observable<PagedResponse<MediaItem>> {
    return this.http.get<PagedResponse<MediaItem>>(`${this.apiUrl}/movie/upcoming`);
  }

  // "multi" searches movies, TV shows and people at the same time
  search(query: string, page = 1): Observable<PagedResponse<MediaItem>> {
    return this.http.get<PagedResponse<MediaItem>>(`${this.apiUrl}/search/multi`, {
      params: { query, page },
    });
  }

  getDetails(type: MediaType, id: number): Observable<MediaDetails> {
    return this.http.get<MediaDetails>(`${this.apiUrl}/${type}/${id}`, {
      params: {
        append_to_response: 'credits,videos,similar',
        // Videos in the chosen language first, English as a backup (many titles only have an
        // English trailer). TMDB wants just the language part here: "pt", not "pt-BR".
        include_video_language: `${this.language.current.slice(0, 2)},en`,
      },
    });
  }

  // "translations" brings the biography in every language, for the English fallback
  getPerson(id: number): Observable<PersonDetails> {
    return this.http.get<PersonDetails>(`${this.apiUrl}/person/${id}`, {
      params: { append_to_response: 'combined_credits,translations' },
    });
  }

  getGenres(type: MediaType): Observable<Genre[]> {
    return this.http
      .get<{ genres: Genre[] }>(`${this.apiUrl}/genre/${type}/list`)
      .pipe(map((response) => response.genres));
  }

  discover(filters: DiscoverFilters): Observable<PagedResponse<MediaItem>> {
    const params: Record<string, string | number> = { page: filters.page ?? 1 };

    if (filters.sortBy === 'top_rated') {
      params['sort_by'] = 'vote_average.desc';
      // Without a minimum, a title with a single 10/10 vote would be first
      params['vote_count.gte'] = 200;
    } else if (filters.sortBy === 'newest') {
      params['sort_by'] =
        filters.type === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc';
      // A few votes means it was already released (skips announced titles)
      params['vote_count.gte'] = 10;
    } else {
      params['sort_by'] = 'popularity.desc';
    }

    if (filters.genreId) {
      params['with_genres'] = filters.genreId;
    }
    if (filters.year) {
      // TMDB uses a different parameter name for the year of movies and TV shows
      const yearParam = filters.type === 'movie' ? 'primary_release_year' : 'first_air_date_year';
      params[yearParam] = filters.year;
    }

    return this.http.get<PagedResponse<MediaItem>>(`${this.apiUrl}/discover/${filters.type}`, {
      params,
    });
  }

  getImageUrl(path: string | null, size = 'w500'): string | null {
    if (!path) {
      return null;
    }
    return `${environment.tmdbImageUrl}/${size}${path}`;
  }
}
