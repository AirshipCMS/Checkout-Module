import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

import { AuthService } from '../auth.service';
import { SinglePaymentOrderComponent } from '../single-payment-order';
import { PaymentMethodComponent } from '../payment-method';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CheckoutComponent implements OnInit {

  user : any;

  constructor(private auth: AuthService) {
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
        },
        err => {
          this.auth.isAuthenticated = false;
          console.error(err);
        }
      );
  }

  cartEmpty(value){
    return value;
  }

}
