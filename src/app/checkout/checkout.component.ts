import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { CheckoutService } from './checkout.service';
import { SinglePaymentOrderComponent } from '../single-payment-order';
import { PaymentMethodComponent } from '../payment-method';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [CheckoutService],
  encapsulation: ViewEncapsulation.None
})
export class CheckoutComponent implements OnInit {

  user : any;
  loading : boolean = true;
  defaultCard : any;
  shippingAddress : any;
  orderNotes : string;
  cart : any = { items: [] };
  stripeToken : string;

  constructor(private auth: AuthService, private router: Router, private service: CheckoutService) {
  }

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile() {
    this.auth.getProfile()
      .subscribe(
        res => {
          this.user = res;
          this.auth.isAuthenticated = true;
          this.loading = false;
        },
        err => {
          this.loading = false;
          this.auth.isAuthenticated = false;
          this.auth.login();
        }
      );
  }

  gotCartItems(cart:any) {
    this.cart = cart;
  }

  gotOrderNotes(orderNotes:string) {
    this.orderNotes = orderNotes;
  }

  defaultCardSaved(data) {
    this.stripeToken = data.token;
    this.defaultCard = data.defaultCard;
  }

  gotShippingAddress(address:any) {
    this.shippingAddress = address;
  }

  placeOrder() {
    this.service.checkout(this.shippingAddress, this.user, this.cart, this.orderNotes, this.stripeToken)
      .subscribe(
        res => {
          this.service.checkoutResponse = res;
          this.service.clearLocalStorage();
          this.router.navigate(['/checkout#receipt']);
        },
        err => this.service.handleError(err)
      );
  }

}
