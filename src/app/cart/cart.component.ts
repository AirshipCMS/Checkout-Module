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
  @Input() defaultCard : any;
  @Input() orderDetails: any;

  constructor(private service: CartService, private sharedService: SharedService) {
  }

  ngOnInit() {
    this.cart = this.service.singleOrderCart;
    this.subtotal = this.service.calculateSubtotal();
    if(!this.orderDetails) {
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
    if(this.orderDetails) {
      this.cart = this.orderDetails.products;
      this.shipping = this.orderDetails.products.totals.shipping_cost.usd/100;
      this.tax = this.orderDetails.products.totals.tax.usd/100;
      this.handling = this.orderDetails.products.totals.handling_cost.usd/100;
      this.total = this.orderDetails.products.totals.total.usd/100;
      this.subtotal = this.orderDetails.products.totals.subtotal.usd/100;
    }
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
