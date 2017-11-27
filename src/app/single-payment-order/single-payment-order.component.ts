import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

import { CartComponent } from '../cart';
import { OrderNotesComponent } from '../order-notes';
import { ShippingAddressComponent } from '../shipping-address';
import { ShippingTypeComponent } from '../shipping-type';

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
  shippingCalculationPending : boolean = true;
  orderTotal : number;
  @Input() defaultCard : any;

  constructor() { }

  ngOnInit() {
  }

  shippingCalculated(total:number) {
    this.shippingCalculationPending = false;
    this.orderTotal = total;
  }

}
