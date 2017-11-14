import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'order-notes',
  templateUrl: './order-notes.component.html',
  styleUrls: ['./order-notes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderNotesComponent implements OnInit {

  orderNotes : string = '';
  @Output() savedOrderNotes = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.getOrderNotes();
  }

  saveOrderNotes(orderNotes) {
    localStorage.setItem('customer_notes', orderNotes.target.value);
    this.savedOrderNotes.emit(orderNotes.target.value);
  }

  getOrderNotes() {
    let localNotes = localStorage.getItem('customer_notes');
    this.orderNotes = localNotes ? localNotes : '';
    this.savedOrderNotes.emit(this.orderNotes);
  }
}
