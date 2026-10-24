import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanActivateFn = async (route, state) => {

  // console.log('NotAuthenticatedGuard');
  
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom( authService.checkStatus());

  // console.log("estat:",{isAuthenticated});
  
  if (isAuthenticated) {
    router.navigateByUrl('/');
    return false;
  }
  return true;
};
