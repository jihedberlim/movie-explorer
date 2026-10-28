import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const TMDB_LANGUAGE = 'pt-BR';

// Without it, searches in Portuguese ("Vingadores") rank the wrong titles first
export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.tmdbApiUrl)) {
    return next(req);
  }

  return next(req.clone({ setParams: { language: TMDB_LANGUAGE } }));
};
