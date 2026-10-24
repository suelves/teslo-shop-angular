import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

const baseUrl = environment.imgUrl;

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[] | null): string {
    // console.log("value", value);

    if (value === null) {
      return './assets/images/no-image.jpg';
    }

    if (typeof value === 'string') {
      return value;
    }

    const image = value[0];

    if (!image) return './assets/images/no-image.jpg';

    return `${baseUrl}/${image}`;
  }
}
