import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductsStore } from './products-store';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-outbox2-outbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, ReactiveFormsModule],
  template: `
    <p>Outbox</p>
    @if (store.isLoading()) {
      <span class="loading loading-dots loading-lg"></span>
    } @else {
      <form
        [formGroup]="form"
        (ngSubmit)="addProduct()"
        class="p-4 border-2 border-gray-400 rounded-2xl"
      >
        <div class="flex flex-row gap-2">
          <input
            formControlName="name"
            type="text"
            placeholder="Product Name"
            class="input input-bordered w-full max-w-xs"
          />
          <input
            formControlName="price"
            type="number"
            placeholder="Product Price"
            class="input input-bordered w-full max-w-xs"
          />
          <button type="submit" class="btn btn-primary btn-sm">
            Add Product
          </button>
        </div>
      </form>
      <table class="table table-auto table-zebra">
        <thead>
          <td>
            <button (click)="store.setSortKey('name')" class="link">
              Name

              @if (store.sortKey() === 'name') {
                <span class="text-accent">
                  @if (store.sortOrder() === 'asc') {
                    ↑
                  } @else {
                    ↓
                  }
                </span>
              }
            </button>
          </td>
          <td>
            <button (click)="store.setSortKey('price')" class="link">
              Price

              @if (store.sortKey() === 'price') {
                <span class="text-accent">
                  @if (store.sortOrder() === 'asc') {
                    ↑
                  } @else {
                    ↓
                  }
                </span>
              }
            </button>
          </td>
          <td>Actions</td>
        </thead>
        <tbody>
          @if (store.productList().isAdding) {
            @for (item of store.productList().additions; track $index) {
              <tr>
                <td>
                  {{ item.name }}
                </td>
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
              @if (product.meta.isMutating) {
                <td class="italic" [class.opacity-50]="product.meta.isDeleting">
                  {{ product.meta.update?.name || product.item.name }}
                </td>
                <td class="italic" [class.opacity-50]="product.meta.isDeleting">
                  {{
                    product.meta.update?.price || product.item.price | currency
                  }}
                </td>
              } @else {
                <td>
                  {{ product.item.name }}
                </td>
                <td>{{ product.item.price | currency }}</td>
              }

              <td>
                <div class="flex flex-row gap-2">
                  @if (product.meta.isDeleting) {
                    <button class="btn btn-danger">
                      <span class="loading loading-dots loading-lg"></span>
                    </button>
                  } @else {
                    <button
                      class="btn btn-error"
                      (click)="store.deleteProduct(product.item.id)"
                      [disabled]="product.meta.isMutating"
                    >
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
                      [disabled]="product.meta.isMutating"
                      (click)="store.doublePrice(product.item)"
                    >
                      Double Price
                    </button>
                  }
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
  styles: ``,
})
export class OutboxComponent {
  store = inject(ProductsStore);
  reduxStore = inject(Store);
  form = new FormGroup({
    name: new FormControl<string>(''),
    price: new FormControl<number>(0),
  });
  addProduct() {
    const newProduct = this.form.value as { name: string; price: number };
    this.store.addProduct(newProduct);
    this.form.reset();
    this.form.patchValue({ price: 0 });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
