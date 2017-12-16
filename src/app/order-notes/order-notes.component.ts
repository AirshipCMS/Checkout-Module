import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

import { SharedService } from '../shared.service';

@Component({
  selector: 'order-notes',
  templateUrl: './order-notes.component.html',
  styleUrls: ['./order-notes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderNotesComponent implements OnInit {

  orderNotes : string = '';
  @Input() receipt : any;
  @Input() singlePaymentOrder;
  @Input() subscriptionItemIndex : number;
  @Input() subscriptionCart : any;
  subscriptionNotes : Array<any> = [];
  singlePaymentNotes : string;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.subscriptionNotes = localStorage.getItem('subscriptionNotes') ? JSON.parse(localStorage.getItem('subscriptionNotes')) : [];
    if(this.subscriptionNotes.length === 0 && this.subscriptionCart) {
      this.subscriptionCart.items.forEach((item) => {
        this.subscriptionNotes.push('');
      });
    }
    this.getOrderNotes();
  }

  saveOrderNotes(orderNotes) {
    if(this.singlePaymentOrder) {
      localStorage.setItem('customer_notes', orderNotes.target.value);
      this.sharedService.setOrderNotes(orderNotes.target.value);
    } else {
      this.subscriptionNotes[this.subscriptionItemIndex] = orderNotes.target.value;
      localStorage.setItem('subscriptionNotes', JSON.stringify(this.subscriptionNotes));
      this.sharedService.setSubscriptionNotes(this.subscriptionNotes);
    }
  }

  getOrderNotes() {
    let localNotes = localStorage.getItem('customer_notes');
    let subscriptionNotes = JSON.parse(localStorage.getItem('subscriptionNotes'));
    if(this.singlePaymentOrder) {
      this.orderNotes = localNotes ? localNotes : '';
      this.sharedService.setOrderNotes(this.orderNotes);
      if(this.receipt) {
        delete localStorage.customer_notes;
      }
    }
    if(this.subscriptionItemIndex !== undefined && subscriptionNotes && subscriptionNotes.length > 0) {
      this.orderNotes = this.subscriptionNotes[this.subscriptionItemIndex];
      if(this.receipt) {
        delete localStorage.subscriptionNotes;
      }
    }
  }
}
