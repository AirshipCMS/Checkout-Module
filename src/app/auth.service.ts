import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../environments/environment';

@Injectable()
export class AuthService {
  id_token : string;
  isAuthenticated : boolean = true;

  constructor(private http: HttpClient) {
    this.id_token = localStorage.getItem('id_token');
  }

  getProfile() {
    let headers = new HttpHeaders().set('authorization', `bearer ${this.id_token}`)
    return this.http.get(`${environment.domain}/api/users/profile`, { headers });
  }

  login() {
    if(!this.isAuthenticated) {
      window.location.href = '/login';
    }
  }

}
