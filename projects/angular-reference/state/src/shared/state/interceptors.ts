import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEventType,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { ApplicationRef, inject } from '@angular/core';

import { catchError, tap } from 'rxjs';
import { globalOutboxStore } from './outbox-store';
import { OUTBOX_SOURCED, OUTBOX_SOURCED_ID, RequestEntity } from './types';

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
        catchError((error: HttpErrorResponse) => {
          console.log({
            msg: 'Got an Outbox Error',
            statusText: error.statusText,
            code: error.status,
          });
          store.responseError({ ...payload, timestamp: Date.now() });
          throw error;
        }),
      );
    } else {
      return next(req);
    }
  };
}
