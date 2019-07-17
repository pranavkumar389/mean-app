import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  createUser(userEmail: string, userPassword: string) {
    const authData: AuthData = { email: userEmail, password: userPassword };
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(res => {
        console.log(res);
      });
  }
}
