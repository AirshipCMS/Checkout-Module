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

  countries: Array<any> = [];
  form: FormGroup;
  address: any;
  accountAddresses: Array<any> = [];
  states: Array<any> = [];
  editaddress: boolean = false;
  changeCardOption: string = 'existing';
  singlePaymentAddress: any;
  subscriptionAddresses: Array<any>;
  newAddressInvalid: boolean = false;
  noAddressSelected: boolean = false;
  invalidZipcode: boolean = false;
  @Input() receipt: any;
  @Input() user;
  @Input() account;
  @Input() subscriptionCart: any;
  @Input() subscriptionItemIndex: number;
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
      zipcode: ['', Validators.compose([Validators.required])],
      phone_number: [''],
      change_address_option: [this.changeCardOption],
      address_options: ''
    });
  }

  ngOnInit() {
    this.countries = this.service.countries;
    let subscriptionAddresses = this.receipt ? this.receipt.subscription_addresses : this.service.getSubscriptionAddresses();
    if (this.account && Object.keys(this.account).length > 0) {
      this.accountAddresses = this.account.postal_addresses;
    }
    if (this.subscriptionCart) {
      if (!subscriptionAddresses) {
        this.subscriptionAddresses = [];
        this.subscriptionCart.items.forEach((item) => {
          this.subscriptionAddresses.push({});
        });
      } else {
        this.subscriptionAddresses = subscriptionAddresses;
      }
    }
    this.getAddress();
  }

  setAddress(address: any) {
    this.invalidZipcode = false;
    if (address) {
      if (address.country === 'US' && address.zipcode.match(/^(?:\d{5}(?:[-]\d{4})?|\d{9})$/) === null) {
        this.invalidZipcode = true;
      } else {
        this.address = this.service.scrubAddress(this.service.formatAddress(address));
        this.editaddress = false;
        if (this.singlePaymentOrder) {
          this.sharedService.setShippingAddress(this.address);
          this.service.saveSinglePaymentAddress(this.address);
        } else {
          if (this.subscriptionAddresses) {
            this.subscriptionAddresses[this.subscriptionItemIndex] = this.address;
            this.service.saveSubscriptionAddresses(this.subscriptionAddresses);
            this.sharedService.setSubscriptionAddresses(this.subscriptionAddresses);
          }
        }
      }
    } else {
      this.noAddressSelected = true;
    }
  }

  getAddress() {
    if (this.receipt) { //receipt
      if (this.singlePaymentOrder) {
        this.address = this.receipt.single_payment_has_shipments.shipping_address;
      } else {
        this.address = this.receipt.subscription_addresses[this.subscriptionItemIndex];
      }
    } else {
      this.sharedService.subscriptionAddresses$.subscribe(addressess => this.subscriptionAddresses = addressess);
      let singlePaymentAddress = this.service.getSinglePaymentAddress();
      let subscriptionAddresses = this.service.getSubscriptionAddresses();
      if (this.subscriptionItemIndex !== undefined) {
        this.address = this.service.formatAddress(this.subscriptionAddresses[this.subscriptionItemIndex]);
        this.sharedService.setSubscriptionAddresses(this.subscriptionAddresses);
      }
      if (this.singlePaymentOrder && singlePaymentAddress) {
        this.address = this.service.formatAddress(singlePaymentAddress);
        this.sharedService.setShippingAddress(this.service.scrubAddress(this.address));
      }
    }
  }

  saveAddress() {
    this.newAddressInvalid = false;
    this.invalidZipcode = false
    if (this.form.valid && (this.form.value.country.code !== 'US' || (this.form.value.country.code === 'US' && this.form.value.zipcode.match(/^(?:\d{5}(?:[-]\d{4})?|\d{9})$/) !== null))) {
      this.address = this.service.formatAddress(this.form.value);
      if (this.account && Object.keys(this.account).length > 0) {
        this.service.saveAddress(this.address, this.user, this.account)
          .subscribe(
            address => {
              this.address = this.service.formatAddress(address);
            },
            err => this.service.handleError(err)
          );
      }
      if (this.subscriptionItemIndex !== undefined) {
        this.subscriptionAddresses[this.subscriptionItemIndex] = this.service.formatAddress(this.service.scrubAddress(this.address));
        this.service.saveSubscriptionAddresses(this.subscriptionAddresses);
        this.sharedService.setSubscriptionAddresses(this.subscriptionAddresses);
      } else {
        this.service.saveSinglePaymentAddress(this.form.value);
        this.sharedService.setShippingAddress(this.service.scrubAddress(this.address));
      }
      this.editaddress = false;
    } else {
      this.newAddressInvalid = true;
      this.invalidZipcode = this.form.value.country.code === 'US' && this.form.value.zipcode.match(/^(?:\d{5}(?:[-]\d{4})?|\d{9})$/) === null;
    }
  }

  getStates(country) {
    if (country) {
      this.states = this.service.getStates(country);
    }
  }

}
