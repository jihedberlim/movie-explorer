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

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private readonly http = inject(HttpClient);
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

  // One request brings the details plus cast, videos and similar titles
  getDetails(type: MediaType, id: number): Observable<MediaDetails> {
    return this.http.get<MediaDetails>(`${this.apiUrl}/${type}/${id}`, {
      params: { append_to_response: 'credits,videos,similar' },
    });
  }

  getGenres(type: MediaType): Observable<Genre[]> {
    return this.http
      .get<{ genres: Genre[] }>(`${this.apiUrl}/genre/${type}/list`)
      .pipe(map((response) => response.genres));
  }

  discover(filters: DiscoverFilters): Observable<PagedResponse<MediaItem>> {
    const params: Record<string, string | number> = {
      page: filters.page ?? 1,
      sort_by: filters.sortBy ?? 'popularity.desc',
    };

    // Only send the filters the user actually picked
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

  // TMDB only sends the end of the image path (e.g. "/abc.jpg"), so we add the base URL and size
  getImageUrl(path: string | null, size = 'w500'): string | null {
    if (!path) {
      return null;
    }
    return `${environment.tmdbImageUrl}/${size}${path}`;
  }
}
