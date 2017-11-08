import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePaymentOrderComponent } from './single-payment-order.component';

describe('SinglePaymentOrderComponent', () => {
  let component: SinglePaymentOrderComponent;
  let fixture: ComponentFixture<SinglePaymentOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinglePaymentOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglePaymentOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
