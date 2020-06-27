import { Component, OnInit, ViewEncapsulation, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import { AuthService } from '../auth.service';
import { CartService } from '../cart';
import { CheckoutService } from './checkout.service';
import { SharedService } from '../shared.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [CartService, CheckoutService],
  encapsulation: ViewEncapsulation.None
})
export class CheckoutComponent implements OnInit {

  user: any;
  account: any;
  loading: boolean;
  creditCard: any;
  singlePaymentAddress: any;
  singlePaymentMiscData;
  subscriptionMiscData;
  subscriptionAddresses: Array<any>;
  singlePaymentNotes: string;
  singleOrderCart: any;
  singleOrderHasShipmentsCart: any;
  subscriptionCart: any;
  shippingType;
  stripeToken: string;
  checkoutResponse: any;
  subscriptionNotes: Array<any>;
  processing: boolean;
  orderFailed: boolean;
  activeSubscriptions: Array<any> = [];
  subscriptionIndex: number = 0;
  orderResponse: Array<any> = [];

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
    if (localStorage.getItem('id_token') !== null) {
      this.getUserProfile();
    } else {
      this.auth.isAuthenticated = false;
      this.auth.login();
    }
    this.singleOrderCart = this.cartService.singleOrderCart;
    this.singleOrderHasShipmentsCart = this.cartService.singleOrderHasShipmentsCart;
    this.subscriptionCart = this.cartService.subscriptionCart;
    this.sharedService.orderNotes$.subscribe(singlePaymentNotes => this.singlePaymentNotes = singlePaymentNotes);
    this.sharedService.shippingAddress$.subscribe(shippingAddress => this.singlePaymentAddress = shippingAddress);
    this.sharedService.subscriptionAddresses$.subscribe(addresses => this.subscriptionAddresses = addresses);
    this.sharedService.account$.subscribe(account => this.account = account);
    this.sharedService.subscriptionNotes$.subscribe(notes => this.subscriptionNotes = notes);
    this.sharedService.singlePaymentOrderMiscData$.subscribe(miscData => this.singlePaymentMiscData = miscData);
    this.sharedService.subscriptionOrdersMiscData$.subscribe(miscData => this.subscriptionMiscData = miscData);
    this.sharedService.shippingType$.subscribe(shippingType => this.shippingType = shippingType);
  }

  getCustomerSubscriptions() {
    if (this.account && Object.keys(this.account).length > 0) {
      this.service.getCustomerSubscriptions(this.user, this.account.id)
        .subscribe(
          res => {
            if (Array.isArray(res)) {
              this.activeSubscriptions = res.filter((item) => !_.isEmpty(item.subscription) && item.subscription.stripe_data.status !== 'canceled');
            }
          },
          err => this.service.handleError(err)
        );
    }
  }

  clearCustomerInfo() {
    delete this.account;
    delete this.creditCard;
    delete localStorage.card;
    delete this.user.account;
    this.sharedService.clearLocalStorage();
  }

  getUserProfile() {
    this.auth.getProfile()
      .subscribe(
        res => {
          this.user = res;
          this.auth.isAuthenticated = true;
          this.user.email = this.user.auth0_user.email;
          if (this.user.scope === 'user') {
            this.getAccount({});
            this.loading = false;
            this.getCustomerSubscriptions();
            this.ref.detectChanges();
          } else {
            let account = localStorage.getItem('account') ? JSON.parse(localStorage.getItem('account')) : this.account;
            if (account) {
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
          localStorage.setItem('account', JSON.stringify(res));
          this.account = res;
          this.user.account = res;
          this.loading = false;
          this.getCustomerSubscriptions();
          this.ref.detectChanges();
        },
        err => {
          this.auth.handleError(err);
          this.account = {};
        }
      )
  }

  creditCardSaved(data) {
    this.stripeToken = data.token;
    this.creditCard = data.creditCard;
  }

  placeOrder() {
    let checkoutStreams = [];
    let subscriptionCart: any = _.cloneDeep(this.subscriptionCart);
    let singlePaymentAddress = this.singlePaymentAddress;
    this.singleOrderCart.misc_data = this.singlePaymentMiscData;
    this.singleOrderHasShipmentsCart.misc_data = this.singlePaymentMiscData;
    let orders = [];
    let baseOrder = {
      shipping_address: null,
      user: this.user,
      account: this.account,
      cart: {
        items: []
      },
      customer_notes: '',
      stripe_token: this.stripeToken,
      misc_data: {},
      shipping_type: null
    }
    if (this.singleOrderCart.items.length > 0) {
      let order = {
        ...baseOrder,
        cart: this.cartService.scrubCart(this.singleOrderCart),
        customer_notes: this.singlePaymentNotes,
        misc_data: this.singlePaymentMiscData
      }
      orders.push(order)
    }
    if (this.singleOrderHasShipmentsCart.items.length > 0) {
      let order = {
        ...baseOrder,
        shipping_address: singlePaymentAddress,
        cart: this.cartService.scrubCart(this.singleOrderHasShipmentsCart),
        customer_notes: this.singlePaymentNotes,
        misc_data: this.singlePaymentMiscData,
        shipping_type: this.shippingType
      }
      orders.push(order)
    }
    if (subscriptionCart.items.length > 0) {
      subscriptionCart.items.map((item, i) => {
        let cart = this.cartService.scrubCart({ items: [item] })
        let subOrder = {
          ...baseOrder,
          customer_notes: this.subscriptionNotes && this.subscriptionNotes[i] ? this.subscriptionNotes[i] : '',
          misc_data: this.subscriptionMiscData && this.subscriptionMiscData[i] ? this.subscriptionMiscData[i] : {},
          cart,
          shipping_address: item.has_shipments && this.subscriptionAddresses && this.subscriptionAddresses[i] ? this.subscriptionAddresses[i] : null,
          shipping_type: item.has_shipments ? this.shippingType : null
        }
        orders.push(subOrder)
      })
    }

    this.processing = true;
    let completedOrders = []
    let i = 1;
    Observable.from(orders)
      .concatMap(order =>
        this.service.checkout(order)
          .do(res => res)
          .catch(obs => Observable.empty())
          .delay(3000)
      )
      .subscribe(val => {
        console.log(val)
        if (val['account']) {
          completedOrders.push(val)
        }
        if (i === orders.length) {
          this.checkoutComplete(completedOrders)
        }
        i++
      })
  }

  checkoutComplete(res: any) {
    let success = false;
    if (res.length > 0) {
      success = true;
    }
    if (success) {
      this.sharedService.checkoutResponse = res;
      this.router.navigate(['/checkout#receipt']);
    } else {
      //if all requests failed
      this.processing = false;
      this.orderFailed = true;
    }
  }

  backToCart() {
    window.location.href = '/cart';
  }

}
