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

  saveAddress(address:any) {
    let formattedAddress;
    for(const [key, value] of Object.entries(address)) {
      address['other_address'] = false;
      address['other_address_text'] = '';
      switch (key) {
        case "country":
          address[key] = value.code;
          break;

        case "state":
          address[key] = value.name;
          break;

        case "other":
          if(value !== '') {
            address.other_address = true;
            address.other_address_text = value;
            address.state = '';
          }
          break;

        default:
          if(value === undefined) {
            delete address[key];
          }
          break;
      }
      formattedAddress = address;
    }
    return formattedAddress;
    // if user is logged and and has account, save address to account else, return formattedAddress
  }

}
