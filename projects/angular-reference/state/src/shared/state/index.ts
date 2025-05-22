import { createFeature, createReducer, on } from '@ngrx/store';
import { OutboxActions, OutboxStages } from './actions';
import { HttpRequest } from '@angular/common/http';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
export type RequestEntity = {
  id: string;
  when: string;
  req: HttpRequest<unknown>;
  stage: OutboxStages;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OutboxState extends EntityState<RequestEntity> {}

const adapter = createEntityAdapter<RequestEntity>();
export const outboxFeature = createFeature({
  name: 'outbox',
  reducer: createReducer(
    adapter.getInitialState(),
    on(OutboxActions.requestHandled, (state, { payload }) => {
      return adapter.setOne(payload, state);
    }),
  ),
});
