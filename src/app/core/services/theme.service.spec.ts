import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE_KEY, ThemeService } from './theme.service';

describe('ThemeService', () => {
  function pretendOsPrefersDark(prefersDark: boolean) {
    vi.stubGlobal('matchMedia', () => ({ matches: prefersDark }));
  }

  function createService(): ThemeService {
    const service = TestBed.inject(ThemeService);
    TestBed.tick();
    return service;
  }

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should follow the OS setting on the first visit', () => {
    pretendOsPrefersDark(true);

    expect(createService().theme()).toBe('dark');
  });

  it('should use light mode when the OS does not prefer dark', () => {
    pretendOsPrefersDark(false);

    expect(createService().theme()).toBe('light');
  });

  it('should prefer the saved choice over the OS setting', () => {
    pretendOsPrefersDark(true);
    localStorage.setItem(THEME_STORAGE_KEY, 'light');

    expect(createService().theme()).toBe('light');
  });

  it('should switch to dark mode and back', () => {
    pretendOsPrefersDark(false);
    const service = createService();

    service.toggle();
    TestBed.tick();
    expect(document.documentElement.classList).toContain('dark');

    service.toggle();
    TestBed.tick();
    expect(document.documentElement.classList).not.toContain('dark');
  });

  it('should save the choice for the next visit', () => {
    pretendOsPrefersDark(false);
    const service = createService();

    service.toggle();
    TestBed.tick();

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });
});
