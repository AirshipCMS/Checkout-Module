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
  @Input() shippingType : string;
  @Input() shipping : string = '(pending)';
  @Input() tax : string = '(pending)';
  @Input() handling : string = '(pending)';
  @Input() total : string = '(pending)';
  subtotal : number = 0;
  @Input() shippingAddress : any;

  constructor(private service: CartService) {}

  ngOnInit() {
    this.cartEmpty.emit(this.service.cart.items.length === 0);
    this.subtotal = this.service.calculateSubtotal();
    this.getShipping();
  }

  getShipping() {
    this.service.getShipping(this.shippingAddress)
      .subscribe(
        res => {
          console.log(res)
        },
        err => this.service.handleError(err)
      );
  }

}
