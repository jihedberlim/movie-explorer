import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'movie-explorer.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly theme = signal<Theme>(this.initialTheme());

  constructor() {
    effect(() => {
      const theme = this.theme();
      this.document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    });
  }

  toggle(): void {
    this.theme.update((theme) => (theme === 'dark' ? 'light' : 'dark'));
  }

  // The user's last choice wins; on the first visit, follow the OS setting
  private initialTheme(): Theme {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    const prefersDark = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    return prefersDark?.matches ? 'dark' : 'light';
  }
}
