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

  constructor(private http: HttpClient) {
    let id_token = localStorage.getItem('id_token');
    this.headers = new HttpHeaders().set('authorization', `bearer ${id_token}`);
    this.omitList = ['created_at', 'id', 'site_id', 'updated_at', '_pivot_account_id', '_pivot_postal_address_id'];
  }

  getStates(country:any) {
    return this.states.find((item, i) => i === country.StateGroupID);
  }

  formattAddress(address:any) {
    let formattedAddress;
    for(const [key, value] of Object.entries(address)) {
      address['other_location'] = false;
      switch (key) {
        case "country":
          address[key] = value.code;
          break;

        case "state":
          address[key] = value.name;
          break;

        case "other_location_text":
          if(value !== '') {
            address.other_location = true;
            address[key] = value;
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
  }

  saveAddress(address:any, formattedAddress:any, user:any) {
    if(Object.keys(user.account).length > 0) {
      let body = user.account;
      body.shipping_address = formattedAddress;
      this.http.put(`${environment.domain}/api/account`, body, { headers: this.headers })
        .subscribe(
          res => res,
          err => this.handleError(err)
        );
    } else {
      localStorage.setItem('shipping_address', JSON.stringify(address));
    }
  }

  getLocalAddress() {
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
