import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  getAccountCards(scope: string, account_id: number) {
    let endpoint = 'account/cards';
    if(scope !== 'user') endpoint = `accounts/${account_id}/cards`;
    return this.http.get(`/api/${endpoint}`, { headers: this.headers });
  }

  addCard(scope: string, account_id: number, source: any) {
    let endpoint = 'account/cards';
    if(scope !== 'user') endpoint = `accounts/${account_id}/cards`;
    let body = {
      stripe_payload: {
        source
      }
    };
    return this.http.post(`/api/${endpoint}`, body, { headers: this.headers });
  }

  setCreditCard(default_source: any, user: any, account: any) {
    let endpoint = 'customer';
    let email = user.email;
    if(user.scope !== 'user') {
      endpoint = `customers/${account.customer.id}`;
      email = account.user.email;
    }
    let body = {
      stripe_payload: {
        default_source,
        email
      }
    }

    return this.http.put(`/api/${endpoint}`, body, { headers: this.headers });
  }

  handleError(err) {
    console.error(err);
  }

}
