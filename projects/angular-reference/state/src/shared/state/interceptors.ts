import {
  HttpContext,
  HttpContextToken,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { OutboxActions } from './actions';
import { RequestEntity } from '.';

export const OUTBOX_SOURCED = new HttpContextToken<
  'queued' | 'outboxed' | 'sent' | undefined
>(() => undefined);
export const OUTBOX_SOURCED_ID = new HttpContextToken<string>(() => '');
export function addRequestToOutbox(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  console.log({ msg: 'Got a Request', req });
  const store = inject(Store);

  const stage = req.context.get(OUTBOX_SOURCED);
  const requestId = req.context.get(OUTBOX_SOURCED_ID);
  if (!requestId) {
    console.error('Request ID not found in context');
  }
  // if (stage === 'outboxed') {
  //   const payload: RequestEntity = {
  //     id: requestId,
  //     when: new Date().toISOString(),
  //     req: req.clone({
  //       context: req.context.set(OUTBOX_SOURCED, 'outboxed'),
  //     }),
  //     stage: 'outboxed',
  //   };
  //   store.dispatch(
  //     OutboxActions.requestHandled({
  //       payload,
  //     }),
  //   );
  //   return EMPTY;
  // }
  if (stage === 'sent') {
    const payload: RequestEntity = {
      id: requestId,
      when: new Date().toISOString(),
      req: req.clone({
        context: req.context.set(OUTBOX_SOURCED, 'sent'),
      }),
      stage: 'fulfilled',
    };
    // if we have seen this request before, we need to update the outbox
    store.dispatch(
      OutboxActions.requestHandled({
        payload,
      }),
    );
    return next(req);
  }
  // if we've never seen this request before, we need to add it to the outbox
  const id = crypto.randomUUID();

  const payload: RequestEntity = {
    id,
    when: new Date().toISOString(),
    req: req.clone({
      context: req.context.set(OUTBOX_SOURCED, 'intercepted'),
    }),
    stage: 'intercepted',
  };
  payload.req.context.set(OUTBOX_SOURCED_ID, id);

  store.dispatch(
    OutboxActions.requestHandled({
      payload,
    }),
  );
  return EMPTY;
}
