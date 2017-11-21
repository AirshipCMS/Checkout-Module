import { TestBed, inject } from '@angular/core/testing';

import { SelectCustomerAccountService } from './select-customer-account.service';

describe('SelectCustomerAccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectCustomerAccountService]
    });
  });

  it('should be created', inject([SelectCustomerAccountService], (service: SelectCustomerAccountService) => {
    expect(service).toBeTruthy();
  }));
});
