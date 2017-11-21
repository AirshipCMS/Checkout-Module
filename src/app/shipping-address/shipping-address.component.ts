import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

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

  countries : Array<any> = [];
  form : FormGroup;
  savedAddress : any;
  states : Array<any> = [];
  @Input() user;

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
      phone_number: ['', Validators.compose([Validators.minLength(7), FormValidator.validPhoneNumber, Validators.maxLength(24)])]
    })
  }

  ngOnInit() {
    this.countries = this.service.countries;
    if(Object.keys(this.user.account).length > 0) {
      let address = this.user.account.postal_addresses[0];
      this.savedAddress = this.service.scrubAddress(address);
      this.sharedService.setShippingAddress(this.service.formattAddress(this.savedAddress));
    } else {
      this.getLocalAddress();
    }
  }

  getLocalAddress() {
    this.savedAddress = this.service.getLocalAddress();
    this.sharedService.setShippingAddress(this.savedAddress);
  }

  saveAddress() {
    this.savedAddress = this.service.formattAddress(this.form.value);
    this.service.saveAddress(this.form.value, this.savedAddress, this.user);
    this.sharedService.setShippingAddress(this.savedAddress);
  }

  getStates(country) {
    if(country) {
      this.states = this.service.getStates(country);
    }
  }

}
