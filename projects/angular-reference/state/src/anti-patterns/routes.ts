import { Routes } from '@angular/router';
import { AntiPatternsComponent } from './anti-patterns';
import { PessimisticComponent } from './pessimistic';
export const ANTI_PATTERN_ROUTES: Routes = [
  {
    path: '',
    component: AntiPatternsComponent,
    children: [
      {
        path: 'pessimistic',
        component: PessimisticComponent,
      },
    ],
  },
];
