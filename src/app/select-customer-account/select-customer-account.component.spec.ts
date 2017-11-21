import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCustomerAccountComponent } from './select-customer-account.component';

describe('SelectCustomerAccountComponent', () => {
  let component: SelectCustomerAccountComponent;
  let fixture: ComponentFixture<SelectCustomerAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCustomerAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCustomerAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
