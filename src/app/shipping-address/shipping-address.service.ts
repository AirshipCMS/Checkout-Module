import { Injectable } from '@angular/core';

import { Countries } from './countries';
import { States } from './states';

@Injectable()
export class ShippingAddressService {

  countries : Array<any> = Countries.items;
  states : Array<any> = States.StateGroups;

  getStates(country: any) {
    return this.states.find((item, i) => i === country.StateGroupID);
  }

  formatAddress(address: any) {
    let formattedAddress;
    for(const [key, value] of Object.entries(address)) {
      address['other_location'] = address['state'] === '';
      switch (key) {
        case "country":
          if(value['code']) address[key] = value['code'];
          break;

        case "state":
          if(value['code']) address[key] = value['code'];
          if(value['name']) address[key] = value['name'];
          break;

        case "other_location_text":
          if(value !== '') {
            address.other_location = true;
            address[key] = value;
            address.state = '';
          }
          break;

        default:
          if(value === undefined || value === null) {
            address[key] = '';
          }
          break;
      }
      formattedAddress = address;
    }
    return formattedAddress;
  }

  saveSinglePaymentAddress(address: any) {
    localStorage.setItem('shipping_address', JSON.stringify(address));
  }

  getSinglePaymentAddress() {
    let localAddress = JSON.parse(localStorage.getItem('shipping_address'));
    let address = localAddress ? localAddress : null;
    return address;
  }

  handleError(error) {
    console.error(error);
  }

}
