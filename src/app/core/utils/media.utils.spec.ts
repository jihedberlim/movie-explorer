import { MediaDetails, MediaItem, Video } from '../models/media.model';
import {
  appendUnique,
  findTrailer,
  getMediaType,
  getRatingLevel,
  getRuntime,
  getTitle,
  getYear,
  onlyMoviesAndTv,
} from './media.utils';

// Builds a fake item with only the fields each test cares about
function createItem(fields: Partial<MediaItem>): MediaItem {
  return {
    id: 1,
    overview: '',
    poster_path: null,
    backdrop_path: null,
    vote_average: 0,
    ...fields,
  };
}

describe('media utils', () => {
  describe('getTitle', () => {
    it('should use the title of a movie', () => {
      expect(getTitle(createItem({ title: 'Interstellar' }))).toBe('Interstellar');
    });

    it('should use the name of a TV show', () => {
      expect(getTitle(createItem({ name: 'Breaking Bad' }))).toBe('Breaking Bad');
    });

    it('should fall back to "Untitled" when there is no title or name', () => {
      expect(getTitle(createItem({}))).toBe('Untitled');
    });
  });

  describe('getYear', () => {
    it('should get the year from the release date of a movie', () => {
      expect(getYear(createItem({ release_date: '2014-11-05' }))).toBe('2014');
    });

    it('should get the year from the first air date of a TV show', () => {
      expect(getYear(createItem({ first_air_date: '2008-01-20' }))).toBe('2008');
    });

    it('should return null when the date is empty or missing', () => {
      expect(getYear(createItem({ release_date: '' }))).toBeNull();
      expect(getYear(createItem({}))).toBeNull();
    });
  });

  describe('getMediaType', () => {
    it('should use media_type when TMDB sends it', () => {
      expect(getMediaType(createItem({ media_type: 'tv', title: 'Ignored' }))).toBe('tv');
      expect(getMediaType(createItem({ media_type: 'movie' }))).toBe('movie');
    });

    it('should treat items with a title as movies', () => {
      expect(getMediaType(createItem({ title: 'Interstellar' }))).toBe('movie');
    });

    it('should treat items without a title as TV shows', () => {
      expect(getMediaType(createItem({ name: 'Breaking Bad' }))).toBe('tv');
    });
  });

  describe('onlyMoviesAndTv', () => {
    it('should remove people from the list', () => {
      const movie = createItem({ id: 1, media_type: 'movie' });
      const show = createItem({ id: 2, media_type: 'tv' });
      const person = createItem({ id: 3, media_type: 'person' });

      expect(onlyMoviesAndTv([movie, person, show])).toEqual([movie, show]);
    });
  });

  describe('appendUnique', () => {
    it('should add the new items at the end, keeping the order', () => {
      const dune = createItem({ id: 1, title: 'Dune' });
      const alien = createItem({ id: 2, title: 'Alien' });

      expect(appendUnique([dune], [alien])).toEqual([dune, alien]);
    });

    it('should skip items that are already in the list', () => {
      const dune = createItem({ id: 1, title: 'Dune' });
      const alien = createItem({ id: 2, title: 'Alien' });

      expect(appendUnique([dune, alien], [alien])).toEqual([dune, alien]);
    });

    it('should keep a movie and a TV show that share the same id', () => {
      const movie = createItem({ id: 1, media_type: 'movie' });
      const show = createItem({ id: 1, media_type: 'tv' });

      expect(appendUnique([movie], [show])).toEqual([movie, show]);
    });
  });

  describe('getRuntime', () => {
    function createDetails(fields: Partial<MediaDetails>): MediaDetails {
      return {
        ...createItem({}),
        genres: [],
        credits: { cast: [] },
        videos: { results: [] },
        similar: { page: 1, results: [], total_pages: 0, total_results: 0 },
        ...fields,
      };
    }

    it('should use the runtime of a movie', () => {
      expect(getRuntime(createDetails({ runtime: 169 }))).toBe(169);
    });

    it('should use the episode length of a TV show', () => {
      expect(getRuntime(createDetails({ episode_run_time: [47, 50] }))).toBe(47);
    });

    it('should return null when the runtime is unknown', () => {
      expect(getRuntime(createDetails({ runtime: 0 }))).toBeNull();
      expect(getRuntime(createDetails({ episode_run_time: [] }))).toBeNull();
    });
  });

  describe('findTrailer', () => {
    function createVideo(key: string, type: string, site = 'YouTube'): Video {
      return { key, name: key, type, site };
    }

    it('should pick the first YouTube trailer', () => {
      const videos = [
        createVideo('clip', 'Clip'),
        createVideo('vimeo-trailer', 'Trailer', 'Vimeo'),
        createVideo('trailer', 'Trailer'),
      ];

      expect(findTrailer(videos)?.key).toBe('trailer');
    });

    it('should pick a teaser when there is no trailer', () => {
      const videos = [createVideo('clip', 'Clip'), createVideo('teaser', 'Teaser')];

      expect(findTrailer(videos)?.key).toBe('teaser');
    });

    it('should return null when there is no trailer or teaser', () => {
      expect(findTrailer([createVideo('clip', 'Clip')])).toBeNull();
      expect(findTrailer([])).toBeNull();
    });
  });

  describe('getRatingLevel', () => {
    it('should be "high" from 7 up', () => {
      expect(getRatingLevel(7)).toBe('high');
      expect(getRatingLevel(8.6)).toBe('high');
    });

    it('should be "medium" from 5 up to below 7', () => {
      expect(getRatingLevel(5)).toBe('medium');
      expect(getRatingLevel(6.9)).toBe('medium');
    });

    it('should be "low" below 5', () => {
      expect(getRatingLevel(4.9)).toBe('low');
    });

    it('should be "none" when nobody voted yet', () => {
      expect(getRatingLevel(0)).toBe('none');
    });
  });
});
