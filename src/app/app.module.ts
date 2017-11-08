import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { CheckoutComponent } from './checkout';
import { ReceiptComponent } from './receipt';
import { appRoutingProviders, routing } from './app.routes';
import { CanActivateViaAuthGuard } from './can-activate-via-auth-guard';
import { AuthService } from './auth.service';
import { CartComponent } from './cart';
import { PaymentMethodComponent } from './payment-method';
import { StripeService } from './stripe.service';

@NgModule({
  declarations: [
    AppComponent,
    CheckoutComponent,
    ReceiptComponent,
    CartComponent,
    PaymentMethodComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    routing
  ],
  providers: [CanActivateViaAuthGuard, appRoutingProviders, AuthService, StripeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
