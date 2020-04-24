import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';

import { CartService } from '../cart';
import { CheckoutService } from './checkout.service';
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

  creditCard : any;
  singlePaymentAddress : any;
  singlePaymentMiscData;
  singlePaymentNotes : string;
  singleOrderCart : any;
  shippingType;
  stripeToken : string;
  checkoutResponse : any;
  processing : boolean;
  orderFailed : boolean;
  orderResponse: Array<any> = [];

  constructor(
    private router: Router,
    private service: CheckoutService,
    private cartService: CartService,
    public sharedService: SharedService,
    private ref: ChangeDetectorRef
    ) {
  }

  ngOnInit() {
    if(localStorage.getItem('id_token') !== null) {
      // route to authenticated checkout?
    }
    this.singleOrderCart = this.cartService.singleOrderCart;
    console.log(this.singleOrderCart)
    this.sharedService.orderNotes$.subscribe(singlePaymentNotes => this.singlePaymentNotes = singlePaymentNotes);
    this.sharedService.shippingAddress$.subscribe(shippingAddress => this.singlePaymentAddress = shippingAddress);
    this.sharedService.singlePaymentOrderMiscData$.subscribe(miscData => this.singlePaymentMiscData = miscData);
    this.sharedService.shippingType$.subscribe(shippingType => this.shippingType = shippingType);
  }

  clearCustomerInfo() {
    delete this.creditCard;
    delete localStorage.card;
    this.sharedService.clearLocalStorage();
  }

  creditCardSaved(data) {
    this.stripeToken = data.token;
    this.creditCard = data.creditCard;
  }

  placeOrder() {
    this.processing = true;
    let singlePaymentAddress = this.singlePaymentAddress;
    let email = this.singlePaymentAddress.email
    delete singlePaymentAddress.email
    if(environment.skip_single_payment_shipping) singlePaymentAddress = environment.default_address;
    this.singleOrderCart.misc_data = this.singlePaymentMiscData;
    if(this.singleOrderCart.items.length > 0) {
      this.service.checkout(singlePaymentAddress, email, this.cartService.scrubCart(this.singleOrderCart), this.singlePaymentNotes, this.stripeToken, this.singlePaymentMiscData, this.shippingType)
        .subscribe(
          res => {
            if(res['account']) {
              this.sharedService.checkoutResponse = res;
              this.router.navigate(['/guest-checkout#receipt']);
            }
          },
          err => {
            this.orderFailed = true;
            this.processing = false;
          }
        );
    }
  }

  backToCart() {
    window.location.href = '/cart';
  }

}
