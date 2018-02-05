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

  cart : any;
  @Output() shippingCalculated = new EventEmitter();
  shippingType : string;
  shipping : any = '(pending)';
  tax : any = '(pending)';
  handling : any = '(pending)';
  total : any = '(pending)';
  subtotal : number = 0;
  pending : boolean = true;
  shippingAddress : any;
  @Input() creditCard : any;
  @Input() receipt: any;
  shippingError: boolean = false;
  shippingErrorMessage: string;

  constructor(private service: CartService, private sharedService: SharedService) {
  }

  ngOnInit() {
    this.cart = this.service.singleOrderCart;
    this.subtotal = this.service.calculateSubtotal();
    if(!this.receipt) {
      if(!environment.skip_single_payment_shipping) {
        this.sharedService.shippingAddress$.subscribe(
          address => {
            this.shippingAddress = address;
            this.getShipping();
          }
        )
      } else {
        this.shippingAddress = environment.default_address;
        this.getShipping();
      }
      this.sharedService.shippingType$.subscribe(
        shippingType => {
          this.shippingType = shippingType;
          if(this.shippingAddress) this.getShipping();
        }
      )
    }
    if(this.receipt) {
      this.cart = this.receipt.products;
      this.shipping = this.receipt.products.totals.shipping_cost.usd/100;
      this.tax = this.receipt.products.totals.tax.usd/100;
      this.handling = this.receipt.products.totals.handling_cost.usd/100;
      this.total = this.receipt.products.totals.total.usd/100;
      this.subtotal = this.receipt.products.totals.subtotal.usd/100;
    }
  }

  getShipping() {
    this.shippingError = false;
    this.pending = true;
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
        err => {
          let message = err.error.data.context.message;
          if(message === 'Inventory check failed.') {
            this.shippingErrorMessage = message;
          } else {
            this.shippingErrorMessage = 'There was an error calculating shipping.';
          }
          this.service.handleError(err);
          this.shippingError = true;
        }
      );
  }

}
