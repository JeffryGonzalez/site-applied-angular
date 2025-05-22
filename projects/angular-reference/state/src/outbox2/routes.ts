import { Routes } from '@angular/router';
import { OutboxComponent } from './outbox';
import { ProductsApi } from './product-api';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { addRequestToOutbox } from '../shared/state/interceptors';
import { ProductsStore } from './products-store';
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
