import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LanguageService } from '../services/language.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const language = inject(LanguageService);

  return next(req).pipe(
    catchError((error) => {
      toast.show(language.t('error.load'));
      // Rethrow so the page that made the request can also leave its loading state
      return throwError(() => error);
    }),
  );
};
