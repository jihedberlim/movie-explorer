import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LanguageService } from './core/services/language.service';
import { ThemeService } from './core/services/theme.service';
import { WatchlistService } from './core/services/watchlist.service';
import { LanguageSelector } from './shared/language-selector/language-selector';
import { Toast } from './shared/toast/toast';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LanguageSelector, Toast],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly watchlist = inject(WatchlistService);
  protected readonly themeService = inject(ThemeService);
  protected readonly i18n = inject(LanguageService);
}
