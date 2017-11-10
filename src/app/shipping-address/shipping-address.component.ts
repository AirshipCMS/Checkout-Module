import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { FormValidator } from '../form-validator';
import { ShippingAddressService } from './shipping-address.service';

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
  savedAddress : any;
  states : Array<any> = [];
  @Input() user;
  @Output() savedShippingAddress = new EventEmitter();

  constructor(private builder: FormBuilder, private service: ShippingAddressService) {
    this.form  = this.builder.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      address_1: ['', Validators.compose([Validators.required])],
      address_2: [''],
      city: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      other: [''],
      zipcode: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10), FormValidator.validZipcode])],
      phone: ['', Validators.compose([Validators.minLength(7), FormValidator.validPhoneNumber, Validators.maxLength(24)])]
    })
  }

  ngOnInit() {
    this.countries = this.service.countries;
    if(Object.keys(this.user.account).length > 0) {
      this.getSavedAddress();
    } else {
      this.getLocalAddress();
    }
  }

  getLocalAddress() {
    this.savedAddress = this.service.getLocalAddress();
    this.savedShippingAddress.emit(this.savedAddress);
  }

  getSavedAddress() {
    this.savedAddress = this.service.getSavedAddress(this.user);
    this.savedShippingAddress.emit(this.savedAddress);
  }

  saveAddress() {
    this.savedAddress = this.service.formattAddress(this.form.value);
    this.service.saveAddress(this.form.value, this.savedAddress, this.user);
    this.savedShippingAddress.emit(this.savedAddress);
  }

  getStates(country) {
    if(country) {
      this.states = this.service.getStates(country)
    }
  }

}
