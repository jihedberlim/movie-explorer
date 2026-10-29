import { PersonCredit, PersonDetails } from '../models/person.model';
import { formatDate, getAge, getBiography, getFilmography } from './person.utils';

function createCredit(fields: Partial<PersonCredit>): PersonCredit {
  return {
    id: 1,
    title: 'Movie',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    vote_average: 0,
    popularity: 0,
    media_type: 'movie',
    ...fields,
  };
}

function createPerson(fields: Partial<PersonDetails>): PersonDetails {
  return {
    id: 10297,
    name: 'Matthew McConaughey',
    biography: '',
    birthday: null,
    deathday: null,
    place_of_birth: null,
    profile_path: null,
    combined_credits: { cast: [] },
    translations: { translations: [] },
    ...fields,
  };
}

describe('person utils', () => {
  describe('getFilmography', () => {
    it('should put the most popular titles first', () => {
      const credits = [
        createCredit({ id: 1, popularity: 5 }),
        createCredit({ id: 2, popularity: 50 }),
        createCredit({ id: 3, popularity: 20 }),
      ];
      expect(getFilmography(credits).map((credit) => credit.id)).toEqual([2, 3, 1]);
    });

    it('should keep a title only once when the person played two roles in it', () => {
      const credits = [
        createCredit({ id: 1, character: 'Role A' }),
        createCredit({ id: 1, character: 'Role B' }),
      ];
      expect(getFilmography(credits)).toHaveLength(1);
    });

    it('should keep a movie and a TV show that share the same id', () => {
      const credits = [
        createCredit({ id: 1, media_type: 'movie' }),
        createCredit({ id: 1, media_type: 'tv', title: undefined, name: 'Show' }),
      ];
      expect(getFilmography(credits)).toHaveLength(2);
    });

    it('should leave out talk, news and reality shows', () => {
      const credits = [
        createCredit({ id: 1, genre_ids: [18] }),
        createCredit({ id: 2, media_type: 'tv', genre_ids: [10767] }),
        createCredit({ id: 3, media_type: 'tv', genre_ids: [35, 10763] }),
        createCredit({ id: 4, media_type: 'tv', genre_ids: [10764] }),
      ];
      expect(getFilmography(credits).map((credit) => credit.id)).toEqual([1]);
    });
  });

  describe('getBiography', () => {
    it('should use the biography in the current language', () => {
      expect(getBiography(createPerson({ biography: 'Ator americano.' }))).toBe('Ator americano.');
    });

    it('should fall back to the English biography when there is no translation', () => {
      const person = createPerson({
        biography: '',
        translations: {
          translations: [
            { iso_639_1: 'fr', data: { biography: 'Acteur américain.' } },
            { iso_639_1: 'en', data: { biography: 'American actor.' } },
          ],
        },
      });
      expect(getBiography(person)).toBe('American actor.');
    });

    it('should return an empty text when there is no biography at all', () => {
      expect(getBiography(createPerson({}))).toBe('');
    });
  });

  describe('getAge', () => {
    const today = new Date('2026-10-28');

    it('should count the full years until today', () => {
      expect(getAge('1969-11-04', null, today)).toBe(56);
    });

    it('should not count the year before the birthday', () => {
      expect(getAge('1969-11-29', null, today)).toBe(56);
      expect(getAge('1969-10-28', null, today)).toBe(57);
    });

    it('should stop counting on the day the person died', () => {
      expect(getAge('1951-07-21', '2014-08-11', today)).toBe(63);
    });

    it('should return null when the birthday is unknown', () => {
      expect(getAge(null, null, today)).toBeNull();
    });
  });

  describe('formatDate', () => {
    it('should write the date in the chosen language', () => {
      expect(formatDate('1969-11-04', 'en-US')).toBe('November 4, 1969');
      expect(formatDate('1969-11-04', 'pt-BR')).toBe('4 de novembro de 1969');
      expect(formatDate('1969-11-04', 'es-ES')).toBe('4 de noviembre de 1969');
    });
  });
});
