import { Component, input } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [ProductImagePipe, RouterLink, CurrencyPipe],
  selector: 'product-table',
  styleUrl: './product-table.css',
  templateUrl: './product-table.html',
})
export class ProductTable {
  public products = input.required<Product[]>();
}
