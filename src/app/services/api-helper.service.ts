import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiHelperService {
  apiAddress: string = environment.apiAddress;
  
  constructor(private http: HttpClient) {}

  private toBearer(token: string | null): { [key: string]: string } {
    return token ? { "Authorization": `Bearer ${token}` } : {};
  }

  private defaultHeaders(token: string | null): HttpHeaders {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Language': '*',
      ...this.toBearer(token)
    };

    return new HttpHeaders(headers);
  }

  getApiAddress() {
    return this.apiAddress;
  }

  getHelper<T>(url: string): Observable<T> {
    const headers = this.defaultHeaders(null);
    return this.http.get<T>(url, { headers, withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  postHelper<T, U>(url: string, request: U, token: string): Observable<T> {
    const headers = this.defaultHeaders(token);
    const body = request ? JSON.stringify(request) : null;
    return this.http.post<T>(url, body, { headers })
      .pipe(catchError(this.handleError));
  }

  postImageHelper<T>(url: string, formData: FormData, token: string): Observable<T> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<T>(url, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  putHelper<T, U>(url: string, request: U, token: string): Observable<T> {
    const headers = this.defaultHeaders(token);
    const body = request ? JSON.stringify(request) : null;
    return this.http.put<T>(url, body, { headers })
      .pipe(catchError(this.handleError));
  }

  patchHelper<T, U>(url: string, request: U, token: string): Observable<T> {
    const headers = this.defaultHeaders(token);
    const body = request ? JSON.stringify(request) : null;
    return this.http.patch<T>(url, body, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteHelper<T>(url: string, token: string): Observable<T> {
    const headers = this.defaultHeaders(token);
    return this.http.delete<T>(url, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: unknown): Observable<never> {
    // Handle error logic here
    return throwError(() => new Error('An error occurred'));
  }
}
