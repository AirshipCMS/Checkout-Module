import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { SharedService } from '../shared.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
  providers: [SharedService],
  encapsulation: ViewEncapsulation.None
})
export class ReceiptComponent implements OnInit {

  orderDetails : any;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.orderDetails = this.sharedService.checkoutResponse;
    console.log(this.orderDetails);
  }

}
