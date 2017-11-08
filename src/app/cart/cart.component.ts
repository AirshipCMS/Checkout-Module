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
  @Input() shipping : string;
  @Input() tax : string;
  @Input() handling : string;
  @Input() total : string;
  subtotal : number = 0;

  constructor(private service: CartService) {}

  ngOnInit() {
    this.cartEmpty.emit(this.service.cart.items.length === 0);
    this.subtotal = this.service.calculateSubtotal();
  }

  getShipping() {
    
  }

}
