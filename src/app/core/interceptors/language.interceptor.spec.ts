import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { LANGUAGE_STORAGE_KEY } from '../services/language.service';
import { languageInterceptor } from './language.interceptor';

describe('languageInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'pt-BR');
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
    // Test files share localStorage, so the language must not leak into the next file
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    httpTesting.verify();
  });

  it('should add the chosen language to TMDB requests, keeping the other params', () => {
    const url = `${environment.tmdbApiUrl}/search/multi`;
    http.get(url, { params: { query: 'Vingadores' } }).subscribe();

    const req = httpTesting.expectOne((r) => r.url === url);
    expect(req.request.params.get('language')).toBe('pt-BR');
    expect(req.request.params.get('query')).toBe('Vingadores');
  });

  it('should not add the language to requests for other sites', () => {
    const url = 'https://example.com/data';
    http.get(url).subscribe();

    const req = httpTesting.expectOne(url);
    expect(req.request.params.has('language')).toBe(false);
  });
});
