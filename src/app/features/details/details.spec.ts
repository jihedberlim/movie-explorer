import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MediaDetails } from '../../core/models/media.model';
import { WatchlistService } from '../../core/services/watchlist.service';
import { Details } from './details';

describe('Details', () => {
  const apiUrl = environment.tmdbApiUrl;
  let fixture: ComponentFixture<Details>;
  let httpTesting: HttpTestingController;

  function createDetails(fields: Partial<MediaDetails> = {}): MediaDetails {
    return {
      id: 157336,
      title: 'Interstellar',
      overview: 'A team of explorers travel through a wormhole in space.',
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      vote_average: 8.5,
      release_date: '2014-11-05',
      runtime: 169,
      genres: [
        { id: 12, name: 'Adventure' },
        { id: 878, name: 'Science Fiction' },
      ],
      credits: {
        cast: [{ id: 10297, name: 'Matthew McConaughey', character: 'Cooper', profile_path: null }],
      },
      videos: { results: [{ key: 'abc123', name: 'Trailer', site: 'YouTube', type: 'Trailer' }] },
      similar: { page: 1, results: [], total_pages: 0, total_results: 0 },
      ...fields,
    };
  }

  function open(type: 'movie' | 'tv', id: string) {
    fixture.componentRef.setInput('type', type);
    fixture.componentRef.setInput('id', id);
    TestBed.tick(); // lets the resource start the request
  }

  beforeEach(async () => {
    localStorage.clear(); // each test starts with an empty watchlist
    await TestBed.configureTestingModule({
      imports: [Details],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Details);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should request the details of the movie in the URL', () => {
    open('movie', '157336');

    httpTesting.expectOne((r) => r.url === `${apiUrl}/movie/157336`);
  });

  it('should show an error message with a retry button when loading fails', async () => {
    open('movie', '999999999');
    httpTesting
      .expectOne((r) => r.url === `${apiUrl}/movie/999999999`)
      .flush(null, { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain("We couldn't load this title");

    const retryButton: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    retryButton.click();
    TestBed.tick();

    httpTesting.expectOne((r) => r.url === `${apiUrl}/movie/999999999`).flush(createDetails());
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Interstellar');
  });

  it('should add the title to the watchlist and remove it again', async () => {
    open('movie', '157336');
    httpTesting.expectOne((r) => r.url === `${apiUrl}/movie/157336`).flush(createDetails());
    await fixture.whenStable();
    const watchlist = TestBed.inject(WatchlistService);
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Add to watchlist');

    button.click();
    await fixture.whenStable();

    expect(watchlist.has('movie', 157336)).toBe(true);
    expect(button.textContent).toContain('In your watchlist');

    button.click();
    await fixture.whenStable();

    expect(watchlist.has('movie', 157336)).toBe(false);
  });

  it('should request TV show details for a TV route', () => {
    open('tv', '1396');

    httpTesting.expectOne((r) => r.url === `${apiUrl}/tv/1396`);
  });

  it('should show the title, year, runtime, genres, overview and cast', async () => {
    open('movie', '157336');
    httpTesting.expectOne((r) => r.url === `${apiUrl}/movie/157336`).flush(createDetails());
    await fixture.whenStable();

    const text: string = fixture.nativeElement.textContent;
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Interstellar');
    expect(text).toContain('2014');
    expect(text).toContain('2h 49min');
    expect(text).toContain('Adventure, Science Fiction');
    expect(text).toContain('A team of explorers');
    expect(text).toContain('Matthew McConaughey');
  });

  it('should embed the YouTube trailer', async () => {
    open('movie', '157336');
    httpTesting.expectOne((r) => r.url === `${apiUrl}/movie/157336`).flush(createDetails());
    await fixture.whenStable();

    const iframe: HTMLIFrameElement = fixture.nativeElement.querySelector('iframe');
    expect(iframe.src).toBe('https://www.youtube-nocookie.com/embed/abc123');
  });

  it('should hide the trailer section when there is no trailer', async () => {
    open('movie', '157336');
    httpTesting
      .expectOne((r) => r.url === `${apiUrl}/movie/157336`)
      .flush(createDetails({ videos: { results: [] } }));
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('iframe')).toBeNull();
  });

  it('should load the new title when the id changes (clicking a similar title)', async () => {
    open('movie', '157336');
    httpTesting.expectOne((r) => r.url === `${apiUrl}/movie/157336`).flush(createDetails());
    await fixture.whenStable();

    open('movie', '27205');
    httpTesting
      .expectOne((r) => r.url === `${apiUrl}/movie/27205`)
      .flush(createDetails({ id: 27205, title: 'Inception' }));
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Inception');
  });
});
