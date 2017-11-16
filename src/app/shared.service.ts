import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { share } from 'rxjs/operators'

@Injectable()
export class SharedService {

  shippingAddress$ : Observable<any>;
  private shippingAddressSubject : Subject<any>;

  constructor() {
    this.shippingAddressSubject = new Subject();
    this.shippingAddress$ = this.shippingAddressSubject.asObservable();
  }

  setShippingAddress(shippingAddress: any) {
    this.shippingAddressSubject.next(shippingAddress);
  }

}
