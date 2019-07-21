import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: any;
  private authStatusListner = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) { }

  createUser(userEmail: string, userPassword: string) {
    const authData: AuthData = { email: userEmail, password: userPassword };
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(() => {
        this.router.navigate(['/']);
      },
      err => {
        this.authStatusListner.next(false);
      });
  }

  login(userEmail: string, userPassword: string) {
    const authData: AuthData = { email: userEmail, password: userPassword };
    this.http.post<{ token: string, expiresIn: number, userId: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe(res => {
        this.token = res.token;
        if (this.token) {
          this.userId = res.userId;
          const expireInDuration = res.expiresIn;
          this.setAuthTimer(expireInDuration);
          this.isAuthenticated = true;
          this.authStatusListner.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expireInDuration * 1000);
          this.saveAuthData(this.token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      },
      err => {
        this.authStatusListner.next(false);
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (authInformation) {
      const now = new Date();
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.userId = authInformation.userId;
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListner.next(true);
      }
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  getAuthenticationStatus() {
    return this.isAuthenticated;
  }

  getuserId() {
    return this.userId;
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const lsToken = localStorage.getItem('token');
    const lsExpirationDate = localStorage.getItem('expirationDate');
    const lsUserId = localStorage.getItem('userId');

    if (!lsToken || !lsExpirationDate) {
      return;
    }

    return {
      token: lsToken,
      expirationDate: new Date(lsExpirationDate),
      userId: lsUserId
    };
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

}
