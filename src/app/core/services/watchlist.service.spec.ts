import { TestBed } from '@angular/core/testing';
import { MediaItem } from '../models/media.model';
import { WATCHLIST_STORAGE_KEY, WatchlistService } from './watchlist.service';

describe('WatchlistService', () => {
  let service: WatchlistService;

  const interstellar: MediaItem = {
    id: 157336,
    title: 'Interstellar',
    overview: '',
    poster_path: '/poster.jpg',
    backdrop_path: null,
    vote_average: 8.5,
    release_date: '2014-11-05',
  };

  const breakingBad: MediaItem = {
    id: 1396,
    name: 'Breaking Bad',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    vote_average: 9,
    first_air_date: '2008-01-20',
  };

  function reopenApp(): WatchlistService {
    TestBed.resetTestingModule();
    return TestBed.inject(WatchlistService);
  }

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(WatchlistService);
  });

  it('should start empty', () => {
    expect(service.items()).toEqual([]);
    expect(service.count()).toBe(0);
  });

  it('should add a title with the info needed to show it', () => {
    service.add(interstellar);

    expect(service.items()).toEqual([
      {
        id: 157336,
        mediaType: 'movie',
        title: 'Interstellar',
        posterPath: '/poster.jpg',
        voteAverage: 8.5,
        year: '2014',
        watched: false,
      },
    ]);
    expect(service.has('movie', 157336)).toBe(true);
  });

  it('should put the newest title first', () => {
    service.add(interstellar);
    service.add(breakingBad);

    expect(service.items().map((item) => item.title)).toEqual(['Breaking Bad', 'Interstellar']);
  });

  it('should not add the same title twice', () => {
    service.add(interstellar);
    service.add(interstellar);

    expect(service.count()).toBe(1);
  });

  it('should treat a movie and a TV show with the same id as different titles', () => {
    service.add(interstellar);
    service.add({ ...breakingBad, id: 157336 });

    expect(service.count()).toBe(2);
  });

  it('should remove a title', () => {
    service.add(interstellar);
    service.add(breakingBad);

    service.remove('movie', 157336);

    expect(service.has('movie', 157336)).toBe(false);
    expect(service.count()).toBe(1);
  });

  it('should mark a title as watched and back', () => {
    service.add(interstellar);

    service.toggleWatched('movie', 157336);
    expect(service.items()[0].watched).toBe(true);

    service.toggleWatched('movie', 157336);
    expect(service.items()[0].watched).toBe(false);
  });

  it('should keep the list after the app is opened again', () => {
    service.add(interstellar);
    service.toggleWatched('movie', 157336);

    const reopened = reopenApp();

    expect(reopened.items()).toEqual(service.items());
  });

  it('should start empty when the saved data is broken', () => {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, '{not valid json');

    expect(reopenApp().items()).toEqual([]);
  });
});
