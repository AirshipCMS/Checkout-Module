import { Injectable } from '@angular/core';

@Injectable()
export class PaymentMethodService {

  constructor() { }

  saveLocalCard(card:any) {
    let localCard = {
      last4: card.last4,
      brand: card.brand
    };
    localStorage.setItem('card', JSON.stringify(localCard));
  }

  getLocalCard() {
    return JSON.parse(localStorage.getItem('card'));
  }

}
