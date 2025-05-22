import { HttpClient, HttpContext } from '@angular/common/http';
import { inject } from '@angular/core';
import { OUTBOX_SOURCED } from '../shared/state/interceptors';
import { HttpMethods } from 'msw';

export type ApiProduct = { id: string; name: string; price: number };

export class ProductsApi {
  #client = inject(HttpClient);
  getProducts() {
    return this.#client.get<ApiProduct[]>('https://some-api/products');
  }

  deleteProduct(id: string) {
    return this.#client.delete(`https://some-api/products/${id}`, {
      context: withOutboxState(id, HttpMethods.DELETE),
    });
  }
  addProduct(product: Omit<ApiProduct, 'id'>) {
    return this.#client.post<ApiProduct>('https://some-api/products', product, {
      context: withOutboxState(product, HttpMethods.POST),
    });
  }
  updateProduct(product: ApiProduct) {
    return this.#client.put<ApiProduct>(
      `https://some-api/products/${product.id}`,
      product,
      {
        context: withOutboxState(product, HttpMethods.PUT),
      },
    );
  }
}

function withOutboxState<T>(state: T, method: HttpMethods) {
  return new HttpContext().set(OUTBOX_SOURCED, {
    method,
    body: state,
  });
}
