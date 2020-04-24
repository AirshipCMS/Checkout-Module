import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class PaymentMethodService {

  headers : HttpHeaders;

  constructor() {}

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

  handleError(err) {
    console.error(err);
  }

}
