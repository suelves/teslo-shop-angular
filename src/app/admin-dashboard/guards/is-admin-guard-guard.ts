import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';
import { firstValueFrom } from 'rxjs';

export const isAdminGuardGuard: CanActivateFn = async (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const isAutheticated = await firstValueFrom( authService.checkStatus());

  if (isAutheticated) {

    const user = authService.user();
    const adminRole = authService.isAdmin();
    // console.log("guard: tenim el adminRole", adminRole, user?.roles);
    
    if (adminRole) {
      return true;
    } 

    router.navigateByUrl('/');
    return false;

     
  }

  // console.log("estem en el guard, no estem autenticats");

  return false;
  


};
