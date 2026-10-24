import { Component, effect, ElementRef, inject, viewChild, ViewChild } from '@angular/core';
import { CardModule } from '@openng/optimus-ui/card';
import { ButtonModule } from '@openng/optimus-ui/button';
// import { ProductCard } from '@products/components/product-card/product-card';
import { createMotion, MotionInstance } from '@openng/optimus-ui-motion';
import { ProductCard } from '@products/components/product-card/product-card';
import { ProductsService } from '@products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  imports: [ProductCard],
  selector: 'app-home-page',
  styleUrl: './home-page.css',
  templateUrl: './home-page.html',
})
export class HomePage {
    
  public grid = viewChild<ElementRef<Element>>('templateGrid');
  public motion : MotionInstance | null = null;
  public animationEffect = effect(() => {
    if (this.grid()) {
      this.motion = createMotion(this.grid()!.nativeElement, {
        name: 'p-fade', // Nom base per a les classes CSS (ex: p-fade-enter-active)
        enter: true,
        leave: true,
        duration: 500   // Durada en mil·lisegons
      });
      this.motion.enter();
    }
  });


  private productService = inject(ProductsService);
  public productsResource = rxResource({
    params: () => ({}),
    stream: ({params}) => {
      return this.productService.getProducts({
        limit: 5,
        gender: 'woman'
      });
    }
    
  })
  ngAfterViewInit() {
    

  }
}


