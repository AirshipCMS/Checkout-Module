import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CartService {

  cart : any;
  subscriptionCart : any = { items: [] };
  singleOrderHasShipmentsCart : any = { items: [] }; //all products where has_shipments === true grouped together
  singleOrderCart : any = { items: [] };

  constructor(private http: HttpClient) {
    let localCart = JSON.parse(localStorage.getItem('cart'));
    this.cart = localCart ? localCart : { items: [] };
    this.checkCartItemTypes();
  }

  scrubCart(cart: any) {
    let formattedCart = { items: [] };
    formattedCart.items = cart.items.map((item) => {
      delete item.product_plan;
      delete item.has_shipments;
      // delete item.misc_data;
      if(item.type !== 'plan') delete item.type;
      return item;
    });
    return formattedCart;
  }

  calculateSubtotal(cart) {
    let subtotal = 0;
    cart.items.forEach((item) => {
      let priceTimesQuantity = item.price.usd * item.quantity;
      subtotal += priceTimesQuantity;
    });
    return subtotal/100;
  }

  checkCartItemTypes() {
    this.cart.items.forEach((item) => {
      if(item.type === 'plan') this.subscriptionCart.items.push(item);
      if(item.type !== 'plan') {
        if(item.has_shipments){
          this.singleOrderHasShipmentsCart.items.push(item);
        } else {
          this.singleOrderCart.items.push(item);
        }
      }
    });
  }

  getShipping(address: any, shippingType: string) {
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
    body['cart'] = this.scrubCart(this.singleOrderHasShipmentsCart);
    body['shipping_type'] = shippingType;
    return this.http.put(`/api/shipping`, body);
  }

  handleError(err) {
    console.error(err);
  }

}
