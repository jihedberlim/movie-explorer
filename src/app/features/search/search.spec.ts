import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MediaItem } from '../../core/models/media.model';
import { FakeIntersectionObserver } from '../../testing/fake-intersection-observer';
import { Search } from './search';

describe('Search', () => {
  const searchUrl = `${environment.tmdbApiUrl}/search/multi`;
  let fixture: ComponentFixture<Search>;
  let httpTesting: HttpTestingController;

  function createPage(page: number, totalPages: number, titles: string[]) {
    const results: MediaItem[] = titles.map((title, index) => ({
      id: page * 100 + index,
      title,
      media_type: 'movie',
      overview: '',
      poster_path: null,
      backdrop_path: null,
      vote_average: 7,
    }));
    return { page, results, total_pages: totalPages, total_results: results.length };
  }

  // Creates the page as if the browser opened /search?q=<urlQuery>
  function setup(urlQuery: string | null = null) {
    TestBed.configureTestingModule({
      imports: [Search],
      providers: [
        provideRouter([{ path: 'search', component: Search }]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: convertToParamMap(urlQuery ? { q: urlQuery } : {}) },
          },
        },
      ],
    });
    fixture = TestBed.createComponent(Search);
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  // Types in the search box like a user would
  function type(text: string) {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = text;
    input.dispatchEvent(new Event('input'));
  }

  function countCards(): number {
    fixture.detectChanges();
    return fixture.nativeElement.querySelectorAll('app-movie-card').length;
  }

  beforeEach(() => {
    // A fake clock: we move time forward ourselves instead of really waiting
    vi.useFakeTimers();
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  });

  afterEach(() => {
    httpTesting.verify();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should send only one request when the user types fast', () => {
    setup();

    // One letter every 100 ms: always faster than the 400 ms debounce
    for (const text of ['I', 'In', 'Inter', 'Interstel', 'Interstellar']) {
      type(text);
      vi.advanceTimersByTime(100);
    }
    vi.advanceTimersByTime(400);

    const req = httpTesting.expectOne((r) => r.url === searchUrl);
    expect(req.request.params.get('query')).toBe('Interstellar');
  });

  it('should not search again when the text did not change', () => {
    setup();

    type('Dune');
    vi.advanceTimersByTime(400);
    httpTesting.expectOne((r) => r.url === searchUrl).flush(createPage(1, 1, ['Dune']));

    // Typing a space and erasing it ends up with the same text
    type('Dune ');
    vi.advanceTimersByTime(400);

    httpTesting.expectNone((r) => r.url === searchUrl);
  });

  it('should search the text that comes in the URL', () => {
    setup('dune');

    vi.advanceTimersByTime(400);

    const req = httpTesting.expectOne((r) => r.url === searchUrl);
    expect(req.request.params.get('query')).toBe('dune');
  });

  it('should load the next page when the user reaches the end of the grid', () => {
    setup();

    type('Dune');
    vi.advanceTimersByTime(400);
    httpTesting
      .expectOne((r) => r.url === searchUrl)
      .flush(createPage(1, 2, ['Dune', 'Dune: Part Two']));
    expect(countCards()).toBe(2);

    FakeIntersectionObserver.showOnScreen();

    const req = httpTesting.expectOne((r) => r.url === searchUrl);
    expect(req.request.params.get('page')).toBe('2');
    req.flush(createPage(2, 2, ['Dune (1984)']));
    expect(countCards()).toBe(3);
  });

  it('should clear the results when the search box is emptied', () => {
    setup();

    type('Dune');
    vi.advanceTimersByTime(400);
    httpTesting.expectOne((r) => r.url === searchUrl).flush(createPage(1, 1, ['Dune']));
    expect(countCards()).toBe(1);

    type('');
    vi.advanceTimersByTime(400);

    expect(countCards()).toBe(0);
  });
});
