import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { LoggingService } from '../services/logging.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private logger: LoggingService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          alert('Unauthorized');
        }

        if (error.status === 500) {
          alert('Server Error');
        }

        this.logger.error('HTTP error response', {
          status: error.status,
          message: error.message
        });

        return throwError(() => error);
      })
    );
  }
}
