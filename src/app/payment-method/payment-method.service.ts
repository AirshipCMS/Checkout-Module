import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable()
export class PaymentMethodService {

  headers : HttpHeaders;

  constructor(private http: HttpClient) {
    let id_token : string = localStorage.getItem('id_token');
    this.headers = new HttpHeaders().set('Authorization', `bearer ${id_token}`);
  }

  saveLocalCard(card:any, token:any) {
    let localCard = {
      last4: card.last4,
      brand: card.brand
    };
    localStorage.setItem('card', JSON.stringify(localCard));
    localStorage.setItem('stripe_token', token);
  }

  getLocalCard() {
    return {
      card: JSON.parse(localStorage.getItem('card')),
      token: localStorage.getItem('stripe_token')
    }
  }

  getAccountCards() {
    return this.http.get(`${environment.domain}/api/account/cards`, { headers: this.headers });
  }

  handleError(err) {
    console.error(err);
  }

}
