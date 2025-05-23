import { computed, inject, Signal } from '@angular/core';
import { signalStoreFeature, withComputed, withMethods } from '@ngrx/signals';
import { globalOutboxStore } from '../services/outbox-store';
import { RequestEntity } from './reducer';

export function withOutbox<T extends { id: string }>(
  name: string,
  entities: Signal<T[]>,
) {
  const outboxStore = inject(globalOutboxStore);

  return signalStoreFeature(
    withMethods(() => {
      return {
        requestSent: (payload: RequestEntity) =>
          outboxStore.requestSent(payload),
        responseReceived: (payload: RequestEntity) =>
          outboxStore.responseReceived(payload),
      };
    }),
    withComputed(() => {
      const ob = outboxStore.entities().filter((a) => a.name === name);
      return {
        outboxAugmentedList: computed(() => {
          const deletions = ob
            .filter((e) => e.kind === 'deletion')
            .map((e) => e.body as string);
          const additions = ob
            .filter((e) => e.kind === 'addition')
            .map((e) => e.body as T);
          const updates = ob

            .filter((e) => e.kind === 'update')
            .map((e) => e.body as T);

          const data = entities().map((e) => ({
            item: e,
            meta: {
              isDeleting: deletions.includes(e.id),
              isUpdating: updates.some((u) => u.id === e.id),
              isMutating:
                additions.some((a) => a.id === e.id) ||
                updates.some((u) => u.id === e.id),
              update: updates.find((u) => u.id === e.id),
            },
          }));

          return {
            data,
            isAdding: additions.length > 0,
            additions,
          };
        }),
      };
    }),
  );
}
