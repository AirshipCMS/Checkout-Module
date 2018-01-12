import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

import { ShippingTypeService } from './shipping-type.service';
import { SharedService } from '../shared.service';
import { environment } from '../../environments/environment';

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
  @Input() receipt: any;

  constructor(private service: ShippingTypeService, private sharedService: SharedService) {
    this.options = environment.shipping_types;
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
