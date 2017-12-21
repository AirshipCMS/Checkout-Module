import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    return this.http.get(`/api/users/profile`, { headers: this.headers });
  }

  login() {
    if(!this.isAuthenticated) {
      window.location.href = '/signin';
    }
  }

  getAccount(scope: string, account: any) {
    let endpoint = 'account';
    if(scope !== 'user') endpoint = `accounts/${account.id}`;
    return this.http.get(`/api/${endpoint}`, { headers: this.headers });
  }

  handleError(err) {
    console.error(err);
  }

}
