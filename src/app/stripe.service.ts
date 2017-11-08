import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../environments/environment';

@Injectable()
export class StripeService {

  headers : HttpHeaders;

  constructor(private http: HttpClient) {
    let id_token = localStorage.getItem('id_token');
    this.headers = new HttpHeaders().set('Authorization', `bearer ${id_token}`);
  }

  addCard(card:any) {
    let body = {
      stripe_payload: {
        source: card.id
      }
    };
    return this.http.post(`${environment.domain}/api/account/cards`, body, { headers: this.headers });
  }

  setDefaultCard(default_source:any, user:any) {
    let body = {
      stripe_payload: {
        default_source,
        email: user.email
      }
    }

    return this.http.put(`${environment.domain}/api/customer`, body, { headers: this.headers });
  }

}
