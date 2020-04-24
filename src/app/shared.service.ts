import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { share } from 'rxjs/operators'

@Injectable()
export class SharedService {
  
  checkoutResponse : any;
  shippingAddress$ : Observable<any>;
  singlePaymentOrderMiscData$ : Observable<any>;
  orderNotes$ : Observable<any>;
  shippingType$ : Observable<any>;
  private shippingAddressSubject : ReplaySubject<any>;
  private orderNotesSubject : ReplaySubject<any>;
  private shippingTypeSubject : ReplaySubject<any>;
  private singlePaymentOrderMiscDataSubject : ReplaySubject<any>;

  constructor() {
    this.shippingAddressSubject = new ReplaySubject<any>();
    this.shippingAddress$ = this.shippingAddressSubject.asObservable();
    this.orderNotesSubject = new ReplaySubject<any>();
    this.orderNotes$ = this.orderNotesSubject.asObservable();
    this.shippingTypeSubject = new ReplaySubject<any>();
    this.shippingType$ = this.shippingTypeSubject.asObservable();
    this.singlePaymentOrderMiscDataSubject = new ReplaySubject<any>();
    this.singlePaymentOrderMiscData$ = this.singlePaymentOrderMiscDataSubject.asObservable();
  }

  setShippingAddress(shippingAddress: any) {
    this.shippingAddressSubject.next(shippingAddress);
  }

  setOrderNotes(orderNotes: string) {
    this.orderNotesSubject.next(orderNotes);
  }

  setSinglePaymentMiscData(miscData) {
    this.singlePaymentOrderMiscDataSubject.next(miscData);
  }

  setShippingType(shippingType: string) {
    this.shippingTypeSubject.next(shippingType);
  }

  clearLocalStorage() {
    for(var key in localStorage) {
      if(key !== 'customer_notes') localStorage.removeItem(key);
    }
  }

}
