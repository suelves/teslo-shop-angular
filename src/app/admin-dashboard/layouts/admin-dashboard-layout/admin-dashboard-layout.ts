import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';

@Component({
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  selector: 'admin-dashboard-layout',
  styleUrl: './admin-dashboard-layout.css',
  templateUrl: './admin-dashboard-layout.html',
})
export class AdminDashboardLayout {
  private authService = inject(AuthService);

  public user = computed(() => this.authService.user());
}
