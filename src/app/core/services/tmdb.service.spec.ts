import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { LANGUAGE_STORAGE_KEY } from './language.service';
import { TmdbService } from './tmdb.service';

describe('TmdbService', () => {
  const apiUrl = environment.tmdbApiUrl;
  let service: TmdbService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'pt-BR');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TmdbService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Test files share localStorage, so the language must not leak into the next file
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    httpTesting.verify();
  });

  it('should get trending titles of the week', () => {
    service.getTrending().subscribe();

    const req = httpTesting.expectOne(`${apiUrl}/trending/all/week`);
    expect(req.request.method).toBe('GET');
  });

  it('should get top rated movies', () => {
    service.getTopRated().subscribe();

    httpTesting.expectOne(`${apiUrl}/movie/top_rated`);
  });

  it('should get upcoming movies', () => {
    service.getUpcoming().subscribe();

    httpTesting.expectOne(`${apiUrl}/movie/upcoming`);
  });

  it('should search with the query and page as params', () => {
    service.search('Interstellar', 2).subscribe();

    const req = httpTesting.expectOne((r) => r.url === `${apiUrl}/search/multi`);
    expect(req.request.params.get('query')).toBe('Interstellar');
    expect(req.request.params.get('page')).toBe('2');
  });

  it('should search the first page by default', () => {
    service.search('Interstellar').subscribe();

    const req = httpTesting.expectOne((r) => r.url === `${apiUrl}/search/multi`);
    expect(req.request.params.get('page')).toBe('1');
  });

  it('should get details with cast, videos in the chosen language and similar titles', () => {
    service.getDetails('tv', 1396).subscribe();

    const req = httpTesting.expectOne((r) => r.url === `${apiUrl}/tv/1396`);
    expect(req.request.params.get('append_to_response')).toBe('credits,videos,similar');
    expect(req.request.params.get('include_video_language')).toBe('pt,en');
  });

  it('should get a person with their movies, TV shows and biography translations', () => {
    service.getPerson(10297).subscribe();

    const req = httpTesting.expectOne((r) => r.url === `${apiUrl}/person/10297`);
    expect(req.request.params.get('append_to_response')).toBe('combined_credits,translations');
  });

  it('should return only the genres array', () => {
    let genres: unknown;
    service.getGenres('movie').subscribe((result) => (genres = result));

    httpTesting
      .expectOne(`${apiUrl}/genre/movie/list`)
      .flush({ genres: [{ id: 28, name: 'Action' }] });

    expect(genres).toEqual([{ id: 28, name: 'Action' }]);
  });

  it('should discover movies with genre and release year', () => {
    service.discover({ type: 'movie', genreId: 28, year: 2014 }).subscribe();

    const req = httpTesting.expectOne((r) => r.url === `${apiUrl}/discover/movie`);
    expect(req.request.params.get('with_genres')).toBe('28');
    expect(req.request.params.get('primary_release_year')).toBe('2014');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('sort_by')).toBe('popularity.desc');
  });

  it('should use first_air_date_year for the year of TV shows', () => {
    service.discover({ type: 'tv', year: 2008 }).subscribe();

    const req = httpTesting.expectOne((r) => r.url === `${apiUrl}/discover/tv`);
    expect(req.request.params.get('first_air_date_year')).toBe('2008');
    expect(req.request.params.has('primary_release_year')).toBe(false);
  });

  it('should not send filters the user did not pick', () => {
    service.discover({ type: 'movie' }).subscribe();

    const req = httpTesting.expectOne((r) => r.url === `${apiUrl}/discover/movie`);
    expect(req.request.params.has('with_genres')).toBe(false);
    expect(req.request.params.has('primary_release_year')).toBe(false);
  });

  it('should sort top rated titles by rating, ignoring titles with few votes', () => {
    service.discover({ type: 'movie', sortBy: 'top_rated' }).subscribe();

    const req = httpTesting.expectOne((r) => r.url === `${apiUrl}/discover/movie`);
    expect(req.request.params.get('sort_by')).toBe('vote_average.desc');
    expect(req.request.params.get('vote_count.gte')).toBe('200');
  });

  it('should sort the newest movies by release date', () => {
    service.discover({ type: 'movie', sortBy: 'newest' }).subscribe();

    const req = httpTesting.expectOne((r) => r.url === `${apiUrl}/discover/movie`);
    expect(req.request.params.get('sort_by')).toBe('primary_release_date.desc');
  });

  it('should sort the newest TV shows by first air date', () => {
    service.discover({ type: 'tv', sortBy: 'newest' }).subscribe();

    const req = httpTesting.expectOne((r) => r.url === `${apiUrl}/discover/tv`);
    expect(req.request.params.get('sort_by')).toBe('first_air_date.desc');
  });

  it('should build the full image url', () => {
    expect(service.getImageUrl('/poster.jpg')).toBe(`${environment.tmdbImageUrl}/w500/poster.jpg`);
    expect(service.getImageUrl('/poster.jpg', 'w185')).toBe(
      `${environment.tmdbImageUrl}/w185/poster.jpg`,
    );
  });

  it('should return null when there is no image', () => {
    expect(service.getImageUrl(null)).toBeNull();
  });
});
