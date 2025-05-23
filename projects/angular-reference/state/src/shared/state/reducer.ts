import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { OutboxActions } from './actions';
export type RequestEntity = {
  id: string;
  timestamp: number;
  method: string;
  kind: 'deletion' | 'addition' | 'update';
  body: unknown;
};

export interface OutboxState extends EntityState<RequestEntity> {
  deadLetters: { id: string; error: { status: number; statusText: string } }[];
}

const adapter = createEntityAdapter<RequestEntity>();
export const outboxFeature = createFeature({
  name: 'outbox',
  reducer: createReducer(
    adapter.getInitialState({
      deadLetters: [] as {
        id: string;
        body: unknown;
        method: string;
        error: { status: number; statusText: string };
      }[],
    }),
    on(OutboxActions.requestSent, (state, { payload }) =>
      adapter.addOne(payload, state),
    ),
    on(OutboxActions.responseReceived, (state, { payload }) =>
      adapter.removeOne(payload.id, state),
    ),
    on(OutboxActions.errorReceived, (state, a) => {
      return adapter.removeOne(a.payload.id, state);
    }),
    on(OutboxActions.errorReceived, (state, { payload, error }) => {
      return {
        ...state,
        deadLetters: [
          ...state.deadLetters,
          {
            id: payload.id,
            body: payload.body,

            method: payload.method,
            error: { status: error.status, statusText: error.statusText },
          },
        ],
      };
    }),
  ),
  extraSelectors: ({ selectEntities, selectIds, selectDeadLetters }) => {
    const selectAll = createSelector(
      selectIds,
      selectEntities,
      (ids, entities) => ids.map((id) => entities[id]!) || [],
    );
    const selectDeletions = createSelector(selectAll, (a) =>
      a.filter((e) => e.kind === 'deletion').map((e) => e.body as string),
    );
    const selectUpdates = createSelector(selectAll, (a) =>
      a.filter((e) => e.kind === 'update').map((e) => e.body),
    );
    const selectAdditions = createSelector(selectAll, (a) =>
      a.filter((e) => e.kind === 'addition').map((e) => e.body),
    );

    function selectOutboxAugmentedList<T extends { id: string }>(
      entities: T[],
    ) {
      return createSelector(
        selectDeletions,
        selectUpdates,
        selectAdditions,
        (deletions, updates, additions) => {
          const entityUpdates = updates as T[];
          const entityAdditions = additions as Omit<T, 'id'>[];
          const entityDeletions = deletions as string[];
          const data = entities.map((entity) => ({
            item: entity,
            meta: {
              isDeleting: entityDeletions.some((d) => d === entity.id),
              isUpdating: entityUpdates.some((d) => d.id === entity.id),
              isMutating:
                entityDeletions.some((d) => d === entity.id) ||
                entityUpdates.some((d) => d.id === entity.id),
              update: entityUpdates.find((d) => d.id === entity.id),
            },
          }));
          return {
            data,
            isAdding: entityAdditions.length > 0,
            additions: entityAdditions,
          };
        },
      );
    }
    return {
      selectDeletions,
      selectUpdates,
      selectAdditions,
      selectDeadLetters,
      selectOutboxAugmentedList,
    };
  },
});

export const {
  name: outboxFeatureName,
  reducer: outboxReducer,
  selectEntities: selectOutboxEntities,
  selectIds: selectOutboxIds,
  selectUpdates,
  selectDeletions,
  selectAdditions,
  selectDeadLetters,
  selectOutboxAugmentedList,
} = outboxFeature;
