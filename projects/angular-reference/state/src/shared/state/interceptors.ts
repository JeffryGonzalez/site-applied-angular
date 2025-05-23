import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { catchError, Observable, tap } from 'rxjs';
import { RequestEntity } from './reducer';
import { OutboxActions } from './actions';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export const OUTBOX_SOURCED = new HttpContextToken<
  | {
      method: HttpMethod;
      kind: 'deletion' | 'addition' | 'update';
      body: unknown;
    }
  | undefined
>(() => undefined);
export const OUTBOX_SOURCED_ID = new HttpContextToken<string>(() => '');
export function addRequestToOutbox(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const outbox = req.context.get(OUTBOX_SOURCED);
  const store = inject(Store);
  if (!outbox) {
    return next(req);
  } else {
    const id = crypto.randomUUID();
    const payload: RequestEntity = {
      id,
      timestamp: Date.now(),
      body: outbox.body,

      kind: outbox.kind,
      method: req.method,
    };
    store.dispatch(OutboxActions.requestSent({ payload }));
    return next(req).pipe(
      tap((r) => {
        if (r.type === HttpEventType.Response) {
          console.log({ msg: 'Got an Outbox Response', r });

          store.dispatch(
            OutboxActions.responseReceived({
              payload: { ...payload, timestamp: Date.now() },
            }),
          );
        }
      }),
      catchError((err: HttpErrorResponse) => {
        console.log({
          msg: 'Got an Outbox Error',
          statusText: err.statusText,
          code: err.status,
        });
        store.dispatch(
          OutboxActions.errorReceived({
            payload: { ...payload, timestamp: Date.now() },
            error: { status: err.status, statusText: err.statusText },
          }),
        );
        throw err;
      }),
    );
  }
}
