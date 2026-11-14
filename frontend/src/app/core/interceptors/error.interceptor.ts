import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const esLogin = req.url.includes('/api/auth/login');

  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {
      let msg = `Error inesperado (código ${e.status})`;
      if (e.status === 0) msg = 'No hay conexión con el servidor';
      else if (e.status === 401 || (e.status === 403 && esLogin)) {
        msg = esLogin ? 'Usuario o contraseña incorrectos' : 'Sesión expirada';
        if (!esLogin) auth.logout();
      } else if (e.status === 403) msg = 'No tienes permiso para esta acción';
      else if (typeof e.error?.message === 'string') msg = e.error.message;
      else if (typeof e.error?.error === 'string') msg = e.error.error;
      return throwError(() => new Error(msg));
    })
  );
};