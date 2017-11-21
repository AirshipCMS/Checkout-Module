import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { SelectCustomerAccountService } from './select-customer-account.service';

@Component({
  selector: 'select-customer-account',
  templateUrl: './select-customer-account.component.html',
  styleUrls: ['./select-customer-account.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SelectCustomerAccountService]
})
export class SelectCustomerAccountComponent implements OnInit {

  constructor(service: SelectCustomerAccountService) { }

  ngOnInit() {
  }

}
