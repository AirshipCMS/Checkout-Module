import { Injectable } from '@angular/core';

@Injectable()
export class ShippingTypeService {

  constructor() {
  }

  saveShippingType(shippingType:string) {
    localStorage.setItem('shipping_type', shippingType);
  }

  getSavedShippingType() {
    let localShippingType = localStorage.getItem('shipping_type');
    let shippingType = localShippingType ? localShippingType : 'USPS';
    return shippingType;
  }

}
