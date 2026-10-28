import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MediaItem } from '../../core/models/media.model';
import { FakeIntersectionObserver } from '../../testing/fake-intersection-observer';
import { Discover } from './discover';

describe('Discover', () => {
  const apiUrl = environment.tmdbApiUrl;
  let fixture: ComponentFixture<Discover>;
  let httpTesting: HttpTestingController;
  let navigateSpy: ReturnType<typeof vi.spyOn>;

  function createPage(page: number, totalPages: number, titles: string[]) {
    const results: MediaItem[] = titles.map((title, index) => ({
      id: page * 100 + index,
      title,
      overview: '',
      poster_path: null,
      backdrop_path: null,
      vote_average: 7,
    }));
    return { page, results, total_pages: totalPages, total_results: results.length };
  }

  async function open(queryParams: Record<string, string> = {}) {
    for (const [name, value] of Object.entries(queryParams)) {
      fixture.componentRef.setInput(name, value);
    }
    TestBed.tick();
  }

  function flushGenres(type: 'movie' | 'tv') {
    httpTesting.expectOne(`${apiUrl}/genre/${type}/list`).flush({
      genres: [
        { id: 18, name: 'Drama' },
        { id: 35, name: 'Comedy' },
      ],
    });
  }

  function changeSelect(index: number, value: string) {
    const select: HTMLSelectElement = fixture.nativeElement.querySelectorAll('select')[index];
    select.value = value;
    select.dispatchEvent(new Event('change'));
  }

  beforeEach(async () => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    await TestBed.configureTestingModule({
      imports: [Discover],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Discover);
    httpTesting = TestBed.inject(HttpTestingController);
    navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    httpTesting.verify();
    vi.unstubAllGlobals();
  });

  it('should show popular movies when the URL has no filters', async () => {
    await open();
    flushGenres('movie');

    const req = httpTesting.expectOne((r) => r.url === `${apiUrl}/discover/movie`);
    expect(req.request.params.get('sort_by')).toBe('popularity.desc');
    req.flush(createPage(1, 1, ['Dune', 'Alien']));
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('app-movie-card').length).toBe(2);
  });

  it('should use the filters from the URL', async () => {
    await open({ type: 'tv', genre: '18', year: '2008', sort: 'top_rated' });
    flushGenres('tv');

    const req = httpTesting.expectOne((r) => r.url === `${apiUrl}/discover/tv`);
    expect(req.request.params.get('with_genres')).toBe('18');
    expect(req.request.params.get('first_air_date_year')).toBe('2008');
    expect(req.request.params.get('sort_by')).toBe('vote_average.desc');
    req.flush(createPage(1, 1, []));
  });

  it('should put the chosen genre in the URL', async () => {
    await open();
    flushGenres('movie');
    httpTesting.expectOne((r) => r.url === `${apiUrl}/discover/movie`).flush(createPage(1, 1, []));
    await fixture.whenStable();

    changeSelect(1, '18');

    expect(navigateSpy).toHaveBeenCalledWith(['/discover'], {
      queryParams: { genre: '18' },
      queryParamsHandling: 'merge',
    });
  });

  it('should clear the genre when the type changes', async () => {
    await open({ genre: '18' });
    flushGenres('movie');
    httpTesting.expectOne((r) => r.url === `${apiUrl}/discover/movie`).flush(createPage(1, 1, []));
    await fixture.whenStable();

    changeSelect(0, 'tv');

    expect(navigateSpy).toHaveBeenCalledWith(['/discover'], {
      queryParams: { type: 'tv', genre: null },
      queryParamsHandling: 'merge',
    });
  });

  it('should load the next page with the same filters when the user reaches the end', async () => {
    await open({ genre: '18' });
    flushGenres('movie');
    httpTesting
      .expectOne((r) => r.url === `${apiUrl}/discover/movie`)
      .flush(createPage(1, 2, ['Dune', 'Alien']));
    await fixture.whenStable();

    FakeIntersectionObserver.showOnScreen();

    const req = httpTesting.expectOne((r) => r.url === `${apiUrl}/discover/movie`);
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('with_genres')).toBe('18');
    req.flush(createPage(2, 2, ['Arrival']));
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('app-movie-card').length).toBe(3);
  });
});
