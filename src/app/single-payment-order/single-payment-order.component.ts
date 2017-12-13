import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

import { environment } from '../../environments/environment';

@Component({
  selector: 'single-payment-order',
  templateUrl: './single-payment-order.component.html',
  styleUrls: ['./single-payment-order.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SinglePaymentOrderComponent implements OnInit {

  @Input() user;
  @Input() account;
  @Input() orderDetails : any;
  @Input() singleOrderCart;
  shippingCalculationPending : boolean = true;
  orderTotal : number;
  @Input() creditCard : any;
  skipShipping : boolean;
  order;

  constructor() { }

  ngOnInit() {
    this.order = this;
    this.skipShipping = environment.skip_single_payment_shipping;
  }

  shippingCalculated(total:number) {
    this.shippingCalculationPending = false;
    this.orderTotal = total;
  }

}
