import { Component, OnInit, ViewEncapsulation, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { AuthService } from '../auth.service';
import { CartService } from '../cart';
import { CheckoutService } from './checkout.service';
import { SinglePaymentOrderComponent } from '../single-payment-order';
import { SubscriptionOrderComponent } from '../subscription-order';
import { PaymentMethodComponent } from '../payment-method';
import { SharedService } from '../shared.service';
import { environment } from '../../environments/environment';

import * as _ from 'lodash';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [CartService, CheckoutService],
  encapsulation: ViewEncapsulation.None
})
export class CheckoutComponent implements OnInit {

  user : any;
  account : any;
  loading : boolean;
  defaultCard : any;
  shippingAddress : any;
  orderNotes : string;
  singleOrderCart : any;
  subscriptionCart : any;
  stripeToken : string;
  checkoutResponse : any;

  constructor(
    private auth: AuthService,
    private router: Router,
    private service: CheckoutService,
    private cartService: CartService,
    public sharedService: SharedService,
    private ref: ChangeDetectorRef
    ) {
  }

  ngOnInit() {
    this.loading = true;
    this.getUserProfile();
    this.singleOrderCart = this.cartService.singleOrderCart;
    this.subscriptionCart = this.cartService.subscriptionCart;
    this.sharedService.orderNotes$.subscribe(orderNotes => this.orderNotes = orderNotes);
    this.sharedService.shippingAddress$.subscribe(shippingAddress => this.shippingAddress = shippingAddress);
    this.sharedService.account$.subscribe(account => this.account = account);
  }

  getUserProfile() {
    this.auth.getProfile()
      .subscribe(
        res => {
          this.user = res;
          this.auth.isAuthenticated = true;
          if(this.user.scope === 'user') {
            if(Object.keys(this.user.account).length > 0) {
              this.getAccount(this.user.account);
            } else {
              this.account = {};
              this.loading = false;
              this.ref.detectChanges();
            }
          } else {
            let account = localStorage.getItem('account') ? JSON.parse(localStorage.getItem('account')) : this.account;
            if(account) {
              this.getAccount(account);
            } else {
              this.loading = false;
            }
          }
        },
        err => {
          this.auth.isAuthenticated = false;
          this.auth.login();
        }
      );
  }

  getAccount(account: any) {
    this.auth.getAccount(this.user.scope, account)
      .subscribe(
        res => {
          this.account = res;
          this.user.account = res;
          this.loading = false;
          this.ref.detectChanges();
        },
        err => this.auth.handleError(err)
      )
  }

  defaultCardSaved(data) {
    this.stripeToken = data.token;
    this.defaultCard = data.defaultCard;
  }

  placeOrder() {
    let checkoutStreams = [];
    let subscriptionCart : any = this.cartService.scrubCart(_.cloneDeep(this.subscriptionCart));
    let singlePaymentAddress = this.shippingAddress;
    let subscriptionAddress = this.shippingAddress;
    if(environment.skip_single_payment_shipping) singlePaymentAddress = environment.default_address;
    if(environment.skip_subscription_shipping) subscriptionAddress = environment.default_address;
    let singlePaymentOrder = this.service.checkout(singlePaymentAddress, this.user, this.account, this.cartService.scrubCart(this.singleOrderCart), this.orderNotes, this.stripeToken);
    subscriptionCart.items.map((item) => {
      let cart = { items: [item] };
      checkoutStreams.push(this.service.checkout(subscriptionAddress, this.user, this.account, cart, this.orderNotes, this.stripeToken));
    });

    if(this.subscriptionCart.items.length === 0) {
      singlePaymentOrder.subscribe(
        res => this.checkoutComplete(res),
        err => this.service.handleError(err)
      );
    }
    if(this.singleOrderCart.items.length === 0) {
      Observable.forkJoin(checkoutStreams).subscribe(
        res => this.checkoutComplete(res),
        err => this.service.handleError(err)
      );
    }

    if(this.singleOrderCart.items.length > 0 && this.subscriptionCart.items.length > 0) {
      checkoutStreams.push(singlePaymentOrder);
      Observable.forkJoin(checkoutStreams).subscribe(
        res => this.checkoutComplete(res),
        err => this.service.handleError(err)
      );
    }
  }

  checkoutComplete(res: any) {
    console.log(res);
    this.sharedService.checkoutResponse = res;
    this.service.clearLocalStorage();
    this.router.navigate(['/checkout#receipt']);
  }

}
