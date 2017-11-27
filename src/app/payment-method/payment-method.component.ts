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
  defaultCard;
  cardElement;
  changeCardOption : string = 'new';
  stripe;
  token;
  editDefualtCard : boolean = false;
  checked: boolean = false;
  @Input() user;
  @Input() account;
  @Output() defaultCardSaved = new EventEmitter();

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
        if(Object.keys(this.account).length > 0) { //if user doesn't have an account.
          this.addCardAndSetAsDefault(res.token.id);
        } else {
          this.token = res.token.id;
          this.defaultCard = res.token.card;
          this.service.saveLocalCard(this.defaultCard, this.token);
          this.defaultCardSaved.emit({ defaultCard : this.defaultCard, token: this.token });
        }
      });
  }

  addCardAndSetAsDefault(token:string) {
    this.service.addCard(this.user.scope, this.account.id, token)
      .pipe(mergeMap(card => this.service.setDefaultCard(card, this.user, this.account.customer.id)))
      .subscribe(
        defaultCard => {
          this.defaultCard = defaultCard;
          this.accountCards.push(this.defaultCard);
          this.defaultCardSaved.emit({ defaultCard : this.defaultCard, token: this.token });
        },
        err => console.error(err)
      );
  }

  setDefaultCard(card:any) {
    this.service.setDefaultCard(card.id, this.user, this.account.customer.id)
      .subscribe(
        res => {
          this.defaultCard = card;
          this.defaultCardSaved.emit({ defaultCard : this.defaultCard });
          this.editDefualtCard = false;
        },
        err => this.service.handleError(err)
      )
  }

  getSavedCard(elements) {
    if(Object.keys(this.account).length === 0) {
      let localData = this.service.getLocalCard();
      this.defaultCard = localData.card;
      this.token = localData.token;
      this.defaultCardSaved.emit({ defaultCard : this.defaultCard, token: this.token });
    } else {
      this.service.getAccountCards(this.user.scope, this.account.id)
        .subscribe(
          res => {
            this.accountCards = res['data'];
            this.defaultCard = this.accountCards.find((item) => item.id === this.account.customer.default_source);
            this.defaultCardSaved.emit({ defaultCard: this.defaultCard });
          },
          err => this.service.handleError(err)
        )
    }
  }

}
