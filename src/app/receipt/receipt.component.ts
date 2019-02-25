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

  receipt : any;
  failedOrders : Array<any> = [];

  constructor(public sharedService: SharedService, public router: Router) {}

  ngOnInit() {
    if(this.sharedService.checkoutResponse) {
      if(this.sharedService.checkoutResponse.products) {
        environment.shipping_types.forEach((type) => {
          if(this.sharedService.checkoutResponse.single_payment.shipping_type.toLowerCase() === type.toLowerCase()) {
            this.sharedService.checkoutResponse.single_payment.shipping_type = type;
          }
        });
        this.receipt = this.sharedService.checkoutResponse;
      } else {
        let subscriptions = { items: [] };
        let plans = [];
        let customers = [];
        let products = {};
        let single_payment = {};
        let account = {};
        let customer = {};
        let shipping_address = {};
        let subscription_addresses = [];
        let creditCard = JSON.parse(localStorage.getItem('card'));
        this.sharedService.checkoutResponse.forEach((item) => {
          if(item.account) {
            if(item.products.items.length > 0) {
              products = item.products;
              single_payment = item.single_payment;
              environment.shipping_types.forEach((type) => {
                if(single_payment['shipping_type'].toLowerCase() === type.toLowerCase()) {
                  single_payment['shipping_type'] = type;
                }
              });
              shipping_address = item.shipping_address;
              account = item.account;
              customer = item.customer;
            }
            if(item.subscriptions.length > 0) {
              subscription_addresses.push(item.shipping_address);
              item.subscriptions[0].misc_data = item.plans[0].misc_data;
              subscriptions.items.push(item.subscriptions[0]);
              customers.push(item.customer);
              plans.push(item.plans[0]);
            }
          } else {
            this.failedOrders.push(item);
          }
        });
        this.receipt = Object.assign({}, {
          subscription_addresses,
          account,
          shipping_address,
          customer,
          customers,
          single_payment,
          products,
          subscriptions,
          plans,
          creditCard
        });
      }
      this.sharedService.clearLocalStorage();
    } else {
      this.router.navigate(['/checkout']);
    }
  }

}
