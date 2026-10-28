import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const LOAD_ERROR_MESSAGE = 'Failed to load. Please check your connection and try again.';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error) => {
      toast.show(LOAD_ERROR_MESSAGE);
      // Rethrow so the page that made the request can also leave its loading state
      return throwError(() => error);
    }),
  );
};
