import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  role_id: number;
  is_active: boolean;
}

export interface RegisterResponse {
  id: number;
  full_name: string;
  email: string;
  role_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthProfile {
  id: number;
  email: string;
  full_name: string;
  role_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'agropre.accessToken';
  private readonly TOKEN_TYPE_KEY = 'agropre.tokenType';

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload).pipe(tap((response) => this.persistSession(response)));
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, payload);
  }

  me(): Observable<AuthProfile> {
    return this.http.get<AuthProfile>(`${this.baseUrl}/me`, {
      headers: this.authHeaders(),
    });
  }

  logout(): void {
    const storage = this.storage;
    if (!storage) return;
    storage.removeItem(this.TOKEN_KEY);
    storage.removeItem(this.TOKEN_TYPE_KEY);
  }

  get token(): string | null {
    return this.storage?.getItem(this.TOKEN_KEY) ?? null;
  }

  get tokenType(): string {
    return this.storage?.getItem(this.TOKEN_TYPE_KEY) ?? 'bearer';
  }

  private persistSession(response: LoginResponse): void {
    if (!response?.access_token) return;
    const storage = this.storage;
    if (!storage) return;
    storage.setItem(this.TOKEN_KEY, response.access_token);
    storage.setItem(this.TOKEN_TYPE_KEY, response.token_type ?? 'bearer');
  }

  private authHeaders(): HttpHeaders {
    const token = this.token;
    if (!token) {
      return new HttpHeaders();
    }

    return new HttpHeaders({
      Authorization: `${this.tokenType} ${token}`,
    });
  }

  private get storage(): Storage | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  }
}
