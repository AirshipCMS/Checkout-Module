import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

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

  @Output() cartEmpty = new EventEmitter();
  @Output() cartHasItems = new EventEmitter();
  @Output() savedShippingAddress = new EventEmitter();
  @Output() savedOrderNotes = new EventEmitter();
  @Input() user;
  shippingAddress : any;
  shippingType : string;
  shippingCalculationPending : boolean = true;
  orderTotal : number;
  @Input() defaultCard : any;

  constructor() { }

  ngOnInit() {
  }

  gotSavedShippingAddress(address:any) {
  	this.shippingAddress = address;
    this.savedShippingAddress.emit(address);
  }

  gotOrderNotes(orderNotes:any) {
    this.savedOrderNotes.emit(orderNotes);
  }

  shippingTypeChanged(shippingType:string) {
    this.shippingType = shippingType;
  }

  shippingCalculated(total:number) {
    this.shippingCalculationPending = false;
    this.orderTotal = total;
  }

}
