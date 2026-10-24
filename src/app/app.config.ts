import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideOptimus } from '@openng/optimus-ui/config';
import Nora from '@openng/optimus-ui-themes/nora';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loginInterceptor } from './shared/interceptors/login-interceptor';
import { authInterceptor } from './auth/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
    provideOptimus({ theme: { preset: Nora } }),
    provideHttpClient(
      withInterceptors([
        // loginInterceptor,
        authInterceptor,
      ]),
    ),
  ],
};
