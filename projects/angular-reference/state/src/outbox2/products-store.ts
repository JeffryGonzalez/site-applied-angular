/* eslint-disable @typescript-eslint/no-unused-vars */
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  removeEntity,
  setEntities,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { map, mergeMap, pipe, switchMap, tap } from 'rxjs';
import { selectOutboxAugmentedList } from '../shared/state/reducer';
import { ProductsApi } from './product-api';
const SORT_KEYS = ['name', 'price'] as const;
type SortKey = (typeof SORT_KEYS)[number];
const SORT_ORDERS = ['asc', 'desc'] as const;
type SortOrder = (typeof SORT_ORDERS)[number];
type ApiProduct = {
  id: string;
  name: string;
  price: number;
};
export const ProductsStore = signalStore(
  withEntities<ApiProduct>(),
  withState({
    sortKey: 'price' as SortKey,
    sortOrder: 'desc' as SortOrder,
    isLoading: true,
  }),
  withMethods((store) => {
    const service = inject(ProductsApi);
    return {
      setSortKey: (key: SortKey) => {
        if (store.sortOrder() === 'asc') {
          patchState(store, { sortKey: key, sortOrder: 'desc' });
        } else {
          patchState(store, { sortKey: key, sortOrder: 'asc' });
        }
      },
      setSortOrder: (order: SortOrder) =>
        patchState(store, { sortOrder: order }),
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
    const reduxStore = inject(Store);

    return {
      productList: computed(() => {
        const entities = store.entities();
        const sortKey = store.sortKey();
        const sortOrder = store.sortOrder();
        const sortedEntities = sortEntities(entities, sortKey, sortOrder);
        return reduxStore.selectSignal(
          selectOutboxAugmentedList(sortedEntities),
        )();
      }),
    };
  }),
  withHooks({
    onInit: (store) => {
      store.load();
    },
  }),
);
function sortEntities(
  entities: ApiProduct[],
  sortKey: SortKey,
  sortOrder: SortOrder,
) {
  return Object.values(entities).sort((a, b) => {
    if (sortKey === 'price') {
      if (a[sortKey] < b[sortKey]) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (a[sortKey] > b[sortKey]) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    } else {
      if (a[sortKey].toLowerCase() < b[sortKey].toLowerCase()) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (a[sortKey].toLowerCase() > b[sortKey].toLowerCase()) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    }
  });
}
