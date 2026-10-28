import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { WatchlistService } from './core/services/watchlist.service';
import { Toast } from './shared/toast/toast';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Toast],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly watchlist = inject(WatchlistService);
  protected readonly themeService = inject(ThemeService);
}
