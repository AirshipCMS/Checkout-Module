import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

import { CartService } from './cart.service';
import { SharedService } from '../shared.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [CartService],
  encapsulation: ViewEncapsulation.None
})
export class CartComponent implements OnInit {

  @Output() shippingCalculated = new EventEmitter();
  shippingType: string;
  shipping: any = '(pending)';
  tax: any = '(pending)';
  handling: any = '(pending)';
  total: any = '(pending)';
  subtotal: number = 0;
  pending: boolean = true;
  shippingAddress: any;
  @Input() creditCard: any;
  @Input() receipt: any;
  @Input() single_payment;
  @Input() cart;
  shippingError: boolean = false;
  shippingErrorMessage: string;

  constructor(private service: CartService, private sharedService: SharedService) {
  }

  ngOnInit() {
    if (!this.receipt) {
      this.subtotal = this.service.calculateSubtotal(this.cart);
      if (this.cart.items[0].has_shipments) {
        this.sharedService.shippingAddress$.subscribe(
          address => {
            this.shippingAddress = address;
            this.getShipping();
          }
        )
      } else {
        this.total = this.subtotal;
      }
    } else {
      this.cart = this.single_payment.products;
      this.shipping = this.single_payment.products.totals.shipping_cost.usd / 100;
      this.tax = this.single_payment.products.totals.tax.usd / 100;
      this.handling = this.single_payment.products.totals.handling_cost.usd / 100;
      this.total = this.single_payment.products.totals.total.usd / 100;
      this.subtotal = this.single_payment.products.totals.subtotal.usd / 100;
    }
  }

  getShipping() {
    this.shippingError = false;
    this.pending = true;
    this.service.getShipping(this.shippingAddress, this.shippingType)
      .subscribe(
        res => {
          this.handling = res['handling_cost'].usd / 100;
          this.shipping = res['shipping_cost'].usd / 100;
          this.tax = res['tax'].usd / 100;
          this.total = res['total'].usd / 100;
          this.pending = false;
          this.shippingCalculated.emit(this.total);
        },
        err => {
          let message = err.error.data.context.message;
          if (message === 'Inventory check failed.') {
            this.shippingErrorMessage = 'One of the items in your cart is out of stock';
          } else {
            this.shippingErrorMessage = 'There was an error calculating shipping.';
          }
          this.service.handleError(err);
          this.shippingError = true;
        }
      );
  }

}
