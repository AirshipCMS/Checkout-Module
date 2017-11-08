import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutComponent } from './checkout';
import { ReceiptComponent } from './receipt';

const AppRoutes : Routes = [
  { path: 'checkout', component: CheckoutComponent },
  { path: 'receipt', component: ReceiptComponent }
]

export const appRoutingProviders : any[] = [];
export const routing : ModuleWithProviders = RouterModule.forRoot(AppRoutes);