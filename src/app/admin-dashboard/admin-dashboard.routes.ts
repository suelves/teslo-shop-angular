import { Routes } from "@angular/router";
import { AdminDashboardLayout } from "./layouts/admin-dashboard-layout/admin-dashboard-layout";
import { ProductsAdminPage } from "./pages/products-admin-page/products-admin-page";
import { ProductAdminPage } from "./pages/product-admin-page/product-admin-page";
import { isAdminGuardGuard } from "./guards/is-admin-guard-guard";



export const adminDahsboardRoutes : Routes = [
    {
        path: '',
        component: AdminDashboardLayout,
        children: [
            {
        
                path: 'products',
                component: ProductsAdminPage,
                canMatch: [isAdminGuardGuard]
            
            },
            {
                path: 'products/:id',
                component: ProductAdminPage
            },
            {
                path: '**',
                redirectTo: ''
            }
        ]
    }
]