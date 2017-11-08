import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { CheckoutComponent } from './checkout';
import { ReceiptComponent } from './receipt';
import { appRoutingProviders, routing } from './app.routes';
import { AuthService } from './auth.service';
import { CartComponent } from './cart';
import { PaymentMethodComponent } from './payment-method';
import { StripeService } from './stripe.service';
import { SinglePaymentOrderComponent } from './single-payment-order';
import { ShippingAddressComponent } from './shipping-address';

@NgModule({
  declarations: [
    AppComponent,
    CheckoutComponent,
    ReceiptComponent,
    CartComponent,
    PaymentMethodComponent,
    SinglePaymentOrderComponent,
    ShippingAddressComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
    FormsModule,
    routing
  ],
  providers: [appRoutingProviders, AuthService, StripeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
