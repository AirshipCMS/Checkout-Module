import { Injectable } from '@angular/core';

@Injectable()
export class ShippingTypeService {

  shippingTypes : Array<any>;

  constructor() {
    this.shippingTypes = ['Standard', 'Expedited'];
  }

  saveShippingType(shippingType:string) {
    localStorage.setItem('shipping_type', shippingType);
  }

  getSavedShippingType() {
    let localShippingType = localStorage.getItem('shipping_type');
    let shippingType = localShippingType ? localShippingType : 'Standard';
    return shippingType;
  }

}
