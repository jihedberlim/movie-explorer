import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LANGUAGE_STORAGE_KEY, LanguageService } from './language.service';

describe('LanguageService', () => {
  const reload = vi.fn();

  // A fake page, so the test can check the reload without really reloading
  function createService(browserLanguage: string): LanguageService {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: {
            documentElement: { lang: '' },
            defaultView: { navigator: { language: browserLanguage } },
            location: { reload },
          },
        },
      ],
    });
    return TestBed.inject(LanguageService);
  }

  beforeEach(() => {
    localStorage.clear();
    reload.mockClear();
  });

  it('should translate a text to the current language', () => {
    const service = createService('pt-BR');
    expect(service.current).toBe('pt-BR');
    expect(service.t('nav.search')).toBe('Buscar');
    expect(service.t('watchlist.all', { count: 2 })).toBe('Todos (2)');
  });

  it('should set the language of the page', () => {
    createService('es-ES');
    expect(TestBed.inject(DOCUMENT).documentElement.lang).toBe('es-ES');
  });

  it('should save the new language and reload the page', () => {
    const service = createService('en-US');

    service.change('es-ES');

    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('es-ES');
    expect(reload).toHaveBeenCalled();
  });

  it('should not reload when the language is already selected', () => {
    const service = createService('en-US');

    service.change('en-US');

    expect(reload).not.toHaveBeenCalled();
  });
});
