import { createActionGroup, props } from '@ngrx/store';
import { RequestEntity } from '.';

export const OutboxActions = createActionGroup({
  source: 'Outbox',
  events: {
    requestSent: props<{
      payload: RequestEntity;
    }>(),
    responseReceived: props<{
      payload: RequestEntity;
    }>(),
    errorReceived: props<{
      payload: RequestEntity;
      error: { status: number; statusText: string };
    }>(),
  },
});
