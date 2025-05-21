import {
  patchState,
  signalStore,
  watchState,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  removeEntity,
  setEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { ApiProduct, ProductsApi } from './product-api';
import { mergeMap, pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

export const OptimisticStore = signalStore(
  withEntities<ApiProduct>(),
  withState({
    loading: true,
    mutating: false,
    errorLog: [] as string[],
    requiresReload: false,
  }),
  withMethods((store) => {
    const service = inject(ProductsApi);
    return {
      delete: rxMethod<string>(
        pipe(
          tap((id) => patchState(store, { mutating: true }, removeEntity(id))),
          mergeMap((id) =>
            service.deleteProduct(id).pipe(
              tapResponse(
                () => {
                  patchState(store, { mutating: false });
                },
                (err: { status: number; statusText: string }) => {
                  const errors = store.errorLog();

                  errors.push(
                    `Could Not Delete ${id}: Status ${err.statusText} (${err.status})`,
                  );
                  patchState(store, {
                    errorLog: errors,
                    mutating: false,
                    requiresReload: true,
                  });
                },
              ),
            ),
          ),
        ),
      ),
      load: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() =>
            service.getProducts().pipe(
              tapResponse(
                (products: ApiProduct[]) =>
                  patchState(store, setEntities(products), {
                    loading: false,
                    errorLog: [],
                    requiresReload: false,
                  }),
                (err) => console.log(err),
              ),
            ),
          ),
        ),
      ),
    };
  }),
  withHooks({
    onInit(store) {
      store.load();
      watchState(store, (state) => {
        if (state.requiresReload) {
          patchState(store, { requiresReload: false });
          store.load();
        }
      });
    },
  }),
);
