import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { WatchlistService } from './core/services/watchlist.service';

@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  // The same watchlist the other pages use, so the counter in the menu is always up to date
  protected readonly watchlist = inject(WatchlistService);
}
