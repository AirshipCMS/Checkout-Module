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
  subscriptionOrdersMiscData$ : Observable<any>;
  orderNotes$ : Observable<any>;
  shippingType$ : Observable<any>;
  account$ : Observable<any>;
  subscriptionAddresses$ : Observable<any>;
  subscriptionNotes$ : Observable<any>;
  private shippingAddressSubject : ReplaySubject<any>;
  private orderNotesSubject : ReplaySubject<any>;
  private shippingTypeSubject : ReplaySubject<any>;
  private accountSubject : ReplaySubject<any>;
  private subscriptionAddressesSubject : ReplaySubject<any>;
  private subscriptionNotesSubject : ReplaySubject<any>;
  private singlePaymentOrderMiscDataSubject : ReplaySubject<any>;
  private subscriptionOrdersMiscDataSubject : ReplaySubject<any>;

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
    this.subscriptionNotesSubject = new ReplaySubject<any>();
    this.subscriptionNotes$ = this.subscriptionNotesSubject.asObservable();
    this.singlePaymentOrderMiscDataSubject = new ReplaySubject<any>();
    this.singlePaymentOrderMiscData$ = this.singlePaymentOrderMiscDataSubject.asObservable();
    this.subscriptionOrdersMiscDataSubject = new ReplaySubject<any>();
    this.subscriptionOrdersMiscData$ = this.subscriptionOrdersMiscDataSubject.asObservable();
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

  setSubscriptionMiscData(miscData) {
    this.subscriptionOrdersMiscDataSubject.next(miscData);
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

  setSubscriptionNotes(orderNotes: Array<any>) {
    this.subscriptionNotesSubject.next(orderNotes);
  }

  clearLocalStorage() {
    for(var key in localStorage) {
      if(key !== 'id_token' && key !== 'customer_notes' && key !== 'subscriptionNotes' && key !== 'profile') localStorage.removeItem(key);
      // if(key !== 'id_token' && key !== 'account' && key !== 'user' && key !== 'customer_notes' && key !== 'subscriptionNotes' && key !== 'profile') localStorage.removeItem(key);

    }
  }

}
