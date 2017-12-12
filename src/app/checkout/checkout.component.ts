import { Component, OnInit, ViewEncapsulation, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

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
  creditCard : any;
  singlePaymentAddress : any;
  subscriptionAddresses : Array<any>;
  singlePaymentNotes : string;
  singleOrderCart : any;
  subscriptionCart : any;
  stripeToken : string;
  checkoutResponse : any;
  subscriptionNotes : Array<any>;
  processing : boolean;
  orderFailed : boolean;
  activeSubscriptions : Array<any> = [];

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
    this.sharedService.orderNotes$.subscribe(singlePaymentNotes => this.singlePaymentNotes = singlePaymentNotes);
    this.sharedService.shippingAddress$.subscribe(shippingAddress => this.singlePaymentAddress = shippingAddress);
    this.sharedService.subscriptionAddresses$.subscribe(addresses => this.subscriptionAddresses = addresses);
    this.sharedService.account$.subscribe(account => this.account = account);
    this.sharedService.subscriptionNotes$.subscribe(notes => this.subscriptionNotes = notes);
  }

  getCustomerSubscriptions() {
    if(Object.keys(this.account).length > 0) {
      this.service.getCustomerSubscriptions(this.user, this.account.id)
        .subscribe(
          res => {
            if(Array.isArray(res)) {
              this.activeSubscriptions = res.filter((item) => !_.isEmpty(item.subscription) && item.subscription.stripe_data.status !== 'canceled');
            }
          },
          err => this.service.handleError(err)
        );
    }
  }

  clearCustomerInfo() {
    delete this.account;
    delete this.user.account;
    delete localStorage.account;
    delete localStorage.shipping_address;
    delete localStorage.stripe_token;
    delete localStorage.subscriptionAddresses;
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
              this.getCustomerSubscriptions();
              this.ref.detectChanges();
            }
          } else {
            let account = localStorage.getItem('account') ? JSON.parse(localStorage.getItem('account')) : this.account;
            if(account) {
              this.getAccount(account);
            } else {
              this.loading = false;
              this.getCustomerSubscriptions();
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
          this.getCustomerSubscriptions();
          this.ref.detectChanges();
        },
        err => this.auth.handleError(err)
      )
  }

  creditCardSaved(data) {
    this.stripeToken = data.token;
    this.creditCard = data.creditCard;
  }

  placeOrder() {
    this.processing = true;
    let checkoutStreams = [];
    let subscriptionCart : any = _.cloneDeep(this.subscriptionCart);
    let singlePaymentAddress = this.singlePaymentAddress;
    if(environment.skip_single_payment_shipping) singlePaymentAddress = environment.default_address;
    let singlePaymentOrder = this.service.checkout(singlePaymentAddress, this.user, this.account, this.cartService.scrubCart(this.singleOrderCart), this.singlePaymentNotes, this.stripeToken).toPromise().catch(err => err);
    subscriptionCart.items.map((item, i) => {
      let cart = { items: [item] };
      let address;
      let orderNotes = '';
      if(!environment.skip_subscription_shipping) {
        address = this.subscriptionAddresses[i];
      }
      if(this.subscriptionNotes) {
        orderNotes = this.subscriptionNotes[i];
      }
      if(environment.skip_subscription_shipping || (environment.has_no_shipments && item.has_no_shipments)) {
        address = environment.default_address;
      }
      checkoutStreams.push(this.service.checkout(address, this.user, this.account, this.cartService.scrubCart(cart), orderNotes, this.stripeToken).toPromise().catch(err => err));
    });

    if(this.subscriptionCart.items.length === 0) {
      singlePaymentOrder.then(res => this.checkoutComplete(res));
    }
    if(this.singleOrderCart.items.length === 0) {
      Observable.forkJoin(checkoutStreams).subscribe(
        res => this.checkoutComplete(res),
        err => this.checkoutComplete(err)
      );
    }

    if(this.singleOrderCart.items.length > 0 && this.subscriptionCart.items.length > 0) {
      checkoutStreams.push(singlePaymentOrder);
      Observable.forkJoin(checkoutStreams).subscribe(
        res => this.checkoutComplete(res),
        err => this.checkoutComplete(err)
      );
    }
  }

  checkoutComplete(res: any) {
    let success = false;
    if(Array.isArray(res)) {
      res.forEach((item) => {
        if(item.account) {
          success = true;
        }
      });
    } else {
      if(res.account) {
        success = true;
      }
    }
    if(success) {
      this.sharedService.checkoutResponse = res;
      this.router.navigate(['/checkout#receipt']);
    } else {
      //if all requests failed
      this.processing = false;
      this.orderFailed = true;
    }
  }

}
