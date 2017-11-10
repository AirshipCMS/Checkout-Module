import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

import { CartComponent } from '../cart';
import { ShippingAddressComponent } from '../shipping-address';

@Component({
  selector: 'single-payment-order',
  templateUrl: './single-payment-order.component.html',
  styleUrls: ['./single-payment-order.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SinglePaymentOrderComponent implements OnInit {

  @Output() cartEmpty = new EventEmitter();
  @Input() user;

  constructor() { }

  ngOnInit() {
  }

}
