import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const TMDB_LANGUAGE = 'pt-BR';

// Asks TMDB for titles, overviews and genres in Brazilian Portuguese.
// It also makes searches in Portuguese ("Vingadores") find the right titles first.
export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.tmdbApiUrl)) {
    return next(req);
  }

  return next(req.clone({ setParams: { language: TMDB_LANGUAGE } }));
};
