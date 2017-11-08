import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

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

  constructor(private service: CartService) {}

  ngOnInit() {
    this.cartEmpty.emit(this.service.cart.items.length === 0)
  }

  getSubtotal() {
    
  }

}
