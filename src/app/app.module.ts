import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { appRoutingProviders, routing } from './app.routes';
import { CartDirective } from './cart/cart.directive';
import { CanActivateViaAuthGuard } from './can-activate-via-auth-guard';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [
    AppComponent,
    CheckoutComponent,
    ReceiptComponent,
    CartDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    routing
  ],
  providers: [CanActivateViaAuthGuard, appRoutingProviders, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
