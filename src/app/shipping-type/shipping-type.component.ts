import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

import { ShippingTypeService } from './shipping-type.service';

@Component({
  selector: 'shipping-type',
  templateUrl: './shipping-type.component.html',
  styleUrls: ['./shipping-type.component.scss'],
  providers: [ShippingTypeService],
  encapsulation: ViewEncapsulation.None
})
export class ShippingTypeComponent implements OnInit {

  options : Array<any>;
  @Output() shippingTypeChanged = new EventEmitter();
  shippingType : string;

  constructor(private service: ShippingTypeService) {
    this.options = this.service.shippingTypes;
  }

  ngOnInit() {
    this.shippingType = this.service.getSavedShippingType();
    this.shippingTypeChanged.emit(this.shippingType);
  }

  saveShippingType(shippingType:string) {
    this.service.saveShippingType(shippingType);
  }

}
