import { Component, signal, input, effect } from '@angular/core';
import { Carousel } from '@openng/optimus-ui/carousel';
import { Button } from '@openng/optimus-ui/button';
import { Tag } from '@openng/optimus-ui/tag';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '../../pipes/product-image.pipe';
import { environment } from '../../../../environments/environment';

/* 
npm i -g neon@latest && neon login && neon skills -y && neon mcp -y && neon link --project-id crimson-lake-29193041 --branch production -y



postgresql://neondb_owner:npg_ivdKxQ4Mphm7@ep-long-fog-b923nbc5-pooler.c-7.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
*/

@Component({
  imports: [Carousel, CommonModule, ProductImagePipe],
  selector: 'product-carousel',
  styleUrl: './product-carousel.css',
  templateUrl: './product-carousel.html',
})
export class ProductCarousel {
  public baseUrl = environment.imgUrl;
  public products = input<Product[]>([]);
  public prdEffec = effect(() => {
    console.log('que hi ha?', this.products());
  });
  public responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '767px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
}
