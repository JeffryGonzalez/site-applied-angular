import { HttpRequest } from '@angular/common/http';
import { createActionGroup, props } from '@ngrx/store';
import { RequestEntity } from '.';

export type OutboxStages =
  | 'intercepted'
  | 'outboxed'
  | 'sent'
  | 'fulfilled'
  | undefined;
export const OutboxActions = createActionGroup({
  source: 'Outbox',
  events: {
    requestHandled: props<{
      payload: RequestEntity;
    }>(),
    sendRequestWithSideEffect: props<{
      request: HttpRequest<unknown>;
    }>(),
    sendRequestWithoutSideEffect: props<{
      request: HttpRequest<unknown>;
    }>(),
  },
});
