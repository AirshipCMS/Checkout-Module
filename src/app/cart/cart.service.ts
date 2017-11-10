import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable()
export class CartService {

  cart : any;
  constructor(private http: HttpClient) {
    this.cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : { items: [] };
  }

  calculateSubtotal() {
    let subtotal = 0;
    this.cart.items.forEach((item) => {
      let priceTimesQuantity = item.price.usd * item.quantity;
      subtotal += priceTimesQuantity;
    });
    return subtotal/100;
  }

  getShipping(address:any) {
    let body = {
      country: '',
      state: '',
      zipcode: '',
      other_location: '',
      other_location_text: ''
    };
    for(const [key] of Object.entries(body)) {
      body[key] = address[key];
    }
    body['cart'] = this.cart;
    body['shipping_type'] = ''
    return this.http.put(`${environment.domain}/api/shipping`, body);
  }

  handleError(err) {
    console.error(err);
  }

}
