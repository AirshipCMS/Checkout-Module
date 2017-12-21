import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CheckoutService {
  headers: HttpHeaders;
  storageProperties : Array<any>;
  requiredSingleOrderProps : Array<any>;
  requiredSubscriptionOrderProps : Array<any>;

  constructor(private http: HttpClient) {
    let id_token : string = localStorage.getItem('id_token');
    this.headers = new HttpHeaders().set('Authorization', `bearer ${id_token}`);
    this.requiredSingleOrderProps = ['id', 'aerostat_id', 'quantity', 'product_title', 'product_variation_title'];
    this.requiredSubscriptionOrderProps = ['id', 'aerostat_id', 'quantity', 'plan'];
  }

  checkout(shipping_address: any, user: any, account: any, cart: any, customer_notes: string, stripe_token: string, misc_data) {
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
      misc_data
    };
    if(stripe_token) order['stripe_token'] = stripe_token;
    return this.http.post(`/api/${endpoint}`, order, { headers: this.headers });
  }

  getCustomerSubscriptions(user: any, account_id: number) {
    let endpoint = `/api/account/orders`;
    if(user.scope !== 'user') {
      endpoint = `/api/accounts/${account_id}/orders`;
    }
    return this.http.get(endpoint, { headers: this.headers });
  }

  handleError(err) {
    console.error(err);
  }

}
