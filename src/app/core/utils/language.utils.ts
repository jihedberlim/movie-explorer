import { LANGUAGES, Language } from '../i18n/translations';

// The user's last choice wins; on the first visit, follow the browser language
// ("pt-PT" and "es-MX" still get Portuguese and Spanish), and English for anything else
export function resolveLanguage(saved: string | null, browserLanguage = ''): Language {
  const savedLanguage = LANGUAGES.find((language) => language.code === saved);
  if (savedLanguage) {
    return savedLanguage.code;
  }
  if (browserLanguage.startsWith('pt')) {
    return 'pt-BR';
  }
  if (browserLanguage.startsWith('es')) {
    return 'es-ES';
  }
  return 'en-US';
}

// Fills the {placeholders} of a translation, e.g. "No results for {query}"
export function fillParams(text: string, params: Record<string, string | number> = {}): string {
  return text.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    name in params ? String(params[name]) : placeholder,
  );
}
