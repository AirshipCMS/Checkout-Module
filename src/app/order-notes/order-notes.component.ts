import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

import { SharedService } from '../shared.service';

@Component({
  selector: 'order-notes',
  templateUrl: './order-notes.component.html',
  styleUrls: ['./order-notes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderNotesComponent implements OnInit {

  orderNotes: string = '';
  @Input() receipt: any;
  @Input() singlePaymentOrder;
  singlePaymentNotes: string;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.getOrderNotes();
  }

  saveOrderNotes(orderNotes) {
    localStorage.setItem('customer_notes', orderNotes.target.value);
    this.sharedService.setOrderNotes(orderNotes.target.value);
  }

  getOrderNotes() {
    let localNotes = localStorage.getItem('customer_notes');
    if (this.singlePaymentOrder) {
      this.orderNotes = localNotes ? localNotes : '';
      this.sharedService.setOrderNotes(this.orderNotes);
      if (this.receipt) {
        delete localStorage.customer_notes;
      }
    }
  }
}
