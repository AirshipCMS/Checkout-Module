import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { FormValidator } from '../form-validator';

@Component({
  selector: 'shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShippingAddressComponent implements OnInit {

  shipping_address : any = {};
  form : FormGroup;

  constructor(private builder: FormBuilder) {
    this.form  = this.builder.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      address_1: ['', Validators.compose([Validators.required])],
      address_2: [''],
      city: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      zipcode: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10), FormValidator.validZipcode])],
      phone: ['', Validators.compose([Validators.minLength(7), FormValidator.validPhoneNumber, Validators.maxLength(24)])]
    })
  }

  ngOnInit() {
  }

  saveAddress() {
    console.log(this.form)
  }

}
