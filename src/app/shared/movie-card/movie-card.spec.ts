import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MediaItem } from '../../core/models/media.model';
import { WatchlistService } from '../../core/services/watchlist.service';
import { MovieCard } from './movie-card';

describe('MovieCard', () => {
  let fixture: ComponentFixture<MovieCard>;

  const movie: MediaItem = {
    id: 157336,
    title: 'Interstellar',
    overview: '',
    poster_path: '/poster.jpg',
    backdrop_path: null,
    vote_average: 8.4,
    release_date: '2014-11-05',
  };

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [MovieCard],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCard);
  });

  async function render(item: MediaItem): Promise<HTMLElement> {
    fixture.componentRef.setInput('item', item);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('should show the title and year', async () => {
    const card = await render(movie);
    expect(card.querySelector('h3')?.textContent).toContain('Interstellar');
    expect(card.textContent).toContain('2014');
  });

  it('should link to the movie details page', async () => {
    const card = await render(movie);
    expect(card.querySelector('a')?.getAttribute('href')).toBe('/movie/157336');
  });

  it('should link to the TV details page for a TV show', async () => {
    const card = await render({ ...movie, title: undefined, name: 'Breaking Bad', id: 1396 });
    expect(card.querySelector('a')?.getAttribute('href')).toBe('/tv/1396');
  });

  it('should not render an image when there is no poster', async () => {
    const card = await render({ ...movie, poster_path: null });
    expect(card.querySelector('img')).toBeNull();
  });

  it('should add the title to the watchlist and remove it on a second click', async () => {
    const card = await render(movie);
    const watchlist = TestBed.inject(WatchlistService);
    const button = card.querySelector('button') as HTMLButtonElement;

    button.click();
    await fixture.whenStable();
    expect(watchlist.has('movie', 157336)).toBe(true);
    expect(button.getAttribute('aria-label')).toBe('Remove Interstellar from watchlist');

    button.click();
    await fixture.whenStable();
    expect(watchlist.has('movie', 157336)).toBe(false);
    expect(button.getAttribute('aria-label')).toBe('Add Interstellar to watchlist');
  });
});
