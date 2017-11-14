import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { CheckoutService } from '../checkout';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
  providers: [CheckoutService],
  encapsulation: ViewEncapsulation.None
})
export class ReceiptComponent implements OnInit {

  orderDetails : any;

  constructor(private checkoutService: CheckoutService) { }

  ngOnInit() {
    this.orderDetails = this.checkoutService.checkoutResponse;
    console.log(this.orderDetails);
  }

}
