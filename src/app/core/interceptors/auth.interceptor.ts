import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Requests to other sites go out untouched, so the token never leaks to them
  if (!req.url.startsWith(environment.tmdbApiUrl)) {
    return next(req);
  }

  // HttpRequest is immutable, so we send a copy with the extra header
  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${environment.tmdbToken}` },
  });
  return next(authReq);
};
