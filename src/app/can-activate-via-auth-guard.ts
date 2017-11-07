import { Injectable  } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

  constructor (private auth: AuthService) {}

  canActivate() {
    if (!this.auth.isAuthenticated) {
      window.location.href = '/login';
      return false;
    }
    return true;
  }

}
