import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { SharedService } from '../shared.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReceiptComponent implements OnInit {

  orderDetails : any;

  constructor(public sharedService: SharedService) {}

  ngOnInit() {
    if(this.sharedService.checkoutResponse.products) {
      this.orderDetails = this.sharedService.checkoutResponse;
    } else {
      let subscriptions = { items: [] };
      let plans = [];
      let products = {};
      let single_payment = {};
      this.sharedService.checkoutResponse.forEach((item) => {
        if(item.products.items.length > 0) {
          products = item.products;
          single_payment = item.single_payment;
        }
        if(item.subscriptions.length > 0) {
          subscriptions.items.push(item.subscriptions[0]);
          plans.push(item.plans[0]);
        }
      });
      this.orderDetails = Object.assign({}, {
        account: this.sharedService.checkoutResponse[0].account,
        shipping_address: this.sharedService.checkoutResponse[0].shipping_address,
        customer: this.sharedService.checkoutResponse[0].customer,
        single_payment,
        products,
        subscriptions,
        plans
      });
    }
    this.sharedService.clearLocalStorage();
  }

}
