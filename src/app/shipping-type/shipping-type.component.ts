import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ShippingTypeService } from './shipping-type.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'shipping-type',
  templateUrl: './shipping-type.component.html',
  styleUrls: ['./shipping-type.component.scss'],
  providers: [ShippingTypeService],
  encapsulation: ViewEncapsulation.None
})
export class ShippingTypeComponent implements OnInit {

  options : Array<any>;
  shippingType : string;

  constructor(private service: ShippingTypeService, private sharedService: SharedService) {
    this.options = this.service.shippingTypes;
  }

  ngOnInit() {
    this.shippingType = this.service.getSavedShippingType();
    this.sharedService.setShippingType(this.shippingType);
  }

  saveShippingType(shippingType:string) {
    this.service.saveShippingType(shippingType);
    this.sharedService.setShippingType(shippingType);
  }

}
