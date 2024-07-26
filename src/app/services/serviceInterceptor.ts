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
import { environment } from '../../environment/environment'; // Adjust the import path as needed

@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the auth token from local storage and remove any surrounding quotes
    let token = localStorage.getItem('user_token');

    // if (token) {
    //   // Remove surrounding quotes if they exist
    //   token = token.replace(/^"(.*)"$/, '$1');
    // }

    const baseUrl = environment.baseURL;

    console.log('Intercepted request:', req.url);
    console.log('Token:', token);

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
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          console.error('HTTP error:', error);

          const status = error.status;
          const unauthorizedStatuses = [
            401, 2, 3, 11, 151, 153, 18, 300, 301, 227, 440,
          ];
          if (unauthorizedStatuses.includes(status)) {
            // Redirect to login or home page and clear token
            console.error(
              'Unauthorized or session timeout, redirecting to login.'
            );
            this.router.navigateByUrl('');
            localStorage.removeItem('user_token');
          } else if (status === 0) {
            console.error('Network error - make sure API is running:', error);
          } else {
            console.error(`HTTP error: ${status}`, error);
          }
        }
        return throwError(error);
      })
    );
  }
}
