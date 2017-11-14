import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [CartService],
  encapsulation: ViewEncapsulation.None
})
export class CartComponent implements OnInit {

  @Output() cartEmpty = new EventEmitter();
  @Output() shippingCalculated = new EventEmitter();
  @Input() shippingType : string;
  shipping : any = '(pending)';
  tax : any = '(pending)';
  handling : any = '(pending)';
  total : any = '(pending)';
  subtotal : number = 0;
  pending : boolean = true;
  @Input() shippingAddress : any;
  @Input() defaultCard : any;

  constructor(private service: CartService) {}

  ngOnInit() {
    this.cartEmpty.emit(this.service.cart.items.length === 0);
    this.subtotal = this.service.calculateSubtotal();
    this.getShipping();
  }

  getShipping() {
    this.service.getShipping(this.shippingAddress, this.shippingType)
      .subscribe(
        res => {
          this.handling = res['handling_cost'].usd/100;
          this.shipping = res['shipping_cost'].usd/100;
          this.tax = res['tax'].usd/100;
          this.total = res['total'].usd/100;
          this.pending = false;
          this.shippingCalculated.emit(this.total);
        },
        err => this.service.handleError(err)
      );
  }

}
