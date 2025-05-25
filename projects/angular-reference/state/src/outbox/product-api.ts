import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import { withOutboxHttpContext } from '@outbox';
const FEATURE_NAME = 'products';
export type ApiProduct = { id: string; name: string; price: number };

export class ProductsApi {
  #client = inject(HttpClient);
  getProducts() {
    return this.#client.get<ApiProduct[]>('https://some-api/products');
  }

  deleteProduct(id: string) {
    return this.#client.delete<void>(`https://some-api/products/${id}`, {
      context: withOutboxHttpContext(FEATURE_NAME, id, 'DELETE'),
    });
  }
  addProduct(product: Omit<ApiProduct, 'id'>) {
    return this.#client.post<ApiProduct>('https://some-api/products', product, {
      context: withOutboxHttpContext(FEATURE_NAME, product, 'POST'),
    });
  }
  updateProduct(product: ApiProduct) {
    return this.#client.put<ApiProduct>(
      `https://some-api/products/${product.id}`,
      product,
      {
        context: withOutboxHttpContext(FEATURE_NAME, product, 'PUT'),
      },
    );
  }
}
