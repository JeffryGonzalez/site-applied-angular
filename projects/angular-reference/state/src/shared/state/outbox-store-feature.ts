import { computed, inject, Signal } from '@angular/core';
import {
  signalStoreFeature,
  withComputed,
  withMethods,
  withProps,
} from '@ngrx/signals';
import { OutboxStore } from './outbox-store';

export function withOutbox<T extends { id: string }>(
  name: string,
  entities: Signal<T[]>,
) {
  return signalStoreFeature(
    withMethods(() => {
      return {};
    }),
    withProps(() => ({
      ob: inject(OutboxStore),
    })),
    withComputed((store) => {
      //  const xx = store.outbox.get();
      //   const ob = outboxStore.entities().filter((a) => a.name === name);
      return {
        outboxAugmentedList: computed(() => {
          const obEntities = store.ob.entities().filter((a) => a.name === name);
          const deletions = obEntities
            .filter((e) => e.kind === 'deletion')
            .map((e) => e.body as string);
          const additions = obEntities
            .filter((e) => e.kind === 'addition')
            .map((e) => e.body as T);
          const updates = obEntities
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
