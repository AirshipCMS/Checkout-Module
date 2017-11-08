import { Injectable } from '@angular/core';

import { Countries } from './countries';
import { States } from './states';

@Injectable()
export class ShippingAddressService {

  countries : Array<any> = Countries.items;
  states : Array<any> = States.StateGroups;

  constructor() { }

  getStates(country:any) {
    return this.states.find((item, i) => i === country.StateGroupID);
  }

}
