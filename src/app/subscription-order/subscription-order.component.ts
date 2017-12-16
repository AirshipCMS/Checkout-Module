import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

import { ShippingAddressComponent } from '../shipping-address';
import { environment } from '../../environments/environment';

@Component({
  selector: 'subscription-order',
  templateUrl: './subscription-order.component.html',
  styleUrls: ['./subscription-order.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SubscriptionOrderComponent implements OnInit {

  @Input() user : any;
  @Input() account : any;
  @Input() creditCard : any;
  @Input() subscriptionCart : any;
  @Input() receipt : any;
  plans : Array<any> = [];
  skipShipping : boolean;
  hasNoShipments : boolean;

  constructor() { }

  ngOnInit() {
    this.skipShipping = environment.skip_subscription_shipping;
    this.hasNoShipments = environment.has_no_shipments;
    if(this.receipt) {
      this.subscriptionCart = this.receipt.subscriptions;
      this.plans = this.receipt.plans;
    }
  }

}
