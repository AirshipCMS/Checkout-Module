import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { FormValidator } from '../form-validator';
import { ShippingAddressService } from './shipping-address.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.scss'],
  providers: [ShippingAddressService],
  encapsulation: ViewEncapsulation.None
})
export class ShippingAddressComponent implements OnInit {

  countries: Array<any> = [];
  form: FormGroup;
  address: any;
  states: Array<any> = [];
  editaddress: boolean = false;
  singlePaymentAddress: any;
  newAddressInvalid: boolean = false;
  noAddressSelected: boolean = false;
  @Input() receipt: any;
  @Input() singlePaymentOrder;

  constructor(private builder: FormBuilder, private service: ShippingAddressService, private sharedService: SharedService) {
    this.form = this.builder.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      address_1: ['', Validators.compose([Validators.required])],
      address_2: [''],
      city: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      other_location_text: [''],
      zipcode: ['', Validators.compose([Validators.required, FormValidator.validZipcode])],
      phone_number: [''],
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });
  }

  ngOnInit() {
    this.countries = this.service.countries;
    this.getAddress();
  }

  setAddress(address: any) {
    if (address) {
      this.address = this.service.formatAddress(address);
      this.editaddress = false;
      this.sharedService.setShippingAddress(this.address);
      this.service.saveSinglePaymentAddress(this.address);
    } else {
      this.noAddressSelected = true;
    }
  }

  getAddress() {
    if (this.receipt) { //receipt
      this.address = this.receipt.shipping_address;
    } else {
      let singlePaymentAddress = this.service.getSinglePaymentAddress();
      if(singlePaymentAddress) {
        this.address = this.service.formatAddress(singlePaymentAddress);
        this.sharedService.setShippingAddress(this.address);
      }
    }
  }

  saveAddress() {
    this.newAddressInvalid = false;
    if (this.form.valid) {
      this.address = this.service.formatAddress(this.form.value);
      this.service.saveSinglePaymentAddress(this.form.value);
      this.sharedService.setShippingAddress(this.address);
      this.editaddress = false;
    } else {
      this.newAddressInvalid = true;
    }
  }

  getStates(country) {
    if (country) {
      this.states = this.service.getStates(country);
    }
  }

}
