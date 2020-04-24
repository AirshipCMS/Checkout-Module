import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

import { environment } from '../../environments/environment';
import { PaymentMethodService } from './payment-method.service';

declare var Stripe;

@Component({
  selector: 'payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  providers: [PaymentMethodService],
  encapsulation: ViewEncapsulation.None
})
export class PaymentMethodComponent implements OnInit {

  creditCard;
  cardElement;
  stripe;
  token;
  editCreditCard: boolean = false;
  processing: boolean = false;
  addCardFailed: boolean = false;
  missingCardInfo: boolean = false;
  loadingPaymentMethod: boolean = false;
  loadPaymentMethodError: boolean = false;
  @Output() creditCardSaved = new EventEmitter();

  constructor(private service: PaymentMethodService) {
  }

  ngOnInit() {
    this.stripe = Stripe(environment.stripe_publish_key);
    let elements = this.stripe.elements();
    this.cardElement = elements.create('card');
    this.cardElement.mount('#card-element');
    this.getSavedCard();
  }

  createToken() {
    this.processing = true;
    this.addCardFailed = false;
    this.missingCardInfo = false;
    this.stripe.createToken(this.cardElement)
      .then((res) => {
        if (res.token) {
          this.processing = false;
          this.token = res.token.id;
          this.creditCard = res.token.card;
          this.service.saveLocalCard(this.creditCard, this.token);
          this.creditCardSaved.emit({ creditCard: this.creditCard, token: this.token });
        } else {
          this.processing = false;
          if (!this.cardElement._complete) {
            this.missingCardInfo = true;
          }
        }
      });
  }

  getSavedCard() {
    let localData = this.service.getLocalCard();
    this.creditCard = localData.card;
    this.token = localData.token;
    this.loadingPaymentMethod = false;
    this.creditCardSaved.emit({ creditCard: this.creditCard, token: this.token });
  }

}
