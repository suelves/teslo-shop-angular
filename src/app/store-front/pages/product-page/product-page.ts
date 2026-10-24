import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCarousel } from '@products/components/product-carousel/product-carousel';
import { ProductsService } from '@products/services/products.service';

@Component({
  imports: [ProductCarousel],
  selector: 'app-product-page',
  styleUrl: './product-page.css',
  templateUrl: './product-page.html',
})
export class ProductPage {
  private productService = inject(ProductsService);
  public productIdSlug = signal('');
  public param = inject(ActivatedRoute).paramMap.subscribe((params) => {
    this.productIdSlug.set(params.get('idSlug') ?? '');
    console.log("param", params.get('idSlug'));
    
  });

  public productResource = rxResource({
    params: () => ({
      id: this.productIdSlug()
    }),
    stream: ({params}) => {
      return this.productService.getProductByIdSlug(params.id)
    }
  });
}
