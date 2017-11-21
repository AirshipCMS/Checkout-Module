import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SelectCustomerAccountService } from './select-customer-account.service';

@Component({
  selector: 'select-customer-account',
  templateUrl: './select-customer-account.component.html',
  styleUrls: ['./select-customer-account.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SelectCustomerAccountService]
})
export class SelectCustomerAccountComponent implements OnInit {

  form : FormGroup;
  accounts : any;

  constructor(private service: SelectCustomerAccountService, private builder: FormBuilder) { }

  ngOnInit() {
    this.form = this.builder.group({
      account: ['', Validators.compose([Validators.required])]
    });
    this.getAccounts();
  }

  getAccounts() {
    this.service.getAccounts()
      .subscribe(
        accounts => {
          this.accounts = accounts;
          this.accounts = this.accounts.sort((a,b) => a.user.email - b.user.emial);
        },
        err => this.service.handleError(err)
      );
  }

  selectAccount(account: any) {

  }

}
