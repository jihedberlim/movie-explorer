import { PersonCredit, PersonDetails } from '../models/person.model';
import { getMediaType } from './media.utils';

// News, reality and talk shows: an actor appears there as a guest ("Self"), not as a role
const GUEST_GENRE_IDS = [10763, 10764, 10767];

// The same title shows up once per character (e.g. two roles in one show), so it is kept once.
// The most popular titles come first, like TMDB's "Known for".
export function getFilmography(credits: PersonCredit[]): PersonCredit[] {
  const seen = new Set<string>();
  const filmography = credits.filter((credit) => {
    const key = `${getMediaType(credit)}-${credit.id}`;
    const isGuest = credit.genre_ids?.some((id) => GUEST_GENRE_IDS.includes(id));
    if (isGuest || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
  return filmography.sort((a, b) => b.popularity - a.popularity);
}

// TMDB sends an empty biography when there is no translation, so we fall back to English
export function getBiography(person: PersonDetails): string {
  if (person.biography) {
    return person.biography;
  }
  const english = person.translations.translations.find((t) => t.iso_639_1 === 'en');
  return english?.data.biography ?? '';
}

// Counts full years: someone born on June 4 is still 49 on June 3 of the year they turn 50
export function getAge(
  birthday: string | null,
  deathday: string | null,
  today = new Date(),
): number | null {
  if (!birthday) {
    return null;
  }
  const birth = new Date(birthday);
  const end = deathday ? new Date(deathday) : today;

  let age = end.getUTCFullYear() - birth.getUTCFullYear();
  const hadBirthdayThisYear =
    end.getUTCMonth() > birth.getUTCMonth() ||
    (end.getUTCMonth() === birth.getUTCMonth() && end.getUTCDate() >= birth.getUTCDate());
  if (!hadBirthdayThisYear) {
    age--;
  }
  return age;
}

// TMDB dates are "YYYY-MM-DD". timeZone UTC keeps "1975-06-04" from showing as June 3 in Brazil.
export function formatDate(date: string, language: string): string {
  return new Date(date).toLocaleDateString(language, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
