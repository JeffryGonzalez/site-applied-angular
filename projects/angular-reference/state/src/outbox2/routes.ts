import { Routes } from '@angular/router';
import { OutboxComponent } from './outbox';
import { ProductsApi } from './product-api';
export const OUTBOX_TWO_ROUTES: Routes = [
  {
    path: '',
    component: OutboxComponent,
    providers: [ProductsApi],
    children: [],
  },
];
