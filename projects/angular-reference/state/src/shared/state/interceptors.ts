import {
  HttpContextToken,
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpMethods } from 'msw';
import { catchError, Observable, tap } from 'rxjs';
import { RequestEntity } from '.';
import { OutboxActions } from './actions';
const ctr = 0;
export const OUTBOX_SOURCED = new HttpContextToken<
  | {
      method: HttpMethods;
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
      method: req.method,
    };
    store.dispatch(OutboxActions.requestSent({ payload }));
    return next(req).pipe(
      tap((r) => {
        if (r.type === HttpEventType.Response) {
          console.log({ msg: 'Got an Outbox Response', r, ctr });

          store.dispatch(
            OutboxActions.responseReceived({
              payload: { ...payload, timestamp: Date.now() },
            }),
          );
        }
      }),
      catchError((err) => {
        console.log({ msg: 'Got an Outbox Error', err, ctr });
        store.dispatch(
          OutboxActions.responseReceived({
            payload: { ...payload, timestamp: Date.now() },
          }),
        );
        throw err;
      }),
    );
  }
}
