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
  singlePaymentAddress : any;
  subscriptionAddresses : Array<any>;
  @Input() orderDetails : any;
  @Input() user;
  @Input() account;
  @Input() subscriptionCart : any;
  @Input() subscriptionItemIndex : number;
  @Input() singlePaymentOrder;

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
    this.subscriptionAddresses = this.service.getSubscriptionAddresses();
    if(!this.subscriptionAddresses && this.subscriptionCart) {
      this.subscriptionAddresses = [];
      this.subscriptionCart.items.forEach((item) => {
        this.subscriptionAddresses.push({});
      });
    }
    if(this.account && Object.keys(this.account).length > 0) {
      this.accountAddresses = this.account.postal_addresses;
      this.defaultAddress = this.account.postal_addresses[0];
      this.sharedService.setShippingAddress(this.defaultAddress);
    }
    this.getAddress();
  }

  setDefaultAddress(address: any) {
    this.defaultAddress = address;
    this.editDefaultAddress = false;
    if(this.singlePaymentOrder) {
      this.sharedService.setShippingAddress(this.defaultAddress);
    } else {
      if(this.subscriptionAddresses) {
        this.subscriptionAddresses[this.subscriptionItemIndex] = this.defaultAddress;
        this.service.saveSubscriptionAddresses(this.subscriptionAddresses);
      }
    }
  }

  getAddress() {
    if(this.orderDetails) { //receipt
      this.defaultAddress = this.orderDetails.shipping_address;
    } else {
      let singlePaymentAddress = this.service.getSinglePaymentAddress();
      let subscriptionAddresses = this.service.getSubscriptionAddresses();
      if(this.subscriptionItemIndex !== undefined && subscriptionAddresses) {
        this.defaultAddress = this.subscriptionAddresses[this.subscriptionItemIndex];
      }
      if(this.singlePaymentOrder && singlePaymentAddress) {
        this.defaultAddress = singlePaymentAddress;
        this.sharedService.setShippingAddress(this.defaultAddress);
      }
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
    }
    this.defaultAddress = this.service.formattAddress(this.form.value);
    if(this.subscriptionItemIndex !== undefined) {
      this.subscriptionAddresses[this.subscriptionItemIndex] = this.defaultAddress;
      this.service.saveSubscriptionAddresses(this.subscriptionAddresses);
    } else {
      this.service.saveSinglePaymentAddress(this.form.value);
      this.sharedService.setShippingAddress(this.defaultAddress);
    }
  }

  getStates(country) {
    if(country) {
      this.states = this.service.getStates(country);
    }
  }

}
