import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Product } from '@products/interfaces/product.interface';
import { ProductCarousel } from '@products/components/product-carousel/product-carousel';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/fotm-utils';
import { FormLabelError } from '../../../../shared/components/form-label-error/form-label-error';
import { JsonPipe } from '@angular/common';
import { ProductsService } from '../../../../products/services/products.service';
import { Router } from '@angular/router';
import { asapScheduler, firstValueFrom } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  imports: [ProductCarousel, ReactiveFormsModule, FormLabelError],
  selector: 'product-details',
  styleUrl: './product-details.css',
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {
  public tempImages = signal<string[]>([]);
  private imagesFileList = signal<FileList | undefined>(undefined);
  public product = input.required<Product>();
  private productsService = inject(ProductsService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  public productForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: ['', [Validators.required, Validators.min(0)]],
    stock: ['', [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
  });

  public productComputed = computed<Product>(() => {
    if (this.tempImages() === undefined) return this.product();

    return {
      ...this.product(),
      images: [...this.product().images, ...this.tempImages()],
    };
  });

  public wasSaved = signal(false);
  public sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  public ngOnInit(): void {
    this.setFormValue(this.product());
  }

  public setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(this.product() as any);
    console.log('Ja som dins i tenim un producte', this.productForm.value);
    // this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
  }

  public onSizeChanged(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }
    this.productForm.patchValue({ sizes: currentSizes });
  }

  public onFilesChanged(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    this.imagesFileList.set(fileList ?? undefined);
    const imagesUrl = Array.from(fileList ?? []).map((file) => URL.createObjectURL(file));
    console.log({ imagesUrl, fileList });
    this.tempImages.set(imagesUrl);
  }

  public async onSubmit() {
    const isValid = this.productForm.valid;
    console.log(this.productForm.value, { isValid });
    this.productForm.markAllAsTouched();

    if (!isValid) return;

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as Partial<Product>),
      tags:
        formValue.tags
          ?.toLocaleLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],
    };

    if (this.product().id === 'new') {
      console.log('es un producte now!!!');
      const product = await firstValueFrom(
        this.productsService.createProduct(productLike, this.imagesFileList()),
      );

      this.router.navigate([`/admin/products`, product.id]);
    } else {
      await firstValueFrom(
        this.productsService.updateProduct(this.product().id, productLike, this.imagesFileList()),
      );
    }

    this.wasSaved.set(true);

    asapScheduler.schedule(() => {
      this.wasSaved.set(false);
    }, 3000);
  }
}
