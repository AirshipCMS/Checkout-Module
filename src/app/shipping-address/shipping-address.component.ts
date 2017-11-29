import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { FormValidator } from '../form-validator';
import { ShippingAddressService } from './shipping-address.service';
import { SharedService } from '../shared.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.scss'],
  providers: [ShippingAddressService],
  encapsulation: ViewEncapsulation.None
})
export class ShippingAddressComponent implements OnInit {

  countries : Array<any> = [];
  form : FormGroup;
  defaultAddress : any;
  accountAddresses : Array<any> = [];
  states : Array<any> = [];
  editDefaultAddress : boolean = false;
  changeCardOption : string = 'existing';
  @Input() orderDetails : any;
  @Input() user;
  @Input() account;

  constructor(private builder: FormBuilder, private service: ShippingAddressService, private sharedService: SharedService) {
    this.form  = this.builder.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      address_1: ['', Validators.compose([Validators.required])],
      address_2: [''],
      city: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      other_location_text: [''],
      zipcode: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10), FormValidator.validZipcode])],
      phone_number: ['', Validators.compose([Validators.minLength(7), FormValidator.validPhoneNumber, Validators.maxLength(24)])],
      change_address_option: [this.changeCardOption],
      address_options: ''
    });
  }

  ngOnInit() {
    this.countries = this.service.countries;
    if(this.account && Object.keys(this.account).length > 0) {
      this.accountAddresses = this.account.postal_addresses;
      let defaultAddress = this.accountAddresses.length-1;
      this.defaultAddress = this.service.scrubAddress(this.accountAddresses[defaultAddress]);
      this.sharedService.setShippingAddress(this.service.formattAddress(this.defaultAddress));
    } else {
      this.getLocalAddress();
    }
  }

  setDefaultAddress(address: any) {
    this.defaultAddress = address;
    this.editDefaultAddress = false;
    this.sharedService.setShippingAddress(this.defaultAddress);
  }

  getLocalAddress() {
    if(this.orderDetails) {
      this.defaultAddress = this.orderDetails.shipping_address;
    } else {
      this.defaultAddress = this.service.getLocalAddress();
      this.sharedService.setShippingAddress(this.defaultAddress);
    }
  }

  saveAddress() {
    if(Object.keys(this.account).length > 0) {
      this.defaultAddress = this.service.formattAddress(this.form.value);
      this.service.saveAddress(this.defaultAddress, this.user, this.account)
        .subscribe(
          address => {
            this.accountAddresses.push(address);
            this.defaultAddress = address;
          },
          err => this.service.handleError(err)
        );
    } else {
      this.defaultAddress = this.service.formattAddress(this.form.value);
      this.service.saveLocalAddress(this.form.value);
    }
    this.sharedService.setShippingAddress(this.defaultAddress);
  }

  getStates(country) {
    if(country) {
      this.states = this.service.getStates(country);
    }
  }

}
