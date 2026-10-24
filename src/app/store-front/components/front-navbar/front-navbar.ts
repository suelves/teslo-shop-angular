import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';
import { Button, ButtonModule } from '@openng/optimus-ui/button';

@Component({
  imports: [RouterLink, RouterLinkActive, ButtonModule],
  selector: 'front-navbar',
  styleUrl: './front-navbar.css',
  templateUrl: './front-navbar.html',
})
export class FrontNavbar {
  private authService = inject(AuthService);

  public isAuthenticated = computed(() => this.authService.authStatus() === 'authenticated');
  public notAuthenticated = computed(() => this.authService.authStatus() === 'not-authenticated');
  public fullName = computed(() => this.authService.user()?.fullName);
}
