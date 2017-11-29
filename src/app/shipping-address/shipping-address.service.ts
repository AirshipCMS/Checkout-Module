import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Countries } from './countries';
import { States } from './states';
import { environment } from '../../environments/environment';

@Injectable()
export class ShippingAddressService {

  countries : Array<any> = Countries.items;
  states : Array<any> = States.StateGroups;
  headers : HttpHeaders;
  omitList : Array<any>;
  accountOmitList : Array<any>;

  constructor(private http: HttpClient) {
    let id_token = localStorage.getItem('id_token');
    this.headers = new HttpHeaders().set('authorization', `bearer ${id_token}`);
    this.omitList = ['created_at', 'id', 'site_id', 'updated_at', '_pivot_account_id', '_pivot_postal_address_id', 'address_options', 'change_address_option'];
  }

  getStates(country: any) {
    return this.states.find((item, i) => i === country.StateGroupID);
  }

  formattAddress(address: any) {
    let formattedAddress;
    for(const [key, value] of Object.entries(address)) {
      address['other_location'] = false;
      switch (key) {
        case "country":
          if(value.code) address[key] = value.code;
          break;

        case "state":
          if(value.name) address[key] = value.name;
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
            delete address[key];
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

  saveAddress(address: any, user: any, account: any) {
    let endpoint = 'account/postal_address';
    if(user.scope !== 'user') endpoint = `accounts/${account.id}/postal_address`;
    return this.http.post(`${environment.domain}/api/${endpoint}`, this.scrubAddress(address), { headers: this.headers });
  }

  saveSubscriptionAddresses(addresses: Array<any>) {
    localStorage.setItem('subscriptionAddresses', JSON.stringify(addresses));
  }

  getSubscriptionAddresses() {
    return JSON.parse(localStorage.getItem('subscriptionAddresses'));
  }

  getSinglePaymentAddress() {
    let localAddress = JSON.parse(localStorage.getItem('shipping_address'));
    let address = localAddress ? localAddress : null;
    return address;
  }

  scrubAddress(address: any) {
    this.omitList.forEach((key) => {
      delete address[key];
    });
    return address;
  }

  handleError(error) {
    console.error(error);
  }

}
