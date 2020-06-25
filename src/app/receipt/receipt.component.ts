import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { SharedService } from '../shared.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReceiptComponent implements OnInit {

  receipt: any = {
    subscriptions: [],
    single_payment: null,
    single_payment_has_shipments: null
  };
  failedOrders: Array<any> = [];

  constructor(public sharedService: SharedService, public router: Router) { }

  setShippingType = (type) => environment.shipping_types.filter((shipping_type) => type.toLowerCase() === shipping_type.toLowerCase())[0]

  ngOnInit() {
    if (this.sharedService.checkoutResponse) {

      let subscriptions = { items: [] };
      let plans = [];
      let subscription_addresses = [];
      let creditCard = JSON.parse(localStorage.getItem('card'));
      let account;
      let customer;
      this.sharedService.checkoutResponse.forEach(order => {
        account = order.account;
        customer = order.customer;
        if (order.single_payment.id && order.shipping_address) {
          this.receipt['single_payment_has_shipments'] = {
            ...order.single_payment,
            shipping_address: order.shipping_address,
            products: order.products
          }
        }
        if (order.single_payment.id && order.shipping_address === null) {
          this.receipt['single_payment'] = { ...order.single_payment, products: order.products }
        }
        if (order.subscriptions.length > 0) {
          let subscriptionOrder = {
            ...order.subscriptions
          }
          subscription_addresses.push(order.shipping_address);
          subscriptions.items.push(subscriptionOrder);
          plans.push(order.plans[0]);
        }
      })

      this.receipt = {
        ...this.receipt,
        subscription_addresses,
        account,
        customer,
        subscriptions,
        plans,
        creditCard
      };
      this.sharedService.clearLocalStorage();
    } else {
      this.router.navigate(['/checkout']);
    }
  }

}
