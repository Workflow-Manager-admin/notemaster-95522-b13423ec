import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        if (error.status === 404) {
          errorMessage = 'Resource not found';
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized access';
        } else if (error.status === 403) {
          errorMessage = 'Access forbidden';
        } else if (error.status === 500) {
          errorMessage = 'Server error';
        }
      }

      console.error('API Error:', error);
      return throwError(() => new Error(errorMessage));
    })
  );
};
