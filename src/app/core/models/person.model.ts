import { MediaItem } from './media.model';

// A title the person worked on. Like search, it mixes movies and TV shows.
export interface PersonCredit extends MediaItem {
  character?: string;
  popularity: number;
}

export interface PersonTranslation {
  iso_639_1: string;
  data: { biography: string };
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  combined_credits: { cast: PersonCredit[] };
  translations: { translations: PersonTranslation[] };
}
