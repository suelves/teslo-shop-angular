import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../products/services/products.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductCard } from '@products/components/product-card/product-card';

@Component({
  imports: [ProductCard],
  selector: 'app-gender-page',
  styleUrl: './gender-page.css',
  templateUrl: './gender-page.html',
})
export class GenderPage {
  public route = inject(ActivatedRoute);
  public productService = inject(ProductsService);
  public gender = toSignal(
    this.route.params.pipe(
      map(({gender}) => gender)
    )

  );
  public genderResource = rxResource({
    params: () => ({
      gender: this.gender()
    }),
    stream: ({params}) => {
      const gender = params.gender;
      return this.productService.getProducts({gender});
    }
  })
}
