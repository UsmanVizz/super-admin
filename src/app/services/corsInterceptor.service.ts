import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';

@Injectable()
export class CorsInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Fetch authentication token from wherever it's stored
    const authHeader = localStorage.getItem('token');
    const baseUrl = environment.baseURL;

    let cloneReq = request.clone();
    if (authHeader !== null) {
      let headers = request.headers.set(
        'Authorization',
        'Bearer ' + authHeader
      );
      if (request.url.includes(baseUrl)) {
        cloneReq = request.clone({ headers, url: request.url });
      } else {
        cloneReq = request.clone({ headers, url: request.url });
      }
    }

    // Clone the request and add the 'Origin' header
    const modifiedRequest = cloneReq.clone({
      // setHeaders: {
      //   'Origin': '*'
      // }
    });

    // Pass the modified request to the next handler and handle errors
    return next.handle(modifiedRequest).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // Handle HttpResponse if needed
          }
        },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            const status = error.status || error.error['status'];
            const statuses = [401, 2, 3, 11, 151, 153, 18, 300, 301, 227];
            if (statuses.includes(status)) {
              this.router.navigateByUrl('');
              localStorage.removeItem('token');
            }
          }
        }
      )
    );
  }
}
