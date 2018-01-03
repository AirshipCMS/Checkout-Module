import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { mergeMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { PaymentMethodService } from './payment-method.service';
import { SharedService } from '../shared.service';

declare var Stripe;

@Component({
  selector: 'payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  providers: [PaymentMethodService],
  encapsulation: ViewEncapsulation.None
})
export class PaymentMethodComponent implements OnInit {

  accountCards : Array<any>;
  creditCard;
  cardElement;
  changeCardOption : string = 'new';
  stripe;
  token;
  editCreditCard : boolean = false;
  checked: boolean = false;
  @Input() user;
  @Input() account;
  @Output() creditCardSaved = new EventEmitter();

  constructor(private service: PaymentMethodService, private sharedService: SharedService) {
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
        if(Object.keys(this.account).length > 0) {
          this.addCardAndSetAsDefault(res);
        } else {
          this.token = res.token.id;
          this.creditCard = res.token.card;
          this.service.saveLocalCard(this.creditCard, this.token);
          this.creditCardSaved.emit({ creditCard : this.creditCard, token: this.token });
        }
      });
  }

  addCardAndSetAsDefault(res: any) {
    this.service.addCard(this.user.scope, this.account.id, res.token.id)
      .pipe(mergeMap(card => this.service.setCreditCard(res.id, this.user, this.account)))
      .subscribe(
        creditCard => {
          this.creditCardSaved.emit({ creditCard : this.creditCard, token: this.token });
          this.editCreditCard = false;
        },
        err => console.error(err)
      );
  }

  setCreditCard(card:any) {
    this.service.setCreditCard(card.id, this.user, this.account)
      .subscribe(
        res => {
          this.creditCard = card;
          this.creditCardSaved.emit({ creditCard : this.creditCard });
          this.editCreditCard = false;
        },
        err => this.service.handleError(err)
      )
  }

  getSavedCard(elements) {
    if(Object.keys(this.account).length === 0) {
      let localData = this.service.getLocalCard();
      this.creditCard = localData.card;
      this.token = localData.token;
      this.creditCardSaved.emit({ creditCard : this.creditCard, token: this.token });
    } else {
      this.service.getAccountCards(this.user.scope, this.account.id)
        .subscribe(
          res => {
            this.accountCards = res['data'];
            this.creditCard = this.accountCards.find((item) => item.id === this.account.customer.default_source);
            this.creditCardSaved.emit({ creditCard: this.creditCard });
          },
          err => this.service.handleError(err)
        )
    }
  }

}
