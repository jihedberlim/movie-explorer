import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'search',
    title: 'title.search',
    loadComponent: () => import('./features/search/search').then((m) => m.Search),
  },
  {
    path: 'discover',
    title: 'title.discover',
    loadComponent: () => import('./features/discover/discover').then((m) => m.Discover),
  },
  {
    path: 'movie/:id',
    data: { type: 'movie' },
    title: 'title.details',
    loadComponent: () => import('./features/details/details').then((m) => m.Details),
  },
  {
    path: 'tv/:id',
    data: { type: 'tv' },
    title: 'title.details',
    loadComponent: () => import('./features/details/details').then((m) => m.Details),
  },
  {
    path: 'watchlist',
    title: 'title.watchlist',
    loadComponent: () => import('./features/watchlist/watchlist').then((m) => m.Watchlist),
  },
  {
    // "**" matches any URL not listed above, so it must stay last
    path: '**',
    title: 'title.notFound',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
