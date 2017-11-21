import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable()
export class SelectCustomerAccountService {

  private headers : HttpHeaders;

  constructor(private http: HttpClient) {
    let id_token = localStorage.getItem('id_token');
    this.headers = new HttpHeaders().set('Authorization', `bearer ${id_token}`);
  }

  getAccounts() {
    return this.http.get(`${environment.domain}/api/accounts`, { headers: this.headers });
  }

  handleError(err) {
    console.error(err);
  }

}
