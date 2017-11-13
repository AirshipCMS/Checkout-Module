import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

import { CartComponent } from '../cart';
import { ShippingAddressComponent } from '../shipping-address';
import { ShippingTypeComponent } from '../shipping-type';

@Component({
  selector: 'single-payment-order',
  templateUrl: './single-payment-order.component.html',
  styleUrls: ['./single-payment-order.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SinglePaymentOrderComponent implements OnInit {

  @Output() cartEmpty = new EventEmitter();
  @Input() user;
  shippingAddress : any;
  shippingType : string;

  constructor() { }

  ngOnInit() {
  }

  savedShippingAddress(address:any) {
  	this.shippingAddress = address;
  }

  shippingTypeChanged(shippingType:string) {
    this.shippingType = shippingType;
  }

}
