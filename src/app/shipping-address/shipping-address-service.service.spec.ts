import { TestBed, inject } from '@angular/core/testing';

import { ShippingAddressService } from './shipping-address.service';

describe('ShippingAddressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShippingAddressService]
    });
  });

  it('should be created', inject([ShippingAddressService], (service: ShippingAddressService) => {
    expect(service).toBeTruthy();
  }));
});
