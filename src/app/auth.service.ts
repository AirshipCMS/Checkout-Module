import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AuthService {
  // Should auth be handle within in this app or login status app?
  id_token : string;
  isAuthenticated : boolean = true;

  constructor(private http: HttpClient) {
    this.id_token = localStorage.getItem('id_token');
  }

  getProfile() {
    let headers = new HttpHeaders().set('authorization', `bearer ${this.id_token}`)
    return this.http.get('https://endtoend.airshipcms-alpha.io/api/users/profile', { headers });
  }

}
