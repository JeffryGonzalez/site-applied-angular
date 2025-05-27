import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withFeature,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import {
  removeEntity,
  setEntities,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, mergeMap, pipe, switchMap, tap } from 'rxjs';

import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withOutbox } from '@outbox';
import { ApiProduct, FEATURE_NAME, ProductsApi } from './product-api';
import { sortEntities, withProductSorting } from './product-store-sorting';

export const ProductsStore = signalStore(
  withEntities<ApiProduct>(),
  withDevtools('ProductsOutbox'),
  withProductSorting(),
  withMethods((store) => {
    const service = inject(ProductsApi);
    return {
      load: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            service.getProducts().pipe(
              tapResponse(
                (products) =>
                  patchState(store, setEntities(products), {
                    isLoading: false,
                  }),
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
    return {
      sortedProducts: computed(() => {
        const entities = store.entities();
        const sortKey = store.sortKey();
        const sortOrder = store.sortOrder();
        return sortEntities(entities, sortKey, sortOrder);
      }),
    };
  }),
  withFeature((store) => withOutbox(FEATURE_NAME, store.sortedProducts)), // [!code highlight]
  withHooks({
    onInit: (store) => {
      store.load();
    },
  }),
);
