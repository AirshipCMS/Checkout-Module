import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutComponent } from './checkout';
import { ReceiptComponent } from './receipt';
import { CanActivateViaAuthGuard } from './can-activate-via-auth-guard';

const AppRoutes : Routes = [
  { path: 'checkout', component: CheckoutComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'receipt', component: ReceiptComponent }
]

export const appRoutingProviders : any[] = [];
export const routing : ModuleWithProviders = RouterModule.forRoot(AppRoutes);