import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LanguageService } from '../services/language.service';

// Without it, searches in Portuguese ("Vingadores") rank the wrong titles first
export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.tmdbApiUrl)) {
    return next(req);
  }

  const language = inject(LanguageService).current;
  return next(req.clone({ setParams: { language } }));
};
