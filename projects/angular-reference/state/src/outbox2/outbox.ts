import { CurrencyPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductsStore } from './products-store';
import { selectDeadLetters } from '../shared/state';

@Component({
  selector: 'app-outbox2-outbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, JsonPipe],
  template: `
    <p>Outbox 2</p>

    <button class="btn btn-primary" (click)="addProduct()">Add Product</button>
    <table class="table table-auto table-zebra">
      <thead>
        <td>Name</td>
        <td>Price</td>
        <td>Actions</td>
      </thead>
      <tbody>
        @if (store.productList().isAdding) {
          @for (item of store.productList().additions; track $index) {
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item.price | currency }}</td>
              <td>
                <span class="loading loading-dots loading-lg"></span>
                <span>Adding..</span>
              </td>
            </tr>
          }
        }
        @for (product of store.productList().data; track product.item.id) {
          <tr>
            @if (product.meta.isUpdating) {
              <td>{{ product.meta.update?.name }}</td>
              <td>{{ product.meta.update?.price | currency }}</td>
            } @else {
              <td>{{ product.item.name }}</td>
              <td>{{ product.item.price | currency }}</td>
            }

            <td>
              @if (product.meta.isDeleting) {
                <button class="btn btn-danger">
                  <span class="loading loading-dots loading-lg"></span>
                </button>
              } @else {
                <button class="btn btn-error" (click)="delete(product.item.id)">
                  Delete
                </button>
              }
              @if (product.meta.isUpdating) {
                <button class="btn btn-primary">
                  <span class="loading loading-dots loading-lg"></span>
                </button>
              } @else {
                <button
                  class="btn btn-primary"
                  (click)="store.doublePrice(product.item)"
                >
                  Double Price
                </button>
              }
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: ``,
})
export class OutboxComponent {
  store = inject(ProductsStore);
  reduxStore = inject(Store);

  delete(id: string) {
    this.store.deleteProduct(id);
  }

  addProduct() {
    this.store.addProduct({
      name: 'New Product',
      price: 100,
    });
  }
}
