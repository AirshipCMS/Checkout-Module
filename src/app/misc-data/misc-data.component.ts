import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

import { KeysPipe } from '../keys.pipe';
import { SharedService } from '../shared.service';


@Component({
  selector: 'misc-data',
  templateUrl: './misc-data.component.html',
  styleUrls: ['./misc-data.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MiscDataComponent implements OnInit {

  @Input() singleOrderCart;
  @Input() subscriptionCart;
  @Input() subscriptionItem;
  @Input() subscriptionItemIndex: number;
  subscriptionMiscData: Array<any> = [];
  @Input() miscData = {};
  @Input() receipt;
  hasMiscData: boolean;

  constructor(private sharedService: SharedService) {
  }

  ngOnInit() {
    if(this.receipt === undefined) {
      if(this.subscriptionItem !== undefined && this.subscriptionItem.misc_data !== undefined) {
        this.subscriptionCart.items.forEach((item) => {
          this.subscriptionMiscData.push({})
        });
        let miscDataKey = this.subscriptionItem.product_title.replace(' ', '_').toLowerCase();
        this.miscData[miscDataKey] = {};
        Object.entries(this.subscriptionItem.misc_data).forEach(([key, value]) => {
          this.miscData[miscDataKey][key] = value;
        });
        this.miscData[miscDataKey]['plan'] = `${this.subscriptionItem.product_plan.name} every ${this.subscriptionItem.product_plan.interval}`;
        this.miscData[miscDataKey]['plan_id'] = this.subscriptionItem.id;
        this.subscriptionMiscData[this.subscriptionItemIndex] = this.miscData;
        this.sharedService.setSubscriptionMiscData(this.subscriptionMiscData);
      }
      if(this.singleOrderCart !== undefined) {
        this.singleOrderCart.items.forEach((item, i) => {
          if(item.misc_data) {
            let miscDataKey = i;
            this.miscData[miscDataKey] = {};
            Object.entries(item.misc_data).forEach(([key, value]) => {
              this.miscData[miscDataKey][key] = value;
            });
            this.miscData[miscDataKey]['product_variation'] = item.product_variation_title;
            this.miscData[miscDataKey]['product_variation_id'] = item.id;
            this.miscData[miscDataKey]['product_title'] = item.product_title;
            this.miscData[miscDataKey]['quantity'] = item.quantity;
          }
        });
        this.sharedService.setSinglePaymentMiscData(this.miscData);
      }
    } else {
      if(this.subscriptionItem !== undefined) {
        this.miscData = this.subscriptionItem.misc_data;
      } else {
        this.miscData = this.receipt.single_payment.misc_data;
      }
    }
    if(this.miscData && Object.keys(this.miscData).length > 0) {
      this.hasMiscData = true;
    }
  }

}
