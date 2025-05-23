import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Routes } from '@angular/router';

import { OutboxComponent } from './outbox';
import { ProductsApi } from './product-api';
import { ProductsStore } from './products-store';
export const OUTBOX_TWO_ROUTES: Routes = [
  {
    path: '',
    component: OutboxComponent,
    providers: [
      ProductsApi,
      ProductsStore,
      provideHttpClient(withInterceptors([])),
    ],
    children: [],
  },
];
