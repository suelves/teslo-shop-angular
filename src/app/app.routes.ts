import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from './auth/guards/not-authenticated-guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes')
            .then(m => m.authRoutes),
        // GUARDS
        canMatch: [
            NotAuthenticatedGuard,
            // () => {
            //     console.log("funció en el guard");
            //     return false;
                
            // },
        ]
        },
        {
            path: 'admin',
            loadChildren: () => import('./admin-dashboard/admin-dashboard.routes')
                .then(m => m.adminDahsboardRoutes)
        },
        {
            path: '',
            loadChildren: () => import('./store-front/store-front.routes')
                .then(m => m.storeFrontRoutes)
        }
];
