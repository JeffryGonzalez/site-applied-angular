import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, tap } from 'rxjs';
import { OutboxActions } from '../actions';
import { OUTBOX_SOURCED } from '../interceptors';
import { RequestEntity } from '..';
export class OutboxEffects {
  #client = inject(HttpClient);
  #actions$ = inject(Actions);

  handleRequest = createEffect(() => {
    return this.#actions$.pipe(
      ofType(OutboxActions.requestHandled),
      tap((a) => console.log('Outbox Effect', a)),
      map(({ payload: a }) => {
        switch (a.stage) {
          case 'intercepted': {
            if (a.req.method === 'GET' || a.req.method === 'HEAD') {
              const payload: RequestEntity = {
                id: a.id,
                when: a.when,
                req: a.req.clone({
                  context: a.req.context.set(OUTBOX_SOURCED, 'outboxed'),
                }),
                stage: 'outboxed',
              };
              return OutboxActions.requestHandled({ payload });
            }
            break;
          }
          case 'outboxed': {
            //             case 'outboxed': {
            if (a.req.method === 'GET' || a.req.method === 'HEAD') {
              return OutboxActions.sendRequestWithoutSideEffect({
                request: a.req.clone({
                  context: a.req.context.set(OUTBOX_SOURCED, 'sent'),
                }),
              });
            }
            return OutboxActions.sendRequestWithoutSideEffect({
              request: a.req.clone({
                context: a.req.context.set(OUTBOX_SOURCED, 'sent'),
              }),
            });
          }
          default: {
            return { type: 'NOOP' };
          }
        }
        return { type: 'NOOP' };
      }),
    );
  });
  sendRequestWithoutSideEffect = createEffect(() => {
    return this.#actions$.pipe(
      ofType(OutboxActions.sendRequestWithoutSideEffect),
      mergeMap((a) => {
        return this.#client.request(a.request).pipe(
          map(() =>
            OutboxActions.requestHandled({
              payload: {
                id: a.request.context.get(OUTBOX_SOURCED) || '',
                req: a.request.clone({
                  context: a.request.context.set(OUTBOX_SOURCED, 'fulfilled'),
                }),
                when: new Date().toISOString(),
                stage: 'fulfilled',
              },
            }),
          ),
        );
      }),
    );
  });
}
