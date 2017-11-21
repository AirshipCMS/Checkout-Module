import { Component, OnInit, ViewEncapsulation, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { CartService } from '../cart';
import { CheckoutService } from './checkout.service';
import { SinglePaymentOrderComponent } from '../single-payment-order';
import { PaymentMethodComponent } from '../payment-method';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [CartService, CheckoutService],
  encapsulation: ViewEncapsulation.None
})
export class CheckoutComponent implements OnInit {

  user : any;
  loading : boolean;
  defaultCard : any;
  shippingAddress : any;
  orderNotes : string;
  cart : any;
  stripeToken : string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private service: CheckoutService,
    private cartService: CartService,
    private sharedService: SharedService,
    private ref: ChangeDetectorRef
    ) {
  }

  ngOnInit() {
    this.loading = true;
    this.getUserProfile();
    this.cart = this.cartService.cart;
    this.sharedService.orderNotes$.subscribe(orderNotes => this.orderNotes = orderNotes);
    this.sharedService.shippingAddress$.subscribe(shippingAddress => this.shippingAddress = shippingAddress);
  }

  getUserProfile() {
    this.auth.getProfile()
      .subscribe(
        res => {
          this.user = res;
          this.auth.isAuthenticated = true;
          if(Object.keys(this.user.account).length > 0) {
            this.getAccount();
          } else {
            this.loading = false;
            this.ref.detectChanges();
          }
        },
        err => {
          this.auth.isAuthenticated = false;
          this.auth.login();
        }
      );
  }

  getAccount() {
    this.auth.getAccount()
      .subscribe(
        res => {
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
    console.log(this.shippingAddress)
    console.log(this.cartService.scrubCart(this.cart))
    // this.service.checkout(this.shippingAddress, this.user, this.cartService.scrubCart(this.cart), this.orderNotes, this.stripeToken)
    //   .subscribe(
    //     res => {
    //       this.service.checkoutResponse = res;
    //       this.service.clearLocalStorage();
    //       this.router.navigate(['/checkout#receipt']);
    //     },
    //     err => this.service.handleError(err)
    //   );
  }

}
