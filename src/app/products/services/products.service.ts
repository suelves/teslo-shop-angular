import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../auth/interfaces/user.interface';

const BASE_URL = environment.baseUrl;

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User,
};

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

interface ImageFileResponse {
  fileName: string;
  secureUrl: string;
}

@Service()
export class ProductsService {
  private http = inject(HttpClient);
  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  public getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) return of(this.productsCache.get(key)!);

    return this.http
      .get<ProductsResponse>(`${BASE_URL}/products`, {
        params: {
          limit: limit,
          offset: offset,
          gender: gender,
        },
      })
      .pipe(tap((resp) => this.productsCache.set(key, resp)));
  }

  public getProductByIdSlug(id: string): Observable<Product> {
    return this.http.get<Product>(`${BASE_URL}/products/${id}`);
  }

  public getProductById(id: string): Observable<Product> {
    if (id === 'new') return of(emptyProduct);

    if (this.productCache.has(id)) return of(this.productCache.get(id)!);

    return this.http
      .get<Product>(`${BASE_URL}/products/${id}`)
      .pipe(tap((resp) => this.productCache.set(id, resp)));
  }

  public updateProduct(
    id: string,
    productLike: Partial<Product>,
    imageFileList?: FileList,
  ): Observable<Product> {
    console.log('Actualizando producto');
    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map(
        (imageNames) =>
          ({
            ...productLike,
            images: [...currentImages, ...imageNames],
          }) as Product,
      ),
      switchMap((updatedProduct) =>
        this.http.patch<Product>(`${BASE_URL}/products/${id}`, updatedProduct),
      ),
      tap((product) => this.updateProductCache(product)),
    );
  }

  public createProduct(
    productLike: Partial<Product>,
    imageFileList?: FileList,
  ): Observable<Product> {
    console.log('Creando producto');
    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map(
        (filenames) =>
          ({
            ...productLike,
            images: [...currentImages, ...filenames],
          }) as Product,
      ),
      switchMap((updatedNewProduct) => {
        return this.http.post<Product>(`${BASE_URL}/products`, updatedNewProduct);
      }),
      tap((product) => this.updateProductCache(product)),
    );
  }

  private updateProductCache(product: Product) {
    const productId = product.id;

    this.productCache.set(productId, product);

    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map((currentProduct) => {
        return currentProduct.id === productId ? product : currentProduct;
      });
    });
  }

  // agafar el file list i pujar-ho al server
  private uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map((file) => this.uploadImage(file));

    return forkJoin(uploadObservables);
  }

  private uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();

    formData.append('file', imageFile);

    return this.http.post<ImageFileResponse>(`${BASE_URL}/files/product`, formData).pipe(
      tap((req) => console.log('la req del tap', req)),
      map((req) => req.fileName),
    );
  }
}
