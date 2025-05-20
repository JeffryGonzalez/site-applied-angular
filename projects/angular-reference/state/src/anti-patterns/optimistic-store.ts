import {patchState, signalStore, withHooks, withMethods, withState} from "@ngrx/signals";
import {removeEntity, setEntities, withEntities} from "@ngrx/signals/entities";
import {ApiProduct, ProductsApi} from "./product-api";
import {mergeMap, pipe, switchMap, tap} from "rxjs";
import {inject} from "@angular/core";
import {tapResponse} from "@ngrx/operators";
import {rxMethod} from "@ngrx/signals/rxjs-interop";



export const OptimisticStore = signalStore(
  withEntities<ApiProduct>(),
  withState({
    loading: true,
    mutating: false,
    errorLog: [] as string[]
  }),
  withMethods(store => {
    const service = inject(ProductsApi)
    return {
      delete: rxMethod<string>(
        pipe(
          tap(() => patchState(store, {mutating: true})),
          mergeMap(id => service.deleteProduct(id)
            .pipe(
              tapResponse(() => {
                patchState(store, removeEntity(id), {mutating: false});
              },
                (err: {status:number, statusText: string}) => {
                const errors = store.errorLog();

                errors.push(`Could Not Delete ${id}: Status ${err.statusText} (${err.status})`);
                  patchState(store,{errorLog: errors,mutating: false} );
                }
              )
            )
          ),
        )
      ),
      load: rxMethod<void>(pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() => service.getProducts()
          .pipe(tapResponse(
            (products:ApiProduct[]) => patchState(store, setEntities(products), { loading: false, errorLog:[]}),
            (err) => console.log(err)
          ))
        ),
      ))
    }
  }),
  withHooks({
    onInit(store) {
      store.load()
    }
  })
)
