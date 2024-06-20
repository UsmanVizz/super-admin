import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environment/environment';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the auth token from local storage
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2hhc2giOiI4M2RhY2ZkYWI2ZjY1OWUzMmY4NzhhODY3OWMwMzFhZSIsImlhdCI6MTcxNjQ2Mjg4N30.fD56lmhnxc2CIPveEdmPYO50jGClxPswF-xdZh-wjCQ';
    const baseUrl = environment.baseURL;

    // Clone the request to add the authorization header if token is present
    if (token && req.url.includes(baseUrl)) {
      req = req.clone({
        setHeaders: { Authorization: `${token}` },
      });
    }

    // Pass on the cloned request instead of the original request
    return next.handle(req).pipe(
      tap((event) => {
        // Log successful responses if needed
        if (event instanceof HttpResponse) {
          console.log('Request successful:', event);
        }
      }),
      catchError((error) => {
        // Handle errors
        if (error instanceof HttpErrorResponse) {
          const status = error.status;
          const unauthorizedStatuses = [
            401, 2, 3, 11, 151, 153, 18, 300, 301, 227,
          ];
          if (unauthorizedStatuses.includes(status)) {
            // Redirect to login or home page and clear token
            this.router.navigateByUrl('');
            localStorage.removeItem('token');
          }
        }
        return throwError(error);
      })
    );
  }
}
