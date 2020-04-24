import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutComponent } from './checkout';
import { ReceiptComponent } from './receipt';

const AppRoutes : Routes = [
  { path: 'guest-checkout', component: CheckoutComponent },
  { path: 'guest-checkout#receipt', component: ReceiptComponent }
]

export const appRoutingProviders : any[] = [];
export const routing : ModuleWithProviders = RouterModule.forRoot(AppRoutes);