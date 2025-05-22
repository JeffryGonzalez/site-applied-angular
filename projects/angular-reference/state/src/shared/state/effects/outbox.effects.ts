import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs';
import { OutboxActions } from '../actions';
import { OUTBOX_SOURCED } from '../interceptors';
export class OutboxEffects {
  #client = inject(HttpClient);
  #actions$ = inject(Actions);

  handleRequest = createEffect(() => {
    return this.#actions$.pipe(
      ofType(OutboxActions.requestHandled),
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

              return OutboxActions.sendRequestWithoutSideEffect({
                request: a.request.clone({
                  context: a.request.context.set(OUTBOX_SOURCED, 'outboxed'),
                }),
              });
            }

            return OutboxActions.sendRequestWithSideEffect({
              request: a.request.clone({
                context: a.request.context.set(OUTBOX_SOURCED, 'outboxed'),
              }),
            });

            break;
          }
          default: {
            return { type: 'NOOP' };
          }
        }
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
              request: a.request.clone({
                context: a.request.context.set(OUTBOX_SOURCED, 'sent'),
              }),
              when: new Date().toISOString(),
              stage: 'sent',
            }),
          ),
        );
      }),
    );
  });
}
