import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { share } from 'rxjs/operators'

@Injectable()
export class SharedService {

  shippingAddress$ : Observable<any>;
  private shippingAddressSubject : ReplaySubject<any>;
  orderNotes$ : Observable<any>;
  private orderNotesSubject : ReplaySubject<any>;
  shippingType$ : Observable<any>;
  private shippingTypeSubject : ReplaySubject<any>;

  constructor() {
    this.shippingAddressSubject = new ReplaySubject<any>();
    this.shippingAddress$ = this.shippingAddressSubject.asObservable();
    this.orderNotesSubject = new ReplaySubject<any>();
    this.orderNotes$ = this.shippingAddressSubject.asObservable();
    this.shippingTypeSubject = new ReplaySubject<any>();
    this.shippingType$ = this.shippingTypeSubject.asObservable();
  }

  setShippingAddress(shippingAddress: any) {
    this.shippingAddressSubject.next(shippingAddress);
  }

  setOrderNotes(orderNotes: string) {
    this.orderNotesSubject.next(orderNotes);
  }

  setShippingType(shippingType: string) {
    this.shippingTypeSubject.next(shippingType);
  }

}
