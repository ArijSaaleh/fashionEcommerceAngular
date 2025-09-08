import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, of, tap} from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
}
@Injectable({
  providedIn: `root`
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // backend base URL

  constructor(private http: HttpClient) {}

  login(req: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, req).pipe(
      tap(res => {
        localStorage.setItem('jwt', res.token); // store token
      })
    );
  }

  register(req: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = 'An error occurred. Please try again.';
        if (error.status === 400) {
          errorMsg = 'Please provide valid registration details.';
        } else if (error.status === 409) {
          errorMsg = 'Email is already in use.';
        }
        return of({ error: true, message: errorMsg });
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
