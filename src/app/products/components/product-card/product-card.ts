import { Component, ElementRef, AfterViewInit, ViewChild, viewChild, signal, input, computed, HostBinding } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { RouterLink } from '@angular/router';
import { CardModule } from '@openng/optimus-ui/card';
import { createMotion, MotionInstance } from '@openng/optimus-ui-motion';
import { environment } from '../../../../environments/environment';
import { SlicePipe } from '@angular/common';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  imports: [CardModule, ButtonModule, RouterLink, SlicePipe, ProductImagePipe],
  selector: 'product-card',
  styleUrl: './product-card.css',
  templateUrl: './product-card.html'
})
export class ProductCard {

  public product = input.required<Product>();
  public baseImgUrl = environment.imgUrl;
  
  public imageSrc = computed(() => `${this.baseImgUrl}/${this.product().images[0]}`);
}
