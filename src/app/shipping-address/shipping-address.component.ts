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
  address : any;
  accountAddresses : Array<any> = [];
  states : Array<any> = [];
  editaddress : boolean = false;
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
    if(this.account && Object.keys(this.account).length > 0) {
      this.accountAddresses = this.account.postal_addresses;
      this.address = this.service.formattAddress(this.account.postal_addresses[0]);
      this.sharedService.setShippingAddress(this.service.scrubAddress(this.address));
    }
    if(!this.subscriptionAddresses && this.subscriptionCart) {
      this.subscriptionAddresses = [];
      this.subscriptionCart.items.forEach((item) => {
        if(this.account && Object.keys(this.account).length > 0) {
          this.subscriptionAddresses.push(this.account.postal_addresses[0]);
        } else {
          this.subscriptionAddresses.push({});
        }
      });
    }
    this.getAddress();
  }

  setAddress(address: any) {
    this.address = this.service.scrubAddress(this.service.formattAddress(address));
    this.editaddress = false;
    if(this.singlePaymentOrder) {
      this.sharedService.setShippingAddress(this.address);
      this.service.saveSinglePaymentAddress(this.address);
    } else {
      if(this.subscriptionAddresses) {
        this.subscriptionAddresses[this.subscriptionItemIndex] = this.address;
        this.service.saveSubscriptionAddresses(this.subscriptionAddresses);
        this.sharedService.setSubscriptionAddresses(this.subscriptionAddresses);
      }
    }
  }

  getAddress() {
    if(this.orderDetails) { //receipt
      this.address = this.orderDetails.shipping_address;
    } else {
      let singlePaymentAddress = this.service.getSinglePaymentAddress();
      let subscriptionAddresses = this.service.getSubscriptionAddresses();
      if(this.subscriptionItemIndex !== undefined) {
        this.sharedService.setSubscriptionAddresses(this.subscriptionAddresses);
      }
      if(this.singlePaymentOrder && singlePaymentAddress) {
        this.address = this.service.formattAddress(singlePaymentAddress);
        this.sharedService.setShippingAddress(this.service.scrubAddress(this.address));
      }
    }
  }

  saveAddress() {
    this.address = this.service.formattAddress(this.form.value);
    if(Object.keys(this.account).length > 0) {
      this.service.saveAddress(this.address, this.user, this.account)
        .subscribe(
          address => {
            this.address = address;
          },
          err => this.service.handleError(err)
        );
    }
    if(this.subscriptionItemIndex !== undefined) {
      this.subscriptionAddresses[this.subscriptionItemIndex] = this.service.formattAddress(this.service.scrubAddress(this.address));
      this.service.saveSubscriptionAddresses(this.subscriptionAddresses);
      this.sharedService.setSubscriptionAddresses(this.subscriptionAddresses);
    } else {
      this.service.saveSinglePaymentAddress(this.form.value);
      this.sharedService.setShippingAddress(this.service.scrubAddress(this.address));
    }
    this.editaddress = false;
  }

  getStates(country) {
    if(country) {
      this.states = this.service.getStates(country);
    }
  }

}
