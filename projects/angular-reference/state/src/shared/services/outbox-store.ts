import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { addEntity, removeEntity, withEntities } from '@ngrx/signals/entities';
import { RequestEntity } from '../state';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

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
    };
  }),
);
