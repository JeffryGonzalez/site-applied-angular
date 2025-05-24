import { Routes } from '@angular/router';

import { OutboxComponent } from './outbox';
export const OUTBOX_TWO_ROUTES: Routes = [
  {
    path: '',
    component: OutboxComponent,
    providers: [],
    children: [],
  },
];
