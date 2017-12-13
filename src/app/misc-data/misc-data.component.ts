import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

import { KeysPipe } from '../keys.pipe';


@Component({
  selector: 'misc-data',
  templateUrl: './misc-data.component.html',
  styleUrls: ['./misc-data.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MiscDataComponent implements OnInit {

  @Input() singlePaymentOrder: boolean;
  @Input() subscriptionItem;
  @Input() subscriptionItemIndex: number;
  subscriptionMiscData: Array<any> = [];
  singlePaymentMiscData;
  miscData = {};

  constructor() {
  }

  ngOnInit() {
    if(this.subscriptionItem !== undefined && this.subscriptionItem.misc_data !== undefined) {
      let miscDataKey = `${this.subscriptionItem.product_title.replace(' ', '_').toLowerCase()}`;
      this.miscData[miscDataKey] = {};
      Object.entries(this.subscriptionItem.misc_data).forEach(([key, value]) => {
        this.miscData[miscDataKey][key] = value;
      });
      this.miscData[miscDataKey]['plan'] = `${this.subscriptionItem.product_plan.name} every ${this.subscriptionItem.product_plan.interval}`;
      this.miscData[miscDataKey]['plan_id'] = this.subscriptionItem.id;
      console.log(this.miscData)
    }
  }

}
