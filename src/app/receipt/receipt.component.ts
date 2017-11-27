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
    this.orderDetails = this.sharedService.checkoutResponse;
  }

}
