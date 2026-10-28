import { fillParams, resolveLanguage } from './language.utils';

describe('language utils', () => {
  describe('resolveLanguage', () => {
    it('should use the saved language first', () => {
      expect(resolveLanguage('es-ES', 'pt-BR')).toBe('es-ES');
    });

    it('should follow the browser language on the first visit', () => {
      expect(resolveLanguage(null, 'pt-BR')).toBe('pt-BR');
      expect(resolveLanguage(null, 'pt-PT')).toBe('pt-BR');
      expect(resolveLanguage(null, 'es-MX')).toBe('es-ES');
    });

    it('should use English for other browser languages', () => {
      expect(resolveLanguage(null, 'fr-FR')).toBe('en-US');
      expect(resolveLanguage(null)).toBe('en-US');
    });

    it('should ignore an invalid saved value', () => {
      expect(resolveLanguage('klingon', 'es-ES')).toBe('es-ES');
    });
  });

  describe('fillParams', () => {
    it('should replace the placeholders with the given values', () => {
      expect(fillParams('All ({count})', { count: 3 })).toBe('All (3)');
      expect(fillParams('Add {title} to {list}', { title: 'Dune', list: 'watchlist' })).toBe(
        'Add Dune to watchlist',
      );
    });

    it('should keep a placeholder that has no value', () => {
      expect(fillParams('No results for {query}')).toBe('No results for {query}');
    });
  });
});
