import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Movie Explorer',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'search',
    title: 'Search | Movie Explorer',
    loadComponent: () => import('./features/search/search').then((m) => m.Search),
  },
  {
    path: 'discover',
    title: 'Discover | Movie Explorer',
    loadComponent: () => import('./features/discover/discover').then((m) => m.Discover),
  },
  {
    path: 'movie/:id',
    data: { type: 'movie' },
    title: 'Details | Movie Explorer',
    loadComponent: () => import('./features/details/details').then((m) => m.Details),
  },
  {
    path: 'tv/:id',
    data: { type: 'tv' },
    title: 'Details | Movie Explorer',
    loadComponent: () => import('./features/details/details').then((m) => m.Details),
  },
  {
    path: 'watchlist',
    title: 'My Watchlist | Movie Explorer',
    loadComponent: () => import('./features/watchlist/watchlist').then((m) => m.Watchlist),
  },
  {
    // "**" matches any URL not listed above, so it must stay last
    path: '**',
    title: 'Page Not Found | Movie Explorer',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
