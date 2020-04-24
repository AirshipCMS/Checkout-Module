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
  @Input() miscData = {};
  @Input() receipt;
  hasMiscData: boolean;

  constructor(private sharedService: SharedService) {
  }

  ngOnInit() {
    if (this.receipt === undefined) {
      if (this.singleOrderCart !== undefined) {
        this.singleOrderCart.items.forEach((item, i) => {
          if (item.misc_data) {
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
      this.miscData = this.receipt.single_payment.misc_data;
    }
    if (this.miscData && Object.keys(this.miscData).length > 0) {
      this.hasMiscData = true;
    }
  }

}
