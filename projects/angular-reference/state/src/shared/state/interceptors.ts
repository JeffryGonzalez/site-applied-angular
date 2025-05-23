import {
  HttpContextToken,
  HttpEventType,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { ApplicationRef, inject } from '@angular/core';

import { tap } from 'rxjs';
import { globalOutboxStore } from '../services/outbox-store';
import { RequestEntity } from './reducer';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export const OUTBOX_SOURCED = new HttpContextToken<
  | {
      method: HttpMethod;
      kind: 'deletion' | 'addition' | 'update';
      body: unknown;
      name: string;
    }
  | undefined
>(() => undefined);
export const OUTBOX_SOURCED_ID = new HttpContextToken<string>(() => '');

export function addOutboxFeatureInterceptor(): HttpInterceptorFn {
  return (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const outbox = req.context.get(OUTBOX_SOURCED);
    const store = inject(globalOutboxStore);
    const appRef = inject(ApplicationRef);
    console.log('Intercepted a request', req.url);
    if (outbox) {
      const id = req.context.get(OUTBOX_SOURCED_ID) || crypto.randomUUID();
      const payload: RequestEntity = {
        id,
        timestamp: Date.now(),
        body: outbox.body,
        name: outbox.name,
        kind: outbox.kind,
        method: req.method,
      };
      store.requestSent(payload);
      appRef.tick();
      return next(req).pipe(
        tap((r) => {
          if (r.type === HttpEventType.Response) {
            store.responseReceived({ ...payload, timestamp: Date.now() });
          }
        }),
      );
    } else {
      return next(req);
    }
  };
}
// export function addRequestToOutbox(name: string) {
//   return (
//     req: HttpRequest<unknown>,
//     next: HttpHandlerFn,
//   ): HttpInterceptorFn => {
//     const outbox = req.context.get(OUTBOX_SOURCED);
//     const store = inject(globalOutboxStore);
//     if (outbox) {

//       const id = crypto.randomUUID();
//       const payload: RequestEntity = {
//         id,
//         timestamp: Date.now(),
//         body: outbox.body,
//         name,
//         kind: outbox.kind,
//         method: req.method,
//       };
//       store.requestSent(payload);
//     }
//       return next(req).pipe(
//         tap((r) => {
//           if (r.type === HttpEventType.Response) {
//             store.responseReceived({ ...payload, timestamp: Date.now() });
//           }
//         }),
//         catchError((err: HttpErrorResponse) => {
//           console.log({
//             msg: 'Got an Outbox Error',
//             statusText: err.statusText,
//             code: err.status,
//           });
//           // store.dispatch(
//           //   OutboxActions.errorReceived({
//           //     payload: { ...payload, timestamp: Date.now() },
//           //     error: { status: err.status, statusText: err.statusText },
//           //   }),
//           // );
//           throw err;
//         }),
//       );
//     }
//   };
// }
