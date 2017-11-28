import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

import { ShippingAddressComponent } from '../shipping-address';

@Component({
  selector: 'subscription-order',
  templateUrl: './subscription-order.component.html',
  styleUrls: ['./subscription-order.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SubscriptionOrderComponent implements OnInit {

  @Input() user : any;
  @Input() account : any;
  @Input() defaultCard : any;
  @Input() subscriptionCart : any;
  @Input() orderDetails : any;
  plans : Array<any> = [];

  constructor() { }

  ngOnInit() {
    if(this.orderDetails) {
      this.subscriptionCart = this.orderDetails.subscriptions;
      this.plans = this.orderDetails.plans;
    }
  }

}
