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

  constructor(private auth: AuthService, private router: Router, service: CheckoutService) {
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

  defaultCardSaved(defaultCard:any) {
    this.defaultCard = defaultCard;
  }

  cartEmpty(value){
    return value;
  }

  retrievedShippingAddress(address:any) {
    this.shippingAddress = address;
  }

}
