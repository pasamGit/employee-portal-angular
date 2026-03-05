import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

interface LoginResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
  jwtToken?: string;
  data?: {
    token?: string;
    accessToken?: string;
    jwt?: string;
    jwtToken?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(data: unknown): Observable<LoginResponse | null> {
    return this.http
      .post<LoginResponse>(`${this.api}/login`, data, {
        observe: 'response'
      })
      .pipe(
        tap((res: HttpResponse<LoginResponse>) => {
          const token = this.extractToken(res);
          if (token) {
            localStorage.setItem('token', token);
          }
        }),
        map((res: HttpResponse<LoginResponse>) => res.body)
      );
  }

  register(data: unknown): Observable<unknown> {
    return this.http.post(`${this.api}/register`, data);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  private extractToken(response: HttpResponse<LoginResponse>): string | null {
    const body = response.body;
    const bodyToken =
      body?.token ??
      body?.accessToken ??
      body?.jwt ??
      body?.jwtToken ??
      body?.data?.token ??
      body?.data?.accessToken ??
      body?.data?.jwt ??
      body?.data?.jwtToken;

    if (bodyToken && bodyToken.trim()) {
      return bodyToken;
    }

    const authHeader = response.headers.get('Authorization')?.trim();
    if (authHeader) {
      return authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : authHeader;
    }

    const altHeader = response.headers.get('X-Auth-Token')?.trim();
    return altHeader || null;
  }
}
