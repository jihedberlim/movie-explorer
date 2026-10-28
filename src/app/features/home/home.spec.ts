import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MediaItem } from '../../core/models/media.model';
import { Home } from './home';

describe('Home', () => {
  const apiUrl = environment.tmdbApiUrl;
  let fixture: ComponentFixture<Home>;
  let httpTesting: HttpTestingController;

  function createPage(items: Partial<MediaItem>[]) {
    const results = items.map((item, index) => ({
      id: index + 1,
      overview: '',
      poster_path: null,
      backdrop_path: null,
      vote_average: 7,
      ...item,
    }));
    return { page: 1, results, total_pages: 1, total_results: results.length };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should show the three carousels with the movies from TMDB', async () => {
    httpTesting
      .expectOne(`${apiUrl}/trending/all/week`)
      .flush(createPage([{ title: 'Dune', media_type: 'movie' }]));
    httpTesting.expectOne(`${apiUrl}/movie/top_rated`).flush(createPage([{ title: 'Alien' }]));
    httpTesting.expectOne(`${apiUrl}/movie/upcoming`).flush(createPage([{ title: 'Avatar' }]));
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;
    const titles = Array.from(element.querySelectorAll('h2')).map((h2) => h2.textContent?.trim());
    expect(titles).toEqual(['Trending this week', 'Top rated movies', 'Coming soon']);
    expect(element.textContent).toContain('Dune');
    expect(element.textContent).toContain('Alien');
    expect(element.textContent).toContain('Avatar');
  });

  it('should feature the first trending title with an image in the hero', async () => {
    httpTesting.expectOne(`${apiUrl}/trending/all/week`).flush(
      createPage([
        { title: 'No Image', media_type: 'movie', overview: 'Plot' },
        { title: 'Dune', media_type: 'movie', overview: 'Plot', backdrop_path: '/dune.jpg' },
      ]),
    );
    httpTesting.expectOne(`${apiUrl}/movie/top_rated`).flush(createPage([]));
    httpTesting.expectOne(`${apiUrl}/movie/upcoming`).flush(createPage([]));
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('h1')?.textContent).toContain('Dune');
    expect(element.querySelector('section a')?.getAttribute('href')).toBe('/movie/2');
  });

  it('should not show people in the trending carousel', async () => {
    httpTesting.expectOne(`${apiUrl}/trending/all/week`).flush(
      createPage([
        { title: 'Dune', media_type: 'movie' },
        { name: 'Zendaya', media_type: 'person' },
      ]),
    );
    httpTesting.expectOne(`${apiUrl}/movie/top_rated`).flush(createPage([]));
    httpTesting.expectOne(`${apiUrl}/movie/upcoming`).flush(createPage([]));
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).not.toContain('Zendaya');
  });
});
