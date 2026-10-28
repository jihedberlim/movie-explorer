import { DOCUMENT, Injectable, inject } from '@angular/core';
import { LANGUAGES, Language, TRANSLATIONS, TranslationKey } from '../i18n/translations';
import { fillParams, resolveLanguage } from '../utils/language.utils';

export const LANGUAGE_STORAGE_KEY = 'movie-explorer.language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);

  readonly current: Language = resolveLanguage(
    localStorage.getItem(LANGUAGE_STORAGE_KEY),
    this.document.defaultView?.navigator.language,
  );
  readonly currentOption = LANGUAGES.find((language) => language.code === this.current)!;

  constructor() {
    // Screen readers use it to pick the right pronunciation
    this.document.documentElement.lang = this.current;
  }

  t(key: TranslationKey, params?: Record<string, string | number>): string {
    return fillParams(TRANSLATIONS[this.current][key], params);
  }

  // Reloading is the simplest way to translate everything at once, including the data
  // that already came from TMDB in the old language (titles, overviews, genres)
  change(language: Language): void {
    if (language === this.current) {
      return;
    }
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    this.document.location.reload();
  }
}
