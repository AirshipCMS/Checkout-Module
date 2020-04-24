import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CheckoutService {
  headers: HttpHeaders;
  storageProperties : Array<any>;
  requiredSingleOrderProps : Array<any>;

  constructor(private http: HttpClient) {
    this.requiredSingleOrderProps = ['id', 'aerostat_id', 'quantity', 'product_title', 'product_variation_title'];
  }

  checkout(shipping_address: any, email: string, cart: any, customer_notes: string, stripe_token: string, misc_data, shipping_type) {
    let endpoint = 'checkout';
    cart['email'] = email;
    cart['customer_notes'] = customer_notes;
    let order = {
      shipping_address,
      email: email,
      cart,
      misc_data
    };
    if(stripe_token) order['stripe_token'] = stripe_token;
    if(shipping_type) order['shipping_type'] = shipping_type;
    return this.http.post(`/api/${endpoint}`, order, { headers: this.headers });
  }

  handleError(err) {
    console.error(err);
  }

}
