import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable()
export class CheckoutService {
  headers: HttpHeaders;
  checkoutResponse : any;
  storageProperties : Array<any>;

  constructor(private http: HttpClient) {
    let id_token : string = localStorage.getItem('id_token');
    this.headers = new HttpHeaders().set('Authorization', `bearer ${id_token}`);
    this.storageProperties = ['cart', 'card', 'stripe_token', 'shipping_address'];
  }

  checkout(shipping_address:any, user:any, cart:any, customer_notes:string, stripe_token:string) {
    cart['email'] = user.email;
    cart['customer_notes'] = customer_notes;
    let order = {
      shipping_address,
      // billing_address: shipping_address,
      email: user.email,
      cart,
      misc_data:  {}
    };
    if(stripe_token) order['stripe_token'] = stripe_token;
    return this.http.post(`${environment.domain}/api/checkout`, order, { headers: this.headers });
  }

  clearLocalStorage() {
    this.storageProperties.forEach((item) => localStorage.removeItem(item))
  }

  handleError(err) {
    console.error(err);
  }

}
