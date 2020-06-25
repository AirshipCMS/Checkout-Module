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
  @Input() receipt : any;
  @Input() singleOrderCart;
  @Input() singleOrderHasShipmentsCart;
  @Input() single_payment;
  shippingCalculationPending : boolean = true;
  orderTotal : number;
  @Input() creditCard : any;
  order;

  constructor() { }

  ngOnInit() {
    this.order = this;
  }

  shippingCalculated(total:number) {
    this.shippingCalculationPending = false;
    this.orderTotal = total;
  }

}
