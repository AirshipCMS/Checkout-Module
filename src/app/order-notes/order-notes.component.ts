import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

import { SharedService } from '../shared.service';

@Component({
  selector: 'order-notes',
  templateUrl: './order-notes.component.html',
  styleUrls: ['./order-notes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderNotesComponent implements OnInit {

  @Input() orderNotes : string = '';
  @Input() orderDetails : any;

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
    this.orderNotes = localNotes ? localNotes : '';
    this.sharedService.setOrderNotes(this.orderNotes);
  }
}
