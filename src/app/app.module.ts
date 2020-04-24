import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CheckoutComponent } from './checkout';
import { ReceiptComponent } from './receipt';
import { appRoutingProviders, routing } from './app.routes';
import { CartComponent } from './cart';
import { PaymentMethodComponent } from './payment-method';
import { SinglePaymentOrderComponent } from './single-payment-order';
import { ShippingAddressComponent } from './shipping-address';
import { ShippingTypeComponent } from './shipping-type/shipping-type.component';
import { OrderNotesComponent } from './order-notes/order-notes.component';
import { SharedService } from './shared.service';
import { MiscDataComponent } from './misc-data/misc-data.component';
import { KeysPipe } from './keys.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CheckoutComponent,
    ReceiptComponent,
    CartComponent,
    PaymentMethodComponent,
    SinglePaymentOrderComponent,
    ShippingAddressComponent,
    ShippingTypeComponent,
    OrderNotesComponent,
    MiscDataComponent,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    routing
  ],
  providers: [appRoutingProviders, SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
