import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { mergeMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { StripeService } from '../stripe.service';

declare var Stripe;

@Component({
  selector: 'payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentMethodComponent implements OnInit {

  defaultCard;
  cardElement;
  stripe;
  token : string;
  editDefualtCard : boolean = false;
  @Input() user;

  constructor(private stripeService: StripeService) {
  }

  ngOnInit() {
    this.stripe = Stripe(environment.stripe_publish_key);
    let elements = this.stripe.elements();
    this.cardElement = elements.create('card');
    this.cardElement.mount('#card-element');
  }

  createToken() {
    this.stripe.createToken(this.cardElement)
      .then((res) => {
        if(Object.keys(this.user.account).length > 0) { //if user doesn't have an account. should account be created at this point or let /api/checkout handle it?
          this.addCardAndSetAsDefault(res.token.id);
        } else {
          this.token = res.token.id;
          this.defaultCard = res.token.card;
        }
      });
  }

  addCardAndSetAsDefault(token:string) {
    this.stripeService.addCard(token)
      .pipe(mergeMap(card => this.stripeService.setDefaultCard(card, this.user)))
      .subscribe(
        defaultCard => this.defaultCard = defaultCard,
        err => console.error(err)
      );
  }

}
