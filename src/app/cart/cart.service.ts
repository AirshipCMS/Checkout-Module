import { Injectable } from '@angular/core';

@Injectable()
export class CartService {

  cart : any;
  constructor() {
    this.cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : { items: [] };
  }

}
