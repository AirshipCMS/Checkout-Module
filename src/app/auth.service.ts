import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../environments/environment';

@Injectable()
export class AuthService {
  headers : HttpHeaders;
  id_token : string;
  isAuthenticated : boolean = true;

  constructor(private http: HttpClient) {
    this.id_token = localStorage.getItem('id_token');
    this.headers = new HttpHeaders().set('authorization', `bearer ${this.id_token}`)
  }

  getProfile() {
    return this.http.get(`${environment.domain}/api/users/profile`, { headers: this.headers });
  }

  login() {
    if(!this.isAuthenticated) {
      window.location.href = '/login';
    }
  }

  getAccount(scope: string, account: any) {
    let endpoint = 'account';
    if(scope !== 'user') endpoint = `accounts/${account.id}`;
    return this.http.get(`${environment.domain}/api/${endpoint}`, { headers: this.headers });
  }

  handleError(err) {
    console.error(err);
  }

}
