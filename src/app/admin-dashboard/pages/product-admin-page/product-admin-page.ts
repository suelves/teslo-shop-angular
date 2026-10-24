import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map, tap } from 'rxjs';
import { ProductDetails } from './product-details/product-details';

@Component({
  imports: [ProductDetails],
  selector: 'product-admin-page',
  styleUrl: './product-admin-page.css',
  templateUrl: './product-admin-page.html',
})
export class ProductAdminPage {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  productService = inject(ProductsService);
  public productId = toSignal(
    this.activatedRoute.params.pipe(
      map(param => param['id'])
    )
  );

  public productResource = rxResource({
    params: () => ({
      id: this.productId
    }),
    stream: ({params}) => {
      const id = params.id
      return this.productService.getProductById(id()).pipe(
        tap(req => console.log("estem rebent el producte", req)
        )
      );
    }
  });


  public redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this.router.navigate(['/admin/products'])
    }
  });
}
