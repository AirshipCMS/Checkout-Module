import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { environment } from '../../environments/environment';

declare var Stripe;

@Component({
  selector: 'payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentMethodComponent implements OnInit {

  card;
  stripe;

  constructor() {
  }

  ngOnInit() {
    this.stripe = Stripe(environment.stripe_publish_key);
    let elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');
  }

  addCard() {
    this.stripe.createToken(this.card)
      .then((res) => {
        console.log(res);
      });
  }

}
