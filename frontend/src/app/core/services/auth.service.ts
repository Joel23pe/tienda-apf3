import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly KEY = 'token';
  private _logged = signal(this.isLoggedIn());
  readonly logged = this._logged.asReadonly();

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>('/api/auth/login', data).pipe(
      tap((r) => {
        localStorage.setItem(this.KEY, r.token);
        this._logged.set(true);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.KEY);
    this._logged.set(false);
    this.router.navigate(['/login']);
  }

  get token(): string | null {
    return localStorage.getItem(this.KEY);
  }

  isLoggedIn(): boolean {
    const t = this.token;
    if (!t) return false;
    try {
      const exp = JSON.parse(atob(t.split('.')[1])).exp;
      return exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}