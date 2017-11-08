import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShippingAddressComponent implements OnInit {

  shipping_address : any = {};

  constructor() { }

  ngOnInit() {
  }

}
