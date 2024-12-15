import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token') || '';
  const cloneRequest = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });

  // Excepcion1: POST de registro y listado de profesores para HOME (Van sin token y son formData)
  if (
    (req.method === 'POST' && req.url.includes('/api/profesores/registro')) ||
    (req.method === 'POST' && req.url.includes('/api/alumnos/registro')) ||
    (req.method === 'GET' && req.url.match(/\/api\/profesores$/))
  ) {
    return next(req);
  }

  // Excepcion2: PUT de registro (Van con token y son formData)
  if (
    (req.method === 'PUT' && req.url.match(/\/api\/profesores\/\d+$/)) ||
    (req.method === 'PUT' && req.url.match(/\/api\/alumnos\/\d+$/))
  ) {
    const cloneRequestDataForm = req.clone({
      setHeaders: {
        Authorization: token,
      },
    });
    return next(cloneRequestDataForm);
  }

  return next(cloneRequest);
};
