import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { OutboxActions } from './actions';
export type RequestEntity = {
  id: string;
  timestamp: number;
  method: string;
  body: unknown;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OutboxState extends EntityState<RequestEntity> {}

const adapter = createEntityAdapter<RequestEntity>();
export const outboxFeature = createFeature({
  name: 'outbox',
  reducer: createReducer(
    adapter.getInitialState(),
    on(OutboxActions.requestSent, (state, { payload }) =>
      adapter.addOne(payload, state),
    ),
    on(OutboxActions.responseReceived, (state, { payload }) =>
      adapter.removeOne(payload.id, state),
    ),
  ),
  extraSelectors: ({ selectEntities, selectIds }) => {
    const selectAll = createSelector(
      selectIds,
      selectEntities,
      (ids, entities) => ids.map((id) => entities[id]!) || [],
    );
    const selectDeletions = createSelector(selectAll, (a) =>
      a.filter((e) => e.method === 'DELETE').map((e) => e.body as string),
    );
    const selectUpdates = createSelector(selectAll, (a) =>
      a.filter((e) => e.method === 'PUT').map((e) => e.body),
    );
    const selectAdditions = createSelector(selectAll, (a) =>
      a.filter((e) => e.method === 'POST').map((e) => e.body),
    );
    return { selectDeletions, selectUpdates, selectAdditions };
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
} = outboxFeature;
