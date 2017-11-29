import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { share } from 'rxjs/operators'

@Injectable()
export class SharedService {
  
  checkoutResponse : any;
  shippingAddress$ : Observable<any>;
  orderNotes$ : Observable<any>;
  shippingType$ : Observable<any>;
  account$ : Observable<any>;
  subscriptionAddresses$ : Observable<any>;
  private shippingAddressSubject : ReplaySubject<any>;
  private orderNotesSubject : ReplaySubject<any>;
  private shippingTypeSubject : ReplaySubject<any>;
  private accountSubject : ReplaySubject<any>;
  private subscriptionAddressesSubject : ReplaySubject<any>;

  constructor() {
    this.shippingAddressSubject = new ReplaySubject<any>();
    this.shippingAddress$ = this.shippingAddressSubject.asObservable();
    this.orderNotesSubject = new ReplaySubject<any>();
    this.orderNotes$ = this.orderNotesSubject.asObservable();
    this.shippingTypeSubject = new ReplaySubject<any>();
    this.shippingType$ = this.shippingTypeSubject.asObservable();
    this.accountSubject = new ReplaySubject<any>();
    this.account$ = this.accountSubject.asObservable();
    this.subscriptionAddressesSubject = new ReplaySubject<any>();
    this.subscriptionAddresses$ = this.subscriptionAddressesSubject.asObservable();
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

  setAccount(account: string) {
    this.accountSubject.next(account);
  }

  setSubscriptionAddresses(addresses: Array<any>) {
    this.subscriptionAddressesSubject.next(addresses);
  }

}
