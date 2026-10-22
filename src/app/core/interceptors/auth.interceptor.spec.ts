import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should add the token to TMDB requests', () => {
    const url = `${environment.tmdbApiUrl}/movie/popular`;
    http.get(url).subscribe();

    const req = httpTesting.expectOne(url);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${environment.tmdbToken}`);
  });

  it('should not add the token to requests for other sites', () => {
    const url = 'https://example.com/data';
    http.get(url).subscribe();

    const req = httpTesting.expectOne(url);
    expect(req.request.headers.has('Authorization')).toBe(false);
  });
});
