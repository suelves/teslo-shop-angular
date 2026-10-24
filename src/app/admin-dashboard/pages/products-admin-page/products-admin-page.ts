import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTable } from '@products/components/product-table/product-table';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { RouterLink } from '@angular/router';

@Component({
  imports: [ProductTable, ButtonDirective, RouterLink],
  selector: 'products-admin-page',
  styleUrl: './products-admin-page.css',
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {
  private productsService = inject(ProductsService);

  public productsResource = rxResource({
    stream: () => {
      return this.productsService.getProducts({ limit: 50 });
    },
  });
}
