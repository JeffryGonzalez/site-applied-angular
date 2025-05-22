import { computed, inject, Signal } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import {
  removeEntity,
  setEntities,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { ProductsApi } from './product-api';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, mergeMap, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import {
  selectAdditions,
  selectDeletions,
  selectUpdates,
} from '../shared/state';
type ApiProduct = {
  id: string;
  name: string;
  price: number;
};
export const ProductsStore = signalStore(
  withEntities<ApiProduct>(),
  withMethods((store) => {
    const service = inject(ProductsApi);
    return {
      load: rxMethod<void>(
        pipe(
          switchMap(() =>
            service.getProducts().pipe(
              tapResponse(
                (products) => patchState(store, setEntities(products)),
                (error) => console.error('Error loading products', error),
              ),
            ),
          ),
        ),
      ),
      doublePrice: rxMethod<ApiProduct>(
        pipe(
          map((product) => ({
            ...product,
            price: product.price * 2,
          })),
          mergeMap((product) =>
            service.updateProduct(product).pipe(
              tapResponse(
                (updatedProduct) =>
                  patchState(store, setEntity(updatedProduct)),
                (error) => console.error('Error updating product', error),
              ),
            ),
          ),
        ),
      ),
      addProduct: rxMethod<Omit<ApiProduct, 'id'>>(
        pipe(
          mergeMap((product) =>
            service.addProduct(product).pipe(
              tapResponse(
                (newProduct) => patchState(store, setEntity(newProduct)),
                (error) => console.error('Error adding product', error),
              ),
            ),
          ),
        ),
      ),
      deleteProduct: rxMethod<string>(
        pipe(
          mergeMap((id) =>
            service.deleteProduct(id).pipe(
              tapResponse(
                () => patchState(store, removeEntity(id)), // remove the entity from the store
                (error) => console.error('Error deleting product', error),
              ),
            ),
          ),
        ),
      ),
    };
  }),
  withComputed((store) => {
    const reduxStore = inject(Store);
    const deletions = reduxStore.selectSignal(selectDeletions);
    const updates = reduxStore.selectSignal(selectUpdates) as Signal<
      ApiProduct[]
    >;
    const additions = reduxStore.selectSignal(selectAdditions) as Signal<
      Omit<ApiProduct, 'id'>[]
    >;
    return {
      productList: computed(() => {
        const data = store.entities().map((i) => ({
          item: i,
          meta: {
            isDeleting: deletions().some((d) => d === i.id),
            isUpdating: updates().some((d) => d.id === i.id),
            update: updates().find((d) => d.id === i.id),
          },
        }));

        return {
          data,
          isAdding: additions().length > 0,
          additions: additions(),
        };
      }),
    };
  }),
  withHooks({
    onInit: (store) => {
      store.load();
    },
  }),
);
