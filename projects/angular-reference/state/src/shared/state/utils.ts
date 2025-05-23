import { HttpContext } from '@angular/common/http';
import { HttpMethod, OUTBOX_SOURCED } from './interceptors';

export function withOutboxState<T>(
  state: T,
  method: HttpMethod,
  kind: 'deletion' | 'addition' | 'update' | undefined = undefined,
) {
  return new HttpContext().set(OUTBOX_SOURCED, {
    method,
    kind:
      kind ??
      (method === 'DELETE'
        ? 'deletion'
        : method === 'POST'
          ? 'addition'
          : 'update'),
    body: state,
  });
}
