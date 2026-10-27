import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { TMDB_LANGUAGE, languageInterceptor } from './language.interceptor';

describe('languageInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([languageInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should add the language to TMDB requests, keeping the other params', () => {
    const url = `${environment.tmdbApiUrl}/search/multi`;
    http.get(url, { params: { query: 'Vingadores' } }).subscribe();

    const req = httpTesting.expectOne((r) => r.url === url);
    expect(req.request.params.get('language')).toBe(TMDB_LANGUAGE);
    expect(req.request.params.get('query')).toBe('Vingadores');
  });

  it('should not add the language to requests for other sites', () => {
    const url = 'https://example.com/data';
    http.get(url).subscribe();

    const req = httpTesting.expectOne(url);
    expect(req.request.params.has('language')).toBe(false);
  });
});
