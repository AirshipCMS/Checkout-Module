import { TestBed, inject } from '@angular/core/testing';

import { ShippingTypeService } from './shipping-type.service';

describe('ShippingTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShippingTypeService]
    });
  });

  it('should be created', inject([ShippingTypeService], (service: ShippingTypeService) => {
    expect(service).toBeTruthy();
  }));
});
