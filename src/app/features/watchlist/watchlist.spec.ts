import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MediaItem } from '../../core/models/media.model';
import { WatchlistService } from '../../core/services/watchlist.service';
import { Watchlist } from './watchlist';

describe('Watchlist', () => {
  let fixture: ComponentFixture<Watchlist>;
  let watchlist: WatchlistService;

  function createMovie(id: number, title: string): MediaItem {
    return { id, title, overview: '', poster_path: null, backdrop_path: null, vote_average: 7 };
  }

  function shownTitles(): string[] {
    const titles: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('h3'));
    return titles.map((h3) => h3.textContent?.trim() ?? '');
  }

  function clickButton(text: string) {
    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );
    buttons.find((button) => button.textContent?.includes(text))?.click();
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Watchlist],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    watchlist = TestBed.inject(WatchlistService);
    fixture = TestBed.createComponent(Watchlist);
  });

  it('should show a message when the watchlist is empty', async () => {
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Your watchlist is empty');
  });

  it('should show the saved titles, newest first', async () => {
    watchlist.add(createMovie(1, 'Dune'));
    watchlist.add(createMovie(2, 'Alien'));
    await fixture.whenStable();

    expect(shownTitles()).toEqual(['Alien', 'Dune']);
  });

  it('should mark a title as watched', async () => {
    watchlist.add(createMovie(1, 'Dune'));
    await fixture.whenStable();

    clickButton('✓ Watched');
    await fixture.whenStable();

    expect(watchlist.items()[0].watched).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Watched (1)');
  });

  it('should remove a title', async () => {
    watchlist.add(createMovie(1, 'Dune'));
    watchlist.add(createMovie(2, 'Alien'));
    await fixture.whenStable();

    fixture.nativeElement.querySelector('[aria-label="Remove Dune"]').click();
    await fixture.whenStable();

    expect(shownTitles()).toEqual(['Alien']);
  });

  it('should show only the titles that match the chosen filter', async () => {
    watchlist.add(createMovie(1, 'Dune'));
    watchlist.add(createMovie(2, 'Alien'));
    watchlist.toggleWatched('movie', 1);
    await fixture.whenStable();

    clickButton('To watch');
    await fixture.whenStable();
    expect(shownTitles()).toEqual(['Alien']);

    clickButton('Watched (');
    await fixture.whenStable();
    expect(shownTitles()).toEqual(['Dune']);
  });
});
