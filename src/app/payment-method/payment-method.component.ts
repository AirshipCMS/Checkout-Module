import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { mergeMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { PaymentMethodService } from './payment-method.service';
import { StripeService } from '../stripe.service';

declare var Stripe;

@Component({
  selector: 'payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  providers: [PaymentMethodService],
  encapsulation: ViewEncapsulation.None
})
export class PaymentMethodComponent implements OnInit {

  defaultCard;
  cardElement;
  stripe;
  token : string;
  editDefualtCard : boolean = false;
  @Input() user;
  @Output() defaultCardSaved = new EventEmitter();

  constructor(private stripeService: StripeService, private service: PaymentMethodService) {
  }

  ngOnInit() {
    this.stripe = Stripe(environment.stripe_publish_key);
    let elements = this.stripe.elements();
    this.cardElement = elements.create('card');
    this.cardElement.mount('#card-element');
    this.getSavedCard(elements);
  }

  createToken() {
    this.stripe.createToken(this.cardElement)
      .then((res) => {
        if(Object.keys(this.user.account).length > 0) { //if user doesn't have an account.
          this.addCardAndSetAsDefault(res.token.id);
        } else {
          this.token = res.token.id;
          this.defaultCard = res.token.card;
          this.service.saveLocalCard(this.defaultCard);
          this.defaultCardSaved.emit(this.defaultCard);
        }
      });
  }

  addCardAndSetAsDefault(token:string) {
    this.stripeService.addCard(token)
      .pipe(mergeMap(card => this.stripeService.setDefaultCard(card, this.user)))
      .subscribe(
        defaultCard => {
          this.defaultCard = defaultCard;
          this.defaultCardSaved.emit(this.defaultCard);
        },
        err => console.error(err)
      );
  }

  getSavedCard(elements) {
    if(Object.keys(this.user.account).length === 0) {
      this.defaultCard = this.service.getLocalCard();
      this.defaultCardSaved.emit(this.defaultCard);
    } else {

    }
  }

}
