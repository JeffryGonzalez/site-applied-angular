import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { addEntity, removeEntity, withEntities } from '@ngrx/signals/entities';
import { RequestEntity } from './types';

export const globalOutboxStore = signalStore(
  withEntities<RequestEntity>(),
  withDevtools('GlobalOutboxStore'),
  withMethods((store) => {
    return {
      requestSent: (payload: RequestEntity) => {
        patchState(store, addEntity(payload));
      },
      responseReceived: (payload: RequestEntity) => {
        patchState(store, removeEntity(payload.id));
      },
      responseError: (payload: RequestEntity) => {
        // TODO: handle error
        patchState(store, removeEntity(payload.id));
      },
    };
  }),
);
