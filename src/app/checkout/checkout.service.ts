import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable()
export class CheckoutService {
  headers: HttpHeaders;
  storageProperties : Array<any>;

  constructor(private http: HttpClient) {
    let id_token : string = localStorage.getItem('id_token');
    this.headers = new HttpHeaders().set('Authorization', `bearer ${id_token}`);
  }

  checkout(shipping_address: any, user: any, account: any, cart: any, customer_notes: string, stripe_token: string) {
    let endpoint = 'checkout';
    let email = user.email;
    if(user.scope !== 'user') {
      endpoint = 'admin/checkout';
      email = account.user.email;
    }
    cart['email'] = email;
    cart['customer_notes'] = customer_notes;
    let order = {
      shipping_address,
      email: email,
      cart,
      misc_data:  {}
    };
    if(stripe_token) order['stripe_token'] = stripe_token;
    return this.http.post(`${environment.domain}/api/${endpoint}`, order, { headers: this.headers });
  }

  handleError(err) {
    console.error(err);
  }

}
