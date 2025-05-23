import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Routes } from '@angular/router';
import { addRequestToOutbox } from '../shared/state/interceptors';

import { ProductsApi } from './product-api';
import { ProductsStore } from './products-store';
import { OutboxComponent } from './outbox';
export const OUTBOX_TWO_ROUTES: Routes = [
  {
    path: '',
    component: OutboxComponent,
    providers: [
      ProductsApi,
      ProductsStore,
      provideHttpClient(withInterceptors([addRequestToOutbox])),
    ],
    children: [],
  },
];
